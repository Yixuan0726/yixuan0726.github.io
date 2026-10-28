const canvas = document.getElementById('game');
const loading = document.getElementById('loading');
const status = document.getElementById('status');
const progress = document.getElementById('progress');
let failed = false;
let disposed = false;
let dataBlobUrl = null;
let unityInstance = null;
const downloads = new AbortController();
const releaseData = () => {
  if (dataBlobUrl) URL.revokeObjectURL(dataBlobUrl);
  dataBlobUrl = null;
};
const stopGame = () => {
  const instance = unityInstance;
  unityInstance = null;
  if (instance) Promise.resolve(instance.Quit()).catch(() => {});
};
const notify = (type, message) => window.parent.postMessage({ type, ...(message ? { message } : {}) }, location.origin);
const fail = error => {
  if (failed || disposed) return;
  failed = true;
  downloads.abort();
  releaseData();
  stopGame();
  const message = String(error?.message || error || 'The browser could not load the game.');
  loading.hidden = false;
  status.textContent = 'Could not start KeepDribbling. Please try the Windows version.';
  progress.hidden = true;
  notify('keepdribbling-error', message);
};
window.addEventListener('pagehide', () => {
  disposed = true;
  downloads.abort();
  releaseData();
  stopGame();
}, { once: true });
canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }));
canvas.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) event.preventDefault();
});

let lastProgressText = '';
function updateProgress(value, label) {
  if (failed || disposed) return;
  progress.value = Math.max(progress.value || 0, Math.min(1, Math.max(0, value)));
  const text = `${label} ${Math.floor(progress.value * 100)}%`;
  if (text !== lastProgressText) status.textContent = lastProgressText = text;
}

function retryDelay(milliseconds) {
  const { signal } = downloads;
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const cancel = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', cancel); resolve(); }, milliseconds);
    signal.addEventListener('abort', cancel, { once: true });
  });
}

async function fetchPart(part, index) {
  for (let attempt = 0; attempt < 3; attempt++) {
    downloads.signal.throwIfAborted();
    const request = new AbortController();
    const cancel = () => request.abort(downloads.signal.reason);
    downloads.signal.addEventListener('abort', cancel, { once: true });
    const timeout = setTimeout(() => request.abort(new Error('Game download timed out.')), 90000);
    try {
      const response = await fetch(part.url, { signal: request.signal, cache: attempt ? 'reload' : 'default' });
      if (!response.ok) throw new Error(`Game download failed (${response.status}, part ${index + 1}).`);
      const blob = await response.blob();
      if (blob.size !== part.size) throw new Error(`Game download is incomplete (part ${index + 1}).`);
      return blob;
    } catch (error) {
      downloads.signal.throwIfAborted();
      if (attempt === 2) throw error;
    } finally {
      clearTimeout(timeout);
      downloads.signal.removeEventListener('abort', cancel);
    }
    await retryDelay(400 * (attempt + 1));
  }
}

async function prepareData(config) {
  if (!('dataChunks' in config)) {
    if (typeof config.dataUrl !== 'string' || !config.dataUrl) throw new Error('Game data is missing from the manifest.');
    return config.dataUrl;
  }
  const chunks = config.dataChunks;
  if (!Array.isArray(chunks) || !chunks.length || !Number.isSafeInteger(config.dataSize) || config.dataSize <= 0 ||
      chunks.some(part => !part || typeof part.url !== 'string' || !part.url || !Number.isSafeInteger(part.size) || part.size <= 0) ||
      chunks.reduce((total, part) => total + part.size, 0) !== config.dataSize) {
    throw new Error('The game download manifest is invalid.');
  }
  const parts = new Array(chunks.length);
  let next = 0;
  let completedBytes = 0;
  updateProgress(0, 'Downloading KeepDribbling…');
  async function worker() {
    while (next < chunks.length) {
      const index = next++;
      parts[index] = await fetchPart(chunks[index], index);
      completedBytes += parts[index].size;
      updateProgress(0.7 * completedBytes / config.dataSize, 'Downloading KeepDribbling…');
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, chunks.length) }, () => worker()));
  downloads.signal.throwIfAborted();
  // Keep Unity's gzip header and marker intact; the loader performs decompression.
  const data = new Blob(parts, { type: 'application/octet-stream' });
  if (data.size !== config.dataSize) throw new Error('The assembled game data is incomplete.');
  dataBlobUrl = URL.createObjectURL(data);
  return dataBlobUrl;
}

async function loadLoader(url) {
  downloads.signal.throwIfAborted();
  const loader = document.createElement('script');
  const loaderReady = new Promise((resolve, reject) => {
    const cleanup = () => {
      loader.onload = loader.onerror = null;
      downloads.signal.removeEventListener('abort', cancel);
    };
    const cancel = () => { cleanup(); loader.remove(); reject(downloads.signal.reason); };
    loader.onload = () => { cleanup(); resolve(); };
    loader.onerror = () => { cleanup(); loader.remove(); reject(new Error('The game loader could not be downloaded.')); };
    downloads.signal.addEventListener('abort', cancel, { once: true });
  });
  loader.src = url;
  document.body.append(loader);
  await loaderReady;
}

async function launch() {
  const response = await fetch('build-config.json', { signal: downloads.signal, cache: 'no-cache' });
  if (!response.ok) throw new Error('Game files are unavailable.');
  const config = await response.json();
  await loadLoader(config.loaderUrl);
  const dataUrl = await prepareData(config);
  downloads.signal.throwIfAborted();
  const chunked = Array.isArray(config.dataChunks);
  try {
    unityInstance = await createUnityInstance(canvas, {
      dataUrl,
      frameworkUrl: config.frameworkUrl,
      codeUrl: config.codeUrl,
      streamingAssetsUrl: 'StreamingAssets',
      companyName: 'Yixuan Yu',
      productName: 'KeepDribbling',
      productVersion: '1.0',
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      showBanner: (message, type) => { if (type === 'error') fail(message); },
    }, value => {
      updateProgress(chunked ? 0.7 + value * 0.3 : value, 'Starting KeepDribbling…');
    });
  } finally {
    releaseData();
  }
  if (failed || disposed) { stopGame(); return; }
  loading.hidden = true;
  canvas.focus({ preventScroll: true });
  if (new URLSearchParams(location.search).get('autostart') === '1') unityInstance.SendMessage('PortfolioWebBridge', 'Begin');
  notify('keepdribbling-ready');
}
launch().catch(fail);
