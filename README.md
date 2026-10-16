# C S Vineeth - Portfolio

A no-build personal portfolio site in which a single role switch re-frames the same body of work for an ML Engineer, Data Scientist or Applied Scientist audience.

![HTML5](https://img.shields.io/badge/HTML5-static-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-custom%20properties-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-vanilla-F7DF1E?logo=javascript&logoColor=black)
![GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-222222?logo=github&logoColor=white)

## Overview

This repository holds the source of the personal portfolio of C S Vineeth ("Portfolio 3"). The site presents one body of work through three professional lenses. Choosing a role in the header rewrites the headline, the profile spec sheet, the headline metrics, the description of working method, the order of the five work domains and the animated background, and points the resume button at the matching PDF.

All site copy lives in one content file, [`data.js`](data.js). A small engine in [`main.js`](main.js) renders it, so the content can be edited without touching the HTML.

The site is plain HTML, CSS and JavaScript. There is no framework, bundler or build step: the files in the repository root are the files that are served.

## Features

- **Role switch.** Three lenses: ML Engineer (`ml`), Data Scientist (`ds`) and Applied Scientist (`as`). The last choice is remembered in the browser's `localStorage` (key `csv_role`); the default is ML Engineer.
- **Shareable locked views.** Adding `?view=ml`, `?view=ds` or `?view=as` to a page URL fixes the page to one role, hides the switch and keeps the parameter on internal links. This is useful for sending a role-specific link to a recruiter.
- **Five work domains.** Fraud and risk, cybersecurity and IoT anomaly detection, medical imaging and computer vision, genomic and biomedical ML, and NLP and predictive analytics. Each domain has a short description and a one-line framing for each role.
- **Canvas visuals.** A background scene per role (pipeline, signal, benchmark) and a live visual per domain on the work page, drawn on `<canvas>`.
- **Role-specific resumes.** One PDF per role, linked from the resume button and chosen by the active role.
- **Accessibility and responsiveness.** Respects `prefers-reduced-motion` (animation is stopped and a static frame is drawn), uses semantic landmarks and `aria-pressed` on the role buttons, and has responsive breakpoints at 980, 760 and 480 px.

## Pages

| Page | What it is |
|---|---|
| [`index.html`](index.html) | Overview: hero with role switch, role-specific metrics and method, the five domains in role-specific order, experience timeline and contact band |
| [`work.html`](work.html) | The five work domains, each with an animated visual, key figures and a role-specific framing line |
| [`contact.html`](contact.html) | Contact details and the resume download for the active role |

## Tech

| Layer | Choice |
|---|---|
| Markup | HTML5, three static pages |
| Styling | One stylesheet (`styles.css`) using CSS custom properties; the accent colour changes per role |
| Behaviour | Vanilla JavaScript (`main.js`); canvas 2D animation |
| Content | `data.js`, exposed as `window.PORTFOLIO` |
| Fonts | Fraunces, Space Grotesk, Inter and JetBrains Mono, loaded from Google Fonts (the only external request the pages make) |
| Hosting | GitHub Pages, serving the repository root directly |

## Run locally

No installation is needed. From the repository root, start any static file server and open the printed address:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/
```

A local server is the closest match to how the site is served by GitHub Pages.

## Edit the content

Change the text and numbers in [`data.js`](data.js); no HTML edits are required for most updates.

| Section of `data.js` | Controls |
|---|---|
| `identity` | Name, email, location, LinkedIn and GitHub links |
| `roles.ml`, `roles.ds`, `roles.as` | For each role: headline, statement, spec rows, four headline metrics, three method points, résumé path, background scene and the order in which the domains appear |
| `projects` | The five domains: `id`, number, `domain` (name), `tag`, `accent` colour, `viz` (visual type), `desc` (description) and a `lens` line for each role |

A few items are written directly in the HTML rather than in `data.js`: the experience timeline and the floating labels on `index.html`, and the per-domain key figures on `work.html`.

## Deployment

The site is served by GitHub Pages from the repository root, so the entry point `index.html` and every file it references must stay at the top level (`index.html`, `work.html`, `contact.html`, `styles.css`, `data.js`, `main.js` and `resume/`). Moving or renaming any of them breaks the live site and its links.

## Project structure

```text
portfolio/
├── index.html     Overview page (GitHub Pages entry point)
├── work.html      The five work domains
├── contact.html   Contact page
├── styles.css     Site styles, including per-role accent colours
├── data.js        Site content: identity, roles and projects (edit this)
├── main.js        Role engine, locked views and canvas scenes
├── resume/        Resume PDFs
│   ├── CS_Vineeth_ML_Engineer.pdf        linked for the ML Engineer role
│   ├── CS_Vineeth_Data_Scientist.pdf     linked for the Data Scientist role
│   ├── CS_Vineeth_Applied_Scientist.pdf  linked for the Applied Scientist role
│   └── CS_Vineeth_Resume_Full.pdf        combined resume; not linked from the site
├── .gitignore
└── README.md
```

## Limitations and notes

- The figures shown on the site (for example the ROC-AUC, mAP@50 and variant counts) summarise project work that lives outside this repository, partly in private repositories. They are not reproduced or verifiable from the contents of this repository.
- The site depends on JavaScript for the role content: the metric, method and domain sections are filled in by `main.js` from `data.js`.
- The per-role accent colours and background scenes are chosen in `data.js` and `styles.css`; there is no separate theme configuration.

## Credits

Typefaces (Fraunces, Space Grotesk, Inter, JetBrains Mono) are loaded from Google Fonts and remain under their own open-source licences. The site content describes the portfolio owner, C S Vineeth.

## License

No license file - all rights reserved by the respective authors.
