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

// Forms: submit to Web3Forms via fetch, show inline status.
// Only report success when Web3Forms confirms it ({"success": true}).
// Fields are sent as regular form data (Web3Forms' standard method). Blank fields
// are left out so the email stays short, and checkbox groups that share a name
// (e.g. "Days available") are joined into one line.
function cleanFormData(form) {
  const merged = new Map();
  for (const [key, value] of new FormData(form)) {
    if (typeof value !== "string" || value.trim() === "") continue;
    merged.set(key, merged.has(key) ? `${merged.get(key)}, ${value}` : value);
  }
  const out = new FormData();
  for (const [key, value] of merged) out.append(key, value);
  return out;
}

document.querySelectorAll("form[data-ajax]").forEach((form) => {
  const status = form.querySelector(".form-status");
  const button = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.querySelector('[name="access_key"]')?.value === "WEB3FORMS_ACCESS_KEY") {
      status.textContent = "Form not connected yet — please call us at 513.633.1447 for now.";
      return;
    }
    status.textContent = "Sending…";
    if (button) button.disabled = true;
    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: cleanFormData(form),
        headers: { Accept: "application/json" },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.message);
      form.reset();
      status.textContent = "Thank you! A member of our team will get back to you within 24–48 hours. For urgent needs, please call 513.633.1447.";
    } catch {
      status.textContent = "Something went wrong. Please call us at 513.633.1447 or try again.";
    } finally {
      if (button) button.disabled = false;
    }
  });
});
