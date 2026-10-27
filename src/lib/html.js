import { statSync } from 'node:fs';
// Общие хелперы разметки и маршрутов
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const tag = (t) => `<span class="tag">${esc(t)}</span>`;
export const dotBadge = (t) => `<span class="badge"><i class="badge__dot" aria-hidden="true"></i>${esc(t)}</span>`;
export const sep = '<i class="sep" aria-hidden="true"></i>';

// Маршруты: RU без префикса, EN под /en/
export const langPrefix = (lang) => (lang === 'ru' ? '' : `/${lang}`);
export const homePath = (lang) => `${langPrefix(lang)}/`;
export const casePath = (lang, slug) => `${langPrefix(lang)}/cases/${slug}/`;

// Картинка кейса = экспорт компонента Project из UI kit (Figma 2:21652).
// Desktop-вариант 640×520 → <name>-640/-1280.webp, Mobile-вариант 350×284 → <name>-m-350/-m-700.webp (до 767 px).
// Соответствие: case-1 = Finance App with AI, case-2 = TimeManager, case-3 = FitFem, case-4 = Order Routing.
export const caseImg = (name, alt, { eager = false } = {}) => `
  <picture>
    <source media="(max-width: 767px)" srcset="${asset(`/img/cases/${name}-m-350.webp`)} 1x, ${asset(`/img/cases/${name}-m-700.webp`)} 2x" width="350" height="284" />
    <img src="${asset(`/img/cases/${name}-640.webp`)}" srcset="${asset(`/img/cases/${name}-640.webp`)} 1x, ${asset(`/img/cases/${name}-1280.webp`)} 2x"
      width="640" height="520" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" />
  </picture>`;

// Версия файла в URL (?v=…): после обновления картинки браузер не покажет старую из кэша
export const asset = (url) => {
  try {
    const st = statSync(new URL(`../../public${url}`, import.meta.url));
    return `${url}?v=${(Math.round(st.mtimeMs) ^ st.size).toString(36)}`;
  } catch { return url; }
};
