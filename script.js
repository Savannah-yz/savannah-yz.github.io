/* All research content and CV links remain usable without JavaScript. */
(() => {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const motionButton = document.querySelector(".motion-button");
  let paused = reducedMotion.matches;
  try {
    paused ||= localStorage.getItem("zhe-motion") === "paused";
  } catch {}
  function setMotion() {
    document.body.classList.toggle("motion-paused", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.setAttribute(
      "aria-label",
      paused ? "Resume animations" : "Pause animations",
    );
    motionButton.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
    motionButton.querySelector(".motion-label").textContent = paused
      ? "Motion off"
      : "Pause motion";
    document.dispatchEvent(
      new CustomEvent("zhe-motion-change", { detail: { paused } }),
    );
  }
  setMotion();
  motionButton.addEventListener("click", () => {
    paused = !paused;
    setMotion();
    try {
      localStorage.setItem("zhe-motion", paused ? "paused" : "on");
    } catch {}
  });
  reducedMotion.addEventListener("change", (e) => {
    paused = e.matches;
    setMotion();
  });

  const menu = document.querySelector("#mobile-nav");
  const menuButton = document.querySelector(".menu-button");
  function closeMenu() {
    menu.hidden = true;
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.lastElementChild.textContent = "＋";
  }
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.lastElementChild.textContent = open ? "−" : "＋";
  });
  menu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.hidden) {
      closeMenu();
      menuButton.focus();
    }
  });
  matchMedia("(min-width: 701px)").addEventListener("change", (e) => {
    if (e.matches) closeMenu();
  });

  const publications = [...document.querySelectorAll(".pub")];
  const filters = [...document.querySelectorAll("[data-filter]")];
  document.querySelector(".publication-controls").hidden = false;
  filters.forEach((button) => {
    const category = button.dataset.filter;
    button.querySelector("span").textContent = publications.filter(
      (p) => category === "all" || p.dataset.category === category,
    ).length;
    button.addEventListener("click", () => {
      filters.forEach((b) =>
        b.setAttribute("aria-pressed", String(b === button)),
      );
      let count = 0;
      publications.forEach((p) => {
        p.hidden = category !== "all" && p.dataset.category !== category;
        if (!p.hidden) count++;
      });
      document.querySelector(".filter-count").textContent =
        `${count} ${count === 1 ? "work" : "works"}`;
    });
  });
})();
