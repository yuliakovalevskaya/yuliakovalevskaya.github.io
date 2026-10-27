// Сборка сайта без зависимостей: node build.js → папка dist/
// Страницы: / и /en/ (главная), /cases/<slug>/ и /en/cases/<slug>/ (кейсы)
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { ru, en } from './src/content.js';
import { layout } from './src/layout.js';
import { homeBody } from './src/pages/home.js';
import { caseBody } from './src/pages/case.js';
import { homePath, casePath } from './src/lib/html.js';

const SITE_URL = process.env.SITE_URL || ''; // например https://yuliakovalevskaya.com
const langs = { ru, en };
const other = (lang) => (lang === 'ru' ? 'en' : 'ru');

const pages = [];
for (const t of Object.values(langs)) {
  pages.push({
    t, path: homePath(t.lang), altPath: homePath(other(t.lang)), isHome: true,
    title: t.meta.title, description: t.meta.description, body: homeBody(t),
  });
  for (const c of t.portfolio.cases) {
    pages.push({
      t, path: casePath(t.lang, c.slug), altPath: casePath(other(t.lang), c.slug),
      title: `${c.title} — ${t.meta.title.split(' — ')[0]}`, description: c.text,
      image: `/img/cases/${c.image}-1280.webp`, body: caseBody(t, c),
    });
  }
}

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('public', 'dist', { recursive: true });
for (const p of pages) {
  const file = `dist${p.path}index.html`;
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, layout({ ...p, siteUrl: SITE_URL }));
}
console.log(`✓ Built ${pages.length} pages into dist/`);
