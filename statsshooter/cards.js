const allCards = window.statsShooterCards;
const controls = document.querySelector('.catalog-controls');
const categories = [...controls.querySelectorAll('[data-category]')];
const routeFilter = document.querySelector('#route-filter');
const search = document.querySelector('#card-search');
const count = document.querySelector('.catalog-count');
const reset = document.querySelector('.catalog-reset');
const grid = document.querySelector('.catalog-grid');
const empty = document.querySelector('.catalog-empty');
const locale = document.documentElement.lang === 'zh-CN' ? {
  maxLevel: '最高等级', slots: '占用卡槽', availability: '获取',
  shown: (visible, total) => `显示 ${visible} / ${total} 张卡牌`,
  noMatches: '没有找到符合条件的卡牌。', loadError: '未能加载卡牌数据。',
} : {
  maxLevel: 'Max level', slots: 'Slots used', availability: 'Availability',
  shown: (visible, total) => `Showing ${visible} of ${total} cards`,
  noMatches: 'No cards match your filters.', loadError: 'The card catalog could not load.',
};

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function addProperty(list, label, value) {
  const property = element('div');
  property.append(element('dt', label), element('dd', value));
  list.append(property);
}

function makeCard(card) {
  const article = element('article', null, 'catalog-card');
  article.dataset.category = card.category;

  const tags = element('div', null, 'catalog-card-tags');
  tags.append(element('span', card.category, 'catalog-card-category'), element('span', card.route));

  const metadata = element('dl', null, 'catalog-card-meta');
  addProperty(metadata, locale.maxLevel, String(card.maxLevel));
  addProperty(metadata, locale.slots, String(card.slots));
  addProperty(metadata, locale.availability, card.availability);

  article.append(tags, element('h2', card.name), element('p', card.description, 'catalog-card-description'), metadata);
  return article;
}

function render() {
  const category = categories.find(button => button.getAttribute('aria-pressed') === 'true').dataset.category;
  const route = routeFilter.value;
  const query = search.value.normalize('NFKC').toLowerCase().trim();
  const words = query ? query.split(/\s+/) : [];
  const visible = allCards.filter(card => {
    if (category && card.category !== category) return false;
    if (route && card.route !== route) return false;
    const text = `${card.name} ${card.description} ${card.route} ${card.availability}`.normalize('NFKC').toLowerCase();
    return words.every(word => text.includes(word));
  });
  grid.replaceChildren(...visible.map(makeCard));
  count.textContent = locale.shown(visible.length, allCards.length);
  empty.textContent = locale.noMatches;
  empty.hidden = visible.length !== 0;
  reset.hidden = !category && !route && !query;
}

if (Array.isArray(allCards) && allCards.length > 0) {
  controls.hidden = false;
  for (const button of categories) {
    button.addEventListener('click', () => {
      for (const candidate of categories) {
        candidate.setAttribute('aria-pressed', String(candidate === button));
      }
      render();
    });
  }
  routeFilter.addEventListener('change', render);
  search.addEventListener('input', render);
  reset.addEventListener('click', () => {
    routeFilter.value = '';
    search.value = '';
    categories[0].click();
    categories[0].focus();
  });
  render();
} else {
  empty.textContent = locale.loadError;
  empty.hidden = false;
}
