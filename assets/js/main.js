// Mobile nav toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
}

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

// Forms: submit to the form's action (e.g. Formspree) via fetch, show inline status.
document.querySelectorAll("form[data-ajax]").forEach((form) => {
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.action.includes("YOUR_FORM_ID")) {
      status.textContent = "Form not connected yet — please call us at 513.633.1447 for now.";
      return;
    }
    status.textContent = "Sending…";
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error();
      form.reset();
      status.textContent = "Thank you! A member of our team will get back to you within 24–48 hours. For urgent needs, please call 513.633.1447.";
    } catch {
      status.textContent = "Something went wrong. Please call us or try again.";
    }
  });
});
