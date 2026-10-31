import { personalMedia } from './personal-media.js?v=f216158be5cb';

export function portraitMarkup() {
  const { portrait } = personalMedia;
  return `<figure class="portrait-stage">
    <div class="portrait-card">
      <img class="portrait-photo" src="${portrait.src}" alt="${portrait.alt}" width="${portrait.width}" height="${portrait.height}" loading="lazy" decoding="async">
      <a class="portrait-court-button" href="#basketball" data-section aria-label="Discover my basketball story">
        <svg class="portrait-ball-icon" viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="17" fill="currentColor"/><g stroke="#38271f" stroke-width="1.6" stroke-linecap="round"><circle cx="20" cy="20" r="17"/><path d="M4 14.5 36 25.5M25.5 4 14.5 36M8.5 7.5c15 8 22 16 23 25M32 7c-15 1-23 9-25 23"/></g></svg>
        <span class="portrait-court-arrow" aria-hidden="true">↓</span>
      </a>
    </div>
  </figure>`;
}
