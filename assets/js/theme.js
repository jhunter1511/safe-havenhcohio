// Safe Haven — light/dark switch. The choice is saved in the visitor's browser.
// The <head> of each page applies a saved "light" choice before the page paints.
(() => {
  const root = document.documentElement;
  const KEY = "sh-theme";
  const actions = document.querySelector(".header-actions");
  if (!actions) return;

  const sun = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/></svg>';
  const moon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>';

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";
  actions.prepend(btn);

  const isLight = () => root.dataset.theme === "light";
  const render = () => {
    // Show the mode you'd switch TO.
    btn.innerHTML = isLight() ? moon : sun;
    const label = isLight() ? "Switch to dark mode" : "Switch to light mode";
    btn.setAttribute("aria-label", label);
    btn.title = label;
    btn.setAttribute("aria-pressed", String(isLight()));
  };
  render();

  btn.addEventListener("click", () => {
    root.classList.add("theme-anim");
    if (isLight()) delete root.dataset.theme; else root.dataset.theme = "light";
    try { localStorage.setItem(KEY, isLight() ? "light" : "dark"); } catch (e) { /* private mode: still works for this page */ }
    render();
    setTimeout(() => root.classList.remove("theme-anim"), 500);
  });
})();
