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
  motionButton.hidden = false;
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
      noteTitle.dataset.length = noteIndex === 1 ? "long" : "short";
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

  // Lightweight SVG companions animate only while their paper is in view.
  const paperObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) =>
        target.classList.toggle("is-visible", isIntersecting),
      );
    },
    { rootMargin: "60px" },
  );
  document
    .querySelectorAll(".pub-mascot")
    .forEach((el) => paperObserver.observe(el));
  const pageVisibility = () =>
    document.body.classList.toggle("page-hidden", document.hidden);
  pageVisibility();
  document.addEventListener("visibilitychange", pageVisibility);

  // Fit a continuous path to the actual milestone positions. This also handles
  // expanded details, font loading, and narrow layouts without fixed offsets.
  const timeline = document.querySelector(".timeline");
  const milestones = [...timeline.querySelectorAll(".timeline-entry")];
  const track = timeline.querySelector(".journey-track");
  const trackBase = timeline.querySelector(".journey-track-base");
  const trackFill = timeline.querySelector(".journey-track-fill");
  const traveller = timeline.querySelector(".journey-buddy");
  let stops = [],
    pathLength = 0,
    currentDistance = 0,
    targetDistance = 0;
  let journeyFrame = 0,
    lastJourneyFrame = 0,
    journeyVisible = false,
    hoveredStop = null,
    focusedStop = null;

  function distanceAtY(y) {
    let low = 0,
      high = pathLength;
    for (let i = 0; i < 13; i++) {
      const mid = (low + high) / 2;
      if (trackBase.getPointAtLength(mid).y < y) low = mid;
      else high = mid;
    }
    return (low + high) / 2;
  }
  function drawJourney() {
    if (!pathLength) return;
    const point = trackBase.getPointAtLength(currentDistance);
    traveller.style.setProperty("--buddy-x", `${point.x}px`);
    traveller.style.setProperty("--buddy-y", `${point.y}px`);
    trackFill.style.strokeDashoffset = String(pathLength - currentDistance);
    let closest = 0;
    stops.forEach((stop, i) => {
      if (Math.abs(stop.y - point.y) < Math.abs(stops[closest].y - point.y))
        closest = i;
    });
    milestones.forEach((el, i) =>
      el.classList.toggle("is-current", closest === i),
    );
  }
  function stopJourney() {
    cancelAnimationFrame(journeyFrame);
    journeyFrame = 0;
    lastJourneyFrame = 0;
    traveller.classList.remove("is-travelling");
  }
  function animateJourney(now) {
    journeyFrame = 0;
    if (paused || document.hidden || !journeyVisible) return;
    const delta = lastJourneyFrame
      ? Math.min((now - lastJourneyFrame) / 1000, 0.06)
      : 0.016;
    lastJourneyFrame = now;
    currentDistance +=
      (targetDistance - currentDistance) * (1 - Math.exp(-12 * delta));
    const moving = Math.abs(targetDistance - currentDistance) > 0.3;
    traveller.classList.toggle("is-travelling", moving);
    if (!moving) currentDistance = targetDistance;
    drawJourney();
    if (moving) journeyFrame = requestAnimationFrame(animateJourney);
    else lastJourneyFrame = 0;
  }
  function followJourney() {
    if (!pathLength || !journeyVisible) return;
    const chosen = focusedStop ?? hoveredStop;
    // Reduced motion keeps the companion still during scrolling; selecting an
    // entry can still move it directly, without animation.
    if (paused && chosen === null) return;
    const rect = timeline.getBoundingClientRect();
    const y = chosen !== null ? stops[chosen].y : innerHeight * 0.46 - rect.top;
    targetDistance = distanceAtY(
      Math.max(stops[0].y, Math.min(stops.at(-1).y, y)),
    );
    if (paused) {
      currentDistance = targetDistance;
      drawJourney();
      return;
    }
    if (!journeyFrame && !document.hidden)
      journeyFrame = requestAnimationFrame(animateJourney);
  }
  function measureJourney() {
    const rect = timeline.getBoundingClientRect();
    const width = track.getBoundingClientRect().width;
    if (!rect.height || !width) return;
    stops = milestones.map((el) => {
      const pin = el.querySelector(".timeline-mark").getBoundingClientRect();
      return {
        x: pin.left + pin.width / 2 - rect.left,
        y: pin.top + pin.height / 2 - rect.top,
      };
    });
    track.setAttribute("viewBox", `0 0 ${width} ${rect.height}`);
    let d = `M ${stops[0].x} ${stops[0].y}`;
    stops.slice(1).forEach((stop, i) => {
      const previous = stops[i];
      const bend = Math.min(18, width * 0.22) * (i % 2 ? -1 : 1);
      const height = stop.y - previous.y;
      d += ` C ${previous.x + bend} ${previous.y + height * 0.32}, ${stop.x - bend} ${previous.y + height * 0.68}, ${stop.x} ${stop.y}`;
    });
    const ratio = pathLength ? currentDistance / pathLength : 0;
    trackBase.setAttribute("d", d);
    trackFill.setAttribute("d", d);
    pathLength = trackBase.getTotalLength();
    currentDistance = ratio * pathLength;
    trackFill.style.strokeDasharray = String(pathLength);
    timeline.classList.add("journey-ready");
    drawJourney();
    followJourney();
  }
  milestones.forEach((entry, i) => {
    entry.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") {
        hoveredStop = i;
        followJourney();
      }
    });
    entry.addEventListener("pointerleave", () => {
      hoveredStop = null;
      followJourney();
    });
    entry.addEventListener("focusin", () => {
      focusedStop = i;
      followJourney();
    });
    entry.addEventListener("focusout", (e) => {
      if (!entry.contains(e.relatedTarget)) {
        focusedStop = null;
        followJourney();
      }
    });
  });
  new ResizeObserver(measureJourney).observe(timeline);
  new IntersectionObserver(([entry]) => {
    journeyVisible = entry.isIntersecting;
    timeline.classList.toggle("journey-visible", journeyVisible);
    if (journeyVisible) followJourney();
    else stopJourney();
  }).observe(timeline);
  addEventListener("scroll", followJourney, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopJourney();
    else followJourney();
  });
  document.addEventListener("zhe-motion-change", () => {
    if (paused) stopJourney();
    else followJourney();
  });
  measureJourney();
})();
