const languageLink = document.querySelector('[data-language-link]');
const alternatePage = new URL(languageLink.href);

function updateLanguageLink() {
  alternatePage.hash = location.hash;
  languageLink.href = alternatePage.href;
}

updateLanguageLink();
window.addEventListener('hashchange', updateLanguageLink);
