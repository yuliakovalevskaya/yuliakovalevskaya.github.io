// HTML-оболочка любой страницы: <head>, шапка, контент, подвал
import { esc, privacyPath } from './lib/html.js';
import { typograph } from './lib/typograph.js';
import { header, footer } from './components/chrome.js';

const FONTS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Montserrat:ital,wght@1,300&family=Lora:wght@700&display=swap';
// Switzer (бейджи) — шрифт Fontshare, в Google Fonts его нет
const SWITZER = 'https://api.fontshare.com/v2/css?f[]=switzer@500&display=swap';

// Vercel Web Analytics: просмотры, посетители, источники, страны, устройства. Без cookies.
// Скрипт есть только на хостинге Vercel, поэтому на GitHub Pages и локально он не подключается.
const ANALYTICS = `
  <script>
    if (!/(github\\.io|localhost|127\\.0\\.0\\.1)$/.test(location.hostname)) {
      window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
      var va = document.createElement('script'); va.defer = true; va.src = '/_vercel/insights/script.js'; document.head.appendChild(va);
    }
  </script>`;

// Microsoft Clarity: карты кликов, глубина прокрутки, записи сессий. Ставит cookies, поэтому грузится
// только после согласия в баннере (логика — в main.js). ID проекта: clarity.microsoft.com → Settings → Overview.
// Пока ID пустой, баннер не показывается и Clarity не подключается.
const CLARITY_ID = process.env.CLARITY_ID || 'z825mjs5ti';

const consentText = {
  ru: {
    title: 'Можно проанализировать, как вы читаете сайт?',
    text: 'Microsoft Clarity запишет клики и прокрутку. Имя и почту он не видит.',
    more: 'Подробнее',
    accept: 'Разрешить',
    decline: 'Отказаться',
    settings: 'Настройки cookies',
  },
  en: {
    title: 'May I analyze how you read the site?',
    text: 'Microsoft Clarity will record clicks and scrolling. It never sees your name or email.',
    more: 'Learn more',
    accept: 'Allow',
    decline: 'Decline',
    settings: 'Cookie settings',
  },
};

const consentBanner = (t) => {
  if (!CLARITY_ID) return '';
  const c = consentText[t.lang];
  return `
  <div class="consent" role="dialog" aria-live="polite" aria-labelledby="consent-title" data-clarity="${CLARITY_ID}" data-lang="${t.lang}" hidden>
    <p class="consent__title" id="consent-title">${c.title}</p>
    <p class="consent__text">${c.text} <a href="${privacyPath(t.lang)}">${c.more}</a></p>
    <div class="consent__actions">
      <button class="btn btn--primary btn--sm" type="button" data-consent="granted">${c.accept}</button>
      <button class="btn btn--secondary btn--sm" type="button" data-consent="denied">${c.decline}</button>
    </div>
  </div>`;
};

// page: { t, path, altPath, isHome, title, description, image, body }
// noindex — служебные страницы (404) не попадают в поиск; script — дополнительный код в конце <body>
export function layout({ t, path, altPath, isHome = false, title, description, image = '/img/hero-1040.webp', body, siteUrl = '', noindex = false, script = '' }) {
  const ruPath = t.lang === 'ru' ? path : altPath;
  const enPath = t.lang === 'en' ? path : altPath;
  return `<!doctype html>
<html lang="${t.lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />${noindex ? '\n  <meta name="robots" content="noindex" />' : ''}
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${siteUrl}${image}" />
  <meta property="og:type" content="website" />
  <link rel="alternate" hreflang="ru" href="${siteUrl}${ruPath}" />
  <link rel="alternate" hreflang="en" href="${siteUrl}${enPath}" />
  <link rel="canonical" href="${siteUrl}${path}" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="${FONTS}" />
  <link rel="stylesheet" href="${SWITZER}" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body class="${isHome ? 'page-home' : 'page-inner'}">
  <div class="glow glow--hero" aria-hidden="true"></div>
  ${typograph(header({ t, isHome, altPath }), t.lang)}
  <main>
${typograph(body, t.lang)}
  </main>
  ${typograph(footer({ t, consentLabel: CLARITY_ID ? consentText[t.lang].settings : '' }), t.lang)}
  <button class="to-top" type="button" aria-label="${t.lang === 'ru' ? 'Наверх' : 'Back to top'}" title="${t.lang === 'ru' ? 'Наверх' : 'Back to top'}" hidden>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 16 12.73 7.77a1 1 0 0 0-1.46 0L3.5 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  ${typograph(consentBanner(t), t.lang)}
  <script src="/main.js" defer></script>${ANALYTICS}${script}
</body>
</html>`;
}
