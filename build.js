// Сборка сайта без зависимостей: node build.js → папка dist/
// Страницы (на каждом языке: /en/, /ru/, /pl/): главная, /cases/<slug>/ (кейсы), /privacy/ (политика конфиденциальности).
// /404.html — английская «не найдено», /ru/404/ и /pl/404/ подгружаются из неё. Старые русские адреса без префикса ведут на /ru/.
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ru, en } from './src/content.js';
import { pl } from './src/content.pl.js';
import { layout } from './src/layout.js';
import { homeBody } from './src/pages/home.js';
import { caseBody } from './src/pages/case.js';
import { privacyBody, privacyTitle } from './src/pages/privacy.js';
import { notFoundBody, notFoundTitle, notFoundScript } from './src/pages/notfound.js';
import { homePath, casePath, privacyPath, LANGS } from './src/lib/html.js';

const SITE_URL = process.env.SITE_URL || ''; // например https://yuliakovalevskaya.com
const langs = { ru, en, pl };
// Адреса одной страницы на всех языках
const altOf = (pathFor) => Object.fromEntries(LANGS.map((l) => [l, pathFor(l)]));
const author = (t) => t.meta.title.split(' — ')[0];

const pages = [];
for (const t of Object.values(langs)) {
  pages.push({
    t, path: homePath(t.lang), alt: altOf(homePath), isHome: true,
    title: t.meta.title, description: t.meta.description, body: homeBody(t),
  });
  for (const c of t.portfolio.cases) {
    pages.push({
      t, path: casePath(t.lang, c.slug), alt: altOf((l) => casePath(l, c.slug)),
      title: `${c.title} — ${author(t)}`, description: c.text,
      image: `/img/cases/${c.image}-1280.webp`, body: caseBody(t, c),
    });
  }
  pages.push({
    t, path: privacyPath(t.lang), alt: altOf(privacyPath),
    title: `${privacyTitle(t.lang)} — ${author(t)}`, description: privacyTitle(t.lang), body: privacyBody(t),
  });
  pages.push({
    t, path: t.lang === 'en' ? '/404.html' : `/${t.lang}/404/`, alt: altOf(homePath), noindex: true,
    title: `${notFoundTitle(t.lang)} — ${author(t)}`, description: notFoundTitle(t.lang), body: notFoundBody(t),
    script: t.lang === 'en' ? notFoundScript : '',
  });
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('public', 'dist', { recursive: true });
for (const p of pages) {
  const file = p.path.endsWith('.html') ? `dist${p.path}` : `dist${p.path}index.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, layout({ ...p, siteUrl: SITE_URL }));
}

// Заглушки для хостинга без редиректов (GitHub Pages); на Vercel те же адреса отдаёт vercel.json. Метки ?utm_… сохраняются.
const stub = (from, to) => {
  const dir = `dist${from}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}index.html`, `<!doctype html><html><head><meta charset="utf-8" /><meta name="robots" content="noindex" /><link rel="canonical" href="${SITE_URL}${to}" /><meta http-equiv="refresh" content="0;url=${to}" /><script>location.replace('${to}' + location.search + location.hash)</script></head></html>`);
};
stub('/', homePath('en'));
stub('/privacy/', privacyPath('ru'));
for (const c of ru.portfolio.cases) stub(`/cases/${c.slug}/`, casePath('ru', c.slug));

console.log(`✓ Built ${pages.length} pages into dist/`);
