// ============ Nav active link tracking ============
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveLink(hash) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function updateActiveLinkOnScroll() {
  if (!sections.length) return;
  const headerOffset = 90;
  let activeSection = sections[0];
  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= headerOffset) {
      activeSection = section;
    }
  });
  const nearBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 8;
  if (nearBottom) activeSection = sections[sections.length - 1];
  setActiveLink(`#${activeSection.id}`);
}

// ============ Scroll progress bar ============
const progressBar = document.getElementById("scroll-progress");
function updateProgress() {
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const max = h.scrollHeight - h.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  if (progressBar) progressBar.style.width = pct + "%";
}

// ============ Scroll handler ============
let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(() => {
    updateActiveLinkOnScroll();
    updateProgress();
    ticking = false;
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setActiveLink(link.getAttribute("href")));
});

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
updateActiveLinkOnScroll();
updateProgress();

// ============ Fade-in on scroll ============
const fadeEls = document.querySelectorAll(".fade-in");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  fadeEls.forEach((el) => io.observe(el));
} else {
  fadeEls.forEach((el) => el.classList.add("visible"));
}

// ============ Publication card hover glow tracking ============
document.querySelectorAll(".pub-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--glow-x", x + "%");
    card.style.setProperty("--glow-y", y + "%");
  });
});
