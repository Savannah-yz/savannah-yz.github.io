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

The portrait and existing paper figures were supplied in this repository. The EgoTools kitchen image and report apartment image are thumbnails from the user's coauthored project pages. Four simple SVG drawings are decorative illustrations, **not** empirical figures or paper results.

## Design direction

The CV, publication links, Scholar, GitHub, and email are immediately visible. A small interactive robot adds personality beside the content; visitors never need to explore a 3D world to find information. The pale periwinkle palette, rounded sans-serif type, and miniature desk replace the previous serif-and-orbit design.

Spatial portfolio references included https://room.bokoko33.me/ and https://bruno-simon.com/, while https://dennissnellenberg.com/ and https://pablocuello.com/ informed the exploration of navigation and motion. The robot, scene, and layout are original; no portfolio template or third-party artwork was copied. The user's preference explicitly favors direct access to research over game-like navigation.

## Motion and accessibility

The scene respects `prefers-reduced-motion`; visitors can also pause it beside the robot. A saved preference persists between visits. Rendering stops offscreen and while the tab is hidden, with device-pixel ratio capped and updates limited to 30 fps. On reduced motion, the greeting button changes pose without animation. Touch devices retain normal page scrolling. If WebGL is unavailable or loses its context, the static robot illustration remains visible.

Semantic headings, descriptive links, keyboard focus, a skip link, and a collapsible mobile menu are provided. All publication content and CV links work without JavaScript. The UI uses Google Fonts with a system-font fallback; the 3D code and all illustrations are local assets.
