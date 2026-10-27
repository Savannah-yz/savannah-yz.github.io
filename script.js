/* Progressive enhancement: all research content and links work without JS. */
(() => {
  "use strict";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let savedMotion;
  try {
    savedMotion = localStorage.getItem("zhe-motion");
  } catch (_) {
    /* Storage is optional. */
  }
  let paused = reducedMotion.matches || savedMotion === "paused";
  const motionButton = document.querySelector(".motion-button");
  const setMotion = () => {
    document.body.classList.toggle("motion-paused", paused);
    motionButton.setAttribute("aria-pressed", String(paused));
    motionButton.setAttribute(
      "aria-label",
      paused ? "Resume animations" : "Pause animations",
    );
    motionButton.firstElementChild.textContent = paused ? "▷" : "Ⅱ";
    motionButton.querySelector(".motion-label").textContent = paused
      ? "Motion off"
      : "Motion on";
  };
  setMotion();
  motionButton.addEventListener("click", () => {
    paused = !paused;
    setMotion();
    try {
      localStorage.setItem("zhe-motion", paused ? "paused" : "on");
    } catch (_) {}
    restartOrbit();
  });
  reducedMotion.addEventListener("change", (event) => {
    paused = event.matches;
    setMotion();
    restartOrbit();
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
  window.matchMedia("(min-width: 601px)").addEventListener("change", (e) => {
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
      updateProgress();
    });
  });

  const progress = document.querySelector(".reading-progress");
  let progressPending = false;
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
    progressPending = false;
  }
  window.addEventListener(
    "scroll",
    () => {
      if (!progressPending) {
        progressPending = true;
        requestAnimationFrame(updateProgress);
      }
    },
    { passive: true },
  );
  updateProgress();
  if ("IntersectionObserver" in window) {
    const navigation = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            document.querySelectorAll(".desktop-nav a").forEach((a) => {
              if (a.hash === `#${entry.target.id}`)
                a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            });
          }
        });
      },
      { rootMargin: "-10% 0px -65% 0px" },
    );
    ["home", "about", "publications", "experience", "contact"].forEach((id) =>
      navigation.observe(document.getElementById(id)),
    );
  }

  // Three-dimensional rings, projected onto a lightweight canvas. No WebGL dependency.
  const canvas = document.getElementById("orbit-canvas");
  const context = canvas.getContext("2d");
  const art = document.querySelector(".hero-art");
  const portrait = document.querySelector(".portrait-card");
  let frame = null,
    inView = true,
    width = 0,
    height = 0,
    time = 0,
    last = 0;
  let pointerX = 0,
    pointerY = 0,
    currentX = 0,
    currentY = 0;
  const rings = [
    { tilt: 0.85, turn: 0.2, radius: 0.45, color: "53,89,69" },
    { tilt: -0.7, turn: 1.25, radius: 0.43, color: "173,81,47" },
    { tilt: 0.35, turn: 2.2, radius: 0.48, color: "99,119,84" },
  ];
  const rotate = (point, ax, ay, az) => {
    let [x, y, z] = point;
    [y, z] = [
      y * Math.cos(ax) - z * Math.sin(ax),
      y * Math.sin(ax) + z * Math.cos(ax),
    ];
    [x, z] = [
      x * Math.cos(ay) + z * Math.sin(ay),
      -x * Math.sin(ay) + z * Math.cos(ay),
    ];
    [x, y] = [
      x * Math.cos(az) - y * Math.sin(az),
      x * Math.sin(az) + y * Math.cos(az),
    ];
    const perspective = 950 / (950 + z);
    return {
      x: width / 2 + x * perspective,
      y: height / 2 + y * perspective,
      z,
      scale: perspective,
    };
  };
  function draw() {
    if (!context || !width || !height) return;
    context.clearRect(0, 0, width, height);
    rings.forEach((ring, index) => {
      const radius = Math.min(width, height) * ring.radius;
      const project = (angle) =>
        rotate(
          [Math.cos(angle) * radius, Math.sin(angle) * radius, 0],
          ring.tilt + currentY * 0.16,
          ring.turn + currentX * 0.18 + Math.sin(time * 0.12) * 0.12,
          -0.3 + index * 0.5,
        );
      for (let j = 0; j < 160; j++) {
        const a = project((j / 160) * Math.PI * 2),
          b = project(((j + 1) / 160) * Math.PI * 2);
        // Faint across the portrait; stronger toward the outside of the orbit.
        const middle =
          Math.abs(a.x - width / 2) < width * 0.26 &&
          Math.abs(a.y - height / 2) < height * 0.29;
        context.beginPath();
        context.moveTo(a.x, a.y);
        context.lineTo(b.x, b.y);
        context.strokeStyle = `rgba(${ring.color},${middle ? 0.07 : a.z > 0 ? 0.18 : 0.38})`;
        context.lineWidth = 0.8;
        context.stroke();
      }
      const bead = project(time * (index === 1 ? -0.22 : 0.18) + index * 2.3);
      context.beginPath();
      context.arc(bead.x, bead.y, 3.4 * bead.scale, 0, Math.PI * 2);
      context.fillStyle = `rgba(${ring.color},.85)`;
      context.fill();
      context.beginPath();
      context.arc(bead.x, bead.y, 7 * bead.scale, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${ring.color},.18)`;
      context.stroke();
    });
  }
  function animate(timestamp) {
    frame = null;
    if (paused || document.hidden || !inView) {
      last = 0;
      draw();
      return;
    }
    if (last) time += Math.min((timestamp - last) / 1000, 0.05);
    last = timestamp;
    currentX += (pointerX - currentX) * 0.035;
    currentY += (pointerY - currentY) * 0.035;
    draw();
    frame = requestAnimationFrame(animate);
  }
  function restartOrbit() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    last = 0;
    if (paused || document.hidden || !inView) draw();
    else frame = requestAnimationFrame(animate);
  }
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    if (context) context.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
    updateProgress();
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(art);
  else window.addEventListener("resize", resize);
  art.addEventListener("pointermove", (event) => {
    if (paused || event.pointerType === "touch") return;
    const rect = art.getBoundingClientRect();
    pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    portrait.style.transform = `rotate(3deg) rotateY(${pointerX * 7}deg) rotateX(${-pointerY * 6}deg)`;
  });
  art.addEventListener("pointerleave", () => {
    pointerX = pointerY = 0;
    portrait.style.transform = "rotate(3deg)";
  });
  if ("IntersectionObserver" in window)
    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      restartOrbit();
    }).observe(art);
  document.addEventListener("visibilitychange", restartOrbit);
  resize();
  restartOrbit();
})();
