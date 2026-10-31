import { keepDribblingDocument as document } from './keepdribbling-document-data.js?v=ff8d12696b03';

const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const paragraphs = values => (Array.isArray(values) ? values : [values]).filter(Boolean).map(value => `<p>${escape(value)}</p>`).join('');

function figure(image, caption = '', className = '') {
  let content = `<img src="${escape(image.src)}" alt="${escape(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async">`;
  if (image.crop) {
    const { left, top, right, bottom, flipX } = image.crop;
    const visibleWidth = 100 - left - right;
    const visibleHeight = 100 - top - bottom;
    const style = `width:${10000 / visibleWidth}%;height:${10000 / visibleHeight}%;left:${-100 * left / visibleWidth}%;top:${-100 * top / visibleHeight}%`;
    content = `<span class="kd-figure-frame" style="aspect-ratio:${image.width * visibleWidth}/${image.height * visibleHeight};${flipX ? 'transform:scaleX(-1)' : ''}"><img src="${escape(image.src)}" alt="${escape(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async" style="${style}"></span>`;
  }
  return `<figure class="kd-figure ${className}"><a href="${escape(image.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open image: ${escape(image.alt)}">${content}</a>${caption ? `<figcaption>${escape(caption)}</figcaption>` : ''}</figure>`;
}

const gallery = (images, className = '') => `<div class="kd-gallery ${className}" data-count="${images.length}">${images.map(image => figure(image)).join('')}</div>`;
const chapterHeading = (number, title) => `<header class="kd-chapter-heading"><span class="kd-chapter-number" aria-hidden="true">${number}</span><h3>${escape(title)}</h3></header>`;
const subsection = (title, text) => `<div class="kd-prose kd-subsection"><h4>${escape(title)}</h4>${paragraphs(text)}</div>`;

function inspiration(title, item) {
  return `<section class="kd-inspiration"><div><h5>${escape(title)}</h5>${paragraphs(item.text)}</div>${figure(item.image, '', 'kd-inspiration-image')}</section>`;
}

function obstacle(item) {
  return `<article class="kd-encounter" id="kd-obstacle-${escape(item.id)}">
    ${figure(item.image)}
    <div class="kd-encounter-copy"><h5>${escape(item.name)}</h5><p class="kd-encounter-subtitle">${escape(item.subtitle)}</p>
      <div class="kd-action">${paragraphs(item.action)}</div><div class="kd-metaphor"><p class="kd-small-label">Metaphor</p>${paragraphs(item.metaphor)}</div>
    </div>
  </article>`;
}

/** Readable HTML imported from the original portfolio PDF; the source stays available. */
export function keepDribblingDocumentMarkup(project) {
  const { intro, protagonist, mechanics, progression, phases, endings, development } = document;
  return `<section class="document-section kd-document" id="project-document" aria-labelledby="document-title">
    <header class="document-heading"><div><p class="case-kicker">Project portfolio</p><h2 id="document-title">The design behind the game.</h2></div>
      <div class="document-links"><a class="text-link" href="${escape(project.documentation)}" target="_blank" rel="noopener noreferrer">Open PDF <span aria-hidden="true">↗</span></a><a class="text-link" href="${escape(project.documentation)}" download="KeepDribbling-Portfolio.pdf">Download PDF <span aria-hidden="true">↓</span></a></div>
    </header>
    <nav class="kd-toc" aria-label="KeepDribbling portfolio chapters">
      <a href="#kd-introduction" data-section>01 Introduction</a><a href="#kd-protagonist" data-section>02 Protagonist design</a><a href="#kd-mechanics" data-section>03 Core mechanics & levels</a><a href="#kd-endings" data-section>04 Ending design</a><a href="#kd-development" data-section>05 Development challenges</a>
    </nav>

    <section class="kd-chapter" id="kd-introduction" aria-label="Introduction">
      ${chapterHeading('01', 'Introduction')}
      ${subsection('The Core Concept', intro.coreConcept)}
      ${gallery(intro.screenshots, 'kd-story-gallery')}
      ${subsection('Personal Motivation', intro.personalMotivation)}
      <div class="kd-prose kd-subsection"><h4>Inspiration</h4></div>
      <div class="kd-inspirations">${inspiration('Temple Run', intro.inspiration.templeRun)}${inspiration('Shaolin Soccer', intro.inspiration.shaolinSoccer)}</div>
      ${figure(intro.inspiration.shaolinSoccer.gameplayImage, '', 'kd-gameplay-example')}
    </section>

    <section class="kd-chapter" id="kd-protagonist" aria-label="Protagonist Design">
      ${chapterHeading('02', 'Protagonist Design')}
      ${gallery(protagonist.images, 'kd-model-gallery')}
      <div class="kd-prose">${paragraphs(protagonist.intro)}</div>
      ${subsection('Technical Implementation', protagonist.implementation)}
      ${subsection('Design Metaphor', protagonist.designMetaphor)}
      ${subsection('The Faceless Player', protagonist.facelessPlayer)}
    </section>

    <section class="kd-chapter" id="kd-mechanics" aria-label="Core Mechanics and Level Design">
      ${chapterHeading('03', 'Core Mechanics & Level Design')}
      <div class="kd-prose">${paragraphs(mechanics.intro)}</div>
      <ol class="kd-process" aria-label="Core gameplay loop"><li>Cognition</li><li>Reaction</li><li>Overcoming</li></ol>
      <div class="kd-sequence">${mechanics.screenshots.map((image, index) => `<figure class="kd-figure"><span class="kd-sequence-number" aria-hidden="true">${index + 1}</span><a href="${escape(image.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open image: ${escape(image.alt)}"><img src="${escape(image.src)}" alt="${escape(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async"></a></figure>`).join('')}</div>
      <div class="kd-prose">${paragraphs(mechanics.tutorial)}</div>
      ${subsection('Level Progression & Design Intention', progression.intention)}
      ${subsection('The Metaphor of the Loop (Level 1 & Level 2)', progression.loop)}
      ${figure(progression.diagram, 'Level progression', 'kd-progression-diagram')}
      <div class="kd-prose kd-penalty"><h4>Core Penalty Rule: Turnover & Retrieval</h4>${paragraphs(progression.penalty)}</div>
      <div class="kd-prose kd-subsection"><h4>Obstacle Metaphors</h4></div>
      ${phases.map(phase => `<section class="kd-phase"><h4>${escape(phase.title)}</h4>${phase.obstacles.map(obstacle).join('')}</section>`).join('')}
    </section>

    <section class="kd-chapter" id="kd-endings" aria-label="Ending Design">
      ${chapterHeading('04', 'Ending Design')}
      ${subsection(endings.introTitle, endings.intro)}
      <div class="kd-endings">${endings.items.map(item => `<article class="kd-ending"><h4>${escape(item.title)}</h4><p class="kd-condition"><strong>Condition:</strong> ${escape(item.condition)}</p><div class="kd-metaphor"><p class="kd-small-label">Design Metaphor</p>${paragraphs(item.metaphor)}</div></article>`).join('')}</div>
    </section>

    <section class="kd-chapter" id="kd-development" aria-label="Development Challenges">
      ${chapterHeading('05', 'Development Challenges')}
      <div class="kd-prose">${paragraphs(development.intro)}</div>
      ${subsection('Overcoming Code Architecture Flaws', development.architecture.text)}
      ${figure(development.architecture.image, 'Code architecture', 'kd-architecture-diagram')}
      ${subsection('Navigating the 3D Art Pipeline', development.artPipeline.text)}
      ${gallery(development.artPipeline.images, 'kd-animation-gallery')}
    </section>
  </section>`;
}
