/**
 * app.js
 * Single bundled script (no ES modules) so the site runs directly from the
 * filesystem via file:// — double-click index.html and everything works,
 * no local server required. This file is components.js + data/blog-articles.js
 * + pages/home.js + main.js concatenated, with import/export removed.
 * Icon <use> hrefs are fragment-only (#icon-x) since the sprite is inlined
 * directly in index.html rather than loaded from a separate file.
 *
 * SOURCE OF TRUTH: the individual files under js/ (components.js,
 * data/blog-articles.js, pages/home.js, main.js) are kept for readability.
 * If you edit one of them, regenerate this bundle from those four files
 * (concatenate in that order, strip import/export lines).
 */

/**
 * blog-articles.js
 * Full-length content for each blog post card, keyed by the same id used in
 * the card's `data-article` attribute. Consumed by initArticleModal() in
 * components.js to populate the article-reader modal.
 */
const BLOG_ARTICLES = {
  "hollywood-smile": {
    title: "كل ما تريد معرفته عن هوليود سمايل قبل اتخاذ القرار",
    meta: "١٥ مايو ٢٠٢٥ · ٨ دقائق قراءة · هوليود سمايل",
    bodyHTML: `
      <p>
        أصبح مصطلح "هوليوود سمايل" شائعًا جدًا في السنوات الأخيرة، ويقصد به الحصول على ابتسامة متناسقة
        وبيضاء بشكل موحّد يشبه ابتسامات نجوم السينما. لكن قبل حجز موعدك الأول، من المهم أن تفهم ما
        تتضمنه العملية فعليًا، ولمن تناسب، وما هي البدائل المتاحة.
      </p>
      <h3>ما هو هوليوود سمايل؟</h3>
      <p>
        هو مصطلح تسويقي وليس اسم إجراء طبي واحد، ويشير غالبًا إلى تركيب قشور تجميلية رفيعة (Veneers) أو
        لومينير على الأسنان الأمامية لتغيير شكلها ولونها وترتيبها في جلسات محدودة، بدلاً من الاعتماد على
        تقويم الأسنان التقليدي الذي يستغرق شهورًا أو سنوات.
      </p>
      <h3>خطوات العملية</h3>
      <ol>
        <li>استشارة أولية وتصوير الأسنان لتقييم صحة اللثة والمينا قبل الموافقة على أي إجراء.</li>
        <li>برد طبقة رقيقة جدًا من سطح السن لتهيئته لاستقبال القشرة التجميلية.</li>
        <li>تركيب قشور مؤقتة لحين تجهيز القشور الدائمة في المعمل.</li>
        <li>تثبيت القشور النهائية وضبط اللون والشكل بما يتناسب مع ملامح الوجه.</li>
      </ol>
      <div class="article-tip">
        نصيحة: هوليوود سمايل ليس مناسبًا للجميع. إذا كانت لديك مشاكل نشطة في اللثة أو تسوس غير معالَج،
        يجب علاج ذلك أولًا. استشر طبيب أسنان مختص قبل اتخاذ القرار النهائي.
      </div>
      <h3>كم تدوم النتيجة؟</h3>
      <p>
        تدوم القشور التجميلية عالية الجودة عادة من ١٠ إلى ١٥ عامًا مع العناية المناسبة، وتشمل هذه العناية
        تجنب قضم الأشياء الصلبة بالأسنان الأمامية، واستخدام واقٍ ليلي إذا كنت تعاني من صرير الأسنان،
        والمتابعة الدورية مع طبيبك لفحص حالة القشور واللثة المحيطة بها.
      </p>
    `,
  },

  "dental-implants": {
    title: "الدليل الكامل لزراعة الأسنان: فوائدها وأنواعها ومدة صلاحيتها",
    meta: "٢ أبريل ٢٠٢٥ · ١٠ دقائق قراءة · زراعة الأسنان",
    bodyHTML: `
      <p>
        فقدان سن أو أكثر لا يؤثر فقط على المظهر، بل على القدرة على المضغ ونطق الحروف، وقد يؤدي مع الوقت
        إلى فقدان كثافة عظم الفك في تلك المنطقة. تُعد زراعة الأسنان اليوم من أكثر الحلول ثباتًا وطبيعية
        لتعويض الأسنان المفقودة.
      </p>
      <h3>كيف تعمل زراعة الأسنان؟</h3>
      <p>
        تعتمد الزراعة على ثبيت جذر صناعي مصنوع من التيتانيوم داخل عظم الفك، ليندمج معه تدريجيًا في عملية
        تُعرف طبيًا بالاندماج العظمي (Osseointegration)، ثم يُركَّب فوقه تاج خزفي مطابق للون وشكل بقية
        الأسنان الطبيعية.
      </p>
      <h3>أنواع الزراعة</h3>
      <ul>
        <li><strong>الزراعة التقليدية:</strong> يُركَّب الغرس أولًا وتُترك فترة التئام قبل تركيب التاج.</li>
        <li><strong>الزراعة الفورية:</strong> يُركَّب التاج المؤقت في نفس جلسة الزراعة عند توفر الشروط المناسبة.</li>
        <li><strong>All-on-4 / All-on-6:</strong> حل لتعويض فك كامل بعدد محدود من الغرسات يحمل جسرًا ثابتًا.</li>
      </ul>
      <div class="article-tip">
        نصيحة: تحديد النوع المناسب يعتمد على كثافة عظم الفك وحالة اللثة، ويُقيَّم ذلك عادة بأشعة ثلاثية
        الأبعاد (CBCT) قبل وضع خطة العلاج النهائية.
      </div>
      <h3>مدة الصلاحية والعناية</h3>
      <p>
        مع العناية الجيدة والمتابعة الدورية، يمكن لغرسة الأسنان أن تدوم ١٥ عامًا أو أكثر، وفي كثير من
        الحالات مدى الحياة، بينما قد يحتاج التاج الخزفي نفسه إلى استبدال بعد ١٠ إلى ١٥ عامًا نتيجة
        الاستخدام اليومي. تنظيف الغرسة بالفرشاة والخيط الطبي مثل أي سن طبيعي هو المفتاح لإطالة عمرها.
      </p>
    `,
  },

  "daily-habits": {
    title: "١٠ عادات يومية تحافظ على أسنانك وتمنع تسوسها",
    meta: "١٨ مارس ٢٠٢٥ · ٦ دقائق قراءة · نصائح طبية",
    bodyHTML: `
      <p>
        معظم مشاكل الأسنان الشائعة مثل التسوس والتهاب اللثة يمكن الوقاية منها بعادات يومية بسيطة. إليك
        أهم عشر عادات ينصح بها أطباء الأسنان للحفاظ على صحة فمك على المدى الطويل.
      </p>
      <ol>
        <li>نظّف أسنانك مرتين يوميًا على الأقل بمعجون يحتوي على الفلورايد.</li>
        <li>استخدم الخيط الطبي يوميًا للوصول إلى ما بين الأسنان حيث لا تصل الفرشاة.</li>
        <li>غيّر فرشاة الأسنان كل ثلاثة أشهر أو عند تآكل شعيراتها.</li>
        <li>قلّل من المشروبات والوجبات الخفيفة الغنية بالسكر خلال اليوم.</li>
        <li>اشرب الماء بعد الوجبات للمساعدة على غسل بقايا الطعام.</li>
        <li>تجنّب استخدام أسنانك لفتح العبوات أو قضم الأشياء الصلبة.</li>
        <li>استخدم غسول فم مضاد للبكتيريا إذا نصحك به طبيبك.</li>
        <li>لا تُهمل تنظيف اللسان، فهو مصدر رئيسي لرائحة الفم الكريهة.</li>
        <li>راقب علامات التهاب اللثة مثل النزيف أو الاحمرار عند التنظيف.</li>
        <li>احجز فحصًا ونظافة احترافية لدى طبيب الأسنان كل ستة أشهر.</li>
      </ol>
      <div class="article-tip">
        تذكير: الفحص الدوري كل ستة أشهر يساعد على اكتشاف التسوس أو مشاكل اللثة في مرحلة مبكرة، قبل أن
        تتحول إلى علاج أكثر تعقيدًا وتكلفة.
      </div>
      <p>
        تبنّي هذه العادات لا يتطلب وقتًا أو جهدًا كبيرًا، لكنه يوفر عليك لاحقًا الكثير من الألم والزيارات
        العلاجية غير الضرورية.
      </p>
    `,
  },

  "whitening-comparison": {
    title: "تبييض الأسنان بالليزر مقابل التبييض المنزلي: أيهما أفضل؟",
    meta: "٥ مارس ٢٠٢٥ · ٧ دقائق قراءة · تبييض الأسنان",
    bodyHTML: `
      <p>
        اصفرار الأسنان أمر طبيعي مع التقدم في العمر وتناول القهوة والشاي والتدخين، ويوجد اليوم طريقتان
        رئيسيتان للتبييض: الجلسة الاحترافية في العيادة، أو المنتجات المنزلية. لكل منهما مميزاته وحدوده.
      </p>
      <h3>التبييض بالليزر في العيادة</h3>
      <p>
        يعتمد على مادة تبييض بتركيز أعلى يُفعَّل أحيانًا بضوء ليزر خاص، تحت إشراف طبيب الأسنان مباشرة.
        النتائج تظهر عادة خلال جلسة واحدة، مع حماية اللثة من التهيج بواسطة حاجز واقٍ، وهو الخيار الأنسب
        لمن يريد نتيجة سريعة وملحوظة قبل مناسبة معينة.
      </p>
      <h3>التبييض المنزلي</h3>
      <p>
        يشمل قوالب مخصصة تُصنع حسب مقاس أسنانك أو شرائط تبييض جاهزة، وتُستخدم يوميًا لفترة أسابيع بتركيز
        أقل أمانًا للاستخدام دون إشراف مباشر. التكلفة أقل، لكن النتيجة أبطأ وتحتاج التزامًا يوميًا للوصول
        لنفس درجة البياض.
      </p>
      <div class="article-tip">
        نصيحة: حساسية الأسنان المؤقتة بعد التبييض أمر شائع في كلتا الطريقتين. أخبر طبيبك إذا كانت لديك
        حساسية موجودة مسبقًا حتى يختار لك التركيز والمدة المناسبة.
      </div>
      <h3>أيهما تختار؟</h3>
      <p>
        إذا كنت تبحث عن نتيجة سريعة وأكثر أمانًا لحساسية الأسنان، فالجلسة الاحترافية هي الخيار الأفضل.
        أما إذا كان وقتك مرنًا وميزانيتك محدودة، فالتبييض المنزلي تحت إشراف الطبيب خيار فعّال أيضًا. في
        الحالتين، استشارة طبيب الأسنان أولًا تضمن اختيار الطريقة الأنسب لحالة مينا أسنانك.
      </p>
    `,
  },

  "kids-first-visit": {
    title: "متى يبدأ طفلك بزيارة طبيب الأسنان؟ دليل الآباء الكامل",
    meta: "١٢ فبراير ٢٠٢٥ · ٥ دقائق قراءة · صحة الأطفال",
    bodyHTML: `
      <p>
        كثير من الآباء يؤجلون أول زيارة لطبيب أسنان الطفل حتى ظهور مشكلة واضحة، لكن الزيارة المبكرة هي
        في الواقع خطوة وقائية أكثر من كونها علاجية، وتُبنى فيها علاقة إيجابية بين الطفل وعيادة الأسنان
        منذ البداية.
      </p>
      <h3>متى تكون أول زيارة؟</h3>
      <p>
        يُنصح عمومًا بأن تكون الزيارة الأولى مع ظهور أول سن لبني، أو في موعد لا يتجاوز عيد ميلاد الطفل
        الأول، أيهما أقرب. هذا التوقيت يتيح لطبيب الأسنان متابعة نمو الأسنان مبكرًا وتقديم إرشادات
        العناية المناسبة لعمر الطفل.
      </p>
      <h3>كيف تحضّر طفلك؟</h3>
      <ul>
        <li>استخدم كلمات إيجابية وبسيطة عند الحديث عن الزيارة، وتجنّب كلمات مخيفة.</li>
        <li>اختر موعدًا صباحيًا يكون فيه الطفل مرتاحًا وغير متعب.</li>
        <li>يمكنك اصطحابه معك في زيارتك أنت أولًا ليتعرف على المكان دون ضغط.</li>
        <li>اختر عيادة أو طبيبًا لديه خبرة في التعامل مع الأطفال تحديدًا.</li>
      </ul>
      <div class="article-tip">
        نصيحة: تجنّب كلمات مثل "إبرة" أو "ألم" قبل الزيارة، فهي غالبًا ما تزرع قلقًا غير ضروري لدى الطفل
        حتى لو لم يكن هناك أي إجراء مؤلم مخطط له.
      </div>
      <h3>العناية بأسنان الأطفال في المنزل</h3>
      <p>
        نظّف أسنان طفلك مرتين يوميًا بمعجون يحتوي على الفلورايد بكمية لا تتجاوز حجم حبة الأرز للأطفال
        الصغار، وأشرف على تفريشه بنفسه حتى يبلغ من العمر ما يكفي لإتقانها بمفرده عادة حوالي السابعة أو
        الثامنة. قلّل من الوجبات والمشروبات السكرية، خاصة قبل النوم.
      </p>
    `,
  },

  "sudden-toothache": {
    title: "ألم الأسنان المفاجئ: أسبابه وكيف تتعامل معه فوراً",
    meta: "٢٨ يناير ٢٠٢٥ · ٤ دقائق قراءة · علاج الألم",
    bodyHTML: `
      <p>
        ألم الأسنان المفاجئ من أكثر المواقف إزعاجًا لأنه غالبًا يبدأ دون سابق إنذار. معرفة السبب المحتمل
        والخطوات الأولية الصحيحة تساعدك على تخفيف الألم ريثما تصل إلى طبيب الأسنان.
      </p>
      <h3>الأسباب الشائعة</h3>
      <ul>
        <li>تسوس وصل إلى الطبقة الداخلية الحساسة من السن.</li>
        <li>كسر أو شرخ في السن غير ظاهر بوضوح للعين.</li>
        <li>التهاب أو خراج في اللثة أو جذر السن.</li>
        <li>احتقان الجيوب الأنفية الذي قد يُشعر بألم يشبه ألم الأسنان العلوية.</li>
      </ul>
      <h3>خطوات إسعافية أولى يمكنك اتخاذها فورًا</h3>
      <ol>
        <li>اغسل فمك بماء دافئ مخلوط بقليل من الملح للمساعدة على التطهير.</li>
        <li>استخدم الخيط الطبي بلطف للتأكد من عدم وجود بقايا طعام عالقة تسبب الضغط.</li>
        <li>ضع كمادة باردة على الخد من الخارج، وليس مباشرة على السن أو اللثة.</li>
        <li>يمكن تناول مسكّن ألم متوفر دون وصفة طبية حسب الإرشادات المكتوبة على العبوة.</li>
        <li>تجنّب الأطعمة والمشروبات شديدة السخونة أو البرودة أو الحلاوة مؤقتًا.</li>
      </ol>
      <div class="article-tip">
        تصحيح معلومة شائعة: لا تضع قرص أسبرين مباشرة على اللثة أو السن المؤلم، فهذا لا يخفف الألم وقد
        يسبب حرقًا في أنسجة اللثة المحيطة.
      </div>
      <h3>متى تحتاج رعاية طارئة؟</h3>
      <p>
        إذا صاحب الألم تورم في الوجه، أو حمى، أو صعوبة في البلع أو التنفس، فهذه علامات تستدعي التوجه
        فورًا لأقرب طوارئ. أما في الحالات الأخرى، فاحجز موعدًا مع طبيب الأسنان في أقرب وقت ممكن لتحديد
        السبب الدقيق وعلاجه قبل أن يتفاقم.
      </p>
    `,
  },
};

/**
 * components.js
 * Reusable, self-contained UI component behaviors shared across the page:
 *   - Header: scroll shadow, mobile menu, active-section highlighting
 *   - Floating actions: scroll-to-top visibility + smooth scroll
 *   - Accordion: single-open FAQ accordion
 *   - Gallery lightbox: click-to-enlarge modal
 *   - Article modal: click a blog post card to read the full article
 */

/* --------------------------------------------------------------------------
   Header — sticky shadow, mobile menu, scroll-spy active link
   -------------------------------------------------------------------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const toggle = header.querySelector(".site-header__toggle");
  const mobileNav = header.querySelector(".site-header__mobile-nav");
  const navLinks = header.querySelectorAll("[data-nav-link]");

  // Shadow / border once the page scrolls past the top.
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu open/close.
  if (toggle && mobileNav) {
    const closeMenu = () => {
      toggle.setAttribute("aria-expanded", "false");
      mobileNav.classList.remove("is-open");
    };

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      mobileNav.classList.toggle("is-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));

    // Collapse the mobile menu automatically when resizing up to desktop.
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) closeMenu();
    });

    // Escape closes the menu too, matching the lightbox/article modal.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    });

    // Clicking anywhere outside the open menu (and outside the toggle
    // button itself, which has its own click handler above) closes it.
    document.addEventListener("click", (event) => {
      if (!mobileNav.classList.contains("is-open")) return;
      if (mobileNav.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });
  }

  // Highlight the nav link matching the section currently in view.
  const sectionIds = [
    ...new Set(
      Array.from(navLinks)
        .map((link) => link.getAttribute("href"))
        .filter((href) => href && href.startsWith("#"))
        .map((href) => href.slice(1)),
    ),
  ];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

  if (sections.length) {
    const setActive = (id) => {
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActive(mostVisible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.01, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
  }
}

/* --------------------------------------------------------------------------
   Floating actions — back-to-top + WhatsApp shortcut
   -------------------------------------------------------------------------- */
function initFloatingActions() {
  const topButton = document.querySelector(".floating-actions__top");
  if (!topButton) return;

  const onScroll = () => {
    topButton.classList.toggle("is-visible", window.scrollY > 400);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  topButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* --------------------------------------------------------------------------
   Accordion — single-open FAQ list
   -------------------------------------------------------------------------- */
function initAccordion(container = document) {
  const items = container.querySelectorAll(".accordion-item");
  if (!items.length) return;

  const collapse = (content) => {
    content.style.height = `${content.scrollHeight}px`;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.style.height = "0px";
      });
    });
  };

  const expand = (content) => {
    content.style.height = `${content.scrollHeight}px`;
  };

  items.forEach((item) => {
    const trigger = item.querySelector(".accordion-trigger");
    const content = item.querySelector(".accordion-content");
    if (!trigger || !content) return;

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      items.forEach((other) => {
        const otherTrigger = other.querySelector(".accordion-trigger");
        const otherContent = other.querySelector(".accordion-content");
        if (!otherTrigger || !otherContent) return;
        if (otherTrigger.getAttribute("aria-expanded") === "true") {
          otherTrigger.setAttribute("aria-expanded", "false");
          collapse(otherContent);
        }
      });

      if (!isOpen) {
        trigger.setAttribute("aria-expanded", "true");
        expand(content);
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Compare sliders — drag-to-compare before/after images
   -------------------------------------------------------------------------- */
function initCompareSliders() {
  const sliders = document.querySelectorAll("[data-compare-slider]");
  if (!sliders.length) return;

  sliders.forEach((slider) => {
    const range = slider.querySelector(".compare-slider__range");
    if (!range) return;

    const update = () => {
      slider.style.setProperty("--pos", range.value);
    };

    update();
    range.addEventListener("input", update);
  });
}

/* --------------------------------------------------------------------------
   Compare filters — tab buttons that filter the before/after gallery
   -------------------------------------------------------------------------- */
function initCompareFilters() {
  const filterBar = document.querySelector(".compare-filters");
  const cards = document.querySelectorAll(".compare-card");
  if (!filterBar || !cards.length) return;

  const buttons = filterBar.querySelectorAll(".compare-filter");
  const emptyMessage = document.querySelector(".compare-empty");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      buttons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("is-active", isActive);
        btn.setAttribute("aria-selected", String(isActive));
      });

      let visibleCount = 0;
      cards.forEach((card) => {
        const matches = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !matches);
        if (matches) visibleCount += 1;
      });

      if (emptyMessage) emptyMessage.hidden = visibleCount > 0;
    });
  });
}

/* --------------------------------------------------------------------------
   Gallery lightbox — click a thumbnail to view it enlarged
   -------------------------------------------------------------------------- */
function initGalleryLightbox() {
  const lightbox = document.getElementById("lightbox");
  const triggers = document.querySelectorAll("[data-lightbox-trigger]");
  if (!lightbox || !triggers.length) return;

  const image = lightbox.querySelector(".lightbox__image");
  let lastFocused = null;

  const openLightbox = (src, alt) => {
    lastFocused = document.activeElement;
    image.src = src;
    image.alt = alt;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    image.src = "";
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openLightbox(trigger.dataset.fullSrc, trigger.dataset.title || "");
    });
  });

  lightbox.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
}

/* --------------------------------------------------------------------------
   Testimonials carousel — arrow nav, dot pagination, and drag/swipe
   -------------------------------------------------------------------------- */
function initTestimonialsCarousel() {
  const root = document.querySelector("[data-testimonials-carousel]");
  if (!root) return;

  const viewport = root.querySelector(".testimonials-viewport");
  const track = root.querySelector(".testimonials-track");
  const cards = Array.from(track.children);
  const prevBtn = root.querySelector(".testimonials-nav--prev");
  const nextBtn = root.querySelector(".testimonials-nav--next");
  const dotsWrap = root.querySelector(".testimonials-dots");
  if (!cards.length) return;

  let index = 0;
  let maxIndex = 0;
  let step = 0; // px per slide (card width + gap)

  const gapPx = () => parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || "0");

  const measure = () => {
    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = gapPx();
    step = cardWidth + gap;
    const perView = Math.max(1, Math.round((viewport.clientWidth + gap) / step));
    maxIndex = Math.max(0, cards.length - perView);
    index = Math.min(index, maxIndex);
    buildDots();
    render();
  };

  const buildDots = () => {
    dotsWrap.innerHTML = "";
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonials-dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-selected", String(i === index));
      dot.setAttribute("aria-label", `الانتقال إلى المجموعة ${i + 1}`);
      dot.addEventListener("click", () => {
        index = i;
        render();
      });
      dotsWrap.appendChild(dot);
    }
  };

  const render = () => {
    // RTL: the first card sits at the visual right edge, so revealing later
    // (further-left) cards means shifting the track rightward — positive translateX.
    track.style.transform = `translateX(${index * step}px)`;
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === maxIndex;
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
      dot.setAttribute("aria-selected", String(i === index));
    });
  };

  prevBtn?.addEventListener("click", () => {
    index = Math.max(0, index - 1);
    render();
  });

  nextBtn?.addEventListener("click", () => {
    index = Math.min(maxIndex, index + 1);
    render();
  });

  // Drag / swipe support (mouse + touch via pointer events).
  let dragStartX = null;
  let dragDelta = 0;

  viewport.addEventListener("pointerdown", (event) => {
    dragStartX = event.clientX;
    dragDelta = 0;
    track.style.transition = "none";
    viewport.setPointerCapture(event.pointerId);
  });

  viewport.addEventListener("pointermove", (event) => {
    if (dragStartX === null) return;
    dragDelta = event.clientX - dragStartX;
    track.style.transform = `translateX(${index * step + dragDelta}px)`;
  });

  const endDrag = () => {
    if (dragStartX === null) return;
    track.style.transition = "";
    const threshold = step * 0.2;
    if (dragDelta > threshold) index = Math.max(0, index - 1);
    else if (dragDelta < -threshold) index = Math.min(maxIndex, index + 1);
    dragStartX = null;
    dragDelta = 0;
    render();
  };

  viewport.addEventListener("pointerup", endDrag);
  viewport.addEventListener("pointercancel", endDrag);
  viewport.addEventListener("pointerleave", () => {
    if (dragStartX !== null) endDrag();
  });

  window.addEventListener("resize", measure);
  measure();
}

/* --------------------------------------------------------------------------
   Article modal — click a blog post card to read the full article
   -------------------------------------------------------------------------- */
function initArticleModal() {
  const modal = document.getElementById("article-modal");
  const triggers = document.querySelectorAll("[data-article]");
  if (!modal || !triggers.length) return;

  const titleEl = document.getElementById("article-modal-title");
  const metaEl = document.getElementById("article-modal-meta");
  const contentEl = document.getElementById("article-modal-content");
  const whatsappLink = document.getElementById("article-modal-whatsapp");
  const closeControls = modal.querySelectorAll("[data-article-modal-close]");
  let lastFocused = null;

  const openArticle = (id, trigger) => {
    const article = BLOG_ARTICLES[id];
    if (!article) return;

    lastFocused = trigger || document.activeElement;
    titleEl.textContent = article.title;
    metaEl.textContent = article.meta;
    contentEl.innerHTML = article.bodyHTML;

    if (whatsappLink) {
      const message = `مرحباً، عندي سؤال بخصوص مقال "${article.title}"`;
      whatsappLink.href = `https://wa.me/201068300432?text=${encodeURIComponent(message)}`;
    }

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    contentEl.scrollTop = 0;
    modal.querySelector(".modal__close")?.focus();
  };

  const closeArticle = () => {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openArticle(trigger.dataset.article, trigger));

    // Cards use role="button" on a non-native element, so Enter/Space need
    // to be wired up manually to match native button keyboard behavior.
    trigger.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openArticle(trigger.dataset.article, trigger);
      }
    });
  });

  closeControls.forEach((control) => control.addEventListener("click", closeArticle));

  // Only close on a direct backdrop click, not clicks that bubble up from
  // inside the panel (reading the article shouldn't accidentally close it).
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeArticle();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeArticle();
    }
  });
}

/**
 * pages/home.js
 * Homepage-specific behavior: the appointment booking form.
 * Validates the required fields, shows inline errors, and simulates a
 * network submission before showing a success confirmation.
 */

const PHONE_PATTERN = /^[0-9+\s-]{8,}$/;

function initBookingForm() {
  const form = document.querySelector(".booking-form");
  if (!form) return;

  const nameField = form.querySelector("#name");
  const phoneField = form.querySelector("#phone");
  const dateField = form.querySelector("#date");
  const nameError = form.querySelector("#name-error");
  const phoneError = form.querySelector("#phone-error");
  const dateError = form.querySelector("#date-error");
  const successNotice = form.querySelector(".form-notice--success");
  const errorNotice = form.querySelector(".form-notice--error");
  const submitButton = form.querySelector(".booking-form__submit");
  const submitIcon = submitButton.querySelector(".icon use");
  const submitIconWrapper = submitButton.querySelector(".icon");
  const submitLabel = submitButton.querySelector(".booking-form__submit-label");

  // Don't let people pick — or submit — a date that's already passed.
  const todayISO = new Date().toLocaleDateString("en-CA"); // "YYYY-MM-DD", local time
  if (dateField) dateField.min = todayISO;

  const ICON_DEFAULT = "#icon-calendar-check";
  const ICON_LOADING = "#icon-loader-2";

  const toggleFieldError = (field, errorEl, message) => {
    if (!field || !errorEl) return;
    if (message) {
      field.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      field.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  };

  const setLoading = (isLoading) => {
    submitButton.disabled = isLoading;
    submitLabel.textContent = isLoading ? "جارٍ الإرسال..." : "تأكيد الحجز";
    submitIcon.setAttribute("href", isLoading ? ICON_LOADING : ICON_DEFAULT);
    submitIconWrapper.classList.toggle("spin", isLoading);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const date = String(data.get("date") || "").trim();

    const errors = {};
    if (name.length < 3) errors.name = "من فضلك اكتب الاسم كاملاً.";
    if (!PHONE_PATTERN.test(phone)) errors.phone = "من فضلك اكتب رقم هاتف صحيح.";
    if (date && date < todayISO) errors.date = "من فضلك اختر تاريخاً في المستقبل.";

    toggleFieldError(nameField, nameError, errors.name);
    toggleFieldError(phoneField, phoneError, errors.phone);
    toggleFieldError(dateField, dateError, errors.date);

    if (Object.keys(errors).length > 0) {
      errorNotice.hidden = false;
      successNotice.hidden = true;
      return;
    }

    errorNotice.hidden = true;
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      successNotice.hidden = false;
      form.reset();
    }, 900);
  });
}

/**
 * main.js
 * Application entry point. Loaded as an ES module (deferred by default),
 * so the DOM is already parsed by the time this runs — it wires up every
 * component's behavior once, on load.
 */


function initApp() {
  initHeader();
  initFloatingActions();
  initAccordion();
  initGalleryLightbox();
  initCompareSliders();
  initCompareFilters();
  initArticleModal();
  initTestimonialsCarousel();
  initBookingForm();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
