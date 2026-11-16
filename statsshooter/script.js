const siteLanguage = document.documentElement.lang;
const isEnglish = siteLanguage === 'en';
const languageLink = document.querySelector('[data-language-link]');
const alternatePage = new URL(languageLink.href);

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
    context.strokeStyle = '#e8c495';
    context.lineWidth = 1.4;
    context.shadowColor = '#271e23';
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

const steps = [
  { sample: 20, result: isEnglish ? 'The mean is in range. Shots deal direct damage.' : '均值有效，可以正常射击。' },
  { sample: 40, result: isEnglish ? 'This shot dealt damage. The mean is now out of range, so later shots lose direct damage.' : '本轮仍有伤害。均值出界，后续普通射击的直伤中断。' },
  { sample: 20, result: isEnglish ? 'Calibration returns the 40 to 20 and restores direct damage.' : '系统把 40 改回 20，恢复正常输出。' },
];
const calibration = document.querySelector('[data-calibration]');
const stepButtons = [...calibration.querySelectorAll('[data-step]')];
const firstSample = calibration.querySelector('[data-first-sample]');
const meanReadout = calibration.querySelector('[data-mean]');
const calibrationResult = calibration.querySelector('[data-calibration-result]');

for (const button of stepButtons) {
  button.addEventListener('click', () => {
    const step = steps[Number(button.dataset.step)];
    const mean = (step.sample + 5 * 20) / 6;
    for (const peer of stepButtons) {
      peer.setAttribute('aria-pressed', String(peer === button));
    }
    calibration.toggleAttribute('data-outside', mean < 18 || mean > 22);
    firstSample.textContent = String(step.sample);
    meanReadout.textContent = mean.toFixed(1);
    calibrationResult.textContent = step.result;
  });
}

const cardSwap = document.querySelector('[data-card-swap]');
const swapChoices = [...cardSwap.querySelectorAll('[data-swap-choice]')];
const swapSlots = [...cardSwap.querySelectorAll('[data-swap-slot]')];
const swapSampleCells = [...cardSwap.querySelectorAll('.swap-samples li')];
const swapSampleValues = swapSampleCells.map(cell => cell.querySelector('strong'));
const originalSamples = swapSampleValues.map(value => Number(value.textContent));
const originalCards = swapSlots.map(slot => slot.textContent);
const swapStage = cardSwap.querySelector('[data-swap-stage]');
const swapEffect = cardSwap.querySelector('[data-swap-effect]');
const swapRifle = cardSwap.querySelector('[data-swap-rifle]');
const swapMean = cardSwap.querySelector('[data-swap-mean]');
const swapVariance = cardSwap.querySelector('[data-swap-variance]');
const swapForecast = cardSwap.querySelector('[data-swap-forecast]');
const swapStatus = cardSwap.querySelector('[data-swap-status]');
const swapHit = cardSwap.querySelector('[data-swap-hit]');
const swapPlay = cardSwap.querySelector('[data-swap-play]');
const swapReset = cardSwap.querySelector('[data-swap-reset]');

// The routes share one set of example precision draws. A hit uses the first draw
// or averages all eight, then Center Compression halves the distance from 20.
const swapDraws = [
  [16, 19, 20, 20, 19, 21, 20, 20],
  [24, 21, 20, 20, 21, 20, 19, 20],
  [18, 20, 20, 21, 21, 19, 19, 20],
  [22, 19, 19, 20, 20, 21, 21, 21],
  [19, 20, 19, 21, 19, 21, 18, 20],
  [21, 20, 20, 19, 20, 22, 20, 20],
];
const tierNames = isEnglish ? ['Base', 'Tier I', 'Tier II', 'Tier III'] : ['基础', 'Ⅰ档', 'Ⅱ档', 'Ⅲ档'];
const swapRifleStages = [
  { effect: isEnglish ? 'Hits up to 1 enemy' : '最多命中 1 敌' },
  { effect: isEnglish ? 'Pierces up to 2 enemies' : '最多贯穿 2 敌', enter: 60, exit: 70 },
  { effect: isEnglish ? 'Pierces up to 3 enemies with damage falloff' : '最多贯穿 3 敌，贯穿伤害递减', enter: 12, exit: 16 },
  { effect: isEnglish ? 'Pierces up to 3 enemies at full damage' : '最多贯穿 3 敌，贯穿不减伤', enter: .30, exit: .45 },
];
const swapNumber = new Intl.NumberFormat(siteLanguage, { maximumFractionDigits: 3 });
let swapSelection = null;
let liveSamples = [...originalSamples];
let liveRifleStage = 3;
let swapHitCount = 0;
let swapTimer = null;

function measureSwapSamples() {
  const mean = liveSamples.reduce((sum, value) => sum + value, 0) / liveSamples.length;
  const variance = liveSamples.reduce((sum, value) => sum + (value - mean) ** 2, 0) / liveSamples.length;
  return { mean, variance };
}

function updateSwapControls() {
  const complete = swapHitCount === swapDraws.length;
  swapHit.disabled = !swapSelection || complete || swapTimer !== null;
  swapPlay.disabled = !swapSelection || complete;
  const [play, pause] = isEnglish ? ['Play Demo', 'Pause Demo'] : ['连续演示', '暂停演示'];
  swapPlay.textContent = swapTimer === null ? play : pause;
  swapReset.disabled = swapHitCount === 0;
}

function renderSwapData({ mean, variance }) {
  for (const [index, value] of liveSamples.entries()) {
    swapSampleValues[index].textContent = swapNumber.format(value);
    swapSampleCells[index].toggleAttribute('data-updated', index === swapHitCount - 1);
  }
  swapMean.textContent = mean.toFixed(2);
  swapVariance.textContent = variance.toFixed(3);
  swapStage.textContent = !isEnglish && liveRifleStage === 0 ? '基础档' : tierNames[liveRifleStage];
  swapEffect.textContent = swapRifleStages[liveRifleStage].effect;
  swapRifle.dataset.swapRifle = liveRifleStage;
}

function stopSwapPlayback() {
  clearInterval(swapTimer);
  swapTimer = null;
}

function resetSwapData(message) {
  stopSwapPlayback();
  liveSamples = [...originalSamples];
  liveRifleStage = 3;
  swapHitCount = 0;
  renderSwapData(measureSwapSamples());
  swapStatus.textContent = message;
  updateSwapControls();
}

function recordSwapHit() {
  const slot = swapHitCount;
  const draws = swapDraws[slot];
  const sample = swapSelection === 'average' ? draws[0] : draws.reduce((sum, draw) => sum + draw, 0) / draws.length;
  const previous = liveSamples[slot];
  const next = 20 + .5 * (sample - 20);
  liveSamples[slot] = next;
  swapHitCount++;

  const { mean, variance } = measureSwapSamples();
  const previousStage = liveRifleStage;
  while (liveRifleStage > 0 && variance > swapRifleStages[liveRifleStage].exit) liveRifleStage--;
  if (mean >= 18 && mean <= 22) {
    for (let stage = liveRifleStage + 1; stage < swapRifleStages.length; stage++) {
      if (variance <= swapRifleStages[stage].enter) liveRifleStage = stage;
    }
  }

  renderSwapData({ mean, variance });
  const stage = swapStage.textContent;
  const sameStage = previousStage === liveRifleStage;
  const drawValue = swapNumber.format(sample);
  const oldValue = swapNumber.format(previous);
  const newValue = swapNumber.format(next);
  if (isEnglish) {
    const source = swapSelection === 'average' ? 'Single draw' : 'Average of eight draws';
    const stageChange = sameStage ? 'stays at' : 'moves to';
    swapStatus.textContent = `Hit ${swapHitCount} of ${swapDraws.length}. ${source} = ${drawValue}. After Center Compression, slot ${slot + 1} changes from ${oldValue} to ${newValue}. Mean ${mean.toFixed(2)}, variance ${variance.toFixed(3)}. The rifle ${stageChange} ${stage}.`;
  } else {
    const source = swapSelection === 'average' ? '单次取样' : '八次取样平均';
    const stageChange = sameStage ? '维持' : '变为';
    swapStatus.textContent = `第 ${swapHitCount} / ${swapDraws.length} 次命中。${source} ${drawValue}，中心收缩后，第 ${slot + 1} 格从 ${oldValue} 写成 ${newValue}。均值 ${mean.toFixed(2)}，方差 ${variance.toFixed(3)}，步枪${stageChange}${stage}。`;
  }
  if (swapHitCount === swapDraws.length) stopSwapPlayback();
  updateSwapControls();
}

for (const choice of swapChoices) {
  choice.addEventListener('click', () => {
    swapSelection = choice.dataset.swapChoice;
    for (const button of swapChoices) button.setAttribute('aria-pressed', String(button === choice));
    for (const [index, slot] of swapSlots.entries()) {
      const replaced = slot.dataset.swapSlot === swapSelection;
      const newCard = isEnglish ? 'Piercing Echo' : '贯穿回响';
      slot.textContent = replaced ? newCard : originalCards[index];
      slot.toggleAttribute('data-replaced', replaced);
    }
    swapForecast.textContent = swapSelection === 'average' ? '1.25' : '0.156';
    resetSwapData(isEnglish
      ? 'Piercing Echo is equipped. The values and tier carry over. Land a hit to update the first slot.'
      : '贯穿回响已装入。六格和档位仍是换卡前的状态，命中后开始逐格更新。');
  });
}
swapHit.addEventListener('click', recordSwapHit);
swapPlay.addEventListener('click', () => {
  if (swapTimer !== null) {
    stopSwapPlayback();
    updateSwapControls();
  } else {
    swapTimer = setInterval(recordSwapHit, 1250);
    recordSwapHit();
  }
});
swapReset.addEventListener('click', () => resetSwapData(isEnglish
  ? 'The starting values are restored. Land another hit or try the other swap.'
  : '已恢复起始六格。再命中一次，或选择另一种换法。'));

for (const group of document.querySelectorAll('[data-tabs]')) {
  const tabList = group.querySelector('[role="tablist"]');
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];

  function selectTab(selectedTab) {
    for (const tab of tabs) {
      const selected = tab === selectedTab;
      const panel = document.getElementById(tab.getAttribute('aria-controls'));
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panel.hidden = !selected;
    }
  }

  for (const tab of tabs) {
    tab.addEventListener('click', () => selectTab(tab));
  }
  tabList.addEventListener('keydown', event => {
    const index = tabs.indexOf(event.target);
    if (index === -1) return;
    const nextIndex = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (nextIndex === undefined) return;
    event.preventDefault();
    selectTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
}

const lightbox = document.querySelector('.lightbox');
const preview = lightbox.querySelector('img');
const previewTitle = lightbox.querySelector('h2');
let lastImageButton;

for (const button of document.querySelectorAll('.zoomable')) {
  button.addEventListener('click', () => {
    const thumbnail = button.querySelector('img');
    lastImageButton = button;
    preview.src = thumbnail.dataset.full || thumbnail.currentSrc || thumbnail.src;
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

for (const board of document.querySelectorAll('[data-board-preview]')) {
  const image = board.querySelector('img');
  board.style.setProperty('--lens-image', `url("${image.src}")`);
  board.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !image.naturalWidth) return;
    const bounds = board.getBoundingClientRect();
    const size = Math.min(220, bounds.height * .8);
    const zoom = Math.min(3, image.naturalWidth / bounds.width);
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const left = Math.max(0, Math.min(bounds.width - size, x - size / 2));
    const top = Math.max(0, Math.min(bounds.height - size, y - size / 2));
    board.style.setProperty('--lens-size', `${size}px`);
    board.style.setProperty('--lens-left', `${left}px`);
    board.style.setProperty('--lens-top', `${top}px`);
    board.style.setProperty('--lens-width', `${bounds.width * zoom}px`);
    board.style.setProperty('--lens-height', `${bounds.height * zoom}px`);
    board.style.setProperty('--lens-position', `${x - left - x * zoom}px ${y - top - y * zoom}px`);
    board.setAttribute('data-previewing', '');
  });
  board.addEventListener('pointerleave', () => board.removeAttribute('data-previewing'));
}

const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');

function bindCombatClip(figure, activeCard = null) {
  const image = figure.querySelector('img');
  const button = figure.querySelector('.clip-playback');
  const playLabel = button.textContent;
  const stopLabel = isEnglish ? 'Stop GIF' : '停止回放';
  let still = image.getAttribute('src');
  let animation = image.dataset.animation;
  let playbackOverride = null;
  let visible = false;

  function wantsPlayback() {
    return playbackOverride ?? (figure.hasAttribute('data-autoplay') && !motionPreference.matches &&
      (!activeCard?.closest('[data-scroll-ready]') || activeCard.hasAttribute('data-active')));
  }

  function render() {
    const playing = wantsPlayback();
    const showAnimation = playing && visible;
    const source = showAnimation ? animation : still;
    if (image.getAttribute('src') !== source) image.setAttribute('src', source);
    button.textContent = playing ? stopLabel : playLabel;
  }

  button.hidden = false;
  button.addEventListener('click', () => {
    playbackOverride = !wantsPlayback();
    render();
  });
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) playbackOverride = false;
    render();
  });
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    render();
  }, { threshold: 0.12 }).observe(figure);
  if (activeCard) {
    const changes = new MutationObserver(render);
    changes.observe(activeCard, { attributeFilter: ['data-active'] });
    changes.observe(activeCard.closest('[data-ignition-rail]'), { attributeFilter: ['data-scroll-ready'] });
  }

  return variant => {
    still = variant.still;
    if (variant.animation) animation = variant.animation;
    if (variant.alt) image.alt = variant.alt;
    render();
  };
}

for (const figure of document.querySelectorAll('[data-ignition-clip]')) {
  bindCombatClip(figure, figure.closest('.ignition-card'));
}

const weaponDemos = {
  rifle: [
    { variance: 0, tier: 3, effect: isEnglish ? 'Pierces three at full damage' : '三目标全额贯穿' },
    { variance: 11, tier: 2, effect: isEnglish ? 'Pierces three enemies' : '贯穿三个目标' },
    { variance: 59, tier: 1, effect: isEnglish ? 'Pierces two enemies' : '贯穿两个目标' },
    { variance: 100, tier: 0, effect: isEnglish ? 'Hits one enemy' : '命中一个目标' },
  ],
  shotgun: [
    { variance: 40, tier: 0, effect: isEnglish ? '5-pellet spread' : '5 弹扇射' },
    { variance: 141, tier: 1, effect: isEnglish ? '7-pellet spread' : '7 弹扇射' },
    { variance: 241, tier: 2, effect: isEnglish ? '9-pellet spread' : '9 弹扇射' },
    { variance: 400, tier: 3, effect: isEnglish ? '25-pellet ring' : '25 弹环射' },
  ],
};
const weaponAssetSuffix = isEnglish ? '-en' : '';
for (const demo of document.querySelectorAll('[data-weapon-demo]')) {
  const weapon = demo.dataset.weaponDemo;
  const slider = demo.querySelector('input');
  const value = demo.querySelector('output strong');
  const caption = demo.querySelector('[data-weapon-caption]');
  const showVariant = bindCombatClip(demo.querySelector('[data-clip]'));
  slider.addEventListener('input', () => {
    const { variance, tier, effect } = weaponDemos[weapon][slider.value];
    const label = tierNames[tier];
    const file = `./assets/${weapon}-${tier}${weaponAssetSuffix}`;
    value.textContent = variance;
    caption.textContent = `${label} · ${effect}`;
    slider.setAttribute('aria-valuetext', isEnglish ? `Variance ${variance}, ${label}, ${effect}` : `方差 ${variance}，${label}，${effect}`);
    const weaponName = weapon === 'rifle' ? 'Rifle' : 'Shotgun';
    const alt = isEnglish ? `${weaponName} gameplay, ${label}. ${effect}.` : `${label}实机攻击，${effect}`;
    showVariant({ still: `${file}.webp`, animation: `${file}.gif`, alt });
  });
}

const navLinks = [...document.querySelectorAll('.main-nav a')];
const navSections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
const readingProgress = document.querySelector('.reading-progress');
const pageHeader = document.querySelector('.site-header');
const ignitionRail = document.querySelector('[data-ignition-rail]');
const ignitionWindow = ignitionRail.querySelector('.ignition-window');
const ignitionCards = [...ignitionRail.querySelectorAll('.ignition-card')];
const ignitionStops = [...ignitionRail.querySelectorAll('[data-ignition-stop]')];
const railMedia = matchMedia('(min-width: 801px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)');
let ignitionTravel = 0;
let ignitionTop = 0;
let ignitionCenter = 0;
let activeIgnition = 0;
let framePending = false;

function measureIgnitionRail() {
  ignitionRail.toggleAttribute('data-scroll-ready', railMedia.matches);
  if (railMedia.matches) {
    ignitionTravel = ignitionCards.at(-1).offsetLeft;
    ignitionTop = pageHeader.offsetHeight + 16;
    ignitionCenter = (ignitionWindow.clientWidth - ignitionCards[0].offsetWidth) / 2;
    ignitionRail.style.setProperty('--ignition-travel', `${ignitionTravel}px`);
    ignitionRail.style.setProperty('--ignition-top', `${ignitionTop}px`);
  }
  scheduleReadingUpdate();
}

function updateIgnitionRail() {
  if (!railMedia.matches || ignitionTravel === 0) return;
  const distance = Math.min(ignitionTravel, Math.max(0, ignitionTop - ignitionRail.getBoundingClientRect().top));
  const progress = distance / ignitionTravel;
  ignitionRail.style.setProperty('--ignition-offset', `${ignitionCenter - distance}px`);
  ignitionRail.style.setProperty('--ignition-progress', progress);
  const current = Math.round(progress * (ignitionCards.length - 1));
  if (current === activeIgnition) return;
  ignitionCards[activeIgnition].removeAttribute('data-active');
  ignitionStops[activeIgnition].removeAttribute('aria-current');
  ignitionCards[current].setAttribute('data-active', '');
  ignitionStops[current].setAttribute('aria-current', 'step');
  activeIgnition = current;
}

function goToIgnitionCard(card, behavior) {
  const railTop = window.scrollY + ignitionRail.getBoundingClientRect().top;
  window.scrollTo({ top: railTop - ignitionTop + card.offsetLeft, behavior });
}

ignitionStops.forEach((stop, index) => {
  stop.addEventListener('click', () => goToIgnitionCard(ignitionCards[index], 'smooth'));
});
ignitionWindow.addEventListener('focusin', event => {
  if (!railMedia.matches || !event.target.matches(':focus-visible')) return;
  const card = event.target.closest('.ignition-card');
  const cardBounds = card.getBoundingClientRect();
  const windowBounds = ignitionWindow.getBoundingClientRect();
  if (cardBounds.left < windowBounds.left || cardBounds.right > windowBounds.right) goToIgnitionCard(card, 'instant');
});
new ResizeObserver(measureIgnitionRail).observe(ignitionWindow);
railMedia.addEventListener('change', measureIgnitionRail);

function updateReadingPosition() {
  framePending = false;
  updateIgnitionRail();
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

    for (const note of notes) {
      const point = guide.querySelector(`[data-point="${note.dataset.callout}"]`);
      const position = getComputedStyle(point);
      const edge = note.dataset.edge;
      const compact = compactGuide.matches;
      const box = (compact ? point : note).getBoundingClientRect();
      const startX = box.left - frame.left + box.width * (compact || edge !== 'left' ? 0.5 : 0);
      const startY = box.top - frame.top + box.height * (compact || edge === 'left' ? 0.5 : Number(edge === 'bottom'));
      const endX = shot.left - frame.left + shot.width * parseFloat(position.getPropertyValue('--x')) / 100;
      const endY = shot.top - frame.top + shot.height * parseFloat(position.getPropertyValue('--y')) / 100;
      const bendX = compact || edge === 'left' ? (endX - startX) * 0.42 : 0;
      const bendY = compact || edge !== 'left' ? (endY - startY) * 0.42 : 0;

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
