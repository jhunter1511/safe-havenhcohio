// Online employment application (careers.html): repeatable work-history
// blocks and today's date next to the signature.
(() => {
  const list = document.getElementById("employers");
  const tpl = document.getElementById("employer-tpl");
  const addBtn = document.getElementById("add-employer");
  const MAX = 5;
  if (!list || !tpl || !addBtn) return;

  // Number blocks 1..n in order so the emailed fields read "Employer 1 - ...".
  function renumber() {
    const blocks = [...list.querySelectorAll(".employer")];
    blocks.forEach((block, i) => {
      const old = block.dataset.n;
      const n = String(i + 1);
      if (old === n) return;
      block.dataset.n = n;
      block.querySelectorAll("[name],[id],[for],[aria-label]").forEach((el) => {
        for (const attr of ["name", "id", "for", "aria-label"]) {
          const v = el.getAttribute(attr);
          if (v) el.setAttribute(attr, v.replace(new RegExp(`(employer |emp)${old}\\b`, "gi"), `$1${n}`));
        }
      });
      block.querySelector(".ref-num").textContent = `Employer ${n}`;
    });
    addBtn.hidden = blocks.length >= MAX;
  }

  function addEmployer() {
    const n = list.children.length + 1;
    if (n > MAX) return;
    const html = tpl.innerHTML.replaceAll("{n}", n);
    list.insertAdjacentHTML("beforeend", html);
    renumber();
    return list.lastElementChild;
  }

  addBtn.addEventListener("click", () => {
    const block = addEmployer();
    block?.querySelector("input")?.focus();
  });
  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-employer");
    if (!btn) return;
    btn.closest(".employer").remove();
    renumber();
  });

  // Start with two employer blocks, like the paper application.
  addEmployer();
  addEmployer();

  // "Other" position: show a required box asking which position.
  const position = document.getElementById("ap-position");
  const otherWrap = document.getElementById("ap-position-other-wrap");
  const otherInput = document.getElementById("ap-position-other");
  function syncOther() {
    const isOther = position?.value === "Other";
    if (otherWrap) otherWrap.hidden = !isOther;
    if (otherInput) { otherInput.required = isOther; if (!isOther) otherInput.value = ""; }
  }
  position?.addEventListener("change", () => { syncOther(); if (position.value === "Other") otherInput?.focus(); });
  syncOther();

  // Signature date (readonly, filled in for the applicant).
  const date = document.getElementById("ap-date");
  if (date) date.value = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  // After a successful submit the form is reset: put back two blocks and the date.
  document.getElementById("application")?.addEventListener("reset", () => {
    setTimeout(() => {
      list.innerHTML = "";
      addEmployer();
      addEmployer();
      if (date) date.value = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
      syncOther();
    });
  });
})();
