// Политика конфиденциальности (GDPR / RODO, ст. 13): на неё ведёт строка согласия под формой в подвале
import { links } from '../content.js';
import { homePath } from '../lib/html.js';

const text = {
  ru: {
    title: 'Политика конфиденциальности',
    updated: 'Обновлено: 27 октября 2026',
    sections: [
      ['Кто обрабатывает данные', `Администратор персональных данных — Юлия Ковалевская, Польша. По любым вопросам о ваших данных пишите на <a href="mailto:${links.email}">${links.email}</a>.`],
      ['Какие данные', 'Только адрес электронной почты, который вы сами вводите в форму в подвале сайта, и адрес страницы, с которой отправлена форма. Сайт не использует cookies, счётчики и рекламные трекеры.'],
      ['Зачем и на каком основании', 'Чтобы ответить вам и обсудить сотрудничество. Основание — ваше согласие (ст. 6 п. 1 лит. a GDPR), которое вы даёте, нажимая «Отправить». Согласие можно отозвать в любой момент письмом на почту выше; это не влияет на законность обработки до отзыва.'],
      ['Кто ещё получает данные', 'Письмо с вашим адресом доставляет сервис FormSubmit (formsubmit.co), хранится оно в почте Gmail (Google). Сайт размещён на GitHub Pages, шрифты загружаются с Google Fonts и Fontshare — эти сервисы видят ваш IP-адрес, как при открытии любого сайта. Данные не продаются и не передаются для рекламы.'],
      ['Сколько хранятся', 'Пока идёт переписка, и не дольше 12 месяцев после последнего письма, если мы не договорились о сотрудничестве. Раньше — по вашему запросу.'],
      ['Ваши права', 'Вы можете запросить доступ к своим данным, их исправление, удаление, ограничение обработки, перенос, а также возразить против обработки. Если считаете, что данные обрабатываются с нарушением, можно подать жалобу в Управление по защите персональных данных Польши (Prezes UODO, uodo.gov.pl).'],
    ],
    back: '← На главную',
  },
  en: {
    title: 'Privacy policy',
    updated: 'Updated: 27 October 2026',
    sections: [
      ['Who processes your data', `The data controller is Yulia Kovalevskaya, Poland. For any question about your data, email <a href="mailto:${links.email}">${links.email}</a>.`],
      ['What data', 'Only the email address you enter in the form in the site footer, and the address of the page the form was sent from. The site uses no cookies, analytics or ad trackers.'],
      ['Why and on what basis', 'To reply to you and discuss working together. The legal basis is your consent (Art. 6(1)(a) GDPR), given when you click “Send”. You can withdraw it at any time by emailing the address above; this does not affect processing before the withdrawal.'],
      ['Who else receives the data', 'The message with your address is delivered by FormSubmit (formsubmit.co) and stored in Gmail (Google). The site is hosted on GitHub Pages, and fonts load from Google Fonts and Fontshare — these services see your IP address, as with any website. Data is never sold or used for advertising.'],
      ['How long it is kept', 'For as long as we are in touch, and no longer than 12 months after the last message if we don’t start working together. Earlier on request.'],
      ['Your rights', 'You can ask for access to your data, its correction, deletion, restriction of processing and portability, and you can object to processing. If you believe your data is processed unlawfully, you can complain to the Polish data protection authority (Prezes UODO, uodo.gov.pl).'],
    ],
    back: '← Back to home',
  },
};

export const privacyTitle = (lang) => text[lang].title;

export const privacyBody = (t) => {
  const p = text[t.lang];
  return `
<section class="section legal">
  <div class="container legal__inner">
    <a class="case-page__back" href="${homePath(t.lang)}">${p.back}</a>
    <h1 class="h2">${p.title}</h1>
    <p class="legal__updated">${p.updated}</p>
    ${p.sections.map(([h, body]) => `
    <div class="legal__block">
      <h2 class="legal__h">${h}</h2>
      <p>${body}</p>
    </div>`).join('')}
  </div>
</section>`;
};
