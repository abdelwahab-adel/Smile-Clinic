/* ============================================================
   Smile Clinic — Frontend Application Logic
   Modular vanilla JS · No frameworks · ES2017
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Utilities ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const on = (el, ev, fn, opts) => el && el.addEventListener(ev, fn, opts);
  const isRTL = document.documentElement.dir === 'rtl';

  /* ============================================================
     1. HEADER — scroll behavior
     ============================================================ */
  const header = $('#mainHeader');
  const backTop = $('#backTop');

  const handleScroll = () => {
    const sy = window.scrollY;
    if (sy > 60) {
      header?.classList.add('is-scrolled');
      backTop?.classList.add('is-visible');
    } else {
      header?.classList.remove('is-scrolled');
      backTop?.classList.remove('is-visible');
    }
  };

  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (!scrollScheduled) {
      scrollScheduled = true;
      requestAnimationFrame(() => {
        handleScroll();
        scrollScheduled = false;
      });
    }
  }, { passive: true });

  on(backTop, 'click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     2. MOBILE NAVIGATION
     ============================================================ */
  const navToggle = $('#navToggle');
  const mobileNav = $('#mobileNav');
  const mobileClose = $('#mobileClose');

  const openMobile = () => {
    mobileNav?.classList.add('is-open');
    mobileNav?.setAttribute('aria-hidden', 'false');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
  };

  const closeMobile = () => {
    mobileNav?.classList.remove('is-open');
    mobileNav?.setAttribute('aria-hidden', 'true');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
  };

  on(navToggle, 'click', openMobile);
  on(mobileClose, 'click', closeMobile);
  on(mobileNav, 'click', (e) => {
    if (e.target === mobileNav) closeMobile();
  });
  $$('.mobilenav__link').forEach((a) => on(a, 'click', closeMobile));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('is-open')) closeMobile();
  });

  /* ============================================================
     3. SMOOTH SCROLL + ACTIVE NAV LINK
     ============================================================ */
  const navLinks = $$('.nav__link');
  const sections = $$('main, section[id]');

  $$('a[href^="#"]').forEach((a) => {
    on(a, 'click', (e) => {
      const href = a.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = (header?.offsetHeight || 0) + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Scroll spy for nav active state
  if (sections.length && navLinks.length) {
    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          const id = entry.target.id;
          navLinks.forEach((l) => {
            const isActive = l.getAttribute('href') === `#${id}`;
            l.classList.toggle('is-active', isActive);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach((s) => s.id && spyObserver.observe(s));
  }

  /* ============================================================
     4. SCROLL REVEAL
     ============================================================ */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = parseInt(getComputedStyle(el).getPropertyValue('--rd')) || 0;
            setTimeout(() => el.classList.add('is-visible'), delay);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ============================================================
     5. ANIMATED COUNTERS
     ============================================================ */
  const toArabicDigits = (n) => {
    const map = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(n).split('').map(c => /\d/.test(c) ? map[+c] : c).join('');
  };
  const formatNumber = (n) => toArabicDigits(n);

  const animateCounter = (el) => {
    if (el.dataset.animated) return;
    el.dataset.animated = '1';
    const target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    const duration = 2000;
    const startTime = performance.now();
    const update = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatNumber(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = formatNumber(target);
    };
    requestAnimationFrame(update);
  };

  const counterEls = $$('[data-count]');
  if ('IntersectionObserver' in window && counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counterEls.forEach((el) => counterObserver.observe(el));
  }

  /* Hero counters — count up once, then stay (data-counter was previously unwired to any JS) */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const runCounterOnce = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    if (isNaN(target)) return;
    const raw = el.textContent.trim();
    const m = raw.match(/[0-9]+/);
    if (!m) return;
    const prefix = raw.slice(0, m.index);
    const suffix = raw.slice(m.index + m[0].length);
    if (reduceMotion) { el.textContent = prefix + formatNumber(target) + suffix; return; }
    const duration = 2000;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + formatNumber(Math.floor(eased * target)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + formatNumber(target) + suffix;
    };
    requestAnimationFrame(step);
  };
  $$('[data-counter]').forEach(runCounterOnce);

  /* ============================================================
     6. BEFORE / AFTER SLIDER (drag + touch + keyboard)
     ============================================================ */
  (function initBeforeAfter() {
    const stage  = $('#baStage');
    const before = $('#baBefore');
    const handle = $('#baHandle');
    if (!stage || !before || !handle) return;

    let isDragging = false;
    let pct = 50;

    const clamp = (v) => Math.min(100, Math.max(0, v));

    const setPosition = (clientX) => {
      const rect = stage.getBoundingClientRect();
      pct = clamp(((clientX - rect.left) / rect.width) * 100);
      // RTL/LTR awareness
      if (isRTL) {
       before.style.clipPath = `inset(0 0 0 ${pct}%)`;
        handle.style.left = pct + '%';
        handle.style.right = 'auto';
      } else {
         before.style.clipPath = `inset(0 ${pct}% 0 0)`;
        handle.style.right = pct + '%';
        handle.style.left = 'auto';
      }
      handle.setAttribute('aria-valuenow', Math.round(pct));
    };

    // Init center
    const initCenter = () => {
      const rect = stage.getBoundingClientRect();
      setPosition(rect.left + rect.width / 2);
    };

    // Pointer events (mouse + touch unified where supported)
    const startDrag = (clientX) => { isDragging = true; setPosition(clientX); };
    const moveDrag = (clientX) => { if (isDragging) setPosition(clientX); };
    const endDrag = () => { isDragging = false; };

    // Mouse
    on(handle, 'mousedown', (e) => { e.preventDefault(); startDrag(e.clientX); });
    window.addEventListener('mousemove', (e) => moveDrag(e.clientX));
    window.addEventListener('mouseup', endDrag);

    // Touch
    on(handle, 'touchstart', (e) => { e.preventDefault(); startDrag(e.touches[0].clientX); }, { passive: false });
    window.addEventListener('touchmove', (e) => { if (isDragging) { e.preventDefault(); moveDrag(e.touches[0].clientX); } }, { passive: false });
    window.addEventListener('touchend', endDrag);

    // Click anywhere on stage moves the handle
    on(stage, 'click', (e) => {
      if (e.target === handle || handle.contains(e.target)) return;
      setPosition(e.clientX);
    });

    // Keyboard
    on(handle, 'keydown', (e) => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowRight') { e.preventDefault(); setPosition(stage.getBoundingClientRect().left + stage.offsetWidth * (pct + step) / 100); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); setPosition(stage.getBoundingClientRect().left + stage.offsetWidth * (pct - step) / 100); }
    });

    if (document.readyState === 'complete') initCenter();
    else window.addEventListener('load', initCenter);

    let resizeRaf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(initCenter);
    });
  })();

  /* ============================================================
     7. BA FILTER TABS
     ============================================================ */
  const baFilters = $$('.ba__filter');
  baFilters.forEach((tab) => {
    on(tab, 'click', () => {
      const filter = tab.dataset.filter;
      baFilters.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      $$('.ba__card').forEach((card) => {
        const matches = filter === 'all' || card.dataset.type === filter;
        card.style.display = matches ? '' : 'none';
      });
    });
  });

  /* ============================================================
     8. TESTIMONIALS CAROUSEL
     ============================================================ */
  (function initTestimonials() {
    const track = $('#testimonialTrack');
    const prevBtn = $('#prevBtn');
    const nextBtn = $('#nextBtn');
    const dotsEl = $('#testimonialDots');
    if (!track) return;

    const cards = $$('.testimonial', track);
    const total = cards.length;
    let current = 0;
    let autoTimer;

    const visibleCount = () => {
      const vw = window.innerWidth;
      if (vw <= 640) return 1;
      if (vw <= 1024) return 2;
      return 3;
    };

    const step = () => {
      if (!cards[0]) return 0;
      return cards[0].offsetWidth + 24; // gap
    };

    const maxIndex = () => Math.max(0, total - visibleCount());

    const buildDots = () => {
      if (!dotsEl) return;
      const n = maxIndex() + 1;
      dotsEl.innerHTML = '';
      for (let i = 0; i < n; i++) {
        const d = document.createElement('button');
        d.className = 'testimonials__dot' + (i === current ? ' is-active' : '');
        d.setAttribute('aria-label', `الانتقال إلى شريحة ${i + 1}`);
        d.addEventListener('click', () => { stopAuto(); go(i); startAuto(); });
        dotsEl.appendChild(d);
      }
    };

    const go = (i) => {
      current = Math.max(0, Math.min(i, maxIndex()));
      const offset = current * step();
      track.style.transform = isRTL
        ? `translateX(${offset}px)`
        : `translateX(-${offset}px)`;
      if (dotsEl) {
        $$('.testimonials__dot', dotsEl).forEach((d, idx) => {
          d.classList.toggle('is-active', idx === current);
        });
      }
    };

    const next = () => go(current < maxIndex() ? current + 1 : 0);
    const prev = () => go(current > 0 ? current - 1 : maxIndex());

    const startAuto = () => { autoTimer = setInterval(next, 5000); };
    const stopAuto = () => clearInterval(autoTimer);

    on(prevBtn, 'click', () => { stopAuto(); prev(); startAuto(); });
    on(nextBtn, 'click', () => { stopAuto(); next(); startAuto(); });

    // Touch swipe support
    let touchStartX = 0;
    let touchStartY = 0;
    on(track, 'touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    on(track, 'touchend', (e) => {
      const dx = touchStartX - e.changedTouches[0].clientX;
      const dy = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        stopAuto();
        if (isRTL ? dx > 0 : dx < 0) next(); else prev();
        startAuto();
      }
    }, { passive: true });

    // Pause on hover
    on(track, 'mouseenter', stopAuto);
    on(track, 'mouseleave', startAuto);

    let resizeRaf;
    window.addEventListener('resize', () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        current = Math.min(current, maxIndex());
        buildDots();
        go(current);
      });
    });

    buildDots();
    go(0);
    startAuto();
  })();

  /* ============================================================
     9. FAQ ACCORDION
     ============================================================ */
  $$('.faq__q').forEach((btn) => {
    on(btn, 'click', () => {
      const item = btn.closest('.faq__item');
      const a = item?.querySelector('.faq__a');
      if (!item || !a) return;

      const isOpen = item.classList.contains('is-open');

      // Close all (single-open accordion)
      $$('.faq__item').forEach((i) => {
        i.classList.remove('is-open');
        const inner = i.querySelector('.faq__a');
        const q = i.querySelector('.faq__q');
        if (inner) inner.style.maxHeight = '';
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        a.style.maxHeight = a.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ============================================================
     10. ARTICLE MODAL
     ============================================================ */
  const articles = {
    article1: {
      cat: 'هوليوود سمايل',
      title: 'كل ما تريد معرفته عن هوليوود سمايل قبل اتخاذ القرار',
      date: '١٥ مايو ٢٠٢٥',
      read: '٨ دقائق',
      body: `
        <p>هوليوود سمايل أو ما يُعرف بـ"ابتسامة النجوم" هو أحد أكثر إجراءات تجميل الأسنان انتشاراً في العقد الأخير، ولأسباب وجيهة تماماً. فهو يحول الابتسامة خلال أيام قليلة إلى نسخة مثالية لا تُنسى.</p>
        <h3>ما هو هوليوود سمايل بالضبط؟</h3>
        <p>هوليوود سمايل هو تركيب قشور خزفية (Porcelain Veneers) رفيعة جداً على سطح الأسنان الأمامية لتغيير شكلها ولونها وحجمها. السُّمك عادةً لا يتجاوز ٠.٥ ملم — أرق من قشرة البصلة — لكنها تُحدث فرقاً درامياً في الابتسامة.</p>
        <h3>خطوات العملية في عيادتنا</h3>
        <ul>
          <li>استشارة أولية مجانية وتصوير رقمي للوجه والأسنان</li>
          <li>تصميم الابتسامة رقمياً بتقنية DSD والذكاء الاصطناعي</li>
          <li>مراجعتك للتصميم وإجراء أي تعديلات تريدها</li>
          <li>جلسة التحضير: طحن خفيف جداً لسطح الأسنان وأخذ القياسات</li>
          <li>تركيب تيجان مؤقتة أثناء تصنيع القشور في المختبر (3-5 أيام)</li>
          <li>جلسة التركيب النهائي والتلميع</li>
        </ul>
        <div class="art-tip">💡 <strong>نصيحة الخبراء:</strong> لا تقبل أي عملية هوليوود سمايل دون رؤية تصميم رقمي مسبق. هذا حقك وليس رفاهية.</div>
        <h3>كم تدوم القشور الخزفية؟</h3>
        <p>القشور الخزفية عالية الجودة تدوم من 10 إلى 20 سنة مع العناية الصحيحة. لون البورسلين لا يتغير ولا يصفر بمرور الوقت، وهو مقاوم للبقع بشكل استثنائي مقارنة بالأسنان الطبيعية.</p>
      `
    },
    article2: {
      cat: 'زراعة الأسنان',
      title: 'الدليل الكامل لزراعة الأسنان: فوائدها وأنواعها ومدة صلاحيتها',
      date: '٢ أبريل ٢٠٢٥',
      read: '١٠ دقائق',
      body: `
        <p>زراعة الأسنان هي الحل الأكثر ديمومة وطبيعية لتعويض الأسنان المفقودة. تستعيد ابتسامتك وقدرتك على المضغ بثقة تامة، وكأنها أسنانك الأصلية.</p>
        <h3>ما هي زراعة الأسنان؟</h3>
        <p>الزراعة هي جذور صناعية من التيتانيوم تُوضع جراحياً في عظم الفك لتحل محل جذور الأسنان المفقودة. تُركب فوقها تيجان خزفية تشبه الأسنان الطبيعية تماماً في الشكل واللون والوظيفة.</p>
        <h3>الأنواع المتوفرة في عيادتنا</h3>
        <ul>
          <li><strong>الزراعة الفورية:</strong> تُركب في نفس يوم خلع السن</li>
          <li><strong>الزراعة التقليدية:</strong> بعد فترة شفاء 3-6 أشهر</li>
          <li><strong>زراعة All-on-4:</strong> لاستبدال كامل الأسنان بدعامات قليلة</li>
          <li><strong>زراعة العظم:</strong> لمن يعانون من ضمور العظام</li>
        </ul>
        <div class="art-tip">💡 <strong>هل تعلم؟</strong> نسبة نجاح زراعة الأسنان تتجاوز 98% عند تطبيق البروتوكولات الصحيحة.</div>
      `
    },
    article3: {
      cat: 'نصائح طبية',
      title: '١٠ عادات يومية تحافظ على أسنانك وتمنع تسوسها للأبد',
      date: '١٨ مارس ٢٠٢٥',
      read: '٦ دقائق',
      body: `
        <p>صحة أسنانك تبدأ من العادات اليومية البسيطة. إليك أهم ١٠ عادات ينصح بها أطباء الأسنان للحفاظ على ابتسامة صحية مدى الحياة.</p>
        <h3>العادة 1-3: التفريش الذكي</h3>
        <ul>
          <li>تفريش الأسنان مرتين يومياً لمدة دقيقتين</li>
          <li>استخدام فرشاة بشعيرات ناعمة</li>
          <li>تغيير الفرشاة كل 3 أشهر</li>
        </ul>
        <h3>العادة 4-6: التنظيف العميق</h3>
        <ul>
          <li>استخدام خيط الأسنان يومياً</li>
          <li>غسول فم طبي بعد التفريش</li>
          <li>تنظيف اللسان بمكشطة مخصصة</li>
        </ul>
        <h3>العادة 7-10: نمط الحياة</h3>
        <ul>
          <li>تقليل السكريات والمشروبات الغازية</li>
          <li>شرب الماء بعد كل وجبة</li>
          <li>مضغ العلك الخالي من السكر</li>
          <li>زيارات دورية كل 6 أشهر</li>
        </ul>
      `
    },
    article4: {
      cat: 'تبييض الأسنان',
      title: 'تبييض الأسنان بالليزر مقابل التبييض المنزلي: أيهما أفضل؟',
      date: '٥ مارس ٢٠٢٥',
      read: '٧ دقائق',
      body: `
        <p>التبييض من أكثر الإجراءات التجميلية طلباً. ولكن ما الفرق بين الليزر في العيادة والطرق المنزلية؟</p>
        <h3>التبييض بالليزر في العيادة</h3>
        <p>جلسة واحدة مدتها 45-60 دقيقة، نتائج فورية قد تصل إلى 8 درجات أفتح. آمن تماماً تحت إشراف طبي، مع حماية اللثة ومتابعة دقيقة.</p>
        <h3>التبييض المنزلي</h3>
        <p>قوالب مخصصة مع جل التبييض تستخدم لمدة أسبوعين. نتائج أبطأ وقد تكون غير متساوية بدون إشراف طبي.</p>
        <div class="art-tip">💡 <strong>توصيتنا:</strong> ابدأ دائماً بالتبييض في العيادة لضمان نتائج آمنة وسريعة، ثم حافظ عليها بقوالب منزلية مخصصة.</div>
      `
    },
    article5: {
      cat: 'صحة الأطفال',
      title: 'متى يبدأ طفلك بزيارة طبيب الأسنان؟ دليل الآباء الكامل',
      date: '١٢ فبراير ٢٠٢٥',
      read: '٥ دقائق',
      body: `
        <p>الأسنان اللبنية تلعب دوراً أساسياً في نمو طفلك وتطور نطق ابتسامته. متى وكيف تبدأ العناية بها؟</p>
        <h3>أول زيارة للأسنان</h3>
        <p>توصي الأكاديمية الأمريكية لطب أسنان الأطفال بأول زيارة عند ظهور أول سن لبني، أو في عمر سنة واحدة على الأكثر. الهدف: تعريف الطفل بالطبيب وتقييم النمو.</p>
        <h3>الروتين اليومي</h3>
        <ul>
          <li>تنظيف اللثة بقطعة قماش مبللة قبل ظهور الأسنان</li>
          <li>فرشاة ناعمة معجون بفلورايد بحجم حبة البازلاء</li>
          <li>تجنب زجاجة الحليب قبل النوم</li>
        </ul>
        <h3>متى تقلق؟</h3>
        <p>راجع الطبيب فوراً في حال: تصبغات على الأسنان، تأخر في الظهور، ألم، أو إصابات.</p>
      `
    },
    article6: {
      cat: 'علاج الألم',
      title: 'ألم الأسنان المفاجئ: أسبابه وكيف تتعامل معه فوراً',
      date: '٢٨ يناير ٢٠٢٥',
      read: '٤ دقائق',
      body: `
        <p>ألم الأسنان المفاجئ يحدث دائماً في أسوأ الأوقات. تعرف على الأسباب والإجراءات الإسعافية.</p>
        <h3>أكثر الأسباب شيوعاً</h3>
        <ul>
          <li>تسوس متقدم يصل للعصب</li>
          <li>خراج أو التهاب في الجذور</li>
          <li>كسر أو شرخ في السن</li>
          <li>انحسار اللثة وكشف الجذور</li>
          <li>ضرس العقل المدفون</li>
        </ul>
        <h3>إجراءات فورية</h3>
        <ul>
          <li>مضمضة بالماء الدافئ والملح</li>
          <li>كمادات باردة على الخد من الخارج</li>
          <li>مسكن ألم مناسب (باراسيتامول أو إيبوبروفين)</li>
          <li>تجنب الأكل على الجانب المصاب</li>
        </ul>
        <div class="art-tip">⚠️ <strong>متى تتصل فوراً؟</strong> إذا استمر الألم أكثر من يومين، أو صاحبته حرارة، أو تورم في الوجه.</div>
      `
    }
  };

  const modal      = $('#articleModal');
  const modalBody  = $('#modalBody');
  const modalTitle = $('#modalTitle');
  const modalClose = $('#modalClose');

  const openModal = (key) => {
    const article = articles[key];
    if (!article || !modal || !modalBody) return;
    modalBody.innerHTML = `
      <span class="modal__meta"><strong>${article.cat}</strong> · ${article.date} · ${article.read}</span>
      <h2>${article.title}</h2>
      ${article.body}
    `;
    modalTitle.textContent = article.title;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  };

  const closeModal = () => {
    modal?.classList.remove('is-open');
    modal?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  };

  // Expose for inline onclick handler fallback (defensive)
  window.closeModal = closeModal;

  $$('.post').forEach((post) => {
    on(post, 'click', (e) => {
      e.preventDefault();
      const key = post.dataset.article;
      if (key) openModal(key);
    });
  });

  on(modalClose, 'click', closeModal);
  on(modal, 'click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal();
  });

  /* ============================================================
     11. BOOKING FORM — validation + state
     ============================================================ */
  const form        = $('#bookingForm');
  const submitBtn   = $('#bookingSubmit');
  const status      = $('#formStatus');

  if (form) {
    // Set min date to today
    const dateInput = $('#bf-date');
    if (dateInput) {
      const now = new Date();
      const localToday = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .split('T')[0];
      dateInput.min = localToday;
    }

    on(form, 'submit', (e) => {
      e.preventDefault();
      let valid = true;
      const required = $$('[required]', form);
      required.forEach((input) => {
        input.style.borderColor = '';
        if (!input.value.trim() || (input.type === 'checkbox' && !input.checked)) {
          input.style.borderColor = '#ef4444';
          valid = false;
        }
      });

      if (!valid) {
        if (status) {
          status.className = 'form-status is-visible form-status--error';
          status.textContent = 'من فضلك أكمل الحقول المطلوبة بشكل صحيح.';
        }
        return;
      }

      // Submit to email — POST to info@smileclinic-eg.com (mailto fallback here)
      const name    = $('#bf-name').value.trim();
      const phone   = $('#bf-phone').value.trim();
      const service = $('#bf-service').value;
      const date    = $('#bf-date').value;
      const time    = $('#bf-time').value;
      const notes   = $('#bf-notes').value.trim();

      const submitText = submitBtn?.querySelector('span');
      if (submitText) submitText.textContent = 'جاري الإرسال...';
      if (submitBtn) submitBtn.disabled = true;

      // Simulated send (replace with real backend integration)
      setTimeout(() => {
        if (submitText) submitText.textContent = '✓ تم تأكيد الحجز';
        if (status) {
          status.className = 'form-status is-visible form-status--success';
          status.textContent = `شكراً ${name}! تم استلام طلب حجزك. سنتواصل معك على ${phone} خلال دقائق.`;
        }

        // Open WhatsApp with prefilled message
        const waMsg = `السلام عليكم، أريد تأكيد الحجز.%0A%0Aالاسم: ${name}%0Aالهاتف: ${phone}%0Aالخدمة: ${service || 'غير محدد'}%0Aالتاريخ: ${date || 'غير محدد'}%0Aالوقت: ${time}%0Aملاحظات: ${notes || 'لا يوجد'}`;
        setTimeout(() => {
          window.open(`https://wa.me/201068300432?text=${waMsg}`, '_blank', 'noopener');
        }, 600);

        // Toast
        const toast = $('#toast');
        toast?.classList.add('is-visible');
        setTimeout(() => toast?.classList.remove('is-visible'), 4000);

        // Reset
        setTimeout(() => {
          form.reset();
          if (submitText) submitText.textContent = 'تأكيد الحجز';
          if (submitBtn) submitBtn.disabled = false;
        }, 6000);
      }, 1200);
    });

    // Clear border on input
    $$('input, select, textarea', form).forEach((el) => {
      on(el, 'input', () => { el.style.borderColor = ''; });
    });
  }

  /* ============================================================
     12. RIPPLE EFFECT ON BUTTONS
     ============================================================ */
  $$('.btn').forEach((btn) => {
    on(btn, 'click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 620);
    });
  });

  /* ============================================================
     13. Performance: defer non-critical work until idle
     ============================================================ */
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // Warm up fonts/animations
      document.documentElement.classList.add('is-ready');
    }, { timeout: 1500 });
  } else {
    setTimeout(() => document.documentElement.classList.add('is-ready'), 800);
  }

})();
