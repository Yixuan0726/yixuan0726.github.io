import { eyedleCaseStudy as story } from './eyedle-case-study-data.js?v=b1b9e4ee866d';

export function eyeDleCaseStudyPage(project, next, { escape: e, picture, media }) {
  const [purpose, loop, decisions, interaction, reflection] = story.sections;
  const p = paragraphs => paragraphs.map(text => `<p>${e(text)}</p>`).join('');
  const full = (anchor = '') => `?project=eyedle&amp;view=full${anchor ? '#' + anchor : ''}`;
  const image = (id, caption) => `<figure>${picture(id)}${caption ? `<figcaption>${e(caption)}</figcaption>` : ''}</figure>`;
  const chapter = (section, number, body) => `<section class="eyedle-chapter" data-chapter aria-labelledby="eyedle-case-${section.id}">
    <header class="eyedle-chapter-heading"><h2 id="eyedle-case-${section.id}"><span class="eyedle-heading-number">${number} </span><span class="eyedle-heading-text">${e(section.title)}</span></h2></header>
    <div class="eyedle-chapter-body">${body}</div></section>`;
  const labels = ['Purpose', 'Core loop', 'Design decisions', 'Input', 'Playtesting'];
  const loopVisuals = [
    ['care-detail.webp?v=b1b9e4ee866d','uploads/eyedle/fresh/care-focus.jpg','Near–far care: the water-drop target'],
    ['production-detail.webp?v=b1b9e4ee866d','uploads/eyedle/fresh/automated-production.jpg','Workshop production: Care Energy and bottle storage'],
    ['upgrade-detail.webp?v=b1b9e4ee866d','assets/eyedle/document/image37.webp','Filter upgrade: 8 coins, with 4 coins left'],
    ['return-detail.webp?v=b1b9e4ee866d','assets/eyedle/document/image32.webp','Saved progress and the next routine in eight hours']
  ];
  const loopImage = index => {
    const [file,original,alt] = loopVisuals[index];
    return `<a class="eyedle-picture eyedle-loop-picture" href="${e(original)}" target="_blank" rel="noopener noreferrer" aria-label="Open full screenshot: ${e(alt)}"><span class="eyedle-loop-image-frame"><img src="uploads/eyedle/case-study/${file}" alt="${e(alt)}" width="680" height="480" loading="lazy" decoding="async"></span><span class="eyedle-zoom-hint" aria-hidden="true">↗</span></a>`;
  };
  const overview = `<div class="eyedle-extra-media" id="eyedle-media-care-to-workshop" data-format="landscape"><figure aria-labelledby="eyedle-media-title-care-to-workshop">
    <header class="eyedle-clip-heading"><h4 id="eyedle-media-title-care-to-workshop">Care powers the workshop</h4><span>Animated mechanism overview</span></header>
    <video id="eyedle-clip-care-to-workshop" controls playsinline muted loop data-eyedle-loop preload="none" width="1280" height="720" poster="uploads/eyedle/case-study/care-to-workshop.jpg?v=b1b9e4ee866d" aria-label="An animated diagram connects care, energy, bottles, and upgrades" aria-describedby="eyedle-media-caption-care-to-workshop"><source src="uploads/eyedle/case-study/care-to-workshop.mp4?v=b1b9e4ee866d" type="video/mp4"></video>
    <figcaption id="eyedle-media-caption-care-to-workshop">Mechanic illustration using EyeDle artwork. Timing is condensed to explain how care supplies the workshop. Watch the full walkthrough for the prototype in action.</figcaption>
    <div class="eyedle-clip-actions"><button type="button" data-loop-toggle aria-controls="eyedle-clip-care-to-workshop" hidden>Play animation</button><a href="uploads/eyedle/case-study/care-to-workshop.mp4?v=b1b9e4ee866d" target="_blank" rel="noopener noreferrer">View larger ↗</a><a href="uploads/eyedle/case-study/care-to-workshop.gif?v=b1b9e4ee866d" download>Download GIF ↓</a><a href="${full('eyedle-media-gameplay-walkthrough')}" data-route>Full walkthrough · 3:01 ↗</a></div>
  </figure></div>`;
  const decisionVisuals = [
    `<div class="eyedle-compare-grid">${image('eyedle-image-24','Early eye-controlled prototype')}${image('eyedle-image-10','Care and idle workshop')}</div>`,
    media('filter-upgrade'),
    `<figure><div class="eyedle-character-states">${['eyedle-image-36','eyedle-image-37','eyedle-image-38'].map(picture).join('')}</div><figcaption>Before care → eyes closed with the player → completion feedback.</figcaption></figure>`
  ];
  const input = `<div class="eyedle-case-split"><div><dl class="eyedle-input-points">${interaction.inputs.map(item => `<div><dt>${e(item.title)}</dt><dd>${e(item.text)}</dd></div>`).join('')}</dl><p class="eyedle-case-disclosure">${e(interaction.disclosure)}</p><a class="eyedle-case-doc-link" href="${full('eyedle-section-2-3')}" data-route>Read the research basis and technical tradeoffs ↗</a></div><div class="eyedle-case-visual">${media('tracking-recovery')}</div></div>`;

  return `<article class="detail eyedle-detail eyedle-layout eyedle-case-study">
    <div class="detail-nav"><a href="./#work" data-route>← All projects</a><span class="detail-index">${e(project.number)} / 04</span></div>
    <header class="eyedle-hero">
      <div class="eyedle-hero-copy"><p class="eyedle-hero-category">${e(project.category)}</p><h1 id="eyedle-document-title"><span class="eyedle-hero-name">${e(story.hero.title)}</span></h1>
        <p class="eyedle-hero-tagline">${e(story.hero.subtitle)}</p><p class="eyedle-case-intro">${e(story.hero.summary)}</p>
        <div class="eyedle-case-actions"><a class="eyedle-read-link" href="#eyedle-case-loop" data-section>See the core loop <span aria-hidden="true">↓</span></a><a class="eyedle-case-doc-link" href="${full()}" data-route>Full design document ↗</a></div>
      </div><div class="eyedle-hero-media">${overview}</div>
    </header>
    <nav class="eyedle-toc" aria-label="EyeDle case study chapters"><div class="eyedle-toc-links">${story.sections.map((section,index) => `<a href="#eyedle-case-${section.id}" data-section data-chapter-link><span class="eyedle-toc-number">${index+1}</span> <span class="eyedle-toc-label">${labels[index]}</span></a>`).join('')}</div><div class="eyedle-reading-track" aria-hidden="true"><span data-reading-progress></span></div></nav>
    <div class="eyedle-document" aria-labelledby="eyedle-document-title">
      ${chapter(purpose,'1',`<div class="eyedle-case-split"><div class="eyedle-case-copy">${p(purpose.paragraphs)}</div><div class="eyedle-case-visual eyedle-case-companion">${image('eyedle-image-04','The same water drop accompanies care and works in the workshop.')}</div></div>`)}
      ${chapter(loop,'2',`<div class="eyedle-case-copy">${p([loop.lead])}</div><ol class="eyedle-loop">${loop.steps.map((step,index) => `<li>${index===0 ? '<span class="eyedle-loop-start">START HERE</span>' : ''}<span class="eyedle-step-number" aria-hidden="true">${step.number}</span>${loopImage(index)}<h3>${e(step.title)}</h3><p>${e(step.text)}</p></li>`).join('')}</ol><p class="eyedle-loop-caption">Selected prototype screenshots. Care input is simulated; the production view uses a staged upgraded save. Select a detail to see its full screenshot.</p><div class="eyedle-loop-notes">${loop.paragraphs.map((text,index) => `<article><h3>${['Optional: send workers on Search','A finish line, without a streak','What upgrades change'][index]}</h3><p>${e(text)}</p></article>`).join('')}</div><a class="eyedle-case-doc-link" href="${full('eyedle-section-2-4')}" data-route>Full economy, upgrade costs and completion requirements ↗</a>`)}
      ${chapter(decisions,'3',decisions.decisions.map((decision,index) => `<article class="eyedle-decision"><div class="eyedle-decision-copy"><h3>${e(decision.title)}</h3>${p(decision.paragraphs)}</div><div class="eyedle-decision-visual">${decisionVisuals[index]}</div></article>`).join(''))}
      ${chapter(interaction,'4',input)}
      ${chapter(reflection,'5',`<div class="eyedle-case-copy">${p([reflection.paragraphs[0]])}</div><div class="eyedle-test-grid">${reflection.findings.map(finding => `<article><span class="eyedle-test-number">${e(finding.number)}</span><h3>${e(finding.title)}</h3><p>${e(finding.text)}</p></article>`).join('')}</div><div class="eyedle-case-copy">${p([reflection.takeaway,reflection.paragraphs[3]])}<a class="eyedle-case-doc-link" href="${full('eyedle-section-3-4')}" data-route>Questionnaire context, results and source links ↗</a></div>`)}
    </div>
    <aside class="eyedle-case-resources" aria-labelledby="eyedle-more"><div><h2 id="eyedle-more">${e(story.detailLink.title)}</h2><p>${e(story.detailLink.description)}</p></div><a class="eyedle-read-link" href="${full()}" data-route>Open full document <span aria-hidden="true">↗</span></a></aside>
    <dialog class="eyedle-lightbox" aria-label="EyeDle image viewer"><div class="eyedle-lightbox-toolbar"><p data-lightbox-counter aria-live="polite"></p><button type="button" data-lightbox-close aria-label="Close image viewer">Close <span aria-hidden="true">×</span></button></div><div class="eyedle-lightbox-stage"><button type="button" data-lightbox-prev aria-label="Previous image">←</button><figure><img data-lightbox-image alt=""><figcaption data-lightbox-caption></figcaption></figure><button type="button" data-lightbox-next aria-label="Next image">→</button></div><div class="eyedle-lightbox-footer"><span>← → to browse · Esc to close</span><a data-lightbox-original target="_blank" rel="noopener noreferrer">Open original ↗</a></div></dialog>
    <a class="next-project" href="?project=${encodeURIComponent(next.id)}" data-route><div><small>Next project</small><strong>${e(next.name)}</strong></div><span aria-hidden="true">→</span></a>
  </article>`;
}
