const navLinks = [...document.querySelectorAll(".site-nav a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const header = document.querySelector(".site-header");

function setActiveLink(hash) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === hash);
  });
}

function updateActiveLinkOnScroll() {
  if (!sections.length) return;

  const headerOffset = (header?.offsetHeight || 0) + 24;
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= headerOffset) {
      activeSection = section;
    }
  });

  const nearBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;

  if (nearBottom) {
    activeSection = sections[sections.length - 1];
  }

  setActiveLink(`#${activeSection.id}`);
}

let ticking = false;

function requestUpdate() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveLinkOnScroll();
    ticking = false;
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveLink(link.getAttribute("href"));
  });
});

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);

updateActiveLinkOnScroll();
