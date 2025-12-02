(function () {
  window.tfcanalytics = {
    trackEvent: () => {},
    identifyUser: () => {}
  }

  window.tfcanalytics.trackEvent = function trackEvent(name, data = {}) {
    const sharedData = {
      page_path: location.pathname,
    };

    console.log("[TRACK EVENT] " + name, { ...sharedData, ...data });

    // GA4
    gtag("event", name, { ...sharedData, ...data });
  }

  window.tfcanalytics.identifyUser = function identifyUser(data) {
    console.log("[IDENTIFY USER]", data);

    // Klaviyo
    var _learnq = window._learnq || [];
    _learnq.push(["identify", data]);

    // GA4
    gtag("set", "user_properties", data);
  }

  // Base user identification
  window.addEventListener("load", function () {
    window.tfcanalytics.identifyUser({
      language_locale:
        window.themeVariables.localization.language.toLowerCase(),
      region_locale: window.themeVariables.localization.country.toLowerCase(),
    });
  });

  // Klaviyo
  window.addEventListener("klaviyoForms", function (e) {
    if (e.detail.type == "open" || e.detail.type == "embedOpen") {
      window.tfcanalytics.trackEvent("klaviyo_form_open", e.detail);
    }
    if (e.detail.type == "submit") {
      window.tfcanalytics.trackEvent("klaviyo_form_submit", e.detail);
    }
    if (e.detail.type == "stepSubmit") {
      window.tfcanalytics.trackEvent("klaviyo_form_step_submit", {
        step_name: e.detail.metaData.$step_name,
        ...e.detail,
      });
    }
    if (e.detail.type == "redirectedToUrl") {
      window.tfcanalytics.trackEvent("klaviyo_form_url_redirect", e.detail);
    }
    if (e.detail.type == "close") {
      window.tfcanalytics.trackEvent("klaviyo_form_close", e.detail);
    }
  });
})();
