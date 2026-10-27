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

  // Figure links still open the image normally without JavaScript.
  const figureDialog = document.querySelector(".figure-dialog");
  let figureTrigger;
  document.querySelectorAll("[data-figure]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !figureDialog.showModal
      )
        return;
      event.preventDefault();
      figureTrigger = link;
      const img = figureDialog.querySelector("img");
      img.src = link.href;
      img.alt = link.querySelector("img").alt;
      document.querySelector("#figure-caption").textContent =
        link.dataset.caption;
      figureDialog.showModal();
      document.body.classList.add("dialog-open");
    });
  });
  figureDialog
    .querySelector(".close-figure")
    .addEventListener("click", () => figureDialog.close());
  figureDialog.addEventListener("click", (event) => {
    if (event.target !== figureDialog) return;
    const rect = figureDialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      figureDialog.close();
  });
  figureDialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    figureTrigger?.focus({ preventScroll: true });
  });

  const note = document.querySelector(".note-section");
  const noteTitle = document.querySelector("#note-title");
  const nextNote = document.querySelector(".next-note");
  const reminders = [
    "What I want<br><span>wants me more.</span>",
    "Everything is working<br><span>in my favor.</span>",
  ];
  let noteIndex = 0,
    noteTimer,
    celebrateTimer;
  nextNote.hidden = false;
  noteTitle.setAttribute("aria-live", "polite");
  nextNote.addEventListener("click", () => {
    clearTimeout(noteTimer);
    clearTimeout(celebrateTimer);
    noteIndex = (noteIndex + 1) % reminders.length;
    const update = () => {
      noteTitle.innerHTML = reminders[noteIndex];
      document.querySelector(".note-count").textContent =
        `0${noteIndex + 1} / 02`;
      note.classList.remove("changing");
      note.classList.add("celebrate");
      celebrateTimer = setTimeout(
        () => note.classList.remove("celebrate"),
        850,
      );
    };
    if (paused || reducedMotion.matches) update();
    else {
      note.classList.add("changing");
      noteTimer = setTimeout(update, 160);
    }
  });
})();
