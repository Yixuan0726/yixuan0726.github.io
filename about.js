import { personalMedia } from './personal-media.js';
import { portraitMarkup } from './portrait.js';

const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const storyPhotos = story => (story.photos?.length ? story.photos : [story.photo]).filter(photo => photo?.src);

function galleryMarkup(story) {
  const photos = storyPhotos(story);
  const name = escapeHTML(story.title.toLowerCase());
  const id = escapeHTML(story.id);
  return `<div class="personal-story-gallery" data-story-gallery="${id}"${photos.length > 1 ? ` role="region" aria-roledescription="carousel" aria-label="${escapeHTML(story.title)} photos"` : ''}>
    <button class="personal-story-photo" id="story-photo-${id}" type="button" data-personal-photo="${id}" aria-label="Enlarge ${name} photo" aria-haspopup="dialog" aria-controls="personal-photo-dialog">
      ${photos.map((photo, index) => `<img class="story-slide${index === 0 ? ' is-active' : ''}" data-story-slide="${index}" src="${escapeHTML(photo.src)}" alt="${escapeHTML(photo.alt)}" width="${photo.width}" height="${photo.height}" loading="lazy" decoding="async" aria-hidden="${index !== 0}">`).join('')}
      <span class="photo-enlarge" aria-hidden="true">View photo ↗</span>
    </button>
    ${photos.length > 1 ? `<div class="story-gallery-controls">
      <div class="story-gallery-steps"><button type="button" data-story-previous aria-label="Previous ${name} photo" aria-controls="story-photo-${id}">←</button><span data-story-count aria-label="Photo 1 of ${photos.length}">1 / ${photos.length}</span><button type="button" data-story-next aria-label="Next ${name} photo" aria-controls="story-photo-${id}">→</button></div>
      <button class="story-gallery-toggle" type="button" data-story-toggle aria-label="Pause ${name} slideshow" aria-controls="story-photo-${id}"><span aria-hidden="true">Ⅱ</span> Pause</button>
    </div><span class="visually-hidden" data-story-status role="status" aria-live="polite" aria-atomic="true"></span>` : ''}
  </div>`;
}

export function aboutMarkup({ paragraphs, contacts, resume }) {
  return `<section class="about-section" id="about" aria-labelledby="about-title" data-about>
    <div class="about-intro">
      ${portraitMarkup()}
      <div class="about-copy">
        <p class="about-kicker">About me</p>
        <h2 id="about-title">A little more<br><span>about me.</span></h2>
        <div class="about-bio">${paragraphs.map(paragraph => `<p>${escapeHTML(paragraph)}</p>`).join('')}</div>
        <nav class="about-interests-nav" aria-label="More about me">
          <a href="#basketball" data-section>Basketball <span aria-hidden="true">↓</span></a>
          <a href="#volunteer-teaching" data-section>Volunteer teaching <span aria-hidden="true">↓</span></a>
        </nav>
        ${contacts ? `<div class="contact-links">${contacts}</div>` : ''}
        ${resume}
      </div>
    </div>
    <div class="personal-stories">
      <div class="personal-stories-heading"><h3>Beyond the screen</h3><p>A few things that are part of my life.</p></div>
      <div class="personal-stories-grid">${personalMedia.interests.map(story => `<article class="personal-story" id="${escapeHTML(story.id)}" aria-labelledby="${escapeHTML(story.id)}-title">
        ${galleryMarkup(story)}
        <div class="personal-story-copy"><p class="personal-story-label">${escapeHTML(story.label)}</p><h4 id="${escapeHTML(story.id)}-title">${escapeHTML(story.title)}</h4><p class="personal-story-detail">${escapeHTML(story.detail)}</p><p>${escapeHTML(story.description)}</p></div>
      </article>`).join('')}</div>
    </div>
    <dialog class="personal-photo-dialog" id="personal-photo-dialog" aria-labelledby="personal-photo-title" aria-describedby="personal-photo-caption">
      <header><h2 id="personal-photo-title" data-photo-title></h2><button type="button" data-close-photo aria-label="Close photo" autofocus><span aria-hidden="true">×</span></button></header>
      <figure><img data-full-photo alt=""><figcaption id="personal-photo-caption" data-photo-caption></figcaption></figure>
      <div class="personal-photo-nav" data-photo-nav hidden><button type="button" data-full-previous aria-label="Previous photo in viewer">←</button><span data-full-count></span><button type="button" data-full-next aria-label="Next photo in viewer">→</button></div>
    </dialog>
  </section>`;
}

export function mountAbout(root) {
  if (!root) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const dialog = root.querySelector('dialog');
  const photo = dialog.querySelector('[data-full-photo]');
  const close = dialog.querySelector('[data-close-photo]');
  const states = new Map();
  let opener = null;
  let activeStory = null;
  let activeIndex = 0;
  let disposed = false;

  const enabledByUser = state => !state.userPaused && (!reducedMotion.matches || state.motionOverride);
  const canRotate = state => !disposed && state.items.length > 1 && state.visible && !document.hidden && !dialog.open && enabledByUser(state) && ((!state.hovered && !state.focused) || state.explicitPlay);
  const sync = state => {
    clearTimeout(state.timer);
    const enabled = enabledByUser(state);
    const running = canRotate(state);
    state.element.dataset.autoplay = running ? 'running' : 'paused';
    if (state.toggle) {
      state.toggle.innerHTML = enabled ? '<span aria-hidden="true">Ⅱ</span> Pause' : '<span aria-hidden="true">▷</span> Play';
      state.toggle.setAttribute('aria-label', `${enabled ? 'Pause' : 'Play'} ${state.story.title.toLowerCase()} slideshow`);
    }
    if (!running) return;
    state.timer = setTimeout(() => {
      showSlide(state, state.index + 1);
      sync(state);
    }, 5000);
  };
  const syncAll = () => states.forEach(sync);
  const showSlide = (state, index, announce = false) => {
    state.index = (index + state.items.length) % state.items.length;
    state.element.dataset.activeSlide = String(state.index);
    state.slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === state.index);
      slide.setAttribute('aria-hidden', String(i !== state.index));
    });
    if (state.count) {
      state.count.textContent = `${state.index + 1} / ${state.items.length}`;
      state.count.setAttribute('aria-label', `Photo ${state.index + 1} of ${state.items.length}`);
    }
    if (announce) {
      state.explicitPlay = false;
      state.status.textContent = `${state.story.title}, photo ${state.index + 1} of ${state.items.length}. ${state.items[state.index].caption}`;
    }
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = states.get(entry.target.dataset.storyGallery);
      if (!state) continue;
      state.visible = entry.isIntersecting && entry.intersectionRatio >= .2;
      sync(state);
    }
  }, { threshold: [0, .2] });

  root.querySelectorAll('[data-story-gallery]').forEach(element => {
    const story = personalMedia.interests.find(item => item.id === element.dataset.storyGallery);
    if (!story) return;
    const state = {
      story, element, items: storyPhotos(story), index: 0, timer: null,
      slides: [...element.querySelectorAll('[data-story-slide]')],
      count: element.querySelector('[data-story-count]'),
      status: element.querySelector('[data-story-status]'), toggle: element.querySelector('[data-story-toggle]'),
      visible: false, hovered: false, focused: false, explicitPlay: false, userPaused: false, motionOverride: false
    };
    states.set(story.id, state);
    showSlide(state, 0);
    if (state.items.length < 2) return;
    element.querySelector('[data-story-previous]').addEventListener('click', () => { showSlide(state, state.index - 1, true); sync(state); }, { signal });
    element.querySelector('[data-story-next]').addEventListener('click', () => { showSlide(state, state.index + 1, true); sync(state); }, { signal });
    state.toggle.addEventListener('click', () => {
      if (enabledByUser(state)) { state.userPaused = true; state.explicitPlay = false; }
      else { state.userPaused = false; state.motionOverride = true; state.explicitPlay = true; }
      sync(state);
    }, { signal });
    element.addEventListener('mouseenter', () => { state.hovered = true; state.explicitPlay = false; sync(state); }, { signal });
    element.addEventListener('mouseleave', () => { state.hovered = false; sync(state); }, { signal });
    element.addEventListener('focusin', () => { state.focused = true; state.explicitPlay = false; sync(state); }, { signal });
    element.addEventListener('focusout', event => {
      if (element.contains(event.relatedTarget)) return;
      state.focused = false; state.explicitPlay = false; sync(state);
    }, { signal });
    element.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      showSlide(state, state.index + (event.key === 'ArrowLeft' ? -1 : 1), true); sync(state);
    }, { signal });
    observer.observe(element);
    sync(state);
  });

  const showFullPhoto = index => {
    const items = storyPhotos(activeStory);
    activeIndex = (index + items.length) % items.length;
    const item = items[activeIndex];
    dialog.querySelector('[data-photo-title]').textContent = activeStory.title;
    dialog.querySelector('[data-photo-caption]').textContent = item.caption;
    photo.src = item.src; photo.alt = item.alt; photo.width = item.width; photo.height = item.height;
    dialog.querySelector('[data-photo-nav]').hidden = items.length < 2;
    dialog.querySelector('[data-full-count]').textContent = `${activeIndex + 1} / ${items.length}`;
    const state = states.get(activeStory.id);
    if (state) showSlide(state, activeIndex);
  };
  root.querySelectorAll('[data-personal-photo]').forEach(button => {
    button.addEventListener('click', () => {
      activeStory = personalMedia.interests.find(item => item.id === button.dataset.personalPhoto);
      if (!activeStory) return;
      opener = button;
      showFullPhoto(states.get(activeStory.id)?.index || 0);
      dialog.showModal();
      document.documentElement.classList.add('photo-is-open');
      syncAll();
      close.focus({ preventScroll: true });
    }, { signal });
  });
  dialog.querySelector('[data-full-previous]').addEventListener('click', () => showFullPhoto(activeIndex - 1), { signal });
  dialog.querySelector('[data-full-next]').addEventListener('click', () => showFullPhoto(activeIndex + 1), { signal });
  dialog.addEventListener('keydown', event => {
    if (!activeStory || storyPhotos(activeStory).length < 2 || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); showFullPhoto(activeIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }, { signal });
  close.addEventListener('click', () => dialog.close(), { signal });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }, { signal });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('photo-is-open');
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    syncAll();
  }, { signal });
  document.addEventListener('visibilitychange', syncAll, { signal });
  reducedMotion.addEventListener('change', syncAll, { signal });
  return () => {
    disposed = true;
    states.forEach(state => clearTimeout(state.timer));
    observer.disconnect(); controller.abort();
    if (dialog.open) dialog.close();
    document.documentElement.classList.remove('photo-is-open');
  };
}
