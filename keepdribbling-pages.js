import { keepDribblingPages } from './keepdribbling-pages-data.js?v=ff8d12696b03';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const chapters = [
  { id: 'kd-introduction', page: 2, label: 'Introduction' },
  { id: 'kd-protagonist', page: 4, label: 'Protagonist design' },
  { id: 'kd-mechanics', page: 5, label: 'Core mechanics & levels' },
  { id: 'kd-endings', page: 9, label: 'Ending design' },
  { id: 'kd-development', page: 11, label: 'Development challenges' }
];

/** Preserve each original PDF page as a full-width, continuously scrolling spread. */
export function keepDribblingPagesMarkup(project) {
  const total = keepDribblingPages.length;
  return `<section class="document-section kd-document" id="project-document" aria-labelledby="document-title" data-kd-pages>
    <header class="document-heading"><div><p class="case-kicker">Project portfolio</p><h2 id="document-title">KeepDribbling — Portfolio</h2></div>
      <div class="document-links"><a class="text-link" href="${escape(project.documentation)}" target="_blank" rel="noopener noreferrer">Open PDF <span aria-hidden="true">↗</span></a><a class="text-link" href="${escape(project.documentation)}" download="KeepDribbling-Portfolio.pdf">Download PDF <span aria-hidden="true">↓</span></a></div>
    </header>
    <nav class="kd-toc" aria-label="KeepDribbling portfolio chapters">${chapters.map((chapter, index) => `<a href="#${chapter.id}" data-section>${String(index + 1).padStart(2, '0')} ${chapter.label}</a>`).join('')}</nav>
    <p class="kd-reading-hint">Scroll through the original pages. Click any page to enlarge.</p>
    <div class="kd-page-list">${keepDribblingPages.map(page => `<figure class="kd-page" id="kd-page-${page.page}">
      ${chapters.filter(chapter => chapter.page === page.page).map(chapter => `<h3 class="kd-page-anchor visually-hidden" id="${chapter.id}">${escape(chapter.label)}</h3>`).join('')}
      <button class="kd-page-open" type="button" data-kd-page="${page.page}" aria-haspopup="dialog" aria-controls="kd-page-viewer" aria-label="Enlarge page ${page.page}: ${escape(page.title)}"><img src="${escape(page.src)}" alt="KeepDribbling portfolio, page ${page.page}: ${escape(page.title)}" width="${page.width}" height="${page.height}" loading="${page.page === 1 ? 'eager' : 'lazy'}" decoding="async"></button>
      <figcaption><span>${String(page.page).padStart(2, '0')} / ${String(total).padStart(2, '0')} <span class="kd-page-caption-title">${escape(page.title)}</span></span><span aria-hidden="true">Enlarge ↗</span></figcaption>
      <div class="visually-hidden kd-page-text">${chapters.some(chapter => chapter.page === page.page) ? '' : `<h3>${escape(page.title)}</h3>`}<p>${escape(page.text)}</p></div>
    </figure>`).join('')}</div>
    <dialog class="kd-page-viewer" id="kd-page-viewer" aria-labelledby="kd-viewer-title">
      <div class="kd-viewer-toolbar"><h3 id="kd-viewer-title" data-kd-viewer-title>Portfolio page</h3><div class="kd-viewer-controls">
        <button type="button" data-kd-previous aria-label="Previous portfolio page">←</button><button type="button" data-kd-next aria-label="Next portfolio page">→</button>
        <label><span class="visually-hidden">Page magnification</span><select data-kd-zoom aria-label="Page magnification"><option value="1">Fit width</option><option value="1.5">150%</option><option value="2">200%</option><option value="3">300%</option><option value="4">400%</option></select></label>
        <button type="button" data-kd-close autofocus>Close ×</button>
      </div></div>
      <p class="kd-viewer-hint">Scroll to read. Change pages with the controls above.</p>
      <div class="kd-viewer-viewport" data-kd-viewport tabindex="0" role="region" aria-label="Enlarged portfolio page"><img data-kd-viewer-image alt="" hidden></div>
      <p class="kd-viewer-status" data-kd-viewer-status role="status" aria-live="polite"></p>
    </dialog>
  </section>`;
}

/** Own the modal, keyboard handlers and scroll lock for one project-page render. */
export function mountKeepDribblingPages(host) {
  if (!host) return () => {};
  const doc = host.ownerDocument;
  const win = doc.defaultView;
  const dialog = host.querySelector('.kd-page-viewer');
  const image = host.querySelector('[data-kd-viewer-image]');
  const viewport = host.querySelector('[data-kd-viewport]');
  const title = host.querySelector('[data-kd-viewer-title]');
  const status = host.querySelector('[data-kd-viewer-status]');
  const previous = host.querySelector('[data-kd-previous]');
  const next = host.querySelector('[data-kd-next]');
  const zoomControl = host.querySelector('[data-kd-zoom]');
  const close = host.querySelector('[data-kd-close]');
  const controller = new AbortController();
  const { signal } = controller;
  const zoomLevels = new Set([1, 1.5, 2, 3, 4]);
  let pageIndex = 0;
  let zoom = 2;
  let opener = null;
  let savedOverflow = null;
  let disposed = false;

  function unlockScroll() {
    if (savedOverflow !== null) {
      doc.body.style.overflow = savedOverflow;
      savedOverflow = null;
    }
  }

  function setZoom(value, keepPosition = true) {
    if (!zoomLevels.has(value)) return;
    const ratio = value / zoom;
    const left = (viewport.scrollLeft + viewport.clientWidth / 2) * ratio - viewport.clientWidth / 2;
    const top = (viewport.scrollTop + viewport.clientHeight / 2) * ratio - viewport.clientHeight / 2;
    zoom = value;
    zoomControl.value = String(value);
    image.style.width = `${value * 100}%`;
    if (keepPosition) viewport.scrollTo({ left: Math.max(0, left), top: Math.max(0, top), behavior: 'instant' });
  }

  function showPage(index) {
    if (index < 0 || index >= keepDribblingPages.length) return;
    pageIndex = index;
    const page = keepDribblingPages[index];
    title.textContent = `${index + 1} / ${keepDribblingPages.length} · ${page.title}`;
    previous.disabled = index === 0;
    next.disabled = index === keepDribblingPages.length - 1;
    image.hidden = true;
    status.textContent = 'Loading page…';
    image.alt = `KeepDribbling portfolio, page ${page.page}: ${page.title}`;
    image.width = page.width;
    image.height = page.height;
    image.src = page.src;
    viewport.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  function openPage(button) {
    const index = keepDribblingPages.findIndex(page => page.page === Number(button.dataset.kdPage));
    if (index < 0) return;
    if (typeof dialog.showModal !== 'function') {
      win.open(keepDribblingPages[index].src, '_blank', 'noopener,noreferrer');
      return;
    }
    opener = button;
    savedOverflow = doc.body.style.overflow;
    doc.body.style.overflow = 'hidden';
    setZoom(win.matchMedia('(max-width: 680px)').matches ? 4 : 1.5, false);
    showPage(index);
    dialog.showModal();
  }

  host.addEventListener('click', event => {
    const button = event.target.closest('[data-kd-page]');
    if (button && host.contains(button)) openPage(button);
  }, { signal });
  close.addEventListener('click', () => dialog.close(), { signal });
  previous.addEventListener('click', () => showPage(pageIndex - 1), { signal });
  next.addEventListener('click', () => showPage(pageIndex + 1), { signal });
  zoomControl.addEventListener('change', () => setZoom(Number(zoomControl.value)), { signal });
  image.addEventListener('load', () => {
    if (disposed) return;
    image.hidden = false;
    status.textContent = '';
  }, { signal });
  image.addEventListener('error', () => {
    if (disposed) return;
    status.textContent = 'This page could not load. Close this view and use Open PDF.';
  }, { signal });
  dialog.addEventListener('close', () => {
    unlockScroll();
    if (!disposed && opener?.isConnected) opener.focus({ preventScroll: true });
  }, { signal });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  }, { signal });
  dialog.addEventListener('keydown', event => {
    if (event.target === zoomControl || event.target === viewport) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      showPage(pageIndex + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  }, { signal });

  return () => {
    disposed = true;
    controller.abort();
    if (dialog.open) dialog.close();
    unlockScroll();
    image.removeAttribute('src');
  };
}
