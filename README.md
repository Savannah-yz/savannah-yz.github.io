# Zhe Yang · Personal homepage

Live at https://savannah-yz.github.io/. A static, responsive research homepage on GitHub Pages. No install or build step is required to serve it.

## Edit and preview

- `index.html`: biography, current projects, experience, honors, and personal notes.
- `data/publications.json`: publication metadata, authors, contributions, and verified links.
- `python3 scripts/build_publications.py`: regenerate publication markup in `index.html` after changing the data. Publication content is delivered as HTML and remains accessible without JavaScript.
- `styles.css`: typography, responsive layout, and print styles.
- `script.js`: filters, mobile navigation, optional motion, and a canvas illustration using projected 3D rings.
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

## Design references

Original implementation informed by the typographic hierarchy and readable navigation of https://brittanychiang.com/ and the spatial playfulness of https://bruno-simon.com/ (https://github.com/brunosimon/folio-2025). No template code or third-party portfolio artwork was copied. Additional browsing: https://github.com/emmabostian/developer-portfolios.

## Motion and accessibility

The animation respects `prefers-reduced-motion`; visitors can pause it using the header control. Canvas rendering stops offscreen and while the tab is hidden. Touch devices retain normal page scrolling. Semantic headings, descriptive links, keyboard focus, a skip link, and a collapsible mobile menu are provided. Research and CV links work without JavaScript.
