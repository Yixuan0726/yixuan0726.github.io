import { eyedleDocument } from './eyedle-document-data.js?v=6f3d6a6af7e6';
import { eyedleMedia } from './eyedle-media.js?v=6f3d6a6af7e6';
import { eyeDleCaseStudyPage } from './eyedle-case-study.js?v=b1b9e4ee866d';

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

function figures(blocks) {
  const first = blocks[0];
  const images = blocks.flatMap(block => block.parts.filter(part => part.type === 'image'));
  const anchors = blocks.slice(1).map(block => `<span class="eyedle-figure-anchor" id="${escape(block.id)}" aria-hidden="true"></span>`).join('');
  return `<div class="eyedle-figures" id="${escape(first.id)}" data-count="${images.length}" data-kind="${escape(first.kind)}" style="--group-width:${blocks.length > 1 ? 100 : first.groupWidth}%;--group-gap:${first.groupGap ?? 2.5}%;--figure-columns:${images.length}">${anchors}${images.map(picture).join('')}</div>`;
}

function canJoinScreenshotRows(previous, next, count) {
  const images = block => block.parts.filter(part => part.type === 'image');
  const portrait = block => images(block).every(image => image.displayWidth / image.displayHeight < .75);
  return next?.type === 'images' && previous.kind === 'screenshots' && next.kind === 'screenshots'
    && count + images(next).length <= 4 && portrait(previous) && portrait(next)
    && !eyedleMedia.insertions.some(item => item.after === previous.id);
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
  const disposeReading = mountReadingNavigation(root, signal);
  const disposeImages = mountImageViewer(root, signal);
  return () => {
    disposeImages();
    disposeReading();
    observer.disconnect();
    controller.abort();
    root.querySelectorAll('video').forEach(video => video.pause());
  };
}

function mountReadingNavigation(root, signal) {
  const chapters = [...root.querySelectorAll('[data-chapter]')];
  const links = [...root.querySelectorAll('[data-chapter-link]')];
  const progress = root.querySelector('[data-reading-progress]');
  const documentArea = root.querySelector('.eyedle-document');
  const navigation = root.querySelector('.eyedle-toc');
  const navigationLinks = root.querySelector('.eyedle-toc-links');
  let frame = 0;
  let previousActive = -1;
  const update = () => {
    frame = 0;
    const offset = (navigation?.offsetHeight || 64) + 40;
    let active = -1;
    chapters.forEach((chapter, index) => {
      if (chapter.getBoundingClientRect().top <= offset) active = index;
    });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (active !== previousActive && active >= 0 && navigationLinks.scrollWidth > navigationLinks.clientWidth + 1) {
      const linkBox = links[active].getBoundingClientRect();
      const navBox = navigationLinks.getBoundingClientRect();
      if (linkBox.left < navBox.left || linkBox.right > navBox.right) {
        navigationLinks.scrollTo({
          left: navigationLinks.scrollLeft + linkBox.left - navBox.left - (navBox.width - linkBox.width) / 2,
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
        });
      }
    }
    previousActive = active;
    if (progress && documentArea) {
      const rect = documentArea.getBoundingClientRect();
      const length = Math.max(1, rect.height - innerHeight + offset);
      const value = Math.min(1, Math.max(0, (offset - rect.top) / length));
      progress.style.transform = `scaleX(${value})`;
    }
    root.style.setProperty('--eyedle-nav-height', `${navigation?.offsetHeight || 64}px`);
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', schedule, { passive: true, signal });
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
  if (resize) { resize.observe(documentArea); resize.observe(navigation); }
  update();
  return () => { cancelAnimationFrame(frame); resize?.disconnect(); };
}

function mountImageViewer(root, signal) {
  const dialog = root.querySelector('.eyedle-lightbox');
  if (!dialog || typeof dialog.showModal !== 'function') return () => {};
  const pictures = [...root.querySelectorAll('.eyedle-picture')];
  const image = dialog.querySelector('[data-lightbox-image]');
  const caption = dialog.querySelector('[data-lightbox-caption]');
  const counter = dialog.querySelector('[data-lightbox-counter]');
  const original = dialog.querySelector('[data-lightbox-original]');
  const previous = dialog.querySelector('[data-lightbox-prev]');
  const next = dialog.querySelector('[data-lightbox-next]');
  let index = 0;
  let trigger = null;
  let oldOverflow = '';
  let oldPadding = '';
  let locked = false;
  let disposed = false;
  const unlock = () => {
    if (!locked) return;
    document.body.style.overflow = oldOverflow;
    document.body.style.paddingRight = oldPadding;
    locked = false;
  };
  const show = position => {
    index = Math.min(pictures.length - 1, Math.max(0, position));
    const picture = pictures[index];
    image.src = picture.href;
    image.alt = picture.querySelector('img').alt;
    caption.textContent = image.alt;
    counter.textContent = `${index + 1} / ${pictures.length}`;
    original.href = picture.href;
    previous.disabled = index === 0;
    next.disabled = index === pictures.length - 1;
  };
  root.addEventListener('click', event => {
    const picture = event.target.closest('.eyedle-picture');
    if (!picture || !root.contains(picture) || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = picture;
    show(pictures.indexOf(picture));
    oldOverflow = document.body.style.overflow;
    oldPadding = document.body.style.paddingRight;
    const scrollbar = innerWidth - document.documentElement.clientWidth;
    if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    locked = true;
    dialog.showModal();
    dialog.querySelector('[data-lightbox-close]').focus();
  }, { signal });
  previous.addEventListener('click', () => show(index - 1), { signal });
  next.addEventListener('click', () => show(index + 1), { signal });
  dialog.querySelector('[data-lightbox-close]').addEventListener('click', () => dialog.close(), { signal });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1));
    }
  }, { signal });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  }, { signal });
  dialog.addEventListener('close', () => {
    unlock();
    if (!disposed && trigger?.isConnected) trigger.focus({ preventScroll: true });
  }, { signal });
  return () => {
    disposed = true;
    if (dialog.open) dialog.close();
    unlock();
  };
}

function paragraph(block, inTable = false) {
  if (block.type === 'images') {
    return figures([block]);
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

function renderBlocks(blocks, label) {
  const content = [];
  let copying = false;
  const closeCopy = () => { if (copying) { content.push('</div>'); copying = false; } };
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.type === 'images') {
      closeCopy();
      const rows = [block];
      let count = block.parts.filter(part => part.type === 'image').length;
      while (canJoinScreenshotRows(rows.at(-1), blocks[index + 1], count)) {
        const nextRow = blocks[++index];
        rows.push(nextRow);
        count += nextRow.parts.filter(part => part.type === 'image').length;
      }
      content.push(figures(rows));
      rows.forEach(row => content.push(extraMedia(row.id)));
      continue;
    }
    if (block.type === 'table') {
      closeCopy();
      content.push(table(block, label));
    } else {
      const rendered = paragraph(block);
      if (rendered) {
        if (/^Level 1Level 2Level 3$/.test(block.text)) {
          closeCopy();
          content.push(rendered);
        } else {
          if (!copying) { content.push('<div class="eyedle-copy-group">'); copying = true; }
          content.push(rendered);
        }
      }
    }
    const inserted = extraMedia(block.id);
    if (inserted) { closeCopy(); content.push(inserted); }
  }
  closeCopy();
  return content.join('\n');
}

function splitHeading(block) {
  const match = block.text.match(/^(\d+)\s+(.+)$/);
  return match ? `<span class="eyedle-heading-number">${escape(match[1])} </span><span class="eyedle-heading-text">${escape(match[2])}</span>` : inline(block.parts);
}

export function eyedlePage(project, next) {
  const currentURL = new URL(location.href);
  const legacyAnchor = /^#eyedle-(?:section|block|image|media)-/.test(currentURL.hash);
  if (currentURL.searchParams.get('view') === 'full' || legacyAnchor) return fullEyeDlePage(project, next);
  const images = eyedleDocument.blocks.flatMap(block => (block.parts || []).filter(part => part.type === 'image'));
  return eyeDleCaseStudyPage(project, next, {
    escape,
    picture: id => { const source = images.find(image => image.id === id); return source ? picture(source) : ''; },
    media: id => { const source = eyedleMedia.insertions.find(item => item.id === id); return source ? extraMedia(source.after) : ''; }
  });
}

function fullEyeDlePage(project, next) {
  const chapters = [];
  let chapter;
  let subsection;
  for (const block of eyedleDocument.blocks) {
    const level = headingLevel(block);
    if (level === 1) continue;
    if (level === 2) {
      chapter = { heading: block, blocks: [], sections: [] };
      chapters.push(chapter);
      subsection = null;
    } else if (level === 3) {
      subsection = { heading: block, blocks: [] };
      chapter.sections.push(subsection);
    } else if (chapter) (subsection || chapter).blocks.push(block);
  }
  const chapterHTML = chapters.map(item => {
    const id = sectionID(item.heading);
    const sections = item.sections.map(section => {
      const sectionId = sectionID(section.heading);
      const split = ['eyedle-section-2-2', 'eyedle-section-4-1'].includes(sectionId);
      return `<section class="eyedle-subsection${split ? ' eyedle-subsection--split' : ''}" aria-labelledby="${sectionId}">
        ${paragraph(section.heading)}
        <div class="eyedle-section-body">${renderBlocks(section.blocks, section.heading.text)}${extraMedia(sectionId)}</div>
      </section>`;
    }).join('\n');
    return `<section class="eyedle-chapter" data-chapter aria-labelledby="${id}">
      <header class="eyedle-chapter-heading"><h2 id="${id}">${splitHeading(item.heading)}</h2></header>
      <div class="eyedle-chapter-body">${item.blocks.length ? `<div class="eyedle-section-body">${renderBlocks(item.blocks, item.heading.text)}</div>` : ''}${sections}${extraMedia(id)}</div>
    </section>`;
  }).join('\n');
  const title = eyedleDocument.title;
  const titleName = title.startsWith('EyeDle ') ? `<span class="eyedle-hero-name">EyeDle</span> <span class="eyedle-hero-subtitle">${escape(title.slice(7))}</span>` : escape(title);
  return `<article class="detail eyedle-detail eyedle-layout">
    <div class="detail-nav"><a href="?project=eyedle" data-route>← EyeDle case study</a><span class="detail-index">${escape(project.number)} / 04</span></div>
    <header class="eyedle-hero">
      <div class="eyedle-hero-copy">
        <p class="eyedle-hero-category">${escape(project.category)}</p>
        <h1 id="eyedle-document-title">${titleName}</h1>
        <p class="eyedle-hero-tagline">${escape(project.tagline)}</p>
        <a class="eyedle-read-link" href="#eyedle-section-1" data-section>Explore the project <span aria-hidden="true">↓</span></a>
      </div>
      <div class="eyedle-hero-media">${extraMedia('project-overview')}</div>
    </header>
    <nav class="eyedle-toc" aria-label="EyeDle document chapters">
      <div class="eyedle-toc-links">${chapters.map(item => {
        const block = item.heading;
        const parts = block.text.match(/^(\d+)\s+(.+)$/);
        return `<a href="#${sectionID(block)}" data-section data-chapter-link><span class="eyedle-toc-number">${escape(parts?.[1] || '')}</span> <span class="eyedle-toc-label">${escape(parts?.[2] || block.text)}</span></a>`;
      }).join('')}</div>
      <div class="eyedle-reading-track" aria-hidden="true"><span data-reading-progress></span></div>
    </nav>
    <div class="eyedle-document" aria-labelledby="eyedle-document-title">${chapterHTML}</div>
    <dialog class="eyedle-lightbox" aria-label="EyeDle image viewer">
      <div class="eyedle-lightbox-toolbar"><p data-lightbox-counter aria-live="polite"></p><button type="button" data-lightbox-close aria-label="Close image viewer">Close <span aria-hidden="true">×</span></button></div>
      <div class="eyedle-lightbox-stage"><button type="button" data-lightbox-prev aria-label="Previous image">←</button><figure><img data-lightbox-image alt=""><figcaption data-lightbox-caption></figcaption></figure><button type="button" data-lightbox-next aria-label="Next image">→</button></div>
      <div class="eyedle-lightbox-footer"><span>← → to browse · Esc to close</span><a data-lightbox-original target="_blank" rel="noopener noreferrer">Open original ↗</a></div>
    </dialog>
    <a class="next-project" href="?project=${encodeURIComponent(next.id)}" data-route><div><small>Next project</small><strong>${escape(next.name)}</strong></div><span aria-hidden="true">→</span></a>
  </article>`;
}
