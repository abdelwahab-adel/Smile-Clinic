/**
 * pages/home.js
 * Homepage-specific behavior: the appointment booking form.
 * Validates the required fields, shows inline errors, and simulates a
 * network submission before showing a success confirmation.
 */

const PHONE_PATTERN = /^[0-9+\s-]{8,}$/;

export function initBookingForm() {
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

  const ICON_DEFAULT = "assets/icons/sprite.svg#icon-calendar-check";
  const ICON_LOADING = "assets/icons/sprite.svg#icon-loader-2";

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
