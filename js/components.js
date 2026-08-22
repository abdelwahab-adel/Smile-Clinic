/**
 * components.js
 * Reusable, self-contained UI component behaviors shared across the page:
 *   - Header: scroll shadow, mobile menu, active-section highlighting
 *   - Floating actions: scroll-to-top visibility + smooth scroll
 *   - Accordion: single-open FAQ accordion
 *   - Gallery lightbox: click-to-enlarge modal
 *   - Article modal: click a blog post card to read the full article
 */
import { BLOG_ARTICLES } from "./data/blog-articles.js";

/* --------------------------------------------------------------------------
   Header — sticky shadow, mobile menu, scroll-spy active link
   -------------------------------------------------------------------------- */
export function initHeader() {
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
export function initFloatingActions() {
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
export function initAccordion(container = document) {
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
export function initCompareSliders() {
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
export function initCompareFilters() {
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
export function initGalleryLightbox() {
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
export function initTestimonialsCarousel() {
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
export function initArticleModal() {
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
