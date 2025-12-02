/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */

// GTAG custom tracking
document.addEventListener("DOMContentLoaded", () => {
  const selectors = {
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
  };

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (target.closest(selectors.headerLink)) {
      window.tfcanalytics.trackEvent("navigation_click", {
        label: target.closest(selectors.headerLink).innerText
      });
    }

    if (target.closest(selectors.sortingContainerDesktop)) {
      if (target.closest(selectors.toggleButton)) {
        window.tfcanalytics.trackEvent("open_sorting");
      }
    }

    if (target.closest(selectors.sortingContainerMobile)) {
      if (target.closest(selectors.toggleButton).classList.contains("mobile-toolbar__item--sort")) {
        window.tfcanalytics.trackEvent("open_sorting");
      } else if (target.closest(selectors.toggleButton).classList.contains("mobile-toolbar__item--filters")) {
        window.tfcanalytics.trackEvent("open_filter");
      }
    }

    if (target.closest(selectors.sortContent)) {
      if (target.closest(selectors.sortContentItem) && !target.closest(selectors.sortContentItem).hasAttribute('data-handled')) {
        const item = target.closest(selectors.sortContentItem);

        if (!item) return null;

        const value = item.querySelector(selectors.sortContentItemLabel);

        window.tfcanalytics.trackEvent("select_sorting", {
          sort_by: value.innerText
        });
        item.setAttribute('data-handled', 'true');
      }
    }

    if (target.closest(selectors.filterContent)) {
      if (target.closest(selectors.filterContentItemCheckbox) && !target.closest(selectors.filterContentItemCheckbox).hasAttribute('data-handled')) {
        const item = target.closest(selectors.filterContentItemCheckbox);

        if (!item) return null;

        const value = item.querySelector(selectors.filterContentItemLabel);

        window.tfcanalytics.trackEvent("select_filter", {
          filter_by: value.innerText
        });
        item.setAttribute('data-handled', 'true');
      } else if (target.closest(selectors.filterContentItemBlock) && !target.closest(selectors.filterContentItemBlock).hasAttribute('data-handled')) {
        const item = target.closest(selectors.filterContentItemBlock);

        if (!item) return null;

        const value = item.querySelector(selectors.filterContentItemLabel);

        window.tfcanalytics.trackEvent("select_filter", {
          filter_by: value.innerText
        });
        item.setAttribute('data-handled', 'true');
      } else if (target.closest(selectors.filterContentItemColorSwatch) && !target.closest(selectors.filterContentItemColorSwatch).hasAttribute('data-handled')) {
        const item = target.closest(selectors.filterContentItemColorSwatch);

        if (!item) return null;

        const value = item.querySelector(selectors.filterContentItemColorSwatchLabel);

        window.tfcanalytics.trackEvent("select_filter", {
          filter_by: value.innerText
        });
        item.setAttribute('data-handled', 'true');
      }
    }

    if (target.closest(selectors.productRecommendationsContainer)) {
      const recommendationsItem = target.closest(selectors.productRecommendationsItem);
      const quickViewButton = target.closest(selectors.toggleButton);
      const quickBuyDrawer = target.closest(selectors.quickBuyDrawer);

      if (recommendationsItem && !quickViewButton && !quickBuyDrawer) {
        const productId = recommendationsItem.dataset.id;

        window.tfcanalytics.trackEvent("click_pdp_reco", {
          productId: productId
        });
      }

      if (quickViewButton) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        const productId = quickViewButton.closest(selectors.productRecommendationsItem).dataset.id;

        window.tfcanalytics.trackEvent("click_pdp_reco_quickview", {
          productId: productId
        });
      }
    }

    if (target.closest(selectors.mainProductContainer)) {
      if (target.closest(selectors.mainProductZoomButton)) {
        window.tfcanalytics.trackEvent("view_zoom");
      }

      if (target.closest(selectors.sizeGuideButton)) {
        window.tfcanalytics.trackEvent("view_sizeguide");
      }

      if (target.closest(selectors.productTabs)) {
        const productTabItem = target.closest(selectors.productTabItem);

        if (!productTabItem) return null;

        const check = productTabItem.getAttribute("aria-expanded") === "true";

        if (productTabItem && check) {
          window.tfcanalytics.trackEvent("accordeon_interaction", {
            label: productTabItem.innerText
          });
        }
      }
    }

    if (target.closest(selectors.languageSwitch)) {
      window.tfcanalytics.trackEvent("language_switch", {
        to: target.closest(selectors.languageSwitch).innerText
      });
    }

    if (target.closest(selectors.headerNavigation)) {
      const toggleButton = target.closest(selectors.toggleButton);

      if (!toggleButton) return null;

      const toggleButtonAriaControls = toggleButton.getAttribute("aria-controls") === "mobile-menu-drawer";

      if (toggleButton && toggleButtonAriaControls) {
        window.tfcanalytics.trackEvent("burger_click");
      }
    }

    if (target.closest(selectors.mobileMenuDrawer)) {
      if (target.closest(selectors.burgerMenuCloseButton)) {
        window.tfcanalytics.trackEvent("burger_close");
      }

      if (target.closest(selectors.mobileMenuDrawerLink)) {
        window.tfcanalytics.trackEvent("navigation_click", {
          label: target.closest(selectors.mobileMenuDrawerLink).innerText
        });
      }
    }
  });

  let check = false;

  function isElementInView(element) {
    if (!element) return null;

    const bounding = element.getBoundingClientRect();

    return (
      bounding.top < window.innerHeight
    );
  }

  const recommendedProducts = document.querySelector(selectors.productRecommendationsContainer);
  function checkIfInView() {
    if (isElementInView(recommendedProducts) && !check) {
      check = true;
      window.tfcanalytics.trackEvent("view_pdp_reco");
      window.removeEventListener("scroll", checkIfInView);
    }
  }

  window.addEventListener("scroll", checkIfInView);
});
