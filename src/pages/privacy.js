// Политика конфиденциальности (GDPR / RODO, ст. 13): на неё ведёт строка согласия под формой в подвале
import { links } from '../content.js';
import { homePath } from '../lib/html.js';

const text = {
  ru: {
    title: 'Политика конфиденциальности',
    updated: 'Обновлено: 3 ноября 2026',
    sections: [
      ['Кто обрабатывает данные', `Администратор персональных данных — Юлия Ковалевская, Польша. По любым вопросам о ваших данных пишите на <a href="mailto:${links.email}">${links.email}</a>.`],
      ['Какие данные', 'Только адрес электронной почты, который вы сами вводите в форму в подвале сайта, и адрес страницы, с которой отправлена форма. Рекламных трекеров нет, cookies без вашего согласия не ставятся. Для статистики посещений работает Vercel Web Analytics: он анонимно считает просмотры страниц, страну, тип устройства и браузер, не ставит cookies и не сохраняет IP-адрес — по этим данным нельзя узнать, кто именно вы.'],
      ['Microsoft Clarity — только с вашего согласия', 'Если вы нажали «Разрешить» в баннере, Microsoft Clarity записывает, как вы пользуетесь сайтом: клики, движение курсора, прокрутку, открытые страницы, тип устройства, браузер и примерную страну. Поля ввода скрываются, имя и почту Clarity не видит. Он ставит cookies _clck (до 1 года) и _clsk (1 день); записи сессий хранятся 30 дней. Данные обрабатывает Microsoft и может передавать их в США. Основание — ваше согласие (ст. 6 п. 1 лит. a GDPR). Отозвать его можно в любой момент кнопкой «Настройки cookies» внизу страницы.'],
      ['Зачем и на каком основании', 'Чтобы ответить вам и обсудить сотрудничество. Основание — ваше согласие (ст. 6 п. 1 лит. a GDPR), которое вы даёте, нажимая «Отправить». Согласие можно отозвать в любой момент письмом на почту выше; это не влияет на законность обработки до отзыва.'],
      ['Кто ещё получает данные', 'Письмо с вашим адресом доставляет сервис FormSubmit (formsubmit.co), хранится оно в почте Gmail (Google). Сайт размещён на Vercel и GitHub Pages, шрифты загружаются с Google Fonts и Fontshare — эти сервисы видят ваш IP-адрес, как при открытии любого сайта. Данные не продаются и не передаются для рекламы.'],
      ['Сколько хранятся', 'Пока идёт переписка, и не дольше 12 месяцев после последнего письма, если мы не договорились о сотрудничестве. Раньше — по вашему запросу.'],
      ['Ваши права', 'Вы можете запросить доступ к своим данным, их исправление, удаление, ограничение обработки, перенос, а также возразить против обработки. Если считаете, что данные обрабатываются с нарушением, можно подать жалобу в Управление по защите персональных данных Польши (Prezes UODO, uodo.gov.pl).'],
    ],
    back: '← На главную',
  },
  en: {
    title: 'Privacy policy',
    updated: 'Updated: 3 November 2026',
    sections: [
      ['Who processes your data', `The data controller is Yulia Kovalevskaya, Poland. For any question about your data, email <a href="mailto:${links.email}">${links.email}</a>.`],
      ['What data', 'Only the email address you enter in the form in the site footer, and the address of the page the form was sent from. There are no ad trackers, and no cookies are set without your consent. Visit statistics come from Vercel Web Analytics: it anonymously counts page views, country, device type and browser, sets no cookies and does not store your IP address, so the data cannot identify you.'],
      ['Microsoft Clarity — only with your consent', 'If you click “Allow” in the banner, Microsoft Clarity records how you use the site: clicks, mouse movement, scrolling, pages opened, device type, browser and approximate country. Form fields are masked, so Clarity never sees your name or email. It sets the cookies _clck (up to 1 year) and _clsk (1 day); session recordings are kept for 30 days. The data is processed by Microsoft and may be transferred to the USA. The legal basis is your consent (Art. 6(1)(a) GDPR). You can withdraw it at any time with the “Cookie settings” button at the bottom of the page.'],
      ['Why and on what basis', 'To reply to you and discuss working together. The legal basis is your consent (Art. 6(1)(a) GDPR), given when you click “Send”. You can withdraw it at any time by emailing the address above; this does not affect processing before the withdrawal.'],
      ['Who else receives the data', 'The message with your address is delivered by FormSubmit (formsubmit.co) and stored in Gmail (Google). The site is hosted on Vercel and GitHub Pages, and fonts load from Google Fonts and Fontshare — these services see your IP address, as with any website. Data is never sold or used for advertising.'],
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
