import { eyedleDocument } from './eyedle-document-data.js';
import { eyedleMedia } from './eyedle-media.js';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const safeURL = value => {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};
const numeric = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
const headingLevel = block => /^title$/i.test(block.style) ? 1 : /^heading\s*1$/i.test(block.style) ? 2 : /^heading\s*2$/i.test(block.style) ? 3 : 0;
const sectionID = block => 'eyedle-section-' + (block.text.match(/^\d+(?:\.\d+)*/)?.[0] || block.id).replaceAll('.', '-');

function inline(parts) {
  return parts.map(part => {
    if (part.type === 'break') return '<br>';
    if (part.type === 'link') {
      const url = safeURL(part.href);
      return url ? `<a href="${escape(url)}" target="_blank" rel="noopener noreferrer">${inline(part.parts)}</a>` : inline(part.parts);
    }
    if (part.type !== 'text') return '';
    let text = escape(part.text);
    if (part.italic) text = `<em>${text}</em>`;
    if (part.bold) text = `<strong>${text}</strong>`;
    return text;
  }).join('');
}

function picture(source) {
  const replacement = eyedleMedia.replacements[source.id];
  const image = replacement ? { ...source, ...replacement, crop: { l: 0, t: 0, r: 0, b: 0 },
    displayWidth: numeric(replacement.width, source.displayWidth), displayHeight: numeric(replacement.height, source.displayHeight) } : source;
  const url = safeURL(image.src);
  if (!url) return '';
  const { l, r, t, b } = image.crop;
  const cropStyle = (l || r || t || b) ? `position:absolute;width:${100 / (1 - l - r)}%;height:${100 / (1 - t - b)}%;max-width:none;left:${-100 * l / (1 - l - r)}%;top:${-100 * t / (1 - t - b)}%;` : '';
  return `<a class="eyedle-picture" id="${escape(source.id)}" href="${escape(url)}" target="_blank" rel="noopener noreferrer" aria-label="Open image: ${escape(image.alt)}" style="--picture-flex:${source.displayWidth}"><span class="eyedle-picture-frame" style="aspect-ratio:${image.displayWidth}/${image.displayHeight}"><img src="${escape(url)}" alt="${escape(image.alt)}" width="${Math.round(numeric(image.width, source.width))}" height="${Math.round(numeric(image.height, source.height))}" loading="lazy" decoding="async"${cropStyle ? ` style="${cropStyle}"` : ''}></span></a>`;
}

function extraMedia(after) {
  const media = eyedleMedia.insertions.filter(item => item.after === after && safeURL(item.src));
  return media.map(item => {
    const src = escape(safeURL(item.src));
    const label = escape(item.alt || item.caption || 'EyeDle gameplay');
    const isLoop = item.type === 'loop';
    const isVideo = item.type === 'video' || isLoop;
    const mediaID = escape(item.id || item.after);
    const videoID = 'eyedle-clip-' + mediaID;
    const titleID = 'eyedle-media-title-' + mediaID;
    const captionID = 'eyedle-media-caption-' + mediaID;
    const visual = isVideo
      ? `<video id="${videoID}" controls playsinline preload="${isLoop ? 'none' : 'metadata'}" aria-label="${label}"${item.caption ? ` aria-describedby="${captionID}"` : ''}${isLoop ? ' muted loop data-eyedle-loop' : ''}${safeURL(item.poster) ? ` poster="${escape(safeURL(item.poster))}"` : ''}${item.width && item.height ? ` width="${numeric(item.width, 1280)}" height="${numeric(item.height, 720)}"` : ''}><source src="${src}" type="video/mp4"></video>`
      : `<img src="${src}" alt="${label}" loading="lazy" decoding="async"${item.width && item.height ? ` width="${numeric(item.width, 1280)}" height="${numeric(item.height, 720)}"` : ''}>`;
    const heading = item.title ? `<header class="eyedle-clip-heading"><h4 id="${titleID}">${escape(item.title)}</h4>${item.label ? `<span>${escape(item.label)}</span>` : ''}</header>` : '';
    const actions = isVideo ? `<div class="eyedle-clip-actions">${isLoop ? `<button type="button" data-loop-toggle aria-controls="${videoID}" hidden>Play animation</button>` : ''}<a href="${src}" target="_blank" rel="noopener noreferrer" aria-label="View larger: ${label}">View larger <span aria-hidden="true">↗</span></a>${safeURL(item.gif) ? `<a href="${escape(safeURL(item.gif))}" download>Download GIF <span aria-hidden="true">↓</span></a>` : ''}</div>` : '';
    return `<div class="eyedle-extra-media" id="eyedle-media-${mediaID}" data-format="${!item.wide && item.height > item.width ? 'portrait' : 'landscape'}"><figure${item.title ? ` aria-labelledby="${titleID}"` : ''}>${heading}${visual}${item.caption ? `<figcaption id="${captionID}">${escape(item.caption)}</figcaption>` : ''}${actions}</figure></div>`;
  }).join('');
}

export function mountEyeDle(root) {
  if (!root) return () => {};
  const controller = new AbortController();
  const { signal } = controller;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();
  const updateButton = (video, button) => {
    button.textContent = video.paused ? 'Play animation' : 'Pause animation';
    button.setAttribute('aria-label', `${video.paused ? 'Play' : 'Pause'}: ${video.getAttribute('aria-label')}`);
  };
  const syncPlayback = (video, state) => {
    const shouldPlay = state.visible && !document.hidden && !state.userPaused && (!reducedMotion.matches || state.userStarted);
    if (shouldPlay && video.paused) video.play().catch(() => updateButton(video, state.button));
    else if (!shouldPlay && !video.paused) video.pause();
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = states.get(entry.target);
      state.visible = entry.isIntersecting && entry.intersectionRatio >= .25;
      syncPlayback(entry.target, state);
    }
  }, { threshold: [0, .25] });
  for (const video of root.querySelectorAll('[data-eyedle-loop]')) {
    const button = video.closest('figure').querySelector('[data-loop-toggle]');
    const state = { button, visible: false, userPaused: false, userStarted: false };
    states.set(video, state);
    video.muted = true;
    video.controls = false;
    button.hidden = false;
    button.addEventListener('click', () => {
      state.userPaused = !video.paused;
      state.userStarted = video.paused;
      if (state.userStarted && !state.visible) {
        video.scrollIntoView({ block: 'center', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      }
      syncPlayback(video, state);
    }, { signal });
    for (const event of ['play', 'pause', 'error']) video.addEventListener(event, () => updateButton(video, button), { signal });
    updateButton(video, button);
    observer.observe(video);
  }
  const syncAll = () => states.forEach((state, video) => syncPlayback(video, state));
  document.addEventListener('visibilitychange', syncAll, { signal });
  reducedMotion.addEventListener('change', syncAll, { signal });
  return () => {
    observer.disconnect();
    controller.abort();
    root.querySelectorAll('video').forEach(video => video.pause());
  };
}

function paragraph(block, inTable = false) {
  if (block.type === 'images') {
    const images = block.parts.filter(part => part.type === 'image');
    return `<div class="eyedle-figures" id="${block.id}" data-count="${images.length}" data-kind="${block.kind}" style="--group-width:${block.groupWidth}%;--group-gap:${block.groupGap ?? 2.5}%">${images.map(picture).join('')}</div>`;
  }
  if (!block.text.trim()) return '';
  const level = headingLevel(block);
  if (level) return `<h${level} id="${level === 1 ? 'eyedle-document-title' : sectionID(block)}">${inline(block.parts)}</h${level}>`;
  if (/^Level 1Level 2Level 3$/.test(block.text)) {
    return `<div class="eyedle-level-labels" id="${block.id}">${['Level 1', 'Level 2', 'Level 3'].map(text => `<span>${text}</span>`).join('')}</div>`;
  }
  const textParts = block.parts.filter(part => part.type === 'text' && part.text.trim());
  const allBold = textParts.length && textParts.every(part => part.bold) && !block.parts.some(part => part.type === 'link');
  const equipment = ['Filter', 'Mixer', 'Bottler'].includes(block.text);
  const tag = allBold && !inTable && !equipment ? 'h4' : 'p';
  const className = equipment && !inTable ? 'eyedle-equipment-label' : block.style === 'EyeDle Reference' ? 'eyedle-reference' : block.parts.some(part => part.type === 'link') && !textParts.length ? 'eyedle-source-link' : '';
  return `<${tag} id="${block.id}"${className ? ` class="${className}"` : ''}>${inline(block.parts)}</${tag}>`;
}

function table(block, label) {
  const total = block.columns.reduce((sum, width) => sum + width, 0);
  const row = (cells, header) => '<tr>' + cells.map(cell => {
    const tag = header ? 'th' : 'td';
    return `<${tag}${header ? ' scope="col"' : ''}${cell.span > 1 ? ` colspan="${cell.span}"` : ''}>${cell.paragraphs.map(p => paragraph(p, true)).join('')}</${tag}>`;
  }).join('') + '</tr>';
  return `<div class="eyedle-table-wrap" id="${block.id}" role="region" aria-label="${escape(label)} table" tabindex="0"><table><colgroup>${block.columns.map(width => `<col style="width:${100 * width / total}%">`).join('')}</colgroup><thead>${row(block.rows[0], true)}</thead><tbody>${block.rows.slice(1).map(cells => row(cells, false)).join('')}</tbody></table></div>`;
}

export function eyedlePage(project, next) {
  const chapters = eyedleDocument.blocks.filter(block => headingLevel(block) === 2);
  let latestHeading = eyedleDocument.title;
  let currentSection = null;
  const content = [];
  for (const block of eyedleDocument.blocks) {
    const level = headingLevel(block);
    if (level === 2 || level === 3) {
      if (currentSection) content.push(extraMedia(currentSection));
      currentSection = sectionID(block);
      latestHeading = block.text;
    }
    content.push(block.type === 'table' ? table(block, latestHeading) : paragraph(block));
    content.push(extraMedia(block.id));
  }
  if (currentSection) content.push(extraMedia(currentSection));
  return `<article class="detail eyedle-detail">
    <div class="detail-nav"><a href="./#work" data-route>← All projects</a><span class="detail-index">${escape(project.number)} / 04</span></div>
    <nav class="eyedle-toc" aria-label="EyeDle document chapters">${chapters.map(block => `<a href="#${sectionID(block)}" data-section>${escape(block.text)}</a>`).join('')}</nav>
    <div class="eyedle-document" aria-labelledby="eyedle-document-title">${content.join('\n')}</div>
    <a class="next-project" href="?project=${encodeURIComponent(next.id)}" data-route><div><small>Next project</small><strong>${escape(next.name)}</strong></div><span aria-hidden="true">→</span></a>
  </article>`;
}
