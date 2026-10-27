// Страница 404 (макет в Figma: «404 — Desktop / Mobile» в разделе Main - Desktop and Mobile).
// GitHub Pages отдаёт /404.html на любой несуществующий адрес; для адресов /en/… она подменяется на /en/404/.
import { homePath } from '../lib/html.js';
import { figmaCursor } from './home.js';

const text = {
  ru: {
    title: 'Страница не найдена',
    lead: 'Возможно, ссылка устарела или в адресе опечатка. Зато кейсы на месте — загляните.',
    home: 'На главную',
    cases: 'Смотреть кейсы',
  },
  en: {
    title: 'Page not found',
    lead: 'The link may be outdated or there’s a typo in the address. The case studies are still here — take a look.',
    home: 'Back to home',
    cases: 'View cases',
  },
};

export const notFoundTitle = (lang) => text[lang].title;

export const notFoundBody = (t) => {
  const p = text[t.lang];
  return `
<section class="nf section">
  <div class="container">
    <div class="nf__card">
      <img class="nf__blob" src="/img/cases/case-bg.webp" width="640" height="640" alt="" aria-hidden="true" />
      <div class="nf__text">
        <p class="nf__code" aria-hidden="true">404</p>
        <h1 class="h2">${p.title}</h1>
        <p class="lead">${p.lead}</p>
        <div class="buttons">
          <a class="btn btn--primary btn--lg" href="${homePath(t.lang)}">${p.home}</a>
          <a class="btn btn--secondary btn--lg" href="${homePath(t.lang)}#portfolio">${p.cases}</a>
        </div>
      </div>
      <div class="nf__deco">${figmaCursor()}</div>
    </div>
  </div>
</section>`;
};

// Для /en/… подгружаем английскую версию страницы, не меняя адрес
export const notFoundScript = `<script>
  if (/^\\/en(\\/|$)/.test(location.pathname)) {
    fetch('/en/404/').then((r) => r.text()).then((h) => {
      const d = new DOMParser().parseFromString(h, 'text/html');
      document.documentElement.lang = 'en';
      document.title = d.title;
      document.body.replaceWith(document.adoptNode(d.body));
      window.__initSite && window.__initSite();
    }).catch(() => {});
  }
</script>`;
