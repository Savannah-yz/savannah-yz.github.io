const atlasData = {
  preferences: {
    title: "Preferences",
    image: "./assets/figures/10_preferences.png",
    pdf: "../figs/10_Preferences.pdf",
    caption:
      "Inferring stable photo-editing preferences from an email thread with annotated visual feedback and user confirmation.",
    copy:
      "Preferences profiling captures stable, trait-like choices that generalize across situations. This case evaluates whether an agent can aggregate multimodal conversational evidence and distill a stable preference model while keeping each inferred trait traceable to concrete file-grounded cues."
  },
  behavioral: {
    title: "Behavioral Patterns",
    image: "./assets/figures/11_behaviour_patterns.png",
    pdf: "../figs/11_behaviour_patterns.pdf",
    caption:
      "Inferring a stable stress-regulation routine by aligning a training plan, logs, messages, diary notes, and multimodal evidence over time.",
    copy:
      "Behavioral patterns profiling targets persistent, temporally structured habits rather than isolated events. This case evaluates whether an agent can integrate cross-file temporal cues, identify periodicity with exceptions, and derive a stable behavioral pattern that remains traceable to verifiable evidence."
  },
  scheduling: {
    title: "Scheduling",
    image: "./assets/figures/12_scheduling.png",
    pdf: "../figs/12_Scheduling.pdf",
    caption:
      "Conditional planning under conflicting commitments, grounded in calendars/emails and historical conflict-resolution evidence.",
    copy:
      "Scheduling information profiling targets forward-looking, constraint-aware planning under a user's established decision policy. This case evaluates whether an agent can recover a user-specific decision model from longitudinal evidence and generate an executable plan that is both constraint-consistent and evidence-traceable."
  },
  retrospection: {
    title: "Retrospection",
    image: "./assets/figures/13_retrospections.png",
    pdf: "../figs/13_Retrospections.pdf",
    caption:
      "The agent reconstructs a graduation-day itinerary by aligning calendar events, photo metadata, and personal notes into a coherent timeline.",
    copy:
      "Retrospective reflections profile event-bounded user history. This case evaluates whether an agent can align timestamps, locations, and participants across modalities to produce a logically consistent itinerary while keeping each inferred step traceable to concrete file-grounded evidence."
  },
  workflow: {
    title: "Workflows",
    image: "./assets/figures/14_workflows.png",
    pdf: "../figs/14_Workflows.pdf",
    caption:
      "Reconstructing a recurring collaborative-learning loop by aligning calendar events, logs, consultation audio, messages, and document updates.",
    copy:
      "Workflows profiling targets procedure-level user modeling across repeated task executions. This case evaluates whether an agent can integrate multimodal procedural traces into a coherent, reusable workflow representation while keeping each step traceable to concrete file-grounded evidence."
  }
};

const atlasTabs = document.querySelectorAll(".atlas-tab");
const atlasTitle = document.getElementById("atlas-title");
const atlasImage = document.getElementById("atlas-image");
const atlasCaption = document.getElementById("atlas-caption");
const atlasCopy = document.getElementById("atlas-copy");
const atlasPdf = document.getElementById("atlas-pdf");
const atlasOpen = document.getElementById("atlas-open");
const atlasOpenButton = document.getElementById("atlas-open-button");

function setAtlasFigure(key) {
  const next = atlasData[key];
  if (!next) return;

  atlasTitle.textContent = next.title;
  atlasImage.src = next.image;
  atlasImage.alt = `${next.title} case study figure.`;
  atlasCaption.textContent = next.caption;
  atlasCopy.textContent = next.copy;
  atlasPdf.href = next.image;
  atlasPdf.textContent = "Open Figure";

  [atlasOpen, atlasOpenButton].forEach((node) => {
    node.dataset.image = next.image;
    node.dataset.title = next.title;
    node.dataset.caption = next.caption;
    node.dataset.pdf = next.image;
  });
}

atlasTabs.forEach((button) => {
  button.addEventListener("click", () => {
    atlasTabs.forEach((tab) => tab.classList.remove("is-active"));
    button.classList.add("is-active");
    setAtlasFigure(button.dataset.atlasKey);
  });
});

setAtlasFigure("preferences");

const copyButton = document.getElementById("copy-citation");
const citationBlock = document.getElementById("citation-block");

if (copyButton && citationBlock) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(citationBlock.textContent);
      copyButton.textContent = "Copied";
      window.setTimeout(() => {
        copyButton.textContent = "Copy BibTeX";
      }, 1400);
    } catch {
      copyButton.textContent = "Copy failed";
      window.setTimeout(() => {
        copyButton.textContent = "Copy BibTeX";
      }, 1400);
    }
  });
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxPdf = document.getElementById("lightbox-pdf");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox({ image, title, caption, pdf }) {
  if (!lightbox) return;
  lightbox.hidden = false;
  document.body.classList.add("is-lightbox-open");
  lightboxImage.src = image;
  lightboxImage.alt = title || "Expanded figure";
  lightboxTitle.textContent = title || "Figure";
  lightboxCaption.textContent = caption || "";
  lightboxPdf.href = image;
  lightboxPdf.textContent = "Open Figure";
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.hidden = true;
  document.body.classList.remove("is-lightbox-open");
  lightboxImage.src = "";
}

document.querySelectorAll(".js-open-figure").forEach((node) => {
  node.dataset.pdf = node.dataset.image;
  node.addEventListener("click", () => {
    openLightbox({
      image: node.dataset.image,
      title: node.dataset.title,
      caption: node.dataset.caption,
      pdf: node.dataset.pdf
    });
  });
});

document.querySelectorAll(".figure-actions").forEach((container) => {
  const trigger = container.querySelector(".js-open-figure");
  const link = container.querySelector("a.button--ghost");
  if (!trigger || !link) return;

  link.href = trigger.dataset.image;
  link.textContent = "Open Figure";
});

lightboxClose?.addEventListener("click", closeLightbox);
document.querySelectorAll("[data-close-lightbox]").forEach((node) => {
  node.addEventListener("click", closeLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});

const navLinks = [...document.querySelectorAll(".top-nav a")];
const observedSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const siteHeader = document.querySelector(".site-header");

function setActiveNavByHash(hash) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === hash);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveNavByHash(link.getAttribute("href"));
  });
});

function updateActiveNavOnScroll() {
  if (!observedSections.length) return;

  const headerHeight = siteHeader?.offsetHeight || 0;
  const probeY = headerHeight + 24;
  let activeSection = observedSections[0];

  observedSections.forEach((section) => {
    const { top } = section.getBoundingClientRect();
    if (top <= probeY) {
      activeSection = section;
    }
  });

  const nearBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

  if (nearBottom) {
    activeSection = observedSections[observedSections.length - 1];
  }

  setActiveNavByHash(`#${activeSection.id}`);
}

let navTicking = false;

function requestNavUpdate() {
  if (navTicking) return;
  navTicking = true;
  window.requestAnimationFrame(() => {
    updateActiveNavOnScroll();
    navTicking = false;
  });
}

window.addEventListener("scroll", requestNavUpdate, { passive: true });
window.addEventListener("resize", requestNavUpdate);

updateActiveNavOnScroll();

document.querySelectorAll(".full-table").forEach((table) => {
  const rows = [...table.querySelectorAll("tbody tr")];
  if (!rows.length) return;

  const dataCells = rows.map((row) => [...row.querySelectorAll("td")]);
  const columnCount = dataCells[0].length;

  for (let col = 1; col < columnCount; col += 1) {
    const numericCells = dataCells
      .map((cells) => cells[col])
      .filter(Boolean)
      .map((cell) => ({ cell, value: Number.parseFloat(cell.textContent.trim()) }))
      .filter((item) => Number.isFinite(item.value));

    if (!numericCells.length) continue;

    const maxValue = Math.max(...numericCells.map((item) => item.value));
    numericCells.forEach((item) => {
      if (item.value === maxValue) {
        item.cell.classList.add("cell--best");
      }
    });
  }
});
