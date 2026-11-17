const siteLanguage = document.documentElement.lang;
const isEnglish = siteLanguage === 'en';
const languageLink = document.querySelector('[data-language-link]');
const alternatePage = new URL(languageLink.href);
const embedFrame = new URLSearchParams(window.location.search).has('embed') ? window.frameElement : null;

if (embedFrame) {
  document.documentElement.classList.add('is-embedded');
  alternatePage.searchParams.set('embed', '1');
  const catalog = document.querySelector('.catalog-link');
  catalog.target = '_blank';
  catalog.rel = 'noopener';
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

function updateLanguageLink() {
  alternatePage.hash = window.location.hash;
  languageLink.href = alternatePage.href;
}

updateLanguageLink();
window.addEventListener('hashchange', updateLanguageLink);

for (const group of document.querySelectorAll('[data-annotations]')) {
  const controls = [...group.querySelectorAll('[data-annotation]')];
  const leader = document.createElement('canvas');
  leader.className = 'leader';
  leader.setAttribute('aria-hidden', 'true');
  group.prepend(leader);

  function drawLeader() {
    if (leader.clientWidth === 0) return;
    const groupBounds = group.getBoundingClientRect();
    const pin = group.querySelector('.pin[aria-pressed="true"]').getBoundingClientRect();
    const note = group.querySelector('.note-select[aria-pressed="true"]').getBoundingClientRect();
    const scale = window.devicePixelRatio;
    leader.width = Math.round(groupBounds.width * scale);
    leader.height = Math.round(groupBounds.height * scale);
    const context = leader.getContext('2d');
    const startX = pin.right - groupBounds.left;
    const startY = pin.top + pin.height / 2 - groupBounds.top;
    const endX = note.left - groupBounds.left;
    const endY = note.top + note.height / 2 - groupBounds.top;
    const bend = (endX - startX) * 0.58;
    context.scale(scale, scale);
    context.beginPath();
    context.moveTo(startX, startY);
    context.bezierCurveTo(startX + bend, startY, endX - bend, endY, endX, endY);
    context.strokeStyle = '#e4bf9b';
    context.lineWidth = 1.4;
    context.shadowColor = '#221a28';
    context.shadowBlur = 2;
    context.stroke();
  }

  for (const control of controls) {
    control.addEventListener('click', () => {
      for (const peer of controls) {
        peer.setAttribute('aria-pressed', String(peer.dataset.annotation === control.dataset.annotation));
      }
      drawLeader();
    });
  }
  new ResizeObserver(drawLeader).observe(group);
}

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
  navLinks.forEach((link, index) => {
    if (index === activeSection) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
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
      context.lineWidth = 3.4;
      context.strokeStyle = '#f0ceab';
      context.stroke();
      context.lineWidth = 1.25;
      context.strokeStyle = '#442943';
      context.stroke();

      const angle = Math.atan2(bendY, bendX);
      const headLength = compact ? 7 : 9;
      context.beginPath();
      context.moveTo(endX, endY);
      context.lineTo(endX - headLength * Math.cos(angle - 0.48), endY - headLength * Math.sin(angle - 0.48));
      context.lineTo(endX - headLength * Math.cos(angle + 0.48), endY - headLength * Math.sin(angle + 0.48));
      context.closePath();
      context.lineWidth = 1.1;
      context.strokeStyle = '#f0ceab';
      context.fillStyle = '#442943';
      context.fill();
      context.stroke();
    }
  }

  const resize = new ResizeObserver(drawCombatLeaders);
  resize.observe(guide);
  resize.observe(image);
  for (const note of notes) resize.observe(note);
}
