/**
 * main.js
 * Application entry point. Loaded as an ES module (deferred by default),
 * so the DOM is already parsed by the time this runs — it wires up every
 * component's behavior once, on load.
 */

import {
  initHeader,
  initFloatingActions,
  initAccordion,
  initGalleryLightbox,
  initCompareSliders,
  initCompareFilters,
  initArticleModal,
  initTestimonialsCarousel,
} from "./components.js";
import { initBookingForm } from "./pages/home.js";

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
