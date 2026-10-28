# Zhe Yang · Personal homepage

A static, responsive research homepage for https://savannah-yz.github.io/. This branch contains the playful robot redesign, prepared for review before replacing the published homepage. The committed assets can be served directly without an install or build step.

## Edit and preview

- `index.html`: biography, current projects, experience, honors, and personal notes.
- `data/publications.json`: publication metadata, authors, contributions, and verified links.
- `python3 scripts/build_publications.py`: regenerate publication markup in `index.html` after changing the data. Publication content is delivered as HTML and remains accessible without JavaScript.
- `styles.css`: typography, responsive layout, and print styles.
- `script.js`: publication filters, mobile navigation, and the motion preference.
- `src/robot-scene.js`: an original Three.js miniature robot, built from geometry, with pointer tracking, blinking, and a wave interaction. After editing, run `npm ci` and `npm run build:scene` to update the committed `assets/robot-scene.js`.
- `assets/robot-fallback.svg`: static artwork used without JavaScript or WebGL. Three.js is bundled locally; its MIT license is in `assets/vendor/THREE-LICENSE.txt`.
- `python3 -m http.server 8765 --bind 127.0.0.1`: local preview.

Push `main` to publish through the repository's existing GitHub Pages configuration. The existing HippoCamp project and data-visualization pages are retained.

## CV

The current download is `assets/Resume-YANG_Zhe.pdf`. The two existing PDF paths under `Resume/` also contain the same updated file so older links keep working. These PDFs come from the CV supplied on 28 October 2026; the incorrect hyperlink from InnerFeel to FileGram was removed. The supplied text and typesetting were preserved.

The older TeX and Word files under `Resume/` are historical sources and do **not** reproduce the current PDF. See `Resume/README.md` before compiling.

## Content provenance · checked 28 October 2026

The supplied October 2026 CV is the source for education, positions, contributions, honors, and submission/acceptance status. Public paper metadata and project links were checked against:

- HippoCamp: https://doi.org/10.1007/978-3-032-37016-7_6 and https://hippocamp-ai.github.io/
- Embodied intelligence report: https://arxiv.org/abs/2610.22471 and https://sensenova.ai/has-gpt-6-astra-achieved-embodied-intelligence
- EgoTools: https://arxiv.org/abs/2609.39378 and https://ropedia.github.io/egotools/; EMNLP acceptance follows the supplied CV.
- FileGram: https://arxiv.org/abs/2604.04901 and https://filegram.choiszt.com/
- Secret leakage: https://aclanthology.org/2026.findings-acl.6/
- Memorization: https://arxiv.org/abs/2507.06056 and https://openreview.net/forum?id=6L4UXc7P3h
- RAUIE: https://doi.org/10.1109/AINIT61980.2024.10581499 (publisher may present an anti-bot check).
- InnerFeel: supplied CV only; no verified public URL was found. It remains labeled “Under review”, without an unrelated link.

The portrait and existing paper figures were supplied in this repository. The EgoTools kitchen image and report apartment image are thumbnails from the user's coauthored project pages. InnerFeel’s teaser was extracted from Figure 1 of the manuscript supplied by the user on 28 October 2026. The complete private manuscript is not included in this repository. Three original SVG robot companions replace unavailable paper figures; they are decorative animations, not figures or results from the papers. The ongoing-work character is a procedural toy animation, not a demonstration of a trained policy.

## Design direction and provenance

The CV, publications, Scholar, GitHub, and email remain directly accessible. DM Sans provides larger, lighter body and display type; Caveat is used for the personal reminders. Every publication uses the same image-and-text row. Five paper images can be enlarged in an accessible dialog. The remaining three use small animated SVG robot companions. Current projects are always-visible chapters beside one sticky character scene; optional technical detail and the experience timeline use native HTML disclosures. The timeline has a scroll-driven robot, a continuous path, and an active milestone highlight.

The robot is constructed in `src/robot-scene.js` with Three.js sphere, cylinder, rounded-box, and tube geometry. No downloaded robot model, stock character, portfolio source code, or external texture is used. The ZY badge, paired memory tabs, and side memory module were added for this homepage. Basic screen-faced robots are a common visual motif; this documents implementation provenance rather than claiming that no similar character exists anywhere. Three.js is the rendering library and its MIT license is retained locally.

Spatial portfolio references included https://room.bokoko33.me/ and https://bruno-simon.com/; https://dennissnellenberg.com/ and https://pablocuello.com/ were browsing references for layout and motion. These are references, not source templates. The user prefers immediately readable research content over game-like navigation.

The hero’s research description and both ongoing project chapters follow the supplied CV’s Research Interests and Research Projects sections. The personal-reminder button alternates the user’s two requested sentiments.

## Motion and accessibility

The scene respects `prefers-reduced-motion`; visitors can also pause it beside the robot. A saved preference persists between visits. Rendering stops offscreen and while the tab is hidden, with device-pixel ratio capped and updates limited to 30 fps. On reduced motion, the greeting button changes pose without animation. Touch devices retain normal page scrolling. If WebGL is unavailable or loses its context, the static robot illustration remains visible.

Semantic headings, descriptive links, keyboard focus, a skip link, a collapsible mobile menu, native details disclosures, and a focus-contained figure dialog are provided. Escape closes the figure dialog and returns focus to the originating figure. The reminder and garden motion also respect reduced-motion and pause preferences. All publication content and CV links work without JavaScript. The UI uses Google Fonts with a system-font fallback; the 3D code and all illustrations are local assets.

## Scroll interaction revision · 28 October 2026

The desktop wrapper uses 92% of the viewport instead of a fixed 1160px cap. The type and spacing scale together on larger screens; small-screen media queries retain fixed readable base sizing. Greetings have intrinsic width and stay on one line. The two decorative project diagrams have been removed.

`src/research-scene.js` contains an original procedural character and pick/carry/place sequence. Native page scroll advances the sequence while the scene stays beside the research chapters. A labeled range slider provides direct replay, including keyboard input; dragging turns the miniature. The hero robot can also be turned. Mobile uses normal document flow and the direct controls. Automatic scene motion respects pause/reduced-motion settings and stops offscreen or when the tab is hidden. No research text is gated behind animation.

Implementation references reviewed on GitHub:
- [Drei ScrollControls](https://github.com/pmndrs/drei/blob/master/docs/controls/scroll-controls.mdx): mapping scroll offsets to stages and damping transitions. This site uses native scrolling and Three.js directly; it does not import Drei or create a separate scroll container.
- [Three.js portfolio](https://github.com/adrianhajdin/threejs-portfolio): integrating character motion beside ordinary project and experience content. No models, textures, UI template, or source was copied.
- [GSAP ScrollTrigger documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/): pinned illustration and scroll scrubbing patterns. This implementation uses CSS sticky and browser scroll events, without adding GSAP.

## Timeline and paper companions · 28 October 2026

Download CV and See publications are adjacent in the hero. The header CV link and the redundant experience CV link were removed.

`scripts/buddy_art.py` defines four original SVG companions: a lock, a book, connected nodes, and the timeline traveller. `scripts/build_publications.py` regenerates the three publication illustrations and the marked timeline SVG. The old slogan covers have been removed. Publication titles, descriptions, authors, and destination links are unchanged. SVG animations stop offscreen, on a hidden tab, or with the motion preference; they remain visible as static art without JavaScript.

The timeline path is fitted to the rendered milestone positions, including after resizing or opening a disclosure. Scrolling moves the traveller along the path; hovering or focusing an entry selects it. The text stays visible and keyboard-operable. Reduced motion keeps the character stationary during scrolling and uses a direct pose change when selecting an entry. The global motion control is available even if WebGL is unavailable.
