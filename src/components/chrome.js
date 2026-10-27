// Шапка и подвал — общие для всех страниц
import { links } from '../content.js';
import { esc, homePath } from '../lib/html.js';

// Ссылка «написать письмо»: на телефоне mailto сразу открывает новое письмо в почтовом приложении,
// на компьютере main.js открывает окно нового письма Gmail (см. [data-mail]).
export const mailto = () => `mailto:${links.email}`;

// variant: 'blue' (шапка) | 'white' (подвал)
export const logo = (href, variant = 'blue') => `
  <a class="logo logo--${variant}" href="${href}" aria-label="Yulia Kovalevskaya">
    <img class="logo__mark" src="/icons/logo-mark${variant === 'white' ? '-white' : ''}.svg" width="34" height="34" alt="" />
    <span class="logo__text"><span>Yulia</span><span>Kovalevskaya</span></span>
  </a>`;

// ctx: { t, isHome, altPath } — altPath: та же страница на другом языке
const langSwitch = (t, altPath) => {
  const opt = (l) => l === t.lang
    ? `<a class="lang__opt is-active" href="#top" hreflang="${l}" aria-current="true">${l === 'ru' ? 'Ru' : 'En'}</a>`
    : `<a class="lang__opt" href="${altPath}" hreflang="${l}">${l === 'ru' ? 'Ru' : 'En'}</a>`;
  return `<div class="lang" role="group" aria-label="Language">${opt("ru")}${opt("en")}</div>`;
};

export const header = ({ t, isHome, altPath }) => {
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
      ${langSwitch(t, altPath)}
      <a class="btn btn--secondary btn--sm" href="${links.cv}" target="_blank" rel="noopener">${t.nav.cv}</a>
      <a class="btn btn--primary btn--sm" href="${mailto()}" data-mail>${t.nav.contact}</a>
    </div>
    <div class="header__mobile">
      <a class="btn btn--primary btn--sm" href="${mailto()}" data-mail>${t.nav.contact}</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mobile-menu"
        data-open-label="${t.nav.openMenu}" data-close-label="${t.nav.closeMenu}" aria-label="${t.nav.openMenu}">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div class="mobile-menu" id="mobile-menu" hidden>
    <nav aria-label="Mobile">${nav}</nav>
    <div class="mobile-menu__actions">
      ${langSwitch(t, altPath)}
      <a class="btn btn--secondary" href="${links.cv}" target="_blank" rel="noopener">${t.nav.cv}</a>
    </div>
  </div>
</header>`;
};

export const footer = ({ t }) => `
<footer class="footer">
  <div class="container">
    <div class="footer__row">
      ${logo(homePath(t.lang), 'white')}
      <dl class="footer__links">
        <div><dt>Mail</dt><dd><a href="${mailto()}" data-mail>${links.email}</a></dd></div>
        <div><dt>Telegram</dt><dd><a href="${links.telegram}" target="_blank" rel="noopener">@yuliakovalevs</a></dd></div>
      </dl>
      <dl class="footer__links">
        <div><dt>Behance</dt><dd><a href="${links.behance}" target="_blank" rel="noopener">Yulia Kovalevskaya</a></dd></div>
        <div><dt>LinkedIn</dt><dd><a href="${links.linkedin}" target="_blank" rel="noopener">in/yulia-kovalevskayauxuidesigner</a></dd></div>
      </dl>
      <form class="footer__form" action="https://formsubmit.co/${links.email}" method="POST" data-endpoint="https://formsubmit.co/ajax/${links.email}"
        data-subject="${esc(t.footer.mailSubject)}" data-sent="${esc(t.footer.sent)}" data-error="${esc(t.footer.error)}">
        <label for="lead-email">${t.footer.leave}</label>
        <input id="lead-email" type="email" name="email" required placeholder="${t.footer.placeholder}" autocomplete="email" />
        <input class="visually-hidden" type="text" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true" />
        <button class="btn btn--white" type="submit">${t.footer.send}</button>
        <p class="footer__hint" role="status" aria-live="polite"></p>
      </form>
    </div>
    <div class="footer__bottom"><span>${t.footer.copyright}</span><span>${t.footer.tagline}</span></div>
  </div>
</footer>`;
