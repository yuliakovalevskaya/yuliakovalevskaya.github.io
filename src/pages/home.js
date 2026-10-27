// Главная страница: секции
import { links } from '../content.js';
import { esc, tag, dotBadge, sep, casePath, caseImg } from '../lib/html.js';

const hero = (t) => `
<section class="hero section">
  <div class="container hero__grid">
    <div class="hero__content">
      <p class="hero__role">${t.hero.role}</p>
      <h1 class="h1">${t.hero.title.map(esc).join('<br class="br-desk" /> ')}</h1>
      <p class="lead">${t.hero.text}</p>
      <div class="badges">${t.hero.badges.map(dotBadge).join('')}</div>
      <p class="note">${t.hero.note}</p>
      <div class="buttons">
        <a class="btn btn--primary btn--lg" href="#portfolio">${t.hero.buttons.portfolio}</a>
        <a class="btn btn--secondary btn--lg" href="${links.cv}" target="_blank" rel="noopener">${t.hero.buttons.cv}</a>
        <a class="btn btn--secondary btn--lg" href="#contacts">${t.hero.buttons.write}</a>
      </div>
      <hr class="divider" />
      <p class="status">
        <span>${t.hero.status.location}</span>${sep}
        <span class="status__open">${t.hero.status.open}</span>${sep}
        <span>${t.hero.status.exp}</span>${sep}
        <span>${t.hero.status.projects}</span>${sep}
        <span>${t.hero.status.stacks}</span>
      </p>
    </div>
    <div class="hero__photo">
      <img src="/img/hero-520.webp" srcset="/img/hero-520.webp 1x, /img/hero-1040.webp 2x" width="520" height="472" alt="${esc(t.hero.photoAlt)}" fetchpriority="high" />
    </div>
  </div>
</section>`;

const values = (t) => `
<section class="values section">
  <div class="container">
    <h2 class="h2 values__title">${t.values.title}</h2>
    <div class="values__grid">
      ${t.values.items.map((v) => `
      <div class="value">
        <p class="value__n">${v.n}</p>
        <h3 class="value__title">${v.title}</h3>
        <p class="value__text">${v.text}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;

const figmaCursor = () => `
  <div class="figma-cursor" aria-hidden="true">
    <span class="figma-cursor__frame"><img src="/icons/figma.svg" width="30" height="30" alt="" /><i></i><i></i><i></i><i></i></span>
    <img class="figma-cursor__arrow" src="/icons/cursor.svg" width="40" height="44" alt="" />
  </div>`;

const portfolio = (t) => `
<section class="portfolio section" id="portfolio">
  <div class="container">
    <div class="portfolio__head">
      <div class="portfolio__intro">
        <h2 class="h2">${t.portfolio.title}</h2>
        <p class="lead">${t.portfolio.text}</p>
      </div>
      <div class="portfolio__deco">${figmaCursor()}</div>
    </div>
    <div class="cases">
      ${t.portfolio.cases.map((c, i) => `
      <article class="case ${i % 2 ? 'case--reverse' : ''}">
        <a class="case__media" href="${casePath(t.lang, c.slug)}" tabindex="-1" aria-hidden="true">${caseImg(c.image, c.title)}</a>
        <div class="case__body">
          <div class="case__info">
            <p class="case__meta">${c.meta}</p>
            <h3 class="case__title">${esc(c.title)}</h3>
            <p class="case__text">${c.text}</p>
            <div class="tags">${c.tags.map(tag).join('')}</div>
            <p class="case__metric"><strong>${c.metric}</strong><span>${c.metricLabel}</span></p>
          </div>
          <a class="btn btn--primary btn--md" href="${casePath(t.lang, c.slug)}">${t.portfolio.button}</a>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>`;

const toolCard = (key, name, t, tall = false) => `
  <div class="tool ${tall ? 'tool--tall' : ''}">
    <img src="/icons/${key}.${key === 'claude' ? 'webp' : 'svg'}" width="110" height="110" alt="" />
    <div class="tool__meta"><p class="tool__name">${name}</p><p class="tool__desc">${t.tools.items[key]}</p></div>
  </div>`;

const arrows = (prev, next, target) => `
  <div class="arrows" data-target="${target}">
    <button class="arrow" type="button" data-dir="-1" aria-label="${prev}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M16 3.5 7.77 11.27a1 1 0 0 0 0 1.46L16 20.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    <button class="arrow" type="button" data-dir="1" aria-label="${next}"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 20.5 8.23-7.77a1 1 0 0 0 0-1.46L8 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
  </div>`;

const tools = (t) => `
<section class="tools section">
  <div class="container">
    <div class="tools__head">
      <h2 class="h2">${t.tools.title}</h2>
      <p class="lead">${t.tools.text}</p>
      ${arrows(t.tools.prev, t.tools.next, 'tools-track')}
    </div>
    <div class="tools__track" id="tools-track">
      <div class="tools__col">${toolCard('chatgpt', 'ChatGPT', t)}${toolCard('claude', 'Claude', t)}</div>
      ${toolCard('figma', 'Figma', t, true)}
      <div class="tools__col">${toolCard('notion', 'Notion', t)}${toolCard('webflow', 'Webflow', t)}</div>
      ${toolCard('miro', 'Miro', t, true)}
      <div class="tools__col">${toolCard('photoshop', 'Adobe Photoshop', t)}${toolCard('illustrator', 'Adobe Illustrator', t)}</div>
    </div>
  </div>
</section>`;

const about = (t) => {
  const a = t.about;
  return `
<section class="about section" id="about">
  <div class="container about__grid">
    <div class="about__left">
      <h2 class="h2">${a.title}</h2>
      <div class="about__text">${a.paragraphs.map((p) => `<p>${p}</p>`).join('')}</div>
      <div class="buttons">
        <a class="btn btn--primary btn--lg" href="${links.cv}" target="_blank" rel="noopener">${a.buttons.cv}</a>
        <a class="btn btn--secondary btn--lg" href="#contacts">${a.buttons.write}</a>
      </div>
      <div class="about__ava" aria-hidden="true">
        <img class="about__ava-cursor" src="/icons/cursor.svg" width="40" height="44" alt="" />
        <img class="about__ava-photo" src="/img/about-avatar.webp" width="64" height="64" alt="" />
      </div>
    </div>
    <div class="about__right">
      <div class="group"><h3 class="label">${a.skillsTitle}</h3><div class="tags tags--10">${a.skills.map(tag).join('')}</div></div>
      <div class="group"><h3 class="label">${a.workflowTitle}</h3><div class="tags tags--10">${a.workflow.map(tag).join('')}</div></div>
      <div class="group"><h3 class="label">${a.aiTitle}</h3><p class="small">${a.aiText}</p></div>
      <div class="group"><h3 class="label">${a.toolsTitle}</h3><div class="badges badges--wrap">${a.tools.map(dotBadge).join('')}</div></div>
      <div class="group"><h3 class="label">${a.langsTitle}</h3><div class="tags tags--10">${a.langs.map(tag).join('')}</div></div>
    </div>
  </div>
</section>`;
};

const stages = (t) => `
<section class="stages section">
  <div class="container">
    <div class="stages__head">
      <h2 class="h2">${t.stages.title}</h2>
      <p class="lead">${t.stages.text}</p>
      <p class="note">${t.stages.note}</p>
    </div>
    <ol class="stages__grid">
      ${t.stages.items.map((s, i) => `
      <li class="stage">
        <span class="stage__n">${i + 1}</span>
        <h3 class="stage__title">${s.title}</h3>
        <p class="stage__text">${s.text}</p>
        <p class="stage__points">${s.points.map((p) => `<span>${esc(p)}</span>`).join(sep)}</p>
      </li>`).join('')}
    </ol>
    <div class="team">
      <h3 class="team__title">${t.stages.teamTitle}</h3>
      <p class="team__text">${t.stages.teamText}</p>
    </div>
  </div>
</section>`;

const testimonials = (t) => `
<section class="testimonials section" id="testimonials">
  <div class="container">
    <div class="testimonials__head">
      <h2 class="h2">${t.testimonials.title}</h2>
      ${arrows(t.testimonials.prev, t.testimonials.next, 'reviews-track')}
    </div>
  </div>
  <div class="reviews" id="reviews-track">
    ${t.testimonials.items.map((r) => `
    <figure class="review">
      <div class="review__top">
        <div class="review__head"><span class="tag">${esc(r.tag)}</span><span class="review__quote" aria-hidden="true">“</span></div>
        <blockquote class="review__text">${esc(r.text)}</blockquote>
      </div>
      <figcaption class="review__author">
        <img src="${r.avatar}" width="48" height="48" alt="" />
        <span><strong>${esc(r.name)}</strong><span>${esc(r.role)}</span></span>
      </figcaption>
    </figure>`).join('')}
  </div>
</section>`;

const contactChip = (icon, label, value, href) => `
  ${href ? `<a class="chip" href="${href}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>` : '<span class="chip">'}
    <img src="/icons/${icon}.svg" width="20" height="20" alt="" /><span>${label}</span><span class="chip__value">${value}</span>
  ${href ? '</a>' : '</span>'}`;

const contacts = (t) => `
<section class="contacts section" id="contacts">
  <div class="container">
    <h2 class="h2">${t.contacts.title}</h2>
    <div class="contact-card">
      <div class="contact-card__left">
        <h3 class="h3">${t.contacts.heading}</h3>
        <p class="lead lead--dark">${t.contacts.text.join('<br />')}</p>
        <div class="buttons">
          <a class="btn btn--primary btn--lg" href="mailto:${links.email}">${t.contacts.write}</a>
          <a class="btn btn--secondary btn--lg" href="${links.cv}" download="Yulia_Kovalevskaya_CV.pdf">${t.contacts.cv}</a>
        </div>
      </div>
      <div class="contact-card__right">
        ${contactChip('mail', 'Mail', links.email, `mailto:${links.email}`)}
        ${contactChip('linkedin', 'LinkedIn', 'in/yulia-kovalevskayauxuidesigner/', links.linkedin)}
        ${contactChip('telegram', 'Telegram', '@yuliakovalevs', links.telegram)}
        ${contactChip('whatsapp', 'WhatsApp', '@yuliakovalevs', links.whatsapp)}
      </div>
    </div>
  </div>
</section>`;


export const homeBody = (t) => [hero, values, portfolio, tools, about, stages, testimonials, contacts].map((s) => s(t)).join('\n');
