
    'use strict';

    // ============ LOADER ============
    window.addEventListener('load', () => {
      setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        initCounters();
      }, 1800);
    });

    // ============ PARTICLES ============
    (function initParticles() {
      const canvas = document.getElementById('particles-canvas');
      const ctx = canvas.getContext('2d');
      let particles = [];
      const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
      resize(); window.addEventListener('resize', resize);
      for (let i = 0; i < 60; i++) {
        particles.push({
          x: Math.random() * innerWidth, y: Math.random() * innerHeight,
          r: Math.random() * 2 + 0.5,
          dx: (Math.random() - 0.5) * 0.4,
          dy: (Math.random() - 0.5) * 0.4,
          o: Math.random() * 0.5 + 0.1
        });
      }
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(14,165,233,${p.o})`;
          ctx.fill();
          p.x += p.dx; p.y += p.dy;
          if (p.x < 0 || p.x > innerWidth) p.dx *= -1;
          if (p.y < 0 || p.y > innerHeight) p.dy *= -1;
        });
        requestAnimationFrame(draw);
      }
      draw();
    })();

    // ============ HEADER SCROLL ============
    const header = document.getElementById('mainHeader');
    const backTop = document.getElementById('backTop');
    window.addEventListener('scroll', () => {
      if (scrollY > 60) {
        header.classList.add('scrolled');
        backTop.classList.add('visible');
      } else {
        header.classList.remove('scrolled');
        backTop.classList.remove('visible');
      }
    });

    // ============ MOBILE NAV ============
    function openMobileNav() { document.getElementById('mobileNav').classList.add('open'); }
    function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); }

    // ============ SCROLL REVEAL ============
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // trigger counter if stat
          if (e.target.querySelector('[data-count]')) {
            e.target.querySelectorAll('[data-count]').forEach(el => animateCount(el));
          }
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => observer.observe(el));

    // ============ COUNTERS ============
    function animateCount(el) {
      if (el.dataset.animated) return;
      el.dataset.animated = '1';
      const target = +el.dataset.count;
      const duration = 2000;
      const start = performance.now();
      const inner = el.querySelector('span') || el;
      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        inner.textContent = current.toLocaleString('ar-EG');
        if (progress < 1) requestAnimationFrame(update);
        else inner.textContent = target.toLocaleString('ar-EG');
      }
      requestAnimationFrame(update);
    }

    function initCounters() {
      document.querySelectorAll('[data-count]').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) animateCount(el);
      });
    }

    // Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('[data-count]').forEach(el => animateCount(el));
          const single = e.target;
          if (single.dataset && single.dataset.count) animateCount(single);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));
    document.querySelectorAll('.stat-card, .about-exp-badge').forEach(el => counterObserver.observe(el));

    // ============ BEFORE / AFTER SLIDER ============
    (function initBA() {
      const images  = document.getElementById('baImages');
      const before  = document.getElementById('baBefore');   // clipped layer on top
      const handle  = document.getElementById('baHandle');
      if (!images || !before) return;

      let isDragging = false;

      // pct = percentage from LEFT where the handle sits
      // before-image shows only the RIGHT portion (inset from left = pct%)
      function setPosition(clientX) {
        const rect = images.getBoundingClientRect();
        const pct  = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
        // "قبل" (before) is the RIGHT half → clip everything to the left of the handle
        before.style.clipPath = `inset(0 0 0 ${pct}%)`;
        handle.style.left = pct + '%';
      }

      // Init at 50%
      function initPos() {
        const rect = images.getBoundingClientRect();
        setPosition(rect.left + rect.width * 0.5);
      }

      handle.addEventListener('mousedown',  e => { isDragging = true;  e.preventDefault(); });
      window.addEventListener('mousemove',  e => { if (isDragging) setPosition(e.clientX); });
      window.addEventListener('mouseup',    ()  => { isDragging = false; });

      handle.addEventListener('touchstart', e => { isDragging = true; e.preventDefault(); }, { passive: false });
      window.addEventListener('touchmove',  e => { if (isDragging) setPosition(e.touches[0].clientX); }, { passive: false });
      window.addEventListener('touchend',   () => { isDragging = false; });

      // Wait for layout then initialise
      if (document.readyState === 'complete') initPos();
      else window.addEventListener('load', initPos);
    })();

    // ============ BA FILTER TABS ============
    document.querySelectorAll('.ba-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ba-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        document.querySelectorAll('.ba-card').forEach(card => {
          if (filter === 'all' || card.dataset.type === filter) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // ============ TESTIMONIAL CAROUSEL ============
    (function initCarousel() {
      const track = document.getElementById('testimonialTrack');
      const prevBtn = document.getElementById('prevBtn');
      const nextBtn = document.getElementById('nextBtn');
      const dots = document.querySelectorAll('.dot');
      if (!track) return;

      const cards = Array.from(track.querySelectorAll('.testimonial-card'));
      const total = cards.length;
      let current = 0;
      let autoTimer;

      // How many cards are visible at current viewport
      function visibleCount() {
        const vw = window.innerWidth;
        if (vw <= 640) return 1;
        if (vw <= 1024) return 2;
        return 3;
      }

      // Width of one card + gap
      function stepWidth() {
        if (!cards[0]) return 0;
        const gap = 24;
        return cards[0].offsetWidth + gap;
      }

      // Max index we can scroll to
      function maxIndex() {
        return Math.max(0, total - visibleCount());
      }

      function goTo(i) {
        current = Math.max(0, Math.min(i, maxIndex()));
        // Track is direction:ltr so negative translateX slides left (reveals next cards)
        track.style.transform = `translateX(-${current * stepWidth()}px)`;
        dots.forEach(d => d.classList.remove('active'));
        if (dots[current]) dots[current].classList.add('active');
      }

      // Next = go forward in the list (higher index = slide left)
      // In RTL UI: "next" arrow (‹) on the left moves to newer items
      // prevBtn (›) on the right goes back to earlier items
      function next() { goTo(current < maxIndex() ? current + 1 : 0); }
      function prev() { goTo(current > 0 ? current - 1 : maxIndex()); }

      function startAuto() { autoTimer = setInterval(next, 4500); }
      function stopAuto()  { clearInterval(autoTimer); }

      nextBtn?.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
      prevBtn?.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
      dots.forEach(d => d.addEventListener('click', () => { stopAuto(); goTo(+d.dataset.idx); startAuto(); }));

      // Swipe support
      let touchStartX = 0;
      track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, {passive:true});
      track.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 40) { stopAuto(); diff > 0 ? next() : prev(); startAuto(); }
      }, {passive:true});

      window.addEventListener('resize', () => goTo(current));
      goTo(0);
      startAuto();
    })();

    // ============ BOOKING FORM ============
    function submitBooking(e) {
      e.preventDefault();
      const btn = e.target.querySelector('.btn-book');
      btn.textContent = '⏳ جاري الإرسال...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = '✅ تم الحجز!';
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); btn.textContent = '📅 تأكيد الحجز'; btn.disabled = false; }, 4000);
      }, 1500);
    }

    // ============ FAQ TOGGLE ============
    function toggleFaq(btn) {
      const item = btn.closest('.faq-item');
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    }

    // ============ ARTICLE MODAL DATA ============
    const articles = {
      article1: {
        cat: 'هوليود سمايل',
        title: 'كل ما تريد معرفته عن هوليود سمايل قبل اتخاذ القرار',
        date: '١٥ مايو ٢٠٢٥',
        readTime: '٨ دقائق قراءة',
        body: `
          <p>هوليود سمايل أو ما يُعرف بـ"ابتسامة النجوم" هو أحد أكثر إجراءات تجميل الأسنان انتشاراً في العقد الأخير، ولأسباب وجيهة تماماً. فهو يحول الابتسامة خلال أيام قليلة إلى نسخة مثالية لا تُنسى.</p>
          <h3>ما هو هوليود سمايل بالضبط؟</h3>
          <p>هوليود سمايل هو تركيب قشور خزفية (Porcelain Veneers) رفيعة جداً على سطح الأسنان الأمامية لتغيير شكلها ولونها وحجمها. السُّمك عادةً لا يتجاوز ٠.٥ ملم — أرق من قشرة البصلة — لكنها تُحدث فرقاً درامياً في الابتسامة.</p>
          <h3>خطوات العملية في عيادتنا</h3>
          <ul>
            <li>استشارة أولية مجانية وتصوير رقمي للوجه والأسنان</li>
            <li>تصميم الابتسامة رقمياً بتقنية DSD والذكاء الاصطناعي</li>
            <li>مراجعتك للتصميم وإجراء أي تعديلات تريدها</li>
            <li>جلسة التحضير: طحن خفيف جداً لسطح الأسنان وأخذ القياسات</li>
            <li>تركيب تيجان مؤقتة أثناء تصنيع القشور في المختبر (٣-٥ أيام)</li>
            <li>جلسة التركيب النهائي والتلميع</li>
          </ul>
          <div class="art-tip">💡 <strong>نصيحة الخبراء:</strong> لا تقبل أي عملية هوليود سمايل دون رؤية تصميم رقمي مسبق. هذا حقك وليس رفاهية.</div>
          <h3>كم تدوم القشور الخزفية؟</h3>
          <p>القشور الخزفية عالية الجودة تدوم من ١٠ إلى ٢٠ سنة مع العناية الصحيحة. لون البورسلين لا يتغير ولا يصفر بمرور الوقت، وهو مقاوم للبقع بشكل استثنائي مقارنة بالأسنان الطبيعية.</p>
          <h3>من هو المرشح المثالي؟</h3>
          <ul>
            <li>من يعاني من تلوّن الأسنان الذي لا يستجيب للتبييض</li>
            <li>الأسنان المتشققة أو المكسورة جزئياً</li>
            <li>الأسنان ذات الشكل غير المنتظم أو المتفاوتة الحجم</li>
            <li>الفراغات الصغيرة بين الأسنان</li>
            <li>من يريد تحسيناً جمالياً شاملاً ودائماً</li>
          </ul>
          <h3>العناية بعد التركيب</h3>
          <p>العناية بسيطة جداً: تفريش منتظم، خيط تنظيف يومي، وزيارة دورية كل ٦ أشهر. يُفضّل تجنب عض الأشياء الصلبة جداً مثل الجوز أو فتح الأغطية بالأسنان.</p>
        `
      },
      article2: {
        cat: 'زراعة الأسنان',
        title: 'الدليل الكامل لزراعة الأسنان: فوائدها وأنواعها ومدة صلاحيتها',
        date: '٢ أبريل ٢٠٢٥',
        readTime: '١٠ دقائق قراءة',
        body: `
          <p>زراعة الأسنان هي الثورة الحقيقية في طب الأسنان الحديث. بدلاً من الجسور أو الطقم المتحرك، الآن يمكنك الحصول على سن دائم يبدو ويشعر تماماً كأسنانك الطبيعية.</p>
          <h3>ما هو الزرع السني؟</h3>
          <p>الزرع السني هو برغي من التيتانيوم يُزرع مكان جذر السن المفقود في عظم الفك. بعد أن يلتحم بالعظم خلال ٣-٦ أشهر، يُركَّب عليه تاج خزفي يُماثل شكل الأسنان الطبيعية تماماً.</p>
          <h3>فوائد زراعة الأسنان</h3>
          <ul>
            <li>يدوم مدى الحياة مع العناية الصحيحة</li>
            <li>يحافظ على عظم الفك ويمنع ضموره</li>
            <li>لا يؤثر على الأسنان المجاورة (عكس الجسر)</li>
            <li>نفس قوة وكفاءة الأسنان الطبيعية في المضغ</li>
            <li>لا حاجة لخلعه أو تنظيفه بشكل منفصل</li>
          </ul>
          <h3>أنواع الزراعة في عيادتنا</h3>
          <p><strong>الزراعة الفورية:</strong> تُزرع في نفس جلسة خلع السن أو مباشرة بعدها. توفر الوقت وتُقلل جلسات العلاج.</p>
          <p><strong>الزراعة التقليدية:</strong> تتم بعد التئام موضع الخلع (٦-٨ أسابيع). تُفضَّل في بعض الحالات التي تحتاج لبناء عظم.</p>
          <p><strong>All-on-4 و All-on-6:</strong> حل متكامل للأسنان الكاملة على ٤ أو ٦ زرعات فقط. مثالي لمن فقد معظم أسنانه.</p>
          <div class="art-tip">💡 <strong>هل أنت مرشح للزراعة؟</strong> معظم البالغين الأصحاء مرشحون. نقيّم حالتك بأشعة CBCT ثلاثية مجانية في أول زيارة.</div>
          <h3>مراحل العلاج بالتفصيل</h3>
          <ul>
            <li>فحص شامل وأشعة ثلاثية الأبعاد</li>
            <li>تخطيط الزراعة رقمياً بدقة مايكرونية</li>
            <li>زراعة الجسم التيتانيومي تحت تخدير موضعي</li>
            <li>فترة التئام ٣-٦ أشهر (مع سن مؤقت)</li>
            <li>تركيب التاج النهائي البورسلين</li>
          </ul>
          <h3>مدة الضمان والصيانة</h3>
          <p>نقدم ضماناً يصل إلى ١٠ سنوات على جميع عمليات الزراعة التي نجريها. مع تنظيف نصف سنوي دوري، يمكن للزراعة أن تدوم مدى الحياة فعلياً.</p>
        `
      },
      article3: {
        cat: 'نصائح طبية',
        title: '١٠ عادات يومية تحافظ على أسنانك وتمنع تسوسها للأبد',
        date: '١٨ مارس ٢٠٢٥',
        readTime: '٦ دقائق قراءة',
        body: `
          <p>الوقاية دائماً أفضل وأرخص من العلاج. الخبر الجيد هو أن صحة أسنانك تتحدد بنسبة ٨٠٪ من عاداتك اليومية لا من جيناتك. إليك العادات العشر التي يوصي بها د. جرجس نبيل لكل مرضاه.</p>
          <h3>العادات العشر الذهبية</h3>
          <ul>
            <li><strong>فرشاة مرتين يومياً بالتقنية الصحيحة:</strong> زاوية ٤٥ درجة باتجاه اللثة، حركات دائرية لطيفة، مدة لا تقل عن دقيقتين.</li>
            <li><strong>خيط تنظيف يومي إلزامي:</strong> الفرشاة تنظف ٦٠٪ فقط من سطح السن. الخيط يصل للـ٤٠٪ الباقية بين الأسنان.</li>
            <li><strong>غسول الفم مرة يومياً:</strong> يقتل البكتيريا المتبقية ويحمي اللثة. اختر غسولاً يحتوي على الفلوريد.</li>
            <li><strong>اشرب الماء بعد كل وجبة:</strong> يغسل بقايا الطعام ويوازن حموضة الفم دون الحاجة للفرشاة في كل مرة.</li>
            <li><strong>قلل السكريات والمشروبات الغازية:</strong> البكتيريا تتغذى على السكر وتُنتج حامضاً يُذيب المينا.</li>
          </ul>
          <div class="art-tip">💡 <strong>حقيقة مهمة:</strong> المشروبات الغازية الـ"دايت" لا تحتوي سكراً لكنها حمضية بنفس القدر وتُضر بالمينا.</div>
          <ul>
            <li><strong>لا تفرش أسنانك مباشرة بعد الأكل:</strong> انتظر ٣٠ دقيقة على الأقل، خصوصاً بعد الحمضيات، لتعود صلابة المينا.</li>
            <li><strong>كل الأطعمة المقوية للأسنان:</strong> الجبن واللبن والخضروات المقرمشة والمكسرات كلها تقوي الأسنان وتحفز اللعاب.</li>
            <li><strong>غيّر فرشاتك كل ٣ أشهر:</strong> الألياف المتهالكة لا تُنظف بشكل صحيح وتحمل البكتيريا.</li>
            <li><strong>ابتعد عن التدخين تماماً:</strong> يسبب أمراض اللثة والتلوين والسرطان. لا يوجد مستوى آمن للتدخين بالنسبة للأسنان.</li>
            <li><strong>زيارة الطبيب كل ٦ أشهر:</strong> الكشف المبكر يوفر عليك الوقت والمال والألم. كثير من المشاكل لها حل بسيط إذا اكتُشفت مبكراً.</li>
          </ul>
          <h3>متى تزور الطبيب فوراً؟</h3>
          <p>لا تتجاهل: ألم مستمر، حساسية مفاجئة للحرارة، نزيف اللثة عند التفريش، تورم، أو تغير في لون سن ما. هذه إشارات إنذار مبكر لا يجب تأجيلها.</p>
        `
      },
      article4: {
        cat: 'تبييض الأسنان',
        title: 'تبييض الأسنان بالليزر مقابل التبييض المنزلي: أيهما أفضل؟',
        date: '٥ مارس ٢٠٢٥',
        readTime: '٧ دقائق قراءة',
        body: `
          <p>سوق تبييض الأسنان يزخر بالخيارات من معجون الأسنان "المُبيِّض" حتى الليزر الطبي المتخصص. لكن ما الفرق الحقيقي؟ وما الذي يناسب حالتك بالتحديد؟</p>
          <h3>أنواع تبييض الأسنان</h3>
          <p><strong>١. تبييض الليزر في العيادة:</strong> أسرع وأقوى الطرق. يُستخدم جيل مركّز من البيروكسيد مع ضوء ليزر أو LED يُنشّط المادة الفعالة. النتيجة: ٦-٨ درجات أفتح في جلسة واحدة تتراوح بين ٦٠-٩٠ دقيقة.</p>
          <p><strong>٢. طوارق التبييض المنزلية:</strong> نصنع لك قالباً مخصصاً لأسنانك وتُعطى جيل تبييض تضعه لساعات معينة يومياً لمدة ٢-٤ أسابيع. النتيجة أبطأ لكن ممتازة.</p>
          <p><strong>٣. أشرطة التبييض الجاهزة:</strong> أرخص لكن أقل فعالية وقد لا تناسب شكل أسنانك تماماً مما يؤدي لنتائج غير منتظمة.</p>
          <div class="art-tip">⚠️ <strong>تحذير:</strong> كريمات وأعشاب "التبييض" المعروضة في مواقع التواصل ليست خاضعة لأي رقابة طبية وبعضها يُتلف المينا بشكل دائم.</div>
          <h3>مقارنة شاملة</h3>
          <ul>
            <li><strong>السرعة:</strong> الليزر يوم واحد — المنزلي ٢-٤ أسابيع</li>
            <li><strong>درجة التبييض:</strong> الليزر أقوى بمراحل</li>
            <li><strong>المدة:</strong> كلاهما يدوم ١-٣ سنوات مع الاهتمام</li>
            <li><strong>الحساسية:</strong> الليزر قد يسبب حساسية مؤقتة ٢٤-٤٨ ساعة</li>
            <li><strong>التكلفة:</strong> الليزر أعلى لكن النتيجة أسرع وأوضح</li>
          </ul>
          <h3>من يستفيد أكثر من التبييض؟</h3>
          <p>التبييض يعمل على التلونات الخارجية (القهوة والشاي والتدخين والأطعمة). لا يعمل على التيجان والقشور الخزفية أو على التلون الداخلي الناتج عن بعض المضادات الحيوية. في الاستشارة نُحدد لك ما إذا كان التبييض هو الحل المناسب لحالتك.</p>
        `
      },
      article5: {
        cat: 'صحة الأطفال',
        title: 'متى يبدأ طفلك بزيارة طبيب الأسنان؟ دليل الآباء الكامل',
        date: '١٢ فبراير ٢٠٢٥',
        readTime: '٨ دقائق قراءة',
        body: `
          <p>كثير من الآباء ينتظرون ظهور مشكلة قبل زيارة طبيب الأسنان. لكن الطب الحديث يؤكد أن الوقاية تبدأ من السنة الأولى. إليك دليلك الكامل بالمراحل العمرية.</p>
          <h3>أول زيارة: متى؟</h3>
          <p>توصي الجمعية المصرية لطب أسنان الأطفال بالزيارة الأولى عند ظهور أول سن للطفل أو في عمر سنة على أبعد تقدير. الهدف ليس العلاج بل التعوّد على البيئة وإرشاد الوالدين.</p>
          <h3>المراحل العمرية وما يهم في كل منها</h3>
          <ul>
            <li><strong>٠-٢ سنة:</strong> تنظيف اللثة بقطعة قماش رطبة. عند ظهور أول سن، فرشاة ناعمة جداً بدون معجون.</li>
            <li><strong>٢-٣ سنوات:</strong> معجون بحجم حبة الأرز. علّم طفلك بمثالك. تجنب زجاجة الحليب أثناء النوم تماماً.</li>
            <li><strong>٣-٦ سنوات:</strong> معجون بحجم حبة البازلاء. الزيارة كل ٦ أشهر للفحص والتنظيف ووضع الفيلم الواقي على الأضراس.</li>
            <li><strong>٦-١٢ سنة:</strong> مرحلة التحول للأسنان الدائمة. متابعة دقيقة لكل سن جديد ومراقبة الفراغات والانتظام.</li>
            <li><strong>١٢+ سنة:</strong> تقييم الحاجة للتقويم. هذا الوقت المثالي للبدء قبل اكتمال نمو الفك.</li>
          </ul>
          <div class="art-tip">💡 <strong>نصيحة ذهبية:</strong> الطفل الذي يزور طبيب الأسنان دورياً لن يخاف منه. الخوف يُصنع من التأجيل والانتظار حتى الألم.</div>
          <h3>أشياء يجب تجنبها تماماً</h3>
          <ul>
            <li>مشاركة الملاعق مع طفلك (تنقل البكتيريا من فمك لفمه)</li>
            <li>تهدئة الطفل بالعصير أو الحليب في زجاجة أثناء النوم</li>
            <li>تأخير علاج أسنان اللبن لأنها "ستسقط أصلاً"</li>
            <li>مكافأة الطفل بالحلوى بعد زيارة الطبيب!</li>
          </ul>
          <p>عيادتنا مجهزة خصيصاً لاستقبال الأطفال بأجواء ودية وطاقم متخصص في التعامل مع الأطفال خاصة الخائفين منهم.</p>
        `
      },
      article6: {
        cat: 'علاج الألم',
        title: 'ألم الأسنان المفاجئ: أسبابه وكيف تتعامل معه فوراً',
        date: '٢٨ يناير ٢٠٢٥',
        readTime: '٥ دقائق قراءة',
        body: `
          <p>ألم الأسنان المفاجئ من أشد أنواع الألم التي يمكن أن يمر بها الإنسان. المشكلة أنه عادةً يضرب في أسوأ وقت ممكن — ليلاً، في عطلة، أو قبل حدث مهم. إليك ما يجب فعله.</p>
          <h3>الأسباب الأكثر شيوعاً</h3>
          <ul>
            <li><strong>التسوس العميق:</strong> عندما يصل للعصب يسبب ألماً حاداً مستمراً أو متقطعاً</li>
            <li><strong>التهاب العصب:</strong> يستجيب للحرارة والبرودة بشكل مبالغ وقد يستيقظك من النوم</li>
            <li><strong>خراج الأسنان:</strong> تورم مؤلم ينشأ من عدوى بكتيرية — يحتاج علاجاً فورياً</li>
            <li><strong>كسر أو تشقق في السن:</strong> ألم حاد عند المضغ أو لمس السن</li>
            <li><strong>التهاب اللثة الحاد:</strong> احمرار ونزيف وألم عند المضغ</li>
            <li><strong>بزوغ ضرس العقل:</strong> ألم في الجزء الخلفي من الفك يصاحبه أحياناً صعوبة في الفتح</li>
          </ul>
          <div class="art-tip">🚨 <strong>اتصل فوراً إذا:</strong> كان معك تورم في الوجه أو الرقبة، أو حرارة مرتفعة مع ألم الأسنان — هذه إشارة لعدوى خطيرة تحتاج علاجاً عاجلاً.</div>
          <h3>ما يمكن فعله ريثما تصل للطبيب</h3>
          <ul>
            <li>مسكن ألم (إيبوبروفين أفضل للألم السني من الباراسيتامول)</li>
            <li>مضمضة بماء دافئ مملّح لتهدئة الالتهاب</li>
            <li>قرنفل (جاويش) مطحون على موضع الألم — له تأثير مخدر طبيعي</li>
            <li>كيس ثلج من الخارج على الخد — لا تضع ثلجاً داخل الفم</li>
            <li>تجنب الطعام الساخن والبارد والحلو حتى الكشف</li>
          </ul>
          <h3>ما يجب تجنبه تماماً</h3>
          <ul>
            <li>وضع الأسبرين مباشرة على السن أو اللثة (يُسبب حرقاً للأنسجة)</li>
            <li>المضغ من جهة الألم</li>
            <li>تأجيل زيارة الطبيب أكثر من يوم أو يومين</li>
          </ul>
          <p>في عيادتنا نخصص مواعيد طارئة لحالات الطوارئ السنية. تواصل معنا على الواتساب وسنوفر لك موعداً في أقرب وقت ممكن.</p>
        `
      }
    };

    function openArticle(id) {
      const art = articles[id];
      if (!art) return;
      const modal = document.getElementById('articleModal');
      document.getElementById('articleContent').innerHTML = `
        <span class="art-cat">${art.cat}</span>
        <h2>${art.title}</h2>
        <div class="art-meta">
          <span>📅 ${art.date}</span>
          <span>⏱ ${art.readTime}</span>
          <span>✍️ د. جرجس نبيل</span>
        </div>
        <div class="art-body">${art.body}</div>
      `;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function closeArticle() {
      document.getElementById('articleModal').classList.remove('open');
      document.body.style.overflow = '';
    }
    function closeArticleIfOutside(e) {
      if (e.target === document.getElementById('articleModal')) closeArticle();
    }
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeArticle(); });
    document.querySelectorAll('[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // ============ MOUSE PARALLAX ON HERO ============
    document.addEventListener('mousemove', e => {
      const glow1 = document.querySelector('.hero-glow-1');
      const glow2 = document.querySelector('.hero-glow-2');
      if (!glow1) return;
      const xP = (e.clientX / innerWidth - 0.5) * 20;
      const yP = (e.clientY / innerHeight - 0.5) * 20;
      glow1.style.transform = `translate(${xP}px, ${yP}px) scale(1)`;
      glow2.style.transform = `translate(${-xP * 0.6}px, ${-yP * 0.6}px) scale(1)`;
    });
  


  const Lightbox = (() => {
    let currentIdx = 0;
    let images = [];

    function open(idx) {
      const lightbox = $('#lightbox');
      const img = $('#lightboxImg');
      if (!lightbox || !img || !images.length) return;
      currentIdx = idx;
      img.src = images[currentIdx];
      img.alt = `صورة ${currentIdx + 1}`;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      const lightbox = $('#lightbox');
      if (!lightbox) return;
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
    }
    function next() {
      if (!images.length) return;
      currentIdx = (currentIdx + 1) % images.length;
      $('#lightboxImg').src = images[currentIdx];
    }
    function prev() {
      if (!images.length) return;
      currentIdx = (currentIdx - 1 + images.length) % images.length;
      $('#lightboxImg').src = images[currentIdx];
    }
    function init() {
      const items = $$('.gallery-item');
      if (!items.length) return;
      images = items.map(item => item.querySelector('img')?.src).filter(Boolean);

      items.forEach((item, idx) => {
        item.addEventListener('click', () => open(idx));
      });

      $('#lightboxClose')?.addEventListener('click', close);
      $('#lightboxNext')?.addEventListener('click', next);
      $('#lightboxPrev')?.addEventListener('click', prev);
      $('#lightbox')?.addEventListener('click', e => {
        if (e.target.id === 'lightbox') close();
      });
      document.addEventListener('keydown', e => {
        if (!$('#lightbox')?.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') next();
        if (e.key === 'ArrowRight') prev();
      });
    }
    return { init };
  })();