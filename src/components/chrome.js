// Шапка и подвал — общие для всех страниц
import { links } from '../content.js';
import { esc, homePath, casePath, privacyPath, PL_PUBLIC } from '../lib/html.js';

// Ссылка «написать письмо»: на телефоне mailto сразу открывает новое письмо в почтовом приложении,
// на компьютере main.js открывает окно нового письма Gmail (см. [data-mail]).
export const mailto = () => `mailto:${links.email}`;

// variant: 'blue' (шапка) | 'white' (подвал)
export const logo = (href, variant = 'blue') => `
  <a class="logo logo--${variant}" href="${href}" aria-label="Yulia Kovalevskaya">
    <img class="logo__mark" src="/icons/logo-mark${variant === 'white' ? '-white' : ''}.svg" width="34" height="34" alt="" />
    <span class="logo__text"><span>Yulia</span><span>Kovalevskaya</span></span>
  </a>`;

// ctx: { t, isHome, alt } — alt: адреса этой же страницы на всех языках
const LANG_LABEL = { en: 'EN', pl: 'PL', ru: 'RU' };
const langSwitch = (t, alt) => {
  const opt = (l) => l === t.lang
    ? `<a class="lang__opt is-active" href="#top" hreflang="${l}" aria-current="true">${LANG_LABEL[l]}</a>`
    : `<a class="lang__opt" href="${alt[l]}" hreflang="${l}">${LANG_LABEL[l]}</a>`;
  const shown = PL_PUBLIC || t.lang === 'pl' ? ['en', 'pl', 'ru'] : ['en', 'ru'];
  return `<div class="lang" role="group" aria-label="Language">${shown.map(opt).join('')}</div>`;
};

export const header = ({ t, isHome, alt }) => {
  const a = (id) => (isHome ? `#${id}` : `${homePath(t.lang)}#${id}`);
  const nav = `
      <a href="${a('portfolio')}">${t.nav.portfolio}</a>
      <a href="${a('about')}">${t.nav.about}</a>
      <a href="${a('testimonials')}">${t.nav.testimonials}</a>
      <a href="${a('contacts')}">${t.nav.contacts}</a>`;
  return `
<header class="header" id="top">
  <div class="header__bar">
    ${logo(isHome ? '#top' : homePath(t.lang))}
    <nav class="header__nav" aria-label="Main">${nav}</nav>
    <div class="header__actions">
      ${langSwitch(t, alt)}
      <a class="btn btn--secondary btn--sm" href="${links.cv}" target="_blank" rel="noopener">${t.nav.cv}</a>
      <a class="btn btn--primary btn--sm" href="${a('contacts')}">${t.nav.contact}</a>
    </div>
    <div class="header__mobile">
      <a class="btn btn--primary btn--sm" href="${a('contacts')}">${t.nav.contact}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu"
        data-open-label="${t.nav.openMenu}" data-close-label="${t.nav.closeMenu}" aria-label="${t.nav.openMenu}">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <nav aria-label="Mobile">${nav}</nav>
    <div class="mobile-menu__actions">
      ${langSwitch(t, alt)}
      <a class="btn btn--secondary" href="${links.cv}" target="_blank" rel="noopener">${t.nav.cv}</a>
    </div>
  </div>
</header>`;
};

// consentLabel — кнопка «Настройки cookies» под строкой согласия: есть, только когда подключён Clarity
export const footer = ({ t, consentLabel = '' }) => `
<footer class="footer">
  <div class="container">
    <div class="footer__row">
      ${logo(homePath(t.lang), 'white')}
      <div class="footer__col">
        <p class="footer__title">${t.footer.contactsTitle}</p>
        <dl class="footer__links">
          <div><dt>Mail</dt><dd><a href="${mailto()}" data-mail>${links.email}</a></dd></div>
          <div><dt>LinkedIn</dt><dd><a href="${links.linkedin}" target="_blank" rel="noopener">in/yulia-kovalevskayauxuidesigner</a></dd></div>
          <div><dt>Telegram</dt><dd><a href="${links.telegram}" target="_blank" rel="noopener">@yuliakovalevs</a></dd></div>
          <div><dt>WhatsApp</dt><dd><a href="https://wa.me/" target="_blank" rel="noopener" data-wa="${links.whatsappDigits}">@yuliakovalevs</a></dd></div>
          <div><dt>Behance</dt><dd><a href="${links.behance}" target="_blank" rel="noopener">Yulia Kovalevskaya</a></dd></div>
        </dl>
      </div>
      <nav class="footer__col" aria-label="${t.footer.casesTitle}">
        <p class="footer__title">${t.footer.casesTitle}</p>
        <ul class="footer__cases">
          ${t.portfolio.cases.map((c) => `<li><a href="${casePath(t.lang, c.slug)}">${esc(c.title.split(' — ')[0])}</a></li>`).join('')}
        </ul>
      </nav>
      <form class="footer__form" action="https://formsubmit.co/${links.email}" method="POST" data-endpoint="https://formsubmit.co/ajax/${links.email}"
        data-subject="${esc(t.footer.mailSubject)}" data-sent="${esc(t.footer.sent)}" data-error="${esc(t.footer.error)}">
        <label for="lead-email">${t.footer.leave}</label>
        <input id="lead-email" type="email" name="email" required placeholder="${t.footer.placeholder}" autocomplete="email" />
        <input class="visually-hidden" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <button class="btn btn--white" type="submit">${t.footer.send}</button>
        <p class="footer__consent">${t.footer.consent} <a href="${privacyPath(t.lang)}">${t.footer.privacy}</a>.${consentLabel ? `<br><button class="footer__cookies" type="button" data-consent-open>${consentLabel}</button>` : ''}</p>
        <p class="footer__hint" role="status" aria-live="polite"></p>
      </form>
    </div>
    <div class="footer__bottom"><span>${t.footer.copyright}</span><span class="footer__tagline">${t.footer.tagline}<svg width="10" height="18" viewBox="0 0 10 18" fill="none" aria-hidden="true"><path d="M5.31 13.85c-.17.06-.46.06-.62 0C3.24 13.36 0 11.3 0 7.8 0 6.25.96 5 2.5 5 4.04 5 4.49 6.08 5 6.76 5.5 6.09 5.93 5 7.66 5 9.2 5 10 6.25 10 7.8c0 3.5-3.24 5.56-4.69 6.05Z" fill="currentColor"/></svg></span></div>
  </div>
</footer>`;
