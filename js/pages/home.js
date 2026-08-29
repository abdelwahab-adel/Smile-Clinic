/**
 * pages/home.js
 * Homepage-specific behavior: the appointment booking form.
 * Validates the required fields, shows inline errors, builds a
 * WhatsApp message with the booking details, and opens it on the
 * clinic's WhatsApp number before showing a success confirmation.
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

  const ICON_DEFAULT = "#icon-calendar-check";
  const ICON_LOADING = "#icon-loader-2";

  // العيادة لا تملك سيرفر خلفي (backend) يستقبل الحجوزات، فبدل ما نتظاهر
  // بالإرسال وتضيع بيانات المريض فعلياً، بنجهّز رسالة واتساب جاهزة بكل
  // تفاصيل الحجز ونفتحها على نفس رقم واتساب العيادة المستخدم في باقي
  // الموقع، والمريض يضغط "إرسال" في واتساب عشان يوصل فعلاً للعيادة.
  const CLINIC_WHATSAPP_NUMBER = "201068300432";

  const buildWhatsAppMessage = ({ name, phone, service, time, date, notes }) => {
    const lines = ["مرحباً، أرغب في حجز موعد في سمايل كلينيك:", `الاسم: ${name}`, `رقم الهاتف: ${phone}`];
    if (service) lines.push(`الخدمة المطلوبة: ${service}`);
    if (date) lines.push(`التاريخ المفضل: ${date}`);
    if (time) lines.push(`الوقت المفضل: ${time}`);
    if (notes) lines.push(`ملاحظات: ${notes}`);
    return lines.join("\n");
  };

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
    const service = String(data.get("service") || "").trim();
    const time = String(data.get("time") || "").trim();
    const notes = String(data.get("notes") || "").trim();

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

    // لازم يتفتح فوراً (synchronously) جوه هاندلر الـ submit مباشرة، مش
    // جوه setTimeout، عشان متصفحات كتير (Chrome/Safari) بتمنع window.open
    // لو حصل بعد أي تأخير وتعتبره popup غير مرغوب فيه.
    const message = buildWhatsAppMessage({ name, phone, service, time, date, notes });
    const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      successNotice.hidden = false;
      form.reset();
    }, 900);
  });
}
