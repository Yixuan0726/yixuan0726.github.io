const canvas = document.getElementById('game');
const loading = document.getElementById('loading');
const status = document.getElementById('status');
const progress = document.getElementById('progress');
let failed = false;
const notify = (type, message) => window.parent.postMessage({ type, ...(message ? { message } : {}) }, location.origin);
const fail = error => {
  if (failed) return;
  failed = true;
  const message = String(error?.message || error || 'The browser could not load the game.');
  loading.hidden = false;
  status.textContent = 'Could not start KeepDribbling. Please try the Windows version.';
  progress.hidden = true;
  notify('keepdribbling-error', message);
};
canvas.addEventListener('pointerdown', () => canvas.focus({ preventScroll: true }));
canvas.addEventListener('keydown', event => {
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) event.preventDefault();
});
async function launch() {
  const response = await fetch('build-config.json');
  if (!response.ok) throw new Error('Game files are unavailable.');
  const config = await response.json();
  const loader = document.createElement('script');
  const loaderReady = new Promise((resolve, reject) => {
    loader.onload = resolve;
    loader.onerror = () => reject(new Error('The game loader could not be downloaded.'));
  });
  loader.src = config.loaderUrl;
  document.body.append(loader);
  await loaderReady;
  let lastPercent = -1;
  const instance = await createUnityInstance(canvas, {
    dataUrl: config.dataUrl,
    frameworkUrl: config.frameworkUrl,
    codeUrl: config.codeUrl,
    streamingAssetsUrl: 'StreamingAssets',
    companyName: 'Yixuan Yu',
    productName: 'KeepDribbling',
    productVersion: '1.0',
    devicePixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
    showBanner: (message, type) => { if (type === 'error') fail(message); },
  }, value => {
    progress.value = value;
    const percent = Math.floor(value * 100 / 10) * 10;
    if (percent !== lastPercent) { status.textContent = `Loading KeepDribbling… ${percent}%`; lastPercent = percent; }
  });
  if (failed) { await instance.Quit(); return; }
  loading.hidden = true;
  canvas.focus({ preventScroll: true });
  if (new URLSearchParams(location.search).get('autostart') === '1') instance.SendMessage('PortfolioWebBridge', 'Begin');
  notify('keepdribbling-ready');
}
launch().catch(fail);
