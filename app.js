import { portfolio } from './content.js?v=6095c3425a84';
import { aboutMarkup, mountAbout } from './about.js?v=6095c3425a84';
import { mountPdfReader } from './pdf-reader.js?v=6095c3425a84';
import { gamePlayerMarkup, mountGamePlayer } from './game-player.js?v=6095c3425a84';
import { eyedlePage, mountEyeDle } from './eyedle.js?v=6095c3425a84';
import { mountCoverMotion } from './cover-motion.js?v=6095c3425a84';

const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const safeURL = value => {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value, location.href);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
};
const projectURL = project => '?project=' + encodeURIComponent(project.id);
const projectMeta = project => '<div class="project-meta">' + project.tags.map(tag => '<span>' + escapeHTML(tag) + '</span>').join('') + '</div>';
const validEmail = portfolio.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portfolio.email);
const resourceLink = (url, label) => '<a class="text-link" href="' + escapeHTML(safeURL(url)) + '" target="_blank" rel="noopener noreferrer">' + escapeHTML(label) + '<span aria-hidden="true">↗</span></a>';

function projectCard(project) {
  const coverVideo = safeURL(project.coverVideo);
  return `<article class="project-card" data-color="${escapeHTML(project.color)}" data-cover="${escapeHTML(project.coverType || 'illustration')}" aria-labelledby="title-${escapeHTML(project.id)}">
    <a class="project-art" href="${projectURL(project)}" data-route aria-label="View ${escapeHTML(project.name)}" ${coverVideo ? 'data-cover-motion' : ''}>
      <img src="${escapeHTML(safeURL(project.cover))}" alt="${escapeHTML(project.coverAlt)}" width="${project.coverWidth || 640}" height="${project.coverHeight || 420}" loading="lazy">
      ${coverVideo ? '<video data-cover-video data-src="' + escapeHTML(coverVideo) + '" poster="' + escapeHTML(safeURL(project.cover)) + '" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>' : ''}
      ${project.coverType === 'screenshot' ? '' : '<span class="cover-label">Concept illustration</span>'}<span class="art-arrow" aria-hidden="true">↗</span>
    </a>
    <div class="project-copy">
      <p class="project-category"><span class="project-number">${escapeHTML(project.number)}</span>${escapeHTML(project.category)}</p>
      <h3 class="project-title" id="title-${escapeHTML(project.id)}"><a href="${projectURL(project)}" data-route>${escapeHTML(project.name)}</a></h3>
      ${project.role && project.collaboration === 'team' ? '<p class="role-label">My role</p><p class="project-role">' + escapeHTML(project.role) + '</p>' : ''}
      <p class="project-description">${escapeHTML(project.description)}</p>${projectMeta(project)}
      <a class="text-link" href="${projectURL(project)}" data-route aria-label="Explore ${escapeHTML(project.name)}">Explore project <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

function projectGroup(collaboration, title) {
  const projects = portfolio.projects.filter(project => project.collaboration === collaboration);
  if (!projects.length) return '';
  return `<section class="project-group" aria-labelledby="${collaboration}-title">
    <div class="section-heading"><h2 id="${collaboration}-title">${title}</h2><span class="section-index">${String(projects.length).padStart(2, '0')} ${projects.length === 1 ? 'project' : 'projects'}</span></div>
    <div class="project-grid">${projects.map(projectCard).join('')}</div>
  </section>`;
}

function resumeCard() {
  const pdf = safeURL(portfolio.resume);
  const word = safeURL(portfolio.resumeWord);
  return `<section class="resume-card" id="resume" aria-labelledby="resume-title">
    <svg class="resume-icon" viewBox="0 0 40 48" fill="none" aria-hidden="true"><path d="M8 3h16l10 10v32H8z" stroke="currentColor" stroke-width="1.5"/><path d="M24 3v11h10M15 23h12M15 30h12M15 37h8" stroke="currentColor" stroke-width="1.5"/></svg>
    <div><h3 id="resume-title">Résumé</h3><p>Experience, education & skills.</p>
      ${pdf || word ? `<div class="resume-resources">${pdf ? resourceLink(pdf, 'View CV (PDF)') : ''}${word ? `<a class="text-link" href="${escapeHTML(word)}" download="Yixuan_Yu_CV.docx">Download CV (Word) <span aria-hidden="true">↓</span></a>` : ''}</div>` : '<span class="resume-status">CV coming soon</span>'}
    </div>
  </section>`;
}

function homePage() {
  const contacts = validEmail ? '<a class="text-link" href="mailto:' + escapeHTML(portfolio.email) + '">Get in touch <span aria-hidden="true">↗</span></a>' : '';
  return `<section class="hero" aria-labelledby="intro-title">
      <div class="hero-copy"><p class="eyebrow">${escapeHTML(portfolio.role)}</p>
        <h1 id="intro-title">Hi, I’m <span>${escapeHTML(portfolio.name)}.</span></h1>
      </div>
      <div class="hero-summary"><p class="hero-description">${escapeHTML(portfolio.introduction)}</p>
        <div class="hero-actions"><a class="primary-link" href="#work" data-section>View my work <span aria-hidden="true">↓</span></a><a class="hero-about-link" href="#about" data-section>About me ↘</a></div>
      </div>
    </section>
    <div id="work">${projectGroup('solo', 'Solo Projects')}${projectGroup('team', 'Team Projects')}</div>` +
    aboutMarkup({ paragraphs: portfolio.about, contacts, resume: resumeCard() });
}

let disposeAbout = () => {};

function caseStudySection(section) {
  const picture = section.image && safeURL(section.image.src) ? `<figure class="case-image"><a href="${escapeHTML(safeURL(section.image.src))}" target="_blank" rel="noopener noreferrer" aria-label="Open image: ${escapeHTML(section.image.alt)}"><img src="${escapeHTML(safeURL(section.image.src))}" alt="${escapeHTML(section.image.alt)}" width="1920" height="1080" loading="lazy"></a><figcaption>${escapeHTML(section.image.caption)}</figcaption></figure>` : '';
  return `<section class="case-section" id="${escapeHTML(section.id)}" aria-labelledby="${escapeHTML(section.id)}-title">
    <div class="case-label"><p class="case-kicker">${escapeHTML(section.kicker)}</p></div>
    <div class="case-body"><h2 id="${escapeHTML(section.id)}-title">${escapeHTML(section.title)}</h2>
      ${section.quote ? '<blockquote>' + escapeHTML(section.quote) + '</blockquote>' : ''}
      ${section.steps?.length ? '<ol class="loop-steps">' + section.steps.map(step => '<li><h3>' + escapeHTML(step.title) + '</h3><p>' + escapeHTML(step.text) + '</p></li>').join('') + '</ol>' : ''}
      ${(section.paragraphs || []).map(paragraph => '<p>' + escapeHTML(paragraph) + '</p>').join('')}
      ${picture}
      ${section.encounters?.length ? '<div class="encounter-list">' + section.encounters.map(encounter => '<article class="encounter"><h3>' + escapeHTML(encounter.name) + '</h3><div><p>' + escapeHTML(encounter.action) + '</p><p class="design-intent"><span>Design intention</span>' + escapeHTML(encounter.meaning) + '</p></div></article>').join('') + '</div>' : ''}
      ${section.endings?.length ? '<details class="ending-disclosure"><summary>Explore the five endings <span>Spoilers ahead</span></summary><div class="ending-list">' + section.endings.map(ending => '<article><h3>' + escapeHTML(ending.name) + '</h3><p class="ending-theme">' + escapeHTML(ending.theme) + '</p><p>' + escapeHTML(ending.condition) + '</p></article>').join('') + '</div>' + (section.note ? '<p class="case-note">' + escapeHTML(section.note) + '</p>' : '') + '</details>' : ''}
    </div>
  </section>`;
}

function documentReader(project) {
  return `<section class="document-section" id="project-document" aria-labelledby="document-title">
    <div class="document-heading"><div><p class="case-kicker">Project portfolio</p><h2 id="document-title">The full project, in detail.</h2></div>
      <div class="document-links">${resourceLink(project.documentation, 'Open PDF')}<a class="text-link" href="${escapeHTML(safeURL(project.documentation))}" download="${escapeHTML(project.name)}-Portfolio.pdf">Download PDF <span aria-hidden="true">↓</span></a></div></div>
    <div class="pdf-reader" data-pdf="${escapeHTML(safeURL(project.documentation))}">
      <div class="pdf-toolbar" role="group" aria-label="PDF controls">
        <div class="pdf-page-controls"><button type="button" data-pdf-previous aria-label="Previous PDF page" disabled>←</button><label>Page <select data-pdf-page aria-label="PDF page" disabled><option>—</option></select></label><button type="button" data-pdf-next aria-label="Next PDF page" disabled>→</button></div>
        <label class="pdf-zoom-label">Zoom <select data-pdf-zoom aria-label="PDF zoom" disabled><option value="1">Fit width</option><option value="1.25">125%</option><option value="1.5">150%</option><option value="2">200%</option><option value="3">300%</option><option value="4">400%</option></select></label>
      </div>
      <div class="pdf-viewport" data-pdf-viewport tabindex="0" role="region" aria-label="PDF page preview"><canvas data-pdf-canvas role="img" aria-label="Project portfolio page" hidden></canvas></div>
      <div class="pdf-status" data-pdf-status role="status" aria-live="polite">Loading portfolio…</div><div class="visually-hidden" data-pdf-text></div>
    </div>
    <p class="document-hint">Original PDF layout. Turn pages or zoom in to read the details.</p>
  </section>`;
}

function detailPage(project) {
  if (project.id === 'eyedle') {
    return eyedlePage(project, portfolio.projects[(portfolio.projects.indexOf(project) + 1) % portfolio.projects.length]);
  }
  const resources = [
    { url: project.projectPage, label: project.projectPageLabel || 'Project page' },
    { url: project.documentPreview ? null : project.documentation, label: 'Project document' },
    { url: project.video, label: project.videoLabel || 'Watch video' },
    { url: project.playable, label: 'Play the game' },
    { url: project.download, label: project.downloadLabel || 'Download game' }
  ].filter(resource => safeURL(resource.url));
  const gallery = (project.gallery || []).filter(item => safeURL(item.src));
  const contributions = project.contributions || [];
  const showDocument = project.documentPreview && safeURL(project.documentation);
  const sections = showDocument ? [] : (project.caseStudy || []);
  const playableCover = gamePlayerMarkup(project);
  const next = portfolio.projects[(portfolio.projects.indexOf(project) + 1) % portfolio.projects.length];
  return '<article class="detail">' +
    '<div class="detail-nav"><a href="./#work" data-route>← All projects</a><span class="detail-index">' + escapeHTML(project.number) + ' / ' + String(portfolio.projects.length).padStart(2, '0') + '</span></div>' +
    '<header class="detail-heading"><p class="project-category">' + escapeHTML(project.category) + '</p><h1>' + escapeHTML(project.name) + '</h1><p class="detail-tagline">' + escapeHTML(project.tagline) + '</p>' +
      (showDocument ? '<div class="detail-actions"><a class="primary-link" href="#project-document" data-section>View project PDF <span aria-hidden="true">↓</span></a>' + (safeURL(project.videoFile) ? '<a class="text-link" href="#walkthrough" data-section>Watch gameplay <span aria-hidden="true">↓</span></a>' : '') + '</div>' :
        (safeURL(project.videoFile) ? '<div class="detail-actions"><a class="primary-link" href="#walkthrough" data-section>Watch gameplay <span aria-hidden="true">↓</span></a>' + (safeURL(project.download) ? resourceLink(project.download, project.downloadLabel || 'Download game') : '') + '</div>' : '')) + '</header>' +
    (playableCover || '<figure><img class="detail-image" src="' + escapeHTML(safeURL(project.cover)) + '" alt="' + escapeHTML(project.coverAlt) + '" width="' + (project.coverWidth || 640) + '" height="' + (project.coverHeight || 420) + '"><figcaption class="cover-caption">' + escapeHTML(project.coverCaption || 'Portfolio cover illustration') + '</figcaption></figure>') +
    (showDocument ? documentReader(project) : '') +
    (sections.length ? '<nav class="case-nav" aria-label="On this project page"><span>On this page</span><a href="#overview" data-section>Overview</a>' + sections.map(section => '<a href="#' + escapeHTML(section.id) + '" data-section>' + escapeHTML(section.nav) + '</a>').join('') + '</nav>' : '') +
    (project.role ? '<section class="detail-section" aria-labelledby="contribution-title"><h2 id="contribution-title">My contribution</h2><div class="detail-contribution"><p class="contribution-role">' + escapeHTML(project.role) + '</p>' +
      (project.context?.length ? '<p class="project-context">' + project.context.map(escapeHTML).join(' · ') + '</p>' : '') +
      (contributions.length ? '<ul class="contribution-list">' + contributions.map(item => '<li>' + escapeHTML(item) + '</li>').join('') + '</ul>' : '') + '</div></section>' : '') +
    '<section class="detail-section" id="overview" aria-labelledby="overview-title"><h2 id="overview-title">Project overview</h2><div class="detail-overview"><p>' + escapeHTML(project.overview || project.description) + '</p>' + projectMeta(project) +
      (!resources.length ? '<div class="materials-note">Project documentation is being prepared.</div>' : '') + '</div></section>' +
    (resources.length ? '<section class="detail-section" aria-labelledby="materials-title"><h2 id="materials-title">Project materials</h2><div><div class="resource-list">' + resources.map(resource => resourceLink(resource.url, resource.label)).join('') + '</div>' + (project.downloadNote ? '<p class="download-note">' + escapeHTML(project.downloadNote) + '</p>' : '') + '</div></section>' : '') +
    (safeURL(project.videoFile) ? '<section class="walkthrough-section" id="walkthrough" aria-labelledby="walkthrough-title"><div class="walkthrough-heading"><h2 id="walkthrough-title">Gameplay walkthrough</h2><span>Recorded gameplay</span></div><video class="gameplay-video" controls preload="metadata" playsinline poster="' + escapeHTML(safeURL(project.videoPoster || project.cover)) + '" aria-label="' + escapeHTML(project.name) + ' full gameplay walkthrough"><source src="' + escapeHTML(safeURL(project.videoFile)) + '" type="video/mp4">Your browser cannot play this video. ' + resourceLink(project.videoFile, 'Open gameplay video') + '</video><p class="video-caption">' + escapeHTML(project.videoCaption || '') + '</p></section>' : '') +
    sections.map(caseStudySection).join('') +
    (gallery.length ? '<section class="detail-section" aria-labelledby="gallery-title"><h2 id="gallery-title">' + escapeHTML(project.galleryTitle || 'A closer look') + '</h2><div class="gallery-grid' + (project.galleryType === 'screenshots' ? ' gallery-grid--screenshots' : '') + '">' + gallery.map(item => '<figure><a href="' + escapeHTML(safeURL(item.src)) + '" target="_blank" rel="noopener noreferrer" aria-label="Open image: ' + escapeHTML(item.alt || item.caption || project.name) + '"><img src="' + escapeHTML(safeURL(item.src)) + '" alt="' + escapeHTML(item.alt || item.caption || project.name) + '" loading="lazy"></a>' + (item.caption ? '<figcaption>' + escapeHTML(item.caption) + '</figcaption>' : '') + '</figure>').join('') + '</div></section>' : '') +
    '<a class="next-project" href="' + projectURL(next) + '" data-route><div><small>Next project</small><strong>' + escapeHTML(next.name) + '</strong></div><span aria-hidden="true">→</span></a></article>';
}

function moveToContent() {
  const hash = location.hash === '#portfolio' ? '#work' : location.hash;
  const target = (hash && document.getElementById(hash.slice(1))) || $('#page-content h1');
  if (!target) return;
  target.tabIndex = -1;
  target.focus({ preventScroll: true });
  if (hash && document.getElementById(hash.slice(1))) target.scrollIntoView({ behavior: 'instant', block: 'start' });
  else window.scrollTo({ top: 0, behavior: 'instant' });
}

let disposeDocument = () => {};
let disposeGame = () => {};
let disposeEyeDle = () => {};
let disposeCoverMotion = () => {};
function render({ navigate = false } = {}) {
  disposeDocument();
  disposeAbout();
  disposeGame();
  disposeEyeDle();
  disposeCoverMotion();
  const id = new URLSearchParams(location.search).get('project');
  const project = portfolio.projects.find(item => item.id === id);
  if (id && !project) {
    $('#page-content').innerHTML = '<section class="not-found"><h1>Project not found.</h1><p>Browse the portfolio to find the current projects.</p><a class="text-link" href="./#work" data-route>View all projects <span aria-hidden="true">↗</span></a></section>';
    document.title = 'Project not found — ' + portfolio.name;
  } else {
    $('#page-content').innerHTML = project ? detailPage(project) : homePage();
    document.title = project ? project.name + ' — ' + portfolio.name : portfolio.name + ' — Game Design Portfolio';
  }
  document.querySelectorAll('.site-header nav a[data-route]').forEach(link => {
    const current = (project && link.hash === '#work') || (!project && link.hash === location.hash);
    if (current) link.setAttribute('aria-current', project ? 'page' : 'location');
    else link.removeAttribute('aria-current');
  });
  if (navigate) moveToContent();
  disposeAbout = mountAbout(document.querySelector('[data-about]'));
  disposeDocument = mountPdfReader(document.querySelector('[data-pdf]'));
  disposeGame = mountGamePlayer(document.querySelector('[data-game-player]'));
  disposeEyeDle = mountEyeDle(document.querySelector('.eyedle-detail'));
  disposeCoverMotion = mountCoverMotion(document.querySelector('#page-content'));
}

document.querySelectorAll('[data-name]').forEach(element => { element.textContent = portfolio.name; });
$('#year').textContent = new Date().getFullYear();
$('.project-count').textContent = String(portfolio.projects.length).padStart(2, '0');
if (safeURL(portfolio.resume)) {
  const resumeLink = $('#header-resume');
  resumeLink.href = safeURL(portfolio.resume);
  resumeLink.target = '_blank';
  resumeLink.rel = 'noopener noreferrer';
  resumeLink.removeAttribute('data-route');
}
document.addEventListener('click', event => {
  const sectionLink = event.target.closest('a[data-section]');
  if (sectionLink && event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
    const target = document.getElementById(sectionLink.hash.slice(1));
    if (target) {
      event.preventDefault();
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
      history.replaceState({ ...history.state }, '', sectionLink.href);
      return;
    }
  }
  const link = event.target.closest('a[data-route]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  history.replaceState({ ...history.state, scrollY: window.scrollY }, '');
  history.pushState({ scrollY: 0 }, '', link.href);
  render({ navigate: true });
});
$('#back-to-top').addEventListener('click', event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  $('.wordmark').focus({ preventScroll: true });
});
history.scrollRestoration = 'manual';
window.addEventListener('popstate', event => {
  render();
  if (typeof event.state?.scrollY === 'number') {
    const heading = $('#page-content h1');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    window.scrollTo({ top: event.state.scrollY, behavior: 'instant' });
  } else moveToContent();
});
render();
if (location.hash) requestAnimationFrame(moveToContent);
