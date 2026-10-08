// Safe Haven — motion & micro-interactions.
// Small, gentle touches. Everything degrades gracefully: if this file fails
// to load, or the visitor prefers reduced motion, the site works as before.
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  // ---- Scroll reveal -------------------------------------------------------
  // Tag the things that should ease in, with a light stagger inside groups.
  // Containers first, so text inside them isn't faded twice.
  const groups = [
    [".split > div:first-child", "left"],
    [".split > div:last-child", "right"],
    [".service-detail", null],
    [".audience > .panel, .values > .panel", "group"],
    [".cards > .card", "group"],
    [".features > .feature", "group"],
    [".contact-grid > *", "group"],
    [".why-photo", "left"],
    [".mission, .photo-frame", "zoom"],
    [".band h2, .band .eyebrow, .cta h2, .cta p", null],
    [".band .muted", null],
    [".cta .btn-row, .cta .btn", null],
  ];
  const tagged = new Set();
  groups.forEach(([sel, mode]) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (tagged.has(el) || el.closest(".hero, .page-hero")) return;
      // Skip anything already inside a revealed ancestor (avoids double fades).
      for (const t of tagged) if (t.contains(el)) return;
      tagged.add(el);
      if (mode === "left" || mode === "right" || mode === "zoom") el.dataset.reveal = mode;
      else el.dataset.reveal = "";
      if (mode === "group") {
        const i = Array.prototype.indexOf.call(el.parentElement.children, el);
        el.style.setProperty("--stagger", `${Math.min(i, 5) * 0.09}s`);
      }
    });
  });

  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    tagged.forEach((el) => io.observe(el));
    // Eyebrows stretch their gold lines when seen, even outside revealed blocks.
    document.querySelectorAll(".eyebrow.lined, .eyebrow.lined-l").forEach((el) => io.observe(el));
  } else {
    tagged.forEach((el) => el.classList.add("is-in"));
    document.querySelectorAll(".eyebrow").forEach((el) => el.classList.add("is-in"));
  }

  // ---- Heart in the hero's handwritten note gets its own span to beat ----
  const note = document.querySelector(".hero-photo .script-note");
  if (note && note.innerHTML.includes("♡")) {
    note.innerHTML = note.innerHTML.replace("♡", '<span class="beat">♡</span>');
  }

  // ---- Header + scroll thread + back-to-top -------------------------------
  const header = document.querySelector(".site-header");
  const thread = document.createElement("div");
  thread.className = "scroll-thread";
  thread.setAttribute("aria-hidden", "true");
  document.body.prepend(thread);

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = "↑";
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }));
  document.body.append(toTop);

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    thread.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    if (header) header.classList.toggle("is-scrolled", y > 20);
    toTop.classList.toggle("show", y > window.innerHeight * 0.9);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (reduce) return; // Everything below is purely decorative motion.

  // ---- Floating hearts drifting up behind the top section of every page ---
  const hero = document.querySelector(".hero");
  const topSection = hero || document.querySelector(".page-hero");
  if (topSection) {
    const layer = document.createElement("div");
    layer.className = "hero-hearts";
    layer.setAttribute("aria-hidden", "true");
    const small = window.innerWidth < 700;
    const count = hero ? (small ? 5 : 9) : (small ? 4 : 7);
    const rise = topSection.offsetHeight + 60; // travel the full height of this section
    for (let i = 0; i < count; i++) {
      const h = document.createElement("span");
      h.textContent = "♥";
      const r = (min, max) => (Math.random() * (max - min) + min).toFixed(2);
      h.style.setProperty("--x", `${r(2, 96)}%`);
      h.style.setProperty("--s", `${r(9, 18)}px`);
      h.style.setProperty("--d", hero ? `${r(14, 24)}s` : `${r(10, 16)}s`);
      h.style.setProperty("--delay", `${r(-20, 2)}s`);
      h.style.setProperty("--drift", `${r(-40, 40)}px`);
      h.style.setProperty("--o", r(0.1, 0.22));
      h.style.setProperty("--rise", `${rise}px`);
      layer.append(h);
    }
    topSection.prepend(layer);
  }

  if (!finePointer) return; // Cursor effects only where there's a mouse.

  // ---- Hero photo tilts softly toward the cursor --------------------------
  const photo = document.querySelector(".hero-photo");
  if (photo && hero) {
    const img = photo.querySelector("img");
    hero.addEventListener("pointermove", (e) => {
      const b = photo.getBoundingClientRect();
      const dx = (e.clientX - (b.left + b.width / 2)) / window.innerWidth;
      const dy = (e.clientY - (b.top + b.height / 2)) / window.innerHeight;
      img.style.setProperty("--ry", `${(dx * 8).toFixed(2)}deg`);
      img.style.setProperty("--rx", `${(-dy * 6).toFixed(2)}deg`);
    });
    hero.addEventListener("pointerleave", () => {
      img.style.setProperty("--ry", "0deg");
      img.style.setProperty("--rx", "0deg");
    });
  }

  // ---- Warm glow follows the cursor across cards and panels ---------------
  document.querySelectorAll(".card, .panel").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const b = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - b.left}px`);
      el.style.setProperty("--my", `${e.clientY - b.top}px`);
    });
  });
})();

// ---- A few little hearts pop out of the main buttons when clicked ---------
// Runs on touch too: it's quick, and doesn't delay navigation.
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-purple, .btn-gold, .header-cta");
    if (!btn) return;
    const x = e.clientX || btn.getBoundingClientRect().left + btn.offsetWidth / 2;
    const y = e.clientY || btn.getBoundingClientRect().top + btn.offsetHeight / 2;
    for (let i = 0; i < 6; i++) {
      const h = document.createElement("span");
      h.className = "heart-pop";
      h.textContent = "♥";
      h.setAttribute("aria-hidden", "true");
      const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.6;
      const dist = 34 + Math.random() * 22;
      h.style.left = `${x}px`;
      h.style.top = `${y}px`;
      h.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
      h.style.setProperty("--dy", `${Math.sin(angle) * dist - 14}px`);
      h.style.setProperty("--r", `${(Math.random() * 60 - 30).toFixed(0)}deg`);
      h.style.color = i % 2 ? "#d6a84e" : "#b26ee0";
      document.body.append(h);
      setTimeout(() => h.remove(), 950);
    }
  });
})();
