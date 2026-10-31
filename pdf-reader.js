const ZOOM_LEVELS = new Set([1, 1.25, 1.5, 2, 3, 4]);

/** Mount a canvas-only PDF preview; no PDF actions or scripting are executed. */
export function mountPdfReader(host) {
  if (!host) return () => {};

  const find = name => host.querySelector(`[data-pdf-${name}]`);
  const previous = find('previous');
  const next = find('next');
  const pages = find('page');
  const zoomControl = find('zoom');
  const status = find('status');
  const viewport = find('viewport');
  const canvas = find('canvas');
  const text = find('text');
  if (![previous, next, pages, zoomControl, status, viewport, canvas, text].every(Boolean)) {
    if (status) status.textContent = 'PDF preview is unavailable. Please use Open PDF.';
    return () => {};
  }

  const document = host.ownerDocument;
  const window = document.defaultView;
  let disposed = false;
  let started = false;
  let pdf = null;
  let loadingTask = null;
  let renderTask = null;
  let renderQueue = Promise.resolve();
  let revision = 0;
  let pageNumber = 1;
  let zoom = ZOOM_LEVELS.has(Number(zoomControl.value)) ? Number(zoomControl.value) : 1;
  let intersectionObserver = null;
  let resizeObserver = null;
  let resizeTimer = null;
  let lastWidth = 0;
  let lastPixelRatio = 0;

  canvas.hidden = true;
  canvas.style.visibility = 'hidden';
  zoomControl.value = String(zoom);
  status.textContent = 'PDF preview will load when it comes into view.';

  function setStatus(message, busy = false) {
    if (disposed) return;
    status.textContent = message;
    host.setAttribute('aria-busy', String(busy));
  }

  function updateControls() {
    previous.disabled = !pdf || pageNumber <= 1;
    next.disabled = !pdf || pageNumber >= pdf.numPages;
    pages.disabled = !pdf;
    zoomControl.disabled = !pdf;
    if (pdf) pages.value = String(pageNumber);
  }

  function measure() {
    const style = window.getComputedStyle(viewport);
    return {
      width: Math.max(0, viewport.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0)),
      pixelRatio: Math.min(2, Math.max(1, window.devicePixelRatio || 1)),
    };
  }

  function reportError(error, phase) {
    if (disposed) return;
    const explanations = {
      PasswordException: 'This PDF is password protected.',
      InvalidPDFException: 'The PDF file could not be read.',
      MissingPDFException: 'The PDF file could not be found.',
      UnexpectedResponseException: 'The PDF file could not be downloaded.',
    };
    const explanation = explanations[error?.name] || `The PDF preview could not ${phase}.`;
    setStatus(`${explanation} Please use Open PDF or Download PDF.`);
  }

  function updateText(page, number, version) {
    page.getTextContent().then(content => {
      if (disposed || version !== revision) return;
      const words = content.items
        .filter(item => typeof item.str === 'string')
        .map(item => `${item.str}${item.hasEOL ? '\n' : ' '}`)
        .join('').trim();
      text.textContent = `Page ${number} of ${pdf.numPages}. ${words || 'This page contains no selectable text. Please view the page image.'}`;
    }).catch(() => {
      if (!disposed && version === revision) {
        text.textContent = `Page ${number} of ${pdf.numPages}. Text is unavailable for this page.`;
      }
    });
  }

  async function renderPage(number, zoomLevel, version) {
    if (disposed || version !== revision) return;
    const page = await pdf.getPage(number);
    if (disposed || version !== revision) return;
    const { width, pixelRatio } = measure();
    lastWidth = width;
    lastPixelRatio = pixelRatio;
    if (width < 1) {
      setStatus('PDF loaded. Waiting for the preview to become visible.');
      return;
    }

    const naturalViewport = page.getViewport({ scale: 1 });
    const pageViewport = page.getViewport({ scale: width / naturalViewport.width * zoomLevel });
    // Bound backing-store memory as well as DPR, including large desktop zooms.
    const outputScale = Math.min(pixelRatio,
      Math.sqrt(16777216 / (pageViewport.width * pageViewport.height)),
      8192 / pageViewport.width, 8192 / pageViewport.height);
    canvas.style.visibility = 'hidden';
    canvas.width = Math.max(1, Math.floor(pageViewport.width * outputScale));
    canvas.height = Math.max(1, Math.floor(pageViewport.height * outputScale));
    canvas.style.width = `${pageViewport.width}px`;
    canvas.style.height = `${pageViewport.height}px`;
    const task = page.render({
      canvas,
      viewport: pageViewport,
      transform: [outputScale, 0, 0, outputScale, 0, 0],
      background: '#ffffff',
    });
    renderTask = task;
    try {
      await task.promise;
    } finally {
      if (renderTask === task) renderTask = null;
    }
    if (disposed || version !== revision) return;
    canvas.hidden = false;
    canvas.style.visibility = 'visible';
    canvas.setAttribute('aria-label', `Project portfolio, page ${number} of ${pdf.numPages}`);
    setStatus(`Page ${number} of ${pdf.numPages} · ${zoomLevel === 1 ? 'Fit width' : `${Math.round(zoomLevel * 100)}%`} · Ready`);
    updateText(page, number, version);
  }

  function requestRender(resetScroll = false) {
    if (disposed || !pdf) return;
    const version = ++revision;
    const number = pageNumber;
    const zoomLevel = zoom;
    if (renderTask) renderTask.cancel();
    if (resetScroll) viewport.scrollTo(0, 0);
    text.textContent = '';
    updateControls();
    setStatus(`Rendering page ${number} of ${pdf.numPages}…`, true);
    // A cancelled render must settle before PDF.js can reuse the same canvas.
    renderQueue = renderQueue.then(() => renderPage(number, zoomLevel, version)).catch(error => {
      if (!disposed && version === revision && error?.name !== 'RenderingCancelledException') {
        reportError(error, 'render this page');
      }
    });
  }

  function changePage(number) {
    if (!pdf || disposed || !Number.isInteger(number)) return;
    const bounded = Math.max(1, Math.min(pdf.numPages, number));
    if (bounded === pageNumber) return;
    pageNumber = bounded;
    requestRender(true);
  }

  const onPrevious = () => changePage(pageNumber - 1);
  const onNext = () => changePage(pageNumber + 1);
  const onPage = () => changePage(Number(pages.value));
  const onZoom = () => {
    const value = Number(zoomControl.value);
    if (!ZOOM_LEVELS.has(value) || value === zoom) return;
    zoom = value;
    requestRender();
  };
  const onResize = () => {
    if (disposed || !pdf) return;
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      resizeTimer = null;
      if (disposed) return;
      const { width, pixelRatio } = measure();
      if (Math.abs(width - lastWidth) > 0.5 || pixelRatio !== lastPixelRatio) requestRender();
    }, 100);
  };

  async function start() {
    if (disposed || started) return;
    started = true;
    intersectionObserver?.disconnect();
    setStatus('Loading PDF preview…', true);
    try {
      if (!host.dataset.pdf) throw new Error('Missing PDF URL');
      const pdfjs = await import('./vendor/pdfjs/pdf.min.js?v=6f3d6a6af7e6');
      if (disposed) return;
      pdfjs.GlobalWorkerOptions.workerSrc = new URL('./vendor/pdfjs/pdf.worker.min.js', import.meta.url).href;
      loadingTask = pdfjs.getDocument({
        url: host.dataset.pdf,
        cMapUrl: new URL('./vendor/pdfjs/cmaps/', import.meta.url).href,
        cMapPacked: true,
        standardFontDataUrl: new URL('./vendor/pdfjs/standard_fonts/', import.meta.url).href,
        wasmUrl: new URL('./vendor/pdfjs/wasm/', import.meta.url).href,
        isEvalSupported: false,
        enableXfa: false,
      });
      const loaded = await loadingTask.promise;
      if (disposed) return;
      pdf = loaded;
      const options = document.createDocumentFragment();
      for (let number = 1; number <= pdf.numPages; number += 1) {
        const option = document.createElement('option');
        option.value = String(number);
        option.textContent = `${number} / ${pdf.numPages}`;
        options.append(option);
      }
      pages.replaceChildren(options);
      requestRender();
    } catch (error) {
      reportError(error, 'load');
    }
  }

  updateControls();
  previous.addEventListener('click', onPrevious);
  next.addEventListener('click', onNext);
  pages.addEventListener('change', onPage);
  zoomControl.addEventListener('change', onZoom);
  window.addEventListener('resize', onResize);
  if (window.ResizeObserver) {
    resizeObserver = new window.ResizeObserver(onResize);
    resizeObserver.observe(viewport);
  }
  if (window.IntersectionObserver) {
    intersectionObserver = new window.IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) void start();
    }, { rootMargin: '300px 0px' });
    intersectionObserver.observe(host);
  } else {
    void start();
  }

  return () => {
    if (disposed) return;
    disposed = true;
    revision += 1;
    previous.removeEventListener('click', onPrevious);
    next.removeEventListener('click', onNext);
    pages.removeEventListener('change', onPage);
    zoomControl.removeEventListener('change', onZoom);
    window.removeEventListener('resize', onResize);
    intersectionObserver?.disconnect();
    resizeObserver?.disconnect();
    window.clearTimeout(resizeTimer);
    renderTask?.cancel();
    // PDFDocumentProxy.destroy() also destroys its loading task and worker.
    const destroy = pdf ? pdf.destroy() : loadingTask?.destroy();
    if (destroy) void destroy.catch(() => {});
  };
}
