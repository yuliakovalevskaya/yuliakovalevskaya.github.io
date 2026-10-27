// Шаблон страницы кейса.
// Если у кейса есть c.detail (см. src/cases/*.js) — рендерим полный разбор по макету Figma v3,
// иначе — обложка и заглушка «скоро».
import { readFileSync } from 'node:fs';
import { esc, tag, dotBadge, sep, casePath, caseImg, homePath, asset } from '../lib/html.js';
import { caseBgs } from '../cases/case-bgs.js';

// Фоновые пятна блока (см. src/cases/case-bgs.js): по горизонтали — от центра страницы, как в макете
const bgs = (slug, anchor) => {
  const set = caseBgs[slug];
  if (!set) return '';
  const src = asset('/img/cases/case-bg.webp');
  const item = (b, kind) => {
    const half = kind === 'd' ? 720 : 195;
    const box = `left:calc(50% + ${b.x - half}px);top:${b.dy}px;width:${b.w}px;height:${b.h}px;opacity:${b.o}${b.r ? `;transform:rotate(${b.r}deg)` : ''}`;
    return `<span class="tm-bg tm-bg--${kind}" style="${box}"><img src="${src}" alt="" width="${b.w}" height="${b.h}" loading="lazy" decoding="async" style="transform:matrix(${b.m.join(',')})" /></span>`;
  };
  const html = ['d', 'm'].flatMap((k) => set[k].filter((b) => b.a === anchor).map((b) => item(b, k))).join('');
  return html ? `<div class="tm-bgs" aria-hidden="true">${html}</div>` : '';
};

// Размеры картинок (1x): d* — 1280, m*/mhero* — 358. Файл размеров — свой у каждого кейса (detail.assets.dims).
const dimsCache = {};
const loadDims = (file) => (dimsCache[file] ??= JSON.parse(readFileSync(new URL(`../cases/${file}`, import.meta.url), 'utf8')));
let DIMS = {};

// Текущий кейс (каталог картинок и язык) — выставляется в detail()
let IMG = '';
let LANG = 'ru';

const dim = (name) => DIMS[name] || [1280, 720];

// Адаптивная картинка: десктопная версия + мобильная (до `until` px).
// pair: на планшете (до 1100 px) тоже мобильная — две диаграммы встают рядом.
const picture = (p, { eager = false, pair = false, dSizes = '(max-width: 1100px) calc(100vw - 80px), 1280px' } = {}) => {
  const d = `${p.d}-${LANG}`;
  const m = `${p.m}-${LANG}`;
  const [dw, dh] = dim(d);
  const [mw, mh] = dim(m);
  const until = pair ? 1100 : 767;
  const mSizes = pair ? '(max-width: 767px) calc(100vw - 40px), calc(50vw - 60px)' : 'calc(100vw - 40px)';
  const load = eager ? 'fetchpriority="high"' : 'loading="lazy"';
  return `<picture>
      <source media="(max-width: ${until}px)" srcset="${asset(`${IMG}/${m}-358.webp`)} 358w, ${asset(`${IMG}/${m}-716.webp`)} 716w" sizes="${mSizes}" width="${mw}" height="${mh}" />
      <img src="${asset(`${IMG}/${d}-1280.webp`)}" srcset="${asset(`${IMG}/${d}-1280.webp`)} 1280w, ${asset(`${IMG}/${d}-2560.webp`)} 2560w" sizes="${dSizes}"
        width="${dw}" height="${dh}" alt="${esc(p.alt)}" ${load} decoding="async" />
    </picture>`;
};

const figure = (p, opts) => `<figure class="tm-figure">${picture(p, opts)}</figure>`;

const icons = {
  play: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M6.5 4.6v10.8c0 .6.7 1 1.2.7l8.4-5.4c.5-.3.5-1 0-1.3L7.7 3.9c-.5-.3-1.2.1-1.2.7z" fill="currentColor"/></svg>',
  pause: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><rect x="5" y="4" width="3.6" height="12" rx="1.2" fill="currentColor"/><rect x="11.4" y="4" width="3.6" height="12" rx="1.2" fill="currentColor"/></svg>',
  muted: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 7.6h2.8L9.7 4.5c.5-.4 1.3 0 1.3.6v9.8c0 .7-.8 1-1.3.6L5.8 12.4H3c-.4 0-.8-.4-.8-.8V8.4c0-.4.4-.8.8-.8z" fill="currentColor"/><path d="M13.6 7.6l4 4.8M17.6 7.6l-4 4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  sound: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 7.6h2.8L9.7 4.5c.5-.4 1.3 0 1.3.6v9.8c0 .7-.8 1-1.3.6L5.8 12.4H3c-.4 0-.8-.4-.8-.8V8.4c0-.4.4-.8.8-.8z" fill="currentColor"/><path d="M13.7 7.2a4 4 0 010 5.6M15.9 5a7.1 7.1 0 010 10" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  info: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7.25" stroke="#576073" stroke-width="1.5"/><path d="M9 8.2v4.3" stroke="#576073" stroke-width="1.5" stroke-linecap="round"/><circle cx="9" cy="5.6" r=".95" fill="#576073"/></svg>',
  check: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="11" fill="#1775d2"/><path d="M6.6 11.3l2.9 2.9 5.9-6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  zoom: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5L9 7M2.5 13.5L7 9" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};


// Видео-превью кейса: автозапуск без звука, пауза и звук — кнопками
const video = (v, L) => `
    <div class="tm-video" data-video>
      <video class="tm-video__media" muted autoplay loop playsinline preload="metadata" poster="${v.poster}" width="${v.w}" height="${v.h}"
        data-hd="${v.hd}" aria-label="${esc(v.label)}">
        <source src="${v.web}" type="video/mp4" />
      </video>
      <div class="tm-video__controls">
        <button type="button" class="tm-video__btn" data-act="play" aria-label="${esc(L.pause)}" data-on="${esc(L.pause)}" data-off="${esc(L.play)}">
          <span class="tm-video__ico tm-video__ico--pause">${icons.pause}</span><span class="tm-video__ico tm-video__ico--play">${icons.play}</span>
        </button>
        <button type="button" class="tm-video__btn" data-act="sound" aria-label="${esc(L.unmute)}" aria-pressed="false" data-on="${esc(L.mute)}" data-off="${esc(L.unmute)}">
          <span class="tm-video__ico tm-video__ico--muted">${icons.muted}</span><span class="tm-video__ico tm-video__ico--sound">${icons.sound}</span>
        </button>
      </div>
    </div>`;

// Слайдер: обложка (hero) и финальный UI
const slider = (slides, { labels, label, kind, L, lazy = false }) => `
    <div class="tm-slider tm-slider--${kind}" data-autoplay="3000" role="region" aria-roledescription="carousel" aria-label="${esc(label)}">
      <div class="tm-slider__track">
        ${slides.map((s, i) => `<div class="tm-slider__slide" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${slides.length}"${i ? ' aria-hidden="true"' : ''}>
          ${picture(s, { eager: !lazy && kind === 'hero' && i === 0 })}
        </div>`).join('')}
      </div>
      <div class="tm-slider__dots" role="tablist" aria-label="${esc(label)}">
        ${slides.map((s, i) => `<button type="button" role="tab" class="tm-slider__dot${i === 0 ? ' is-active' : ''}" data-i="${i}" aria-selected="${i === 0}" aria-label="${esc(labels ? labels[i] : `${L.slide} ${i + 1}`)}"></button>`).join('')}
      </div>
    </div>`;

const cards = (items, cols = 3) => `
      <ol class="tm-cards${cols === 2 ? ' tm-cards--2' : ''}">${items.map((it, i) => `
        <li class="stage">
          <span class="stage__n">${i + 1}</span>
          <h3 class="stage__title">${esc(it.title)}</h3>
          <p class="stage__text">${esc(it.text)}</p>
          ${it.points ? `<p class="stage__points">${it.points.map((x) => `<span>${esc(x)}</span>`).join(sep)}</p>` : ''}
        </li>`).join('')}
      </ol>`;

const block = (b, L) => {
  switch (b.type) {
    case 'role': return `
      <div class="tm-panel">
        <dl class="tm-info">${b.info.map(([k, v]) => `
          <div class="tm-info__item"><dt class="tm-label">${esc(k)}</dt><dd class="tm-info__value">${esc(v)}</dd></div>`).join('')}
        </dl>
        <hr class="tm-rule" />
        <div class="tm-groups">
          <div class="tm-group"><h3 class="label">${esc(b.did.label)}</h3><div class="tags tags--10">${b.did.tags.map(tag).join('')}</div></div>
          <div class="tm-group"><h3 class="label">${esc(b.tools.label)}</h3><div class="badges">${b.tools.badges.map(dotBadge).join('')}</div></div>
        </div>
      </div>`;
    case 'facts': return `
      <div class="tm-facts${b.cols === 3 ? ' tm-facts--3' : ''}">${b.items.map((f) => `
        <div class="tm-fact"><p class="tm-fact__value">${esc(f.value)}</p><p class="tm-fact__label">${esc(f.label)}</p></div>`).join('')}
      </div>`;
    case 'task': return `
      <div class="tm-task"><h3 class="tm-task__label">${esc(b.label)}</h3><p class="tm-task__text">${esc(b.text)}</p></div>`;
    case 'img': return figure(b);
    case 'p': return `<p class="tm-p${b.mt ? ' tm-mt' : ''}"${b.mt ? ` style="--mt:${b.mt}px"` : ''}>${esc(b.text)}</p>`;
    case 'h3': return `<h3 class="tm-h3${b.space ? ' tm-h3--lg' : ''}${b.loose ? ' tm-h3--loose' : ''}${b.hgap ? ' tm-h3--gap' : ''}"${b.hgap ? ` style="--hgap:${b.hgap}px"` : ''}>${esc(b.text)}</h3>`;
    case 'path': return `
      <div class="tm-path">
        <p class="tm-path__label">${esc(b.label)}</p>
        <p class="tm-path__text">${esc(b.text)}</p>
        <ol class="tm-path__steps">${b.steps.map((x, i) => `<li><span class="tm-badge">${i + 1}</span>${esc(x)}</li>`).join('')}</ol>
      </div>`;
    case 'cards': return cards(b.items, b.cols);
    case 'market': {
      const pct = (v) => `${Math.max(v * 10, 1.5)}%`;
      const ticks = [0, 2, 4, 6, 8, 10];
      return `
      <div class="tm-market">
        <div class="tm-market__head">
          <h3 class="tm-market__title">${esc(b.title)}</h3>
          <p class="tm-lead">${esc(b.text)}</p>
        </div>
        <div class="tm-bench">
          <div class="tm-bench__legend">
            <p class="tm-bench__how"><b>${esc(b.legend.how)}</b><span class="tm-bench__sample" aria-hidden="true"></span><span>${esc(b.legend.bar)}</span></p>
            <p class="tm-bench__colors">${b.legend.colors.map((c, i) => `<span><i class="tm-bench__dot tm-bench__dot--${['none', 'service', 'ours'][i]}"></i>${esc(c)}</span>`).join('')}</p>
          </div>
          <div class="tm-bench__table" role="table" aria-label="${esc(b.title)}">
            <div class="tm-bench__row tm-bench__row--head" role="row">${b.cols.map((c) => `<span role="columnheader">${esc(c)}</span>`).join('')}</div>
            <hr class="tm-bench__divider" />
            ${b.rows.map((r) => `
            <div class="tm-bench__row tm-bench__row--${r.kind}" role="row">
              <span class="tm-bench__name" role="rowheader">${esc(r.name)}</span>
              <span class="tm-bench__bar" role="cell" aria-label="${esc(r.time)}"><span class="tm-bench__range" style="width:${pct(r.max)}"></span><span class="tm-bench__min" style="width:${pct(r.min)}"></span></span>
              <span class="tm-bench__time" role="cell">${esc(r.time)}</span>
              <span class="tm-bench__who" role="cell"><span class="tm-pill tm-pill--${r.tone}">${esc(r.who)}</span></span>
            </div>`).join('')}
            <div class="tm-bench__axis" aria-hidden="true"><span class="tm-bench__ticks">${ticks.map((v) => `<span style="left:${v * 10}%">${v}</span>`).join('')}<em>${esc(b.unit)}</em></span></div>
          </div>
        </div>
        <div class="tm-task"><h4 class="tm-task__label">${esc(b.why.label)}</h4>
          <div class="tm-market__why">${b.why.text.split('\n').map((x) => `<p class="tm-task__text">${esc(x)}</p>`).join('')}<p class="tm-market__source">${esc(b.source)}</p></div>
        </div>
        <div class="tm-market__take"><p class="tm-market__take-label">${esc(b.take.label)}</p><div class="tags">${b.take.tags.map(tag).join('')}</div></div>
      </div>`;
    }
    case 'audience': return `
      <div class="tm-audience">
        <div class="tm-box"><h3 class="label">${esc(b.who.label)}</h3><div class="tags tags--10">${b.who.tags.map(tag).join('')}</div></div>
        <div class="tm-box tm-box--blue"><h3 class="label">${esc(b.need.label)}</h3><p>${esc(b.need.text)}</p></div>
      </div>`;
    case 'cjm': return `
      <div class="tm-pair">${b.items.map((it) => `
        <figure class="tm-figure">
          <button type="button" class="tm-zoom" data-full="${IMG}/${it.full}-${LANG}" data-w="${dim(`${it.full}-${LANG}`)[0]}" data-h="${dim(`${it.full}-${LANG}`)[1]}"
            data-title="${esc(it.fullAlt)}" aria-label="${esc(`${L.openCjm}: ${it.fullAlt}`)}" aria-haspopup="dialog">
            ${picture(it, { pair: true })}
            <span class="tm-zoom__hint">${icons.zoom}${esc(L.openCjm)}</span>
          </button>
        </figure>`).join('')}
      </div>`;
    case 'pair': return `<div class="tm-pair">${b.items.map((p) => figure(p, { pair: true })).join('')}</div>`;
    case 'principle': return `
      <div class="tm-principle${b.variant ? ` tm-principle--${b.variant}` : ''}">
        <div class="tm-principle__text">
          <p class="tm-principle__label">${esc(b.label)}</p>
          <h3 class="tm-principle__title">${esc(b.title)}</h3>
          <p class="tm-principle__lead">${esc(b.text)}</p>
        </div>
        <ul class="tm-principle__rules">${b.rules.map(([bold, rest]) => `<li><span><b>${esc(bold)}</b> → ${esc(rest)}</span></li>`).join('')}</ul>
      </div>`;
    case 'scenarios': return `
      <div class="tm-scenarios">${b.items.map((s) => `
        <article class="tm-scenario">
          <div class="tm-person">
            <img src="${IMG}/avatar-${s.avatar}.webp" width="48" height="48" alt="" loading="lazy" decoding="async" />
            <p class="tm-person__name"><strong>${esc(s.name)}</strong><span>${esc(s.role)}</span></p>
            <span class="tm-pill">${esc(s.tag)}</span>
          </div>
          <p class="tm-scenario__text">${esc(s.text)}</p>
          <ol class="tm-steps">${s.steps.map((x, i) => `<li class="tm-step"><span class="tm-badge">${i + 1}</span>${esc(x)}</li>`).join('')}</ol>
        </article>`).join('')}
      </div>`;
    case 'decision': return `
      <article class="tm-decision">
        <div class="tm-decision__head"><span class="tm-badge tm-badge--lg">${b.num}</span><h3 class="tm-decision__title">${esc(b.title)}</h3></div>
        <div class="tags">${b.tags.map(tag).join('')}</div>
        <div class="tm-decision__row">
          <div class="tm-decision__cell"><p class="tm-label">${esc(L.problem)}</p><p>${esc(b.problem)}</p></div>
          <div class="tm-decision__cell"><p class="tm-label">${esc(L.solution)}</p><p>${esc(b.solution)}</p></div>
        </div>
        <hr class="tm-rule" />
        <div class="tm-decision__row">
          <div class="tm-decision__cell"><p class="tm-label">${esc(L.why)}</p><p>${esc(b.why)}</p></div>
          <div class="tm-decision__cell tm-decision__cell--result"><p class="tm-label${L.resultPlain ? ' tm-label--plain' : ''}">${esc(L.result)}</p><p>${esc(b.result)}</p></div>
        </div>
      </article>`;
    case 'slider': return slider(b.slides, { label: b.label, kind: 'ui', L });
    case 'results': return `
      <div class="tm-results">
        <div class="tm-before">
          <p class="tm-label">${esc(b.before.label)}</p>
          ${b.before.rows.map(([k, from, to]) => `
          <div class="tm-cmp"><p class="tm-cmp__label">${esc(k)}</p>
            <p class="tm-cmp__vals"><span class="tm-cmp__from">${esc(from)}</span><span class="tm-cmp__arrow" aria-hidden="true">→</span><strong class="tm-cmp__to">${esc(to)}</strong></p></div>`).join('')}
          <p class="tm-note">${icons.info}<span>${esc(b.before.note)}</span></p>
        </div>
        <div class="tm-ready">
          <p class="tm-label">${esc(b.ready.label)}</p>
          <ul>${b.ready.items.map((x) => `<li>${icons.check}<span>${esc(x)}</span></li>`).join('')}</ul>
        </div>
      </div>`;
    case 'nextsteps': return `
      <div class="tm-table" role="table">
        <div class="tm-table__head" role="row"><p class="tm-label" role="columnheader">${esc(b.head[0])}</p><p class="tm-label" role="columnheader">${esc(b.head[1])}</p></div>
        ${b.rows.map((r, i) => `
        <div class="tm-table__row" role="row">
          <div class="tm-table__what" role="cell"><span class="tm-badge tm-badge--lg">${i + 1}</span><div><strong>${esc(r.title)}</strong><p>${esc(r.text)}</p></div></div>
          <p class="tm-crit" role="cell">${esc(r.crit)}</p>
        </div>`).join('')}
      </div>`;
    default: return '';
  }
};

const otherCases = (t, c) => {
  const others = t.portfolio.cases.filter((x) => x.slug !== c.slug);
  return `
    <h2 class="h3 case-page__other-title">${t.casePage.other}</h2>
    <div class="case-page__other">
      ${others.map((o) => `
      <a class="mini-case" href="${casePath(t.lang, o.slug)}">
        ${caseImg(o.image, o.title)}
        <span class="mini-case__title">${esc(o.title)}</span>
      </a>`).join('')}
    </div>`;
};

// Короткая страница для кейсов без разбора
const stub = (t, c) => `
<section class="section case-page">
  <div class="container">
    <a class="case-page__back" href="${homePath(t.lang)}#portfolio">← ${t.casePage.back}</a>
    <div class="case-page__head">
      <p class="case__meta">${c.meta}</p>
      <h1 class="h1">${esc(c.title)}</h1>
      <p class="lead">${c.text}</p>
      <div class="tags">${c.tags.map(tag).join('')}</div>
      <p class="case__metric"><strong>${c.metric}</strong><span>${c.metricLabel}</span></p>
    </div>
    <div class="case-page__cover">${caseImg(c.image, c.title, { eager: true })}</div>
    <p class="case-page__soon note">${t.casePage.soon}</p>
    ${otherCases(t, c)}
  </div>
</section>`;

// Полный разбор
const detail = (t, c) => {
  const d = c.detail;
  const L = d.labels;
  const assets = d.assets || { dir: 'v3', dims: 'tm-dims.json' };
  IMG = `/img/cases/${c.slug}/${assets.dir}`;
  DIMS = loadDims(assets.dims);
  const cta = d.cta || { title: t.casePage.ctaTitle, text: t.casePage.ctaText, button: t.casePage.cta };
  LANG = t.lang;
  const h = d.hero;
  return `
<div class="tm">
  <section class="tm-hero">
    ${bgs(c.slug, 'hero')}
    <div class="container">
      <a class="tm-back" href="${homePath(t.lang)}#portfolio">← ${t.casePage.back}</a>
      <div class="tm-hero__body">
        <div class="tm-intro">
          <div class="tm-intro__text">
            <p class="tm-meta">${esc(h.meta)}</p>
            <h1 class="tm-h1">${esc(h.title)}</h1>
            <p class="lead">${esc(h.lead)}</p>
            <div class="badges badges--wrap">${h.badges.map(dotBadge).join('')}</div>
            <hr class="divider" />
            <p class="status">${h.status.map((x, i) => `<span${i === 0 ? ' class="status__open"' : ''}>${esc(x)}</span>`).join(sep)}</p>
          </div>
          <div class="tm-stats">${h.stats.map((s) => `
            <div class="tm-fact"><p class="tm-fact__value">${esc(s.value)}</p><p class="tm-fact__label">${esc(s.label)}</p></div>`).join('')}
          </div>
        </div>
        ${h.video ? video(h.video, L) : slider(h.slides, { labels: h.slidesLabel, label: h.title, kind: 'hero', L })}
      </div>
    </div>
  </section>

  <div class="container tm-body">
    <nav class="tm-nav" aria-label="${esc(d.nav.label)}">
      <div class="tm-nav__list">${d.nav.items.map(([id, label]) => `<a href="#${id}">${esc(label)}</a>`).join('')}</div>
    </nav>
    ${d.sections.map((s, i) => `
    <section class="tm-section${s.glow ? ' tm-section--glow' : ''}" id="${s.id}" aria-labelledby="${s.id}-title"${s.gap ? ` data-gap="${s.gap}"` : ''}>
      ${bgs(c.slug, String(i + 1).padStart(2, '0'))}
      <header class="tm-head">
        <p class="tm-eyebrow"><b>${String(i + 1).padStart(2, '0')}</b>${sep}<span>${esc(s.eyebrow)}</span></p>
        <h2 class="tm-h2" id="${s.id}-title">${esc(s.title)}</h2>
        ${s.lead ? `<p class="tm-lead">${esc(s.lead)}</p>` : ''}
      </header>
      ${s.blocks.map((b) => block(b, L)).join('\n')}
    </section>${h.video && h.sliderAfter === s.id ? `
    <div class="tm-gallery">${bgs(c.slug, 'gallery')}${slider(h.slides, { labels: h.slidesLabel, label: h.title, kind: 'hero', L, lazy: true })}</div>` : ''}`).join('')}

    <div class="tm-cta">
      <div class="tm-cta__text">
        <h2 class="tm-cta__title">${esc(cta.title)}</h2>
        <p class="lead">${esc(cta.text)}</p>
      </div>
      <a class="btn btn--primary btn--lg" href="${homePath(t.lang)}#contacts">${esc(cta.button)}</a>
    </div>
    <div class="tm-other">${otherCases(t, c)}</div>
  </div>

  <dialog class="tm-lightbox" aria-label="${esc(L.openCjm)}">
    <div class="tm-lightbox__bar">
      <p class="tm-lightbox__title"></p>
      <button type="button" class="tm-lightbox__close" aria-label="${esc(L.close)}">×</button>
    </div>
    <div class="tm-lightbox__body"><img alt="" decoding="async" /></div>
  </dialog>
</div>`;
};

export const caseBody = (t, c) => (c.detail ? detail(t, c) : stub(t, c));
