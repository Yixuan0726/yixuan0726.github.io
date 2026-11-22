const siteLanguage = document.documentElement.lang;
const isEnglish = siteLanguage === 'en';
const embedFrame = new URLSearchParams(window.location.search).has('embed') ? window.frameElement : null;

if (embedFrame) {
  document.documentElement.classList.add('is-embedded');
  alternatePage.searchParams.set('embed', '1');
  updateLanguageLink();
  const catalogLink = document.querySelector('[data-card-catalog]');
  catalogLink.target = '_blank';
  catalogLink.rel = 'noopener';
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    const section = link && document.getElementById(link.hash.slice(1));
    if (!section || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    history.replaceState(null, '', link.hash);
    updateLanguageLink();
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
    const frameTop = embedFrame.getBoundingClientRect().top + window.parent.scrollY;
    window.parent.scrollTo(0, frameTop + window.scrollY + section.getBoundingClientRect().top - 16);
  });
}

function revealLinkedDetail() {
  if (!location.hash) return;
  let id;
  try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
  if (embedFrame) return;
  const target = document.getElementById(id);
  let details = target?.closest('details');
  let revealed = false;
  while (details) {
    if (!details.open) { details.open = true; revealed = true; }
    details = details.parentElement?.closest('details');
  }
  if (revealed) requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
}
revealLinkedDetail();
window.addEventListener('hashchange', revealLinkedDetail);

const mediaActions = document.querySelector('.project-actions');
const watchLink = mediaActions.querySelector('[href="#gameplay-video"]');
const demoLink = mediaActions.querySelector('[href="#playable-demo"]');
const compactControls = matchMedia('(max-width: 760px), (pointer: coarse)');
function orderMediaLinks() {
  mediaActions.prepend(compactControls.matches ? watchLink : demoLink);
}
orderMediaLinks();
compactControls.addEventListener('change', orderMediaLinks);

const filmPlayer = document.querySelector('.film-player');
const filmCover = document.querySelector('[data-film-play]');
filmPlayer.controls = false;
filmCover.hidden = false;

function primaryActivation(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

function playFilm() {
  filmCover.hidden = true;
  filmPlayer.controls = true;
  filmPlayer.focus({ preventScroll: true });
  filmPlayer.play().catch(() => { /* Native controls allow another play attempt. */ });
}

filmCover.addEventListener('click', playFilm);
watchLink.addEventListener('click', event => {
  if (primaryActivation(event)) playFilm();
});

const demo = document.querySelector('[data-demo-player]');
const launchDemo = demo.querySelector('[data-game-start]');
// The standalone game link remains available without the embedded player.
import('../game-player.js?v=showcase-v1').then(({ mountGamePlayer }) => {
  mountGamePlayer(demo);
  launchDemo.hidden = false;
  launchDemo.addEventListener('click', () => filmPlayer.pause());
  demoLink.addEventListener('click', event => {
    if (primaryActivation(event) && !demo.querySelector('[data-game-poster]').hidden) launchDemo.click();
  });
}).catch(() => { /* The link to the hosted demo remains usable. */ });

const lightbox = document.querySelector('.lightbox');
const preview = lightbox.querySelector('img');
const previewTitle = lightbox.querySelector('h2');
let lastImageButton;

for (const button of document.querySelectorAll('.zoomable')) {
  button.addEventListener('click', () => {
    const thumbnail = button.querySelector('img');
    const source = thumbnail.dataset.full || thumbnail.currentSrc || thumbnail.src;
    if (embedFrame) {
      window.open(source, '_blank', 'noopener,noreferrer');
      return;
    }
    lastImageButton = button;
    preview.src = source;
    preview.alt = thumbnail.alt;
    const previewAction = isEnglish ? /^Enlarge / : /^放大(?:查看)?/;
    const title = button.getAttribute('aria-label').replace(previewAction, '');
    previewTitle.textContent = title.charAt(0).toUpperCase() + title.slice(1);
    lightbox.showModal();
  });
}
lightbox.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener('close', () => {
  preview.removeAttribute('src');
  lastImageButton?.focus({ preventScroll: true });
});

const navLinks = [...document.querySelectorAll('.main-nav a')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
const readingProgress = document.querySelector('.reading-progress');
const pageHeader = document.querySelector('.site-header');
let framePending = false;

function updateReadingPosition() {
  framePending = false;
  const threshold = pageHeader.offsetHeight + 45;
  let activeSection = -1;
  navSections.forEach((section, index) => {
    if (section.getBoundingClientRect().top <= threshold) activeSection = index;
  });
  // A short final chapter can be fully visible before its top reaches the header.
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollRange > 0 && window.scrollY >= scrollRange - 1) activeSection = navSections.length - 1;
  navLinks.forEach((link, index) => {
    if (index === activeSection) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const progress = scrollRange > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollRange)) : 0;
  readingProgress.style.setProperty('--read', progress);
}

function scheduleReadingUpdate() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(updateReadingPosition);
}

window.addEventListener('scroll', scheduleReadingUpdate, { passive: true });
new ResizeObserver(scheduleReadingUpdate).observe(document.querySelector('main'));
scheduleReadingUpdate();

// Loop silent demonstration clips automatically whenever they are on screen.
const motionStates = new Map();
function syncMotion(state) {
  const shouldPlay = state.visible && !document.hidden;
  if (shouldPlay && state.video.paused) {
    state.video.play().catch(() => {});
  } else if (!shouldPlay && !state.video.paused) {
    state.video.pause();
  }
}
const motionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const state = motionStates.get(entry.target);
    state.visible = entry.isIntersecting;
    syncMotion(state);
  }
}, { threshold: 0 });
for (const clip of document.querySelectorAll('[data-motion-clip]')) {
  const video = clip.querySelector('video');
  const state = { video, visible: false };
  motionStates.set(video, state);
  video.muted = true;
  video.controls = false;
  motionObserver.observe(video);
}
document.addEventListener('visibilitychange', () => motionStates.forEach(syncMotion));

for (const guide of document.querySelectorAll('[data-combat-guide]')) {
  const canvas = guide.querySelector('.combat-guide-leaders');
  const context = canvas.getContext('2d');
  const image = guide.querySelector('.combat-guide-image img');
  const notes = [...guide.querySelectorAll('[data-callout]')];
  const compactGuide = matchMedia('(max-width: 760px)');

  function drawCombatLeaders() {
    if (!context || !canvas.clientWidth) return;
    const frame = canvas.getBoundingClientRect();
    const shot = image.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(frame.width * ratio);
    canvas.height = Math.round(frame.height * ratio);
    context.scale(ratio, ratio);
    context.lineCap = 'round';
    context.lineJoin = 'round';

    const compact = compactGuide.matches;
    for (const note of notes) {
      const { edge, compactEdge, targetX, targetY } = note.dataset;
      const attachment = compact && compactEdge ? compactEdge : edge;
      const startsAtLeft = attachment === 'left';
      const box = note.getBoundingClientRect();
      const startX = box.left - frame.left + (startsAtLeft ? 0 : box.width / 2);
      const startY = box.top - frame.top + box.height * (startsAtLeft ? 0.5 : Number(attachment === 'bottom'));
      const endX = shot.left - frame.left + shot.width * Number(targetX);
      const endY = shot.top - frame.top + shot.height * Number(targetY);
      const bendX = startsAtLeft ? (endX - startX) * 0.42 : 0;
      const bendY = startsAtLeft ? 0 : (endY - startY) * 0.42;

      context.beginPath();
      context.moveTo(startX, startY);
      context.bezierCurveTo(startX + bendX, startY + bendY, endX - bendX, endY - bendY, endX, endY);
      context.lineWidth = 2.8;
      context.strokeStyle = '#f4d8aa';
      context.stroke();
      context.lineWidth = 1.25;
      context.strokeStyle = '#614533';
      context.stroke();

      const angle = Math.atan2(bendY, bendX);
      const headLength = compact ? 7 : 9;
      context.beginPath();
      context.moveTo(endX, endY);
      context.lineTo(endX - headLength * Math.cos(angle - 0.48), endY - headLength * Math.sin(angle - 0.48));
      context.lineTo(endX - headLength * Math.cos(angle + 0.48), endY - headLength * Math.sin(angle + 0.48));
      context.closePath();
      context.lineWidth = 1.1;
      context.strokeStyle = '#f4d8aa';
      context.fillStyle = '#614533';
      context.fill();
      context.stroke();
    }
  }

  const resize = new ResizeObserver(drawCombatLeaders);
  resize.observe(guide);
  resize.observe(image);
  for (const note of notes) resize.observe(note);
}
