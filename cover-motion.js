// Animate portfolio covers only when the visitor is interacting with them.
export function mountCoverMotion(root = document) {
  const areas = [...root.querySelectorAll('[data-cover-motion]')];
  if (!areas.length) return () => {};
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(hover: none) and (pointer: coarse)');
  const controller = new AbortController();
  const options = { signal: controller.signal };
  let disposed = false;
  const items = areas.map(area => ({
    area, video: area.querySelector('[data-cover-video]'),
    visible: false, hovered: false, focused: false,
    requested: false, loaded: false, failed: false, version: 0
  })).filter(item => item.video);

  const wanted = item => !disposed && !item.failed && !reduce.matches &&
    !document.hidden && item.visible && (touch.matches || item.hovered || item.focused);

  function stop(item) {
    item.requested = false;
    item.version++;
    item.video.pause();
    item.area.classList.remove('is-playing');
    if (item.video.readyState) {
      try { item.video.currentTime = 0; } catch {}
    }
  }

  function update(item) {
    if (!wanted(item)) { stop(item); return; }
    if (item.requested) return;
    item.requested = true;
    const version = ++item.version;
    if (!item.loaded) {
      item.loaded = true;
      item.video.muted = true;
      item.video.src = item.video.dataset.src;
      item.video.load();
    }
    const play = item.video.play();
    if (play) play.catch(() => {
      // Leaving a card while it loads can cancel play; allow the next visit.
      if (!disposed && version === item.version) {
        item.requested = false;
        item.area.classList.remove('is-playing');
      }
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const item = items.find(item => item.area === entry.target);
      if (!item) return;
      item.visible = entry.isIntersecting && entry.intersectionRatio >= .15;
      update(item);
    });
  }, { threshold: [0, .15] });

  items.forEach(item => {
    const { area, video } = item;
    area.addEventListener('pointerenter', event => {
      item.hovered = event.pointerType !== 'touch';
      update(item);
    }, options);
    area.addEventListener('pointerleave', () => {
      item.hovered = false;
      update(item);
    }, options);
    area.addEventListener('focusin', () => {
      item.focused = true;
      update(item);
    }, options);
    area.addEventListener('focusout', event => {
      if (!area.contains(event.relatedTarget)) item.focused = false;
      update(item);
    }, options);
    video.addEventListener('playing', () => {
      if (wanted(item)) area.classList.add('is-playing');
      else stop(item);
    }, options);
    video.addEventListener('error', () => {
      item.failed = true;
      stop(item);
    }, options);
    observer.observe(area);
  });

  const refresh = () => items.forEach(update);
  document.addEventListener('visibilitychange', refresh, options);
  reduce.addEventListener('change', refresh, options);
  touch.addEventListener('change', refresh, options);
  window.addEventListener('pagehide', refresh, options);

  return () => {
    disposed = true;
    controller.abort();
    observer.disconnect();
    items.forEach(item => {
      stop(item);
      if (item.loaded) {
        item.video.removeAttribute('src');
        item.video.load();
      }
    });
  };
}
