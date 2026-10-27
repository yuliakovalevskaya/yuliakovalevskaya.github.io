# Портфолио Юлии Ковалевской

Статический сайт без зависимостей: RU на `/`, EN на `/en/`.

## Структура

- `src/content.js` — все тексты RU/EN, список кейсов и ссылки (почта, Telegram, LinkedIn, WhatsApp, Behance, CV). Правки текста делаются здесь.
- `src/layout.js` — общая оболочка страницы (head, шапка, подвал).
- `src/components/chrome.js` — шапка, подвал, логотип.
- `src/pages/home.js` — секции главной.
- `src/pages/case.js` — шаблон страницы кейса: полный разбор (если у кейса есть `detail`) или обложка + «скоро».
- `src/cases/timemanager.js` — тексты кейса TimeManager RU/EN (макет Figma v3), `src/cases/tm-dims.json` — размеры картинок.
- `src/lib/html.js` — хелперы и маршруты.
- `public/` — стили, скрипт, картинки (`img/cases/*-640.webp` и `*-1280.webp` для Retina), иконки, `cv/`.
- `build.js` — собирает все страницы в `dist/`.

Адреса: `/` и `/en/` — главная, `/cases/<slug>/` и `/en/cases/<slug>/` — кейсы
(finance-ai, timemanager, fitfem, order-routing). Новый кейс = новая запись в `portfolio.cases` в `content.js`.

## Локальный запуск

Нужен Node.js 18+.

```bash
npm run build          # соберёт dist/
npx serve dist         # откроет сайт на http://localhost:3000
```

## Деплой на Vercel

Настройки уже лежат в `vercel.json` (сборка, папка `dist`, кэш картинок и видео), поэтому в Vercel ничего вводить не нужно.

1. Репозиторий на GitHub с этой папкой.
2. vercel.com/new → Import Git Repository → выберите репозиторий → Deploy.
3. Каждый push в main — новая версия сайта через ~1 минуту.
4. Свой домен: Project → Settings → Domains.

Без GitHub: на vercel.com/new нажмите «folder» и выберите готовую папку `dist` (после `npm run build`).

## Что нужно доделать

- WhatsApp: вставить ссылку в `links.whatsapp` в `src/content.js` (пока чип без ссылки).
- Реальные тексты карточек и страницы кейсов: готов TimeManager (src/cases/timemanager.js, картинки в public/img/cases/timemanager/v3/), остальные — по тому же шаблону.

## Кейс TimeManager: как устроена страница

Брейкпоинты: десктоп > 1100 px (макет 1440), планшет 768–1100 px, телефон < 768 px (макет 390).

- Картинки в `public/img/cases/timemanager/v3/`: `d01…d11-<lang>` — десктопные иллюстрации (1280 и 2560 px),
  `m01…m15-<lang>` — мобильные версии (358 и 716 px), `hero-*`/`mhero-*` — слайдер обложки, `ui1…4` — слайдер финального UI,
  `cjm-full-*` — полные CJM, открываются в лайтбоксе по клику на превью CJM.
- На телефоне грузятся мобильные картинки (`<picture>`), на десктопе — десктопные. На планшете пары диаграмм (CJM, user flow) показываются мобильными версиями в две колонки.
- Чтобы обновить картинку из Figma: экспортируйте фрейм в 2x, сохраните как `<имя>-2560.webp` (или `-716` для мобильных) и уменьшенную копию `-1280`/`-358`; если поменялась высота — поправьте `src/cases/tm-dims.json`.


## Обложки кейсов = компонент Project из UI kit

Картинки карточек на главной, в «Других кейсах» и на обложке кейса — это экспорт компонента **Project** (Figma, UI kit, node 2:21652).
В макетах главной (Main - Desktop / Main - mobile) карточки Portfolio Card тоже содержат экземпляры Project, поэтому правка картинки в UI kit сразу меняет главную в Figma.

| Файл на сайте | Вариант Project |
|---|---|
| `img/cases/case-1-*` | Name=Finance App with AI |
| `img/cases/case-2-*` | Name=TimeManager |
| `img/cases/case-3-*` | Name=FitFem |
| `img/cases/case-4-*` | Name=Order Routing |

Desktop-вариант (640×520) → `case-N-640.webp` и `case-N-1280.webp` (2x); Mobile-вариант (350×284) → `case-N-m-350.webp` и `case-N-m-700.webp` (2x), показывается на экранах до 767 px.
После правки обложки в Figma экспортируйте эти два варианта в 1x и 2x под теми же именами (или попросите Claude пересобрать) — разметку менять не нужно.
