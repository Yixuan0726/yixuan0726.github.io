const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

function webBuildURL(value, base = location.href) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value, base);
    return ['http:', 'https:'].includes(url.protocol) && url.origin === new URL(base).origin ? url : null;
  } catch { return null; }
}

function assetURL(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

/** The existing game menu is the poster. No Unity files load before Start. */
export function gamePlayerMarkup(project) {
  const build = webBuildURL(project.webBuild);
  const cover = assetURL(project.cover);
  if (!build || !cover) return '';
  const download = assetURL(project.download);
  return `<section class="game-player" data-game-player data-web-build="${escapeHTML(build.href)}" data-game-name="${escapeHTML(project.name)}" aria-label="${escapeHTML(project.name)} browser game">
    <div class="game-player-toolbar">
      <p class="game-player-hint">Play in browser · Keyboard required</p>
      <div class="game-player-controls" data-game-controls hidden>
        <button type="button" data-game-close>Close game</button>
        <button type="button" data-game-fullscreen hidden>Fullscreen</button>
      </div>
    </div>
    <div class="game-player-feedback" data-game-feedback hidden>
      <p data-game-status role="status" aria-live="polite" aria-atomic="true"></p>
      <p class="game-error-detail" data-game-error-detail hidden></p>
      <div class="game-player-fallback" data-game-fallback hidden>
        <button type="button" data-game-retry>Try again</button>
        ${download ? `<a href="${escapeHTML(download)}" download>Download Windows version <span aria-hidden="true">↓</span></a>` : ''}
      </div>
    </div>
    <div class="game-player-surface" data-game-surface>
      <div class="game-player-poster" data-game-poster>
        <img src="${escapeHTML(cover)}" alt="${escapeHTML(project.coverAlt || project.name + ' start screen')}" width="1920" height="1080">
        <button class="game-menu-hotspot game-menu-start" type="button" data-game-start aria-label="Play ${escapeHTML(project.name)} in browser"><span class="visually-hidden">Start game</span></button>
        <a class="game-menu-hotspot game-menu-exit" href="./#work" data-route aria-label="Exit to all projects"><span class="visually-hidden">Exit to all projects</span></a>
      </div>
      <div class="game-player-frame" data-game-frame hidden></div>
    </div>
    <p class="game-player-instructions">A / D: change lanes · W / S: move to retrieve the ball · Follow the on-screen action prompts.</p>
  </section>`;
}

/** Own the iframe and its message handlers for exactly one project-page render. */
export function mountGamePlayer(host) {
  if (!host) return () => {};
  const doc = host.ownerDocument;
  const win = doc.defaultView;
  const build = webBuildURL(host.dataset.webBuild, win.location.href);
  if (!build) return () => {};
  const find = name => host.querySelector(`[data-game-${name}]`);
  const start = find('start');
  const poster = find('poster');
  const surface = find('surface');
  const slot = find('frame');
  const controls = find('controls');
  const close = find('close');
  const fullscreen = find('fullscreen');
  const feedback = find('feedback');
  const status = find('status');
  const detail = find('error-detail');
  const fallback = find('fallback');
  const retry = find('retry');
  if (![start, poster, surface, slot, controls, close, fullscreen, feedback, status, detail, fallback, retry].every(Boolean)) return () => {};

  const controller = new AbortController();
  const { signal } = controller;
  let frame = null;
  let frameController = null;
  let slowTimer = 0;
  let disposed = false;
  let ready = false;

  function removeFrame() {
    win.clearTimeout(slowTimer);
    slowTimer = 0;
    frameController?.abort();
    frameController = null;
    const previous = frame;
    frame = null;
    ready = false;
    if (previous) {
      previous.src = 'about:blank';
      previous.remove();
    }
    slot.hidden = true;
    surface.removeAttribute('aria-busy');
  }

  function leaveFullscreen() {
    if (doc.fullscreenElement === host && doc.exitFullscreen) {
      Promise.resolve(doc.exitFullscreen()).catch(() => {});
    }
  }

  function reset({ restoreFocus = true } = {}) {
    removeFrame();
    leaveFullscreen();
    poster.hidden = false;
    controls.hidden = true;
    fullscreen.hidden = true;
    feedback.hidden = true;
    fallback.hidden = true;
    detail.hidden = true;
    status.textContent = '';
    if (restoreFocus && !disposed && host.isConnected) start.focus({ preventScroll: true });
  }

  function showError(message) {
    if (disposed) return;
    const shouldRestoreFocus = host.contains(doc.activeElement);
    reset({ restoreFocus: false });
    feedback.hidden = false;
    fallback.hidden = false;
    status.textContent = 'The browser game could not start. Try again or use the Windows version.';
    detail.textContent = typeof message === 'string' ? message.slice(0, 300) : '';
    detail.hidden = !detail.textContent;
    if (shouldRestoreFocus) retry.focus({ preventScroll: true });
  }

  function launch() {
    if (disposed) return;
    removeFrame();
    const url = new URL(build.href);
    url.searchParams.set('autostart', '1');
    poster.hidden = true;
    slot.hidden = false;
    controls.hidden = false;
    fullscreen.hidden = true;
    feedback.hidden = false;
    fallback.hidden = true;
    detail.hidden = true;
    status.textContent = 'Loading game… The first load may take a little while.';
    surface.setAttribute('aria-busy', 'true');

    frame = doc.createElement('iframe');
    frame.title = `${host.dataset.gameName || 'KeepDribbling'} — playable browser game`;
    frame.allow = 'fullscreen; autoplay; gamepad';
    frame.allowFullscreen = true;
    frame.setAttribute('tabindex', '0');
    frameController = new AbortController();
    frame.addEventListener('error', () => showError(), { signal: frameController.signal, once: true });
    frame.src = url.href;
    slot.append(frame);
    close.focus({ preventScroll: true });
    slowTimer = win.setTimeout(() => {
      if (disposed || !frame || ready) return;
      status.textContent = 'Still loading. You can keep waiting, try again, or use the Windows version.';
      fallback.hidden = false;
    }, 120000);
  }

  start.addEventListener('click', launch, { signal });
  retry.addEventListener('click', launch, { signal });
  close.addEventListener('click', () => reset(), { signal });
  fullscreen.addEventListener('click', async () => {
    if (!frame || !ready || !host.requestFullscreen) return;
    try {
      if (doc.fullscreenElement === host) await doc.exitFullscreen();
      else await host.requestFullscreen();
      if (!disposed && frame) frame.focus({ preventScroll: true });
    } catch {
      if (disposed) return;
      feedback.hidden = false;
      status.textContent = 'Fullscreen is unavailable. You can keep playing here.';
    }
  }, { signal });
  doc.addEventListener('fullscreenchange', () => {
    fullscreen.textContent = doc.fullscreenElement === host ? 'Exit fullscreen' : 'Fullscreen';
  }, { signal });
  win.addEventListener('message', event => {
    if (disposed || !frame || event.source !== frame.contentWindow || event.origin !== win.location.origin) return;
    const data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'keepdribbling-ready') {
      if (ready) return;
      ready = true;
      win.clearTimeout(slowTimer);
      slowTimer = 0;
      surface.removeAttribute('aria-busy');
      feedback.hidden = true;
      fallback.hidden = true;
      fullscreen.hidden = !host.requestFullscreen || doc.fullscreenEnabled === false;
      if (host.contains(doc.activeElement)) frame.focus({ preventScroll: true });
    } else if (data.type === 'keepdribbling-error') {
      showError(data.message);
    } else if (data.type === 'keepdribbling-exit') {
      reset();
    }
  }, { signal });

  return () => {
    if (disposed) return;
    disposed = true;
    controller.abort();
    reset({ restoreFocus: false });
  };
}
