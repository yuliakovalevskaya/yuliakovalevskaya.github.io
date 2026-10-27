// HTML-оболочка любой страницы: <head>, шапка, контент, подвал
import { esc } from './lib/html.js';
import { typograph } from './lib/typograph.js';
import { header, footer } from './components/chrome.js';

const FONTS = 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Montserrat:ital,wght@1,300&family=Lora:wght@700&display=swap';
// Switzer (бейджи) — шрифт Fontshare, в Google Fonts его нет
const SWITZER = 'https://api.fontshare.com/v2/css?f[]=switzer@500&display=swap';

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
  ${typograph(footer({ t }), t.lang)}
  <button class="to-top" type="button" aria-label="${t.lang === 'ru' ? 'Наверх' : 'Back to top'}" title="${t.lang === 'ru' ? 'Наверх' : 'Back to top'}" hidden>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20.5 16 12.73 7.77a1 1 0 0 0-1.46 0L3.5 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  </button>
  <script src="/main.js" defer></script>${script}
</body>
</html>`;
}
