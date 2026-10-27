window.__initSite = () => {
  // Мобильное меню
  const burger = document.querySelector('.burger');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? burger.dataset.closeLabel : burger.dataset.openLabel);
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
  };
  burger?.addEventListener('click', () => setMenu(menu.hidden));
  menu?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu && !menu.hidden) setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 1100 && menu && !menu.hidden) setMenu(false); });

  // Карусели (отзывы, инструменты на мобильных)
  document.querySelectorAll('.arrows').forEach((group) => {
    const track = document.getElementById(group.dataset.target);
    if (!track) return;
    const [prev, next] = group.querySelectorAll('.arrow');
    const step = () => {
      const item = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 0;
      return item ? item.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
    };
    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max;
    };
    group.addEventListener('click', (e) => {
      const btn = e.target.closest('.arrow');
      if (!btn) return;
      track.scrollBy({ left: step() * Number(btn.dataset.dir), behavior: 'smooth' });
    });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Форма в футере: почта посетителя уходит письмом Юлии через FormSubmit (без своего бэкенда)
  const form = document.querySelector('.footer__form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim();
    if (!email || form.classList.contains('is-sending')) return;
    const hint = form.querySelector('.footer__hint');
    const btn = form.querySelector('button');
    form.classList.add('is-sending'); btn.disabled = true; hint.textContent = '';
    try {
      const res = await fetch(form.dataset.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, _subject: form.dataset.subject, _template: 'table', _captcha: 'false', _honey: form._honey.value, page: location.href }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || res.status);
      hint.textContent = form.dataset.sent;
      form.reset();
    } catch {
      hint.textContent = form.dataset.error;
    } finally {
      form.classList.remove('is-sending'); btn.disabled = false;
    }
  });

  // Ссылки «написать письмо»: на компьютере открываем новое письмо в Gmail (у многих нет почтового приложения
  // и mailto просто открывает браузер). На телефоне оставляем mailto — откроется письмо в почтовом приложении.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('a[data-mail]').forEach((a) => {
      const to = a.getAttribute('href').replace(/^mailto:/, '');
      a.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}`;
      a.target = '_blank'; a.rel = 'noopener';
    });
  }

  // Отзывы: перетаскивание мышью, как свайп пальцем на телефоне — лента едет за курсором и по инерции
  const reviews = document.getElementById('reviews-track');
  if (reviews && window.matchMedia('(pointer: fine)').matches) {
    let down = false, moved = false, startX = 0, startLeft = 0, lastX = 0, lastT = 0, v = 0, timer = 0;
    const snap = getComputedStyle(reviews).scrollSnapType;
    const stopInertia = () => clearTimeout(timer);
    reviews.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      stopInertia();
      down = true; moved = false; startX = lastX = e.clientX; startLeft = reviews.scrollLeft; lastT = performance.now(); v = 0;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) > 4) {
        moved = true;
        reviews.classList.add('is-dragging');
        reviews.style.scrollSnapType = 'none';
        reviews.setPointerCapture?.(e.pointerId);
      }
      if (!moved) return;
      const now = performance.now();
      v = (e.clientX - lastX) / Math.max(now - lastT, 1);
      lastX = e.clientX; lastT = now;
      reviews.scrollLeft = startLeft - dx;
    });
    const end = () => {
      if (!down) return;
      down = false;
      reviews.classList.remove('is-dragging');
      if (!moved) return;
      // Инерция: чем быстрее отпустили, тем дальше уезжает лента; останавливается на ближайшей карточке
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const goal = reviews.scrollLeft - (reduce ? 0 : v * 250);
      const stops = [...reviews.children].map((c) => c.offsetLeft - reviews.firstElementChild.offsetLeft);
      const max = reviews.scrollWidth - reviews.clientWidth;
      const target = Math.min(max, stops.reduce((best, s) => (Math.abs(s - goal) < Math.abs(best - goal) ? s : best), stops[0]));
      reviews.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' });
      clearTimeout(timer);
      timer = setTimeout(() => { reviews.style.scrollSnapType = snap; }, reduce ? 0 : 600);
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    // После перетаскивания клик не должен срабатывать на карточке, картинки не таскаются
    reviews.addEventListener('click', (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    reviews.addEventListener('dragstart', (e) => e.preventDefault());
  }

  // Кейс: слайдеры (обложка и финальный UI) — смена каждые 3 секунды, точки, свайп, стрелки клавиатуры.
  // Автосмена работает всегда, пока слайдер на экране и вкладка открыта; после ручного переключения отсчёт начинается заново.
  document.querySelectorAll('.tm-slider').forEach((sl) => {
    const track = sl.querySelector('.tm-slider__track');
    const slides = [...sl.querySelectorAll('.tm-slider__slide')];
    const dots = [...sl.querySelectorAll('.tm-slider__dot')];
    const delay = Number(sl.dataset.autoplay) || 3000;
    let i = 0, timer = null, visible = !('IntersectionObserver' in window);
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      track.style.transform = `translateX(-${i * 100}%)`;
      slides.forEach((s, k) => s.setAttribute('aria-hidden', String(k !== i)));
      dots.forEach((d, k) => { d.classList.toggle('is-active', k === i); d.setAttribute('aria-selected', String(k === i)); });
    };
    const stop = () => { clearTimeout(timer); timer = null; };
    const play = () => {
      stop();
      if (!visible || document.hidden || !sl.isConnected || slides.length < 2) return;
      timer = setTimeout(() => { go(i + 1); play(); }, delay);
    };
    dots.forEach((d) => d.addEventListener('click', () => { go(Number(d.dataset.i)); play(); }));
    sl.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { go(i + (e.key === 'ArrowRight' ? 1 : -1)); dots[i]?.focus(); play(); }
    });
    let x0 = null, y0 = null;
    track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { go(i + (dx < 0 ? 1 : -1)); play(); }
      x0 = null;
    });
    document.addEventListener('visibilitychange', play);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; play(); }).observe(sl);
    }
    go(0); play();
  });

  // Кейс: видео-превью. Автозапуск без звука (иначе браузеры блокируют), пауза и звук — кнопками.
  // Если пользователь сам поставил паузу, видео не включается снова при прокрутке.
  document.querySelectorAll('[data-video]').forEach((box) => {
    const v = box.querySelector('video');
    const bPlay = box.querySelector('[data-act="play"]');
    const bSound = box.querySelector('[data-act="sound"]');
    let userPaused = false, visible = true;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // HD-версия для больших экранов; если её нет или сеть экономная — остаётся web-версия
    const hd = v.dataset.hd;
    const saveData = navigator.connection && navigator.connection.saveData;
    if (hd && !saveData && window.matchMedia('(min-width: 1600px) and (min-resolution: 1.5dppx)').matches) {
      const web = v.currentSrc || v.querySelector('source').src;
      v.addEventListener('error', () => { if (v.src && v.src.indexOf(hd) !== -1) { v.src = web; v.load(); if (!userPaused) v.play().catch(() => {}); } }, { once: true });
      v.src = hd; v.load();
    }
    const sync = () => {
      const paused = v.paused;
      box.classList.toggle('is-paused', paused);
      bPlay.setAttribute('aria-label', paused ? bPlay.dataset.off : bPlay.dataset.on);
      box.classList.toggle('is-sound', !v.muted);
      bSound.setAttribute('aria-pressed', String(!v.muted));
      bSound.setAttribute('aria-label', v.muted ? bSound.dataset.off : bSound.dataset.on);
    };
    const tryPlay = () => { if (!userPaused && visible && !document.hidden) v.play().catch(() => sync()); };
    if (reduce) { userPaused = true; v.removeAttribute('autoplay'); v.pause(); }
    bPlay.addEventListener('click', () => {
      if (v.paused) { userPaused = false; v.play().catch(() => {}); } else { userPaused = true; v.pause(); }
    });
    bSound.addEventListener('click', () => {
      v.muted = !v.muted;
      if (!v.muted) { userPaused = false; if (v.paused) v.play().catch(() => {}); }
      sync();
    });
    ['play', 'pause', 'volumechange'].forEach((e) => v.addEventListener(e, sync));
    document.addEventListener('visibilitychange', () => { if (document.hidden) v.pause(); else tryPlay(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) tryPlay(); else v.pause(); }, { threshold: 0.25 }).observe(box);
    }
    sync(); tryPlay();
  });

  // Кейс: липкое содержание — подсветка текущего раздела
  const navLinks = [...document.querySelectorAll('.tm-nav a')];
  if (navLinks.length && 'IntersectionObserver' in window) {
    const list = document.querySelector('.tm-nav__list');
    const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    // Разделы без пункта в меню (цели, финальный UI, рефлексия) относим к предыдущему пункту
    const sections = [...document.querySelectorAll('.tm-section')];
    let owner = null;
    const ownerOf = new Map(sections.map((s) => { if (byId.has(s.id)) owner = s.id; return [s, owner]; }));
    const setActive = (a) => {
      if (!a || a.classList.contains('is-active')) return;
      navLinks.forEach((l) => l.classList.remove('is-active'));
      a.classList.add('is-active');
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: a.offsetLeft - 12, behavior: 'smooth' });
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(byId.get(ownerOf.get(en.target))); });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  // Кейс: полная CJM в лайтбоксе
  const box = document.querySelector('.tm-lightbox');
  if (box && typeof box.showModal === 'function') {
    const img = box.querySelector('img');
    const title = box.querySelector('.tm-lightbox__title');
    let opener = null;
    document.querySelectorAll('.tm-zoom').forEach((btn) => btn.addEventListener('click', () => {
      opener = btn;
      const base = btn.dataset.full;
      img.src = `${base}-2560.webp`;
      img.srcset = `${base}-1280.webp 1280w, ${base}-2560.webp 2560w`;
      img.sizes = 'min(1320px, 100vw)';
      img.width = btn.dataset.w; img.height = btn.dataset.h;
      img.alt = btn.dataset.title;
      title.textContent = btn.dataset.title;
      box.showModal();
      box.querySelector('.tm-lightbox__body').scrollTo(0, 0);
      document.documentElement.style.overflow = 'hidden';
    }));
    const close = () => box.close();
    box.querySelector('.tm-lightbox__close').addEventListener('click', close);
    box.addEventListener('click', (e) => { if (e.target === box) close(); });
    box.addEventListener('close', () => { document.documentElement.style.overflow = ''; opener?.focus(); });
  } else if (box) {
    // Без <dialog>: просто открываем картинку
    document.querySelectorAll('.tm-zoom').forEach((btn) => btn.addEventListener('click', () => { window.open(`${btn.dataset.full}-2560.webp`, '_blank', 'noopener'); }));
  }


  // Кнопка «Наверх»: появляется после первого экрана, плавно прокручивает к началу страницы
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    toTop.hidden = false;
    const sync = () => toTop.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.8);
    toTop.addEventListener('click', () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      toTop.blur();
    });
    if (!window.__toTopBound) { window.__toTopBound = true; window.addEventListener('scroll', () => window.__toTopSync && window.__toTopSync(), { passive: true }); }
    window.__toTopSync = sync;
    sync();
  }
};
window.__initSite();
