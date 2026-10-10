# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Mainly other developers and curious tinkerers: people who like algorithms, maps, generative graphics and small games, and who come by from GitHub, LinkedIn or a shared link. They are browsing, not evaluating, and success means they explore the projects, open a demo or play a game. Recruiters, companies and friends also visit, but they come second. For them it is enough to find out who Jakob is and see the route his career has taken; the Career page covers that.

## Product Purpose

The personal and career landing page of Jakob Kramhøft (initials JJK): a senior developer and data specialist in Copenhagen with an M.Sc. in Computer Modelling from DTU, who has been programming since his first Commodore 64 in 1984. The site lets people get to know him through what he builds. It has a main page and three subpages:

- **Main page:** a short introduction and a way into the three subpages.
- **Career:** a simple CV, shown as a route with employers, roles, dates and education.
- **Algorithms and Utilities:** professional and hobby projects: algorithms, tools, data quality and geo work.
- **Games and Fun:** games and playful experiments, some playable right on the site.

It works when a visitor keeps clicking because the projects themselves are interesting, and leaves with a sense of a person who builds software that "models and organizes reality, or is just beautiful or fun".

## Positioning

A working data and modelling specialist whose hobby output is as big as his professional record: a long list of real side projects spanning procedural worlds, noise functions, fractals, pathfinding, image generators, VR and Unreal sandboxes, game prototypes and small tools for family. The site shows the work instead of describing it. The unifying idea, "data as a landscape", comes from his background in computer modelling, maps and data quality.

## Operating Context

- Visitors arrive on desktop or phone, usually from LinkedIn, GitHub or a direct link, and browse casually.
- Sound is opt-in. Browsers block autoplay anyway, and the site should never surprise anyone with audio.
- Some projects can be opened or played (hosted on the site, or public source under github.com/jjkramhoeft). Others are private or local and can only be described. Both kinds must look like first-class entries.

## Capabilities and Constraints

- **Stack:** plain static HTML, CSS and JavaScript with no build step. It is hosted on GitHub Pages (`jjkramhoeft/landingpage`, `main` root, `.nojekyll`) and must also run on a small private web server. Local preview: `python -m http.server 8765`.
- **Content as data:** projects live in `data/projects.js` and career entries in `data/career.js`. Adding a project means copying an object; that ease of editing is a requirement (README).
- **One project list, two sections:** each project is `section: "algorithms"` or `section: "games"`, `kind: "professional"`, `"hobby"` or `"tool"`, and has optional `link`, `source` and `play` (a playable pop-up).
- **Built-in behaviours (README):** sound is off by default and the setting is remembered; animated backgrounds run on one `<canvas>`, pause when the tab is hidden and become a still image under reduced motion; light and dark mode both work; subpages have a small fixed header with the name, a link home and the sound toggle, while the main page has only the sound toggle.
- **Undecided:** which projects from `rework.md` get a link, source or playable build, and the final wording for each.

## Brand Commitments

- Name "Jakob Kramhøft", initials **JJK** (never "JK"). Tagline in use: "Developer, Data Specialist, Mathematical Modeling".
- Voice: first person, warm, plain and a little playful. The current intro is the reference: "I build software that models and organizes reality, or is just beautiful or fun!"
- Copyright line: "© 1986-<current year> Jakob Kramhøft".
- Links: LinkedIn `linkedin.com/in/jjkramhoeft`, GitHub `github.com/jjkramhoeft` (the personal account, never the work account `jjk-idq`).
- The site-wide idea "data as a landscape" is the user's own concept, recorded in the README. How it looks is a design decision for later work.

## Evidence on Hand

- **Career:** `resources/experience-education.md` (from LinkedIn, 2026-09-27) and `data/career.js`, with real employer logos in `resources/logos/` (BiQ, bdq, iDQ, DM Partner, COWI, Mobile People, Euman, Kildegaard, DTU).
- **Real projects:** the list in `rework.md` (Chinese Checkers, Mosaic Picture generator, Lego Brick Picture Frame, Sudoku Solver, Dijkstra route, Perlin/Simplex noise, Fractal Generator, Minecraft clone in C#, Aurora Forecast App, ComfyUI custom nodes and more). Most have a name only for now, with no description, date, link or image yet.
- **Placeholders, not evidence:** every entry currently in `data/projects.js` is AI-made example content (`example: true`), and so are the SVG illustrations in `assets/projects/`. They must be replaced, not presented as real work.
- **Not available:** no portrait photo (the hero shows "JJK" initials), no CV PDF (so no download button until one exists), no real project screenshots. Do not invent testimonials, clients, metrics, dates or project details.

## Product Principles

1. **Show the work.** Projects, demos and playable things carry the site, and anything that doesn't lead into real work should get out of the way.
2. **Built for fellow tinkerers.** Write and structure for curious developers first. The career story is there when someone wants it, not pushed on them.
3. **Truthful by default.** Only real projects, real dates and real links. A described-only project is stated honestly rather than dressed up with fake demos.
4. **Easy to grow.** Adding a project stays a copy-and-fill edit in one data file, with no build step.
5. **Delight is opt-in and polite.** Sound, motion and easter eggs reward interest but never block, surprise or slow down someone who just wants to read.

## Accessibility & Inclusion

Respect `prefers-reduced-motion` (a still background replaces the animation), keep text readable in both light and dark mode, never autoplay sound, and keep a skip link and keyboard access to every card, filter and game pop-up.
