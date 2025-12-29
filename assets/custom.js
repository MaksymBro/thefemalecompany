/**
 * ==========================================================
 * THEME CUSTOM TRACKING & UI EXTENSIONS
 * ==========================================================
 * 1. Helpers
 * 2. TF Analytics click tracking
 * 3. PDP recommendation visibility + clicks tracking
 * 4. Intelligems tracking (product card click for allowed IDs)
 * 5. Product card visibility (IntersectionObserver)
 * 6. Show more (data-added-button-more)  ✅ updated logic
 * ==========================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  Helpers.init();

  TFAnalytics.init();
  PDPRecommendations.init();
  IntelligemsTracking.init();
  ProductVisibilityTracking.init();
  ShowMore.init();
});

const Helpers = {
  init() {},

  // Safe tracking wrapper (prevents errors if tfcanalytics is not ready)
  track(eventName, payload = {}) {
    try {
      if (window.tfcanalytics && typeof window.tfcanalytics.trackEvent === "function") {
        window.tfcanalytics.trackEvent(eventName, payload);
      }
    } catch (e) {
      // silent
    }
  },

  isInViewport(el) {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight;
  },

  createButton(label = window.translation.showMore) {
    const btn = document.createElement("a");
    btn.href = "#";
    btn.className = "button button--primary button--small";
    btn.textContent = label;
    btn.setAttribute("data-show-more-btn", "true");
    return btn;
  }
};

const TFAnalytics = {
  selectors: {
    sortingContainerDesktop: ".product-facet__meta-bar-item.product-facet__meta-bar-item--sort",
    sortingContainerMobile: "#mobile-facet-toolbar",
    toggleButton: "button[is='toggle-button']",

    sortContent: "#sort-by-popover",
    sortContentItem: ".popover__choice-item",
    sortContentItemLabel: ".popover__choice-label",

    filterContent: "#facet-filters-form",
    filterContentItemCheckbox: ".checkbox-container",
    filterContentItemBlock: ".block-swatch",
    filterContentItemColorSwatch: ".color-swatch__item",
    filterContentItemLabel: "label",
    filterContentItemColorSwatchLabel: "label span",

    productRecommendationsContainer: ".shopify-section--product-recommendations",
    productRecommendationsItem: ".product-item",
    quickBuyDrawer: "quick-buy-drawer",

    mainProductContainer: ".shopify-section--main-product",
    mainProductZoomButton: ".product__zoom-button",
    sizeGuideButton: ".product-form__option-link",
    productTabs: ".product-tabs",
    productTabItem: ".collapsible-toggle",

    headerNavigation: ".header__inline-navigation",
    burgerMenuCloseButton: ".drawer__close-button",
    mobileMenuDrawer: "#mobile-menu-drawer",
    mobileMenuDrawerLink: ".mobile-nav__link",
    headerLink: ".header-link",
    languageSwitch: ".language-switch span"
  },

  init() {
    document.addEventListener("click", this.handleClick.bind(this));
  },

  handleClick(event) {
    const target = event.target;
    const s = this.selectors;

    // Header navigation click
    if (target.closest(s.headerLink)) {
      Helpers.track("navigation_click", {
        label: target.closest(s.headerLink).innerText
      });
    }

    // Desktop sorting open
    if (target.closest(s.sortingContainerDesktop)) {
      if (target.closest(s.toggleButton)) {
        Helpers.track("open_sorting");
      }
    }

    // Mobile toolbar: sorting / filters open
    if (target.closest(s.sortingContainerMobile)) {
      const btn = target.closest(s.toggleButton);
      if (btn && btn.classList.contains("mobile-toolbar__item--sort")) {
        Helpers.track("open_sorting");
      } else if (btn && btn.classList.contains("mobile-toolbar__item--filters")) {
        Helpers.track("open_filter");
      }
    }

    // Select sorting option
    if (target.closest(s.sortContent)) {
      const item = target.closest(s.sortContentItem);
      if (item && !item.hasAttribute("data-handled")) {
        const labelEl = item.querySelector(s.sortContentItemLabel);
        Helpers.track("select_sorting", { sort_by: labelEl ? labelEl.innerText : "" });
        item.setAttribute("data-handled", "true");
      }
    }

    // Select filter option (checkbox / block / color)
    if (target.closest(s.filterContent)) {
      // checkbox
      const checkbox = target.closest(s.filterContentItemCheckbox);
      if (checkbox && !checkbox.hasAttribute("data-handled")) {
        const labelEl = checkbox.querySelector(s.filterContentItemLabel);
        Helpers.track("select_filter", { filter_by: labelEl ? labelEl.innerText : checkbox.innerText });
        checkbox.setAttribute("data-handled", "true");
        return;
      }

      // block swatch
      const block = target.closest(s.filterContentItemBlock);
      if (block && !block.hasAttribute("data-handled")) {
        const labelEl = block.querySelector(s.filterContentItemLabel);
        Helpers.track("select_filter", { filter_by: labelEl ? labelEl.innerText : block.innerText });
        block.setAttribute("data-handled", "true");
        return;
      }

      // color swatch
      const color = target.closest(s.filterContentItemColorSwatch);
      if (color && !color.hasAttribute("data-handled")) {
        const labelEl = color.querySelector(s.filterContentItemColorSwatchLabel);
        Helpers.track("select_filter", { filter_by: labelEl ? labelEl.innerText : color.innerText });
        color.setAttribute("data-handled", "true");
        return;
      }
    }

    // PDP recommendations click tracking
    if (target.closest(s.productRecommendationsContainer)) {
      const recoItem = target.closest(s.productRecommendationsItem);
      const quickViewBtn = target.closest(s.toggleButton);
      const quickBuy = target.closest(s.quickBuyDrawer);

      if (recoItem && !quickViewBtn && !quickBuy) {
        Helpers.track("click_pdp_reco", { productId: recoItem.dataset.id });
      }

      if (quickViewBtn) {
        event.stopPropagation();
        event.stopImmediatePropagation();

        const parentItem = quickViewBtn.closest(s.productRecommendationsItem);
        if (parentItem) {
          Helpers.track("click_pdp_reco_quickview", { productId: parentItem.dataset.id });
        }
      }
    }

    // Main product interactions
    if (target.closest(s.mainProductContainer)) {
      if (target.closest(s.mainProductZoomButton)) {
        Helpers.track("view_zoom");
      }

      if (target.closest(s.sizeGuideButton)) {
        Helpers.track("view_sizeguide");
      }

      if (target.closest(s.productTabs)) {
        const tab = target.closest(s.productTabItem);
        if (tab) {
          const expanded = tab.getAttribute("aria-expanded") === "true";
          if (expanded) {
            Helpers.track("accordeon_interaction", { label: tab.innerText });
          }
        }
      }
    }

    // Language switch
    if (target.closest(s.languageSwitch)) {
      Helpers.track("language_switch", { to: target.closest(s.languageSwitch).innerText });
    }

    // Burger click in header
    if (target.closest(s.headerNavigation)) {
      const btn = target.closest(s.toggleButton);
      if (btn && btn.getAttribute("aria-controls") === "mobile-menu-drawer") {
        Helpers.track("burger_click");
      }
    }

    // Mobile menu close + navigation clicks
    if (target.closest(s.mobileMenuDrawer)) {
      if (target.closest(s.burgerMenuCloseButton)) {
        Helpers.track("burger_close");
      }

      if (target.closest(s.mobileMenuDrawerLink)) {
        Helpers.track("navigation_click", {
          label: target.closest(s.mobileMenuDrawerLink).innerText
        });
      }
    }
  }
};

const PDPRecommendations = {
  containerSelector: ".shopify-section--product-recommendations",
  seen: false,
  container: null,

  init() {
    this.container = document.querySelector(this.containerSelector);
    if (!this.container) return;

    // fire once when scrolled into view
    this.boundCheck = this.check.bind(this);
    window.addEventListener("scroll", this.boundCheck);
    // also check on load (in case already visible)
    this.check();
  },

  check() {
    if (!this.seen && Helpers.isInViewport(this.container)) {
      this.seen = true;
      Helpers.track("view_pdp_reco");
      window.removeEventListener("scroll", this.boundCheck);
    }
  }
};

const IntelligemsTracking = {
  allowedIds: ["8291888922890", "9847956013322", "9769898869002"],

  init() {
    window.igEvents = window.igEvents || [];

    document.addEventListener("click", (e) => {
      const item = e.target.closest("product-item");
      if (!item) return;

      const id = item.getAttribute("data-id");
      if (!id) return;

      if (this.allowedIds.includes(id)) {
        window.igEvents.push({ event: "productcard_newnameclicked" });
        // console.log("Gültiges Produkt geklickt:", id);
      }
    });
  }
};

const ProductVisibilityTracking = {
  observer: null,
  tracked: new Set(),
  paused: false,
  ignoreUntil: 0,
  resumeTimeout: null,

  init() {
    this.observeItems();
    document.addEventListener("theme:loading:end", this.reInit.bind(this));
  },

  observeItems() {
    const items = document.querySelectorAll("product-item[data-id]");
    this.observer = new IntersectionObserver(this.handle.bind(this), {
      root: null,
      threshold: 1.0 // fully visible
    });

    items.forEach((i) => this.observer.observe(i));
  },

  handle(entries) {
    if (this.paused) return;
    if (Date.now() < this.ignoreUntil) return;

    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        const id = entry.target.getAttribute("data-id");
        if (!id) return;

        if (!this.tracked.has(id)) {
          Helpers.track("view_productitem", { productId: id });
          this.tracked.add(id);
        }

        this.observer.unobserve(entry.target);
      }
    });
  },

  reInit() {
    this.paused = true;

    if (this.resumeTimeout) clearTimeout(this.resumeTimeout);

    try {
      this.observer.disconnect();
    } catch (e) {
      // ignore
    }

    // observe fresh items only
    const newItems = document.querySelectorAll("product-item[data-id]");
    newItems.forEach((item) => {
      const id = item.getAttribute("data-id");
      if (!id) return;
      if (this.tracked.has(id)) return;
      this.observer.observe(item);
    });

    // ignore for a short window to avoid tracking during automatic scroll
    const IGNORE_MS = 700;
    this.ignoreUntil = Date.now() + IGNORE_MS;

    this.resumeTimeout = setTimeout(() => {
      this.paused = false;
      this.ignoreUntil = 0;
    }, IGNORE_MS + 50);
  }
};

/**
 * ==========================================================
 * Show more (data-added-button-more)
 *
 * NEW RULES (your last message):
 * - We find element with data-added-button-more="p" (or other tag).
 * - Button is inserted AFTER that element (outside, as next sibling).
 * - Collapsed height is applied to the SAME element [data-added-button-more]
 * - Collapsed height equals the height up to the FIRST matched tag inside it (e.g. first <p>)
 * ==========================================================
 */
const ShowMore = {
  init() {
    const containers = document.querySelectorAll("[data-added-button-more]");
    if (!containers.length) return;

    containers.forEach((container) => this.setup(container));
  },

  setup(container) {
    // prevent double init
    if (container.dataset.showMoreInited === "true") return;
    container.dataset.showMoreInited = "true";

    const tag = (container.getAttribute("data-added-button-more") || "").trim();
    if (!tag) return;

    // find FIRST element by tag inside container
    const firstEl = container.querySelector(tag);
    if (!firstEl) return;

    // calculate collapsed height as "container top -> firstEl bottom"
    const containerRect = container.getBoundingClientRect();
    const firstRect = firstEl.getBoundingClientRect();

    // height in pixels that should remain visible in collapsed state
    let collapsedHeight = Math.round(firstRect.bottom - containerRect.top);

    // Safety: if container is currently display:none etc.
    if (!Number.isFinite(collapsedHeight) || collapsedHeight <= 0) return;

    // Ensure collapsed height is not larger than full scrollHeight
    const fullHeight = container.scrollHeight;
    collapsedHeight = Math.min(collapsedHeight, fullHeight);

    // If there is nothing to collapse, no button
    if (fullHeight <= collapsedHeight + 5) return;

    // apply collapsed styles to the SAME container
    container.style.overflow = "hidden";
    container.style.maxHeight = collapsedHeight + "px";
    container.style.transition = "max-height 0.3s ease";

    // insert button AFTER container (not inside)
    const btn = Helpers.createButton(window.translation.showMore);
    let expanded = false;

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      expanded = !expanded;

      if (expanded) {
        // expand
        container.style.maxHeight = container.scrollHeight + "px";
        btn.textContent = window.translation.showLess;
      } else {
        // collapse
        container.style.maxHeight = collapsedHeight + "px";
        btn.textContent = window.translation.showMore;

        // scroll back to start of container (optional but matches your old logic)
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    // Insert after container
    container.insertAdjacentElement("afterend", btn);
  }
};
