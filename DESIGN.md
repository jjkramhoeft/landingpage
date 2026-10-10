---
name: JJKramhoeft Landing Page
description: The Atlas of Side Projects. One night-map terrain, four themed pages.
colors:
  night-map-slate: "#0d1418"
  night-map-glow: "#12303a"
  night-map-surface: "rgba(17, 27, 34, 0.82)"
  night-map-surface-strong: "rgba(22, 35, 44, 0.95)"
  night-map-line: "rgba(160, 200, 210, 0.16)"
  night-map-text: "#e7eef1"
  night-map-muted: "#9aabb5"
  day-map-paper: "#eef3f4"
  day-map-text: "#10222b"
  day-map-muted: "#4a606d"
  contour-teal: "#35d0c0"
  contour-teal-day: "#0b7a70"
  route-amber: "#f2a541"
  route-amber-day: "#9a5a06"
  blueprint-blue: "#5aa2ff"
  blueprint-blue-day: "#1f66c9"
  blueprint-night: "#0a1726"
  signal-green: "#4cf5a0"
  signal-green-day: "#0a8a55"
  marquee-red: "#e9584c"
  marquee-red-day: "#b3261e"
  console-brass: "#c9a04a"
  console-brass-day: "#7a5c12"
  arcade-charcoal: "#14110e"
  console-cream: "#efe6d4"
  console-cream-muted: "#a99c88"
  console-paper: "#f3ecdf"
  cartridge-shell: "#2b2520"
  cartridge-shell-hover: "#352e27"
  label-edge: "#0e0c0a"
  on-coin: "#14110e"
typography:
  display:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(3rem, 10.5vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  sheet-display:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 7vw, 4.75rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-lead:
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "ui-monospace, Cascadia Code, SF Mono, Consolas, Liberation Mono, monospace"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.14em"
  blueprint-display:
    fontFamily: "ui-monospace, Cascadia Code, SF Mono, Consolas, Liberation Mono, monospace"
    fontSize: "clamp(2rem, 6vw, 3.4rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  arcade-display:
    fontFamily: "Press Start 2P, ui-monospace, monospace"
    fontSize: "clamp(1.6rem, 6vw, 3rem)"
    fontWeight: 400
    lineHeight: 1.3
  arcade-label:
    fontFamily: "Press Start 2P, ui-monospace, monospace"
    fontSize: "0.65rem"
    fontWeight: 400
    lineHeight: 1
rounded:
  none: "0px"
  chip: "6px"
  blueprint: "8px"
  tile: "14px"
  card: "18px"
  pill: "999px"
spacing:
  gutter: "16px"
  gutter-wide: "28px"
  card-gap: "20px"
  card-pad: "18px 20px"
  portal-pad: "28px 4px"
  section: "64px"
  section-wide: "72px"
  header: "60px"
  container: "1120px"
  container-narrow: "880px"
components:
  summit-label:
    textColor: "{colors.night-map-text}"
    typography: "{typography.headline}"
    padding: "{spacing.portal-pad}"
  project-card:
    backgroundColor: "{colors.night-map-surface}"
    textColor: "{colors.night-map-text}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-pad}"
  project-card-blueprint:
    backgroundColor: "{colors.night-map-surface}"
    rounded: "{rounded.blueprint}"
  project-card-cartridge:
    backgroundColor: "{colors.cartridge-shell}"
    rounded: "{rounded.none}"
    padding: "18px 10px 10px"
  project-card-cartridge-hover:
    backgroundColor: "{colors.cartridge-shell-hover}"
  icon-button:
    backgroundColor: "{colors.night-map-surface}"
    textColor: "{colors.night-map-muted}"
    rounded: "{rounded.pill}"
    size: "40px"
  icon-button-on:
    textColor: "{colors.contour-teal}"
  pill-button:
    textColor: "{colors.night-map-text}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
  badge:
    textColor: "{colors.night-map-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 8px"
  filter-chip:
    backgroundColor: "{colors.night-map-surface}"
    textColor: "{colors.night-map-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "8px 14px"
  filter-chip-active:
    textColor: "{colors.night-map-text}"
  coin-button:
    backgroundColor: "{colors.console-brass}"
    textColor: "{colors.on-coin}"
    typography: "{typography.arcade-label}"
    rounded: "{rounded.none}"
    padding: "10px 14px"
---

# Design System: JJKramhoeft Landing Page

## Overview

**Creative North Star: "The Atlas of Side Projects"**

The site is a bound atlas of one person's work. Every page is a sheet from the same atlas. The main page is the night-map cover, covered in drifting contour lines. The Career sheet is a transit route, the Algorithms sheet a blueprint, and the Games sheet an old games console in a dark room. They share one printing: the same slate ground, the same see-through panels, the same card anatomy, header, footer and sound toggle. A sheet changes only its background, accent, heading font and card shape. The projects are what the atlas is for, so the chrome stays thin and lets them lead.

Components are **crafted instruments**. Every card has a small, precise, hand-made detail that belongs to its sheet: corner brackets and a scan line on the blueprint, grip ridges and stepped pixel corners on the cartridge, a round logo badge on the route. These details are what make the site recognisable, and they show up where a person looks, not as decoration spread across the page. Behind everything, one `<canvas>` runs a slow generative background (noise contours, a pathfinding or sorting run, a parallax starfield, a pulsing map grid). It is dimmed well back, pauses when the tab is hidden, and becomes a still frame under reduced motion.

Dark ("Night over the map") is the default, and light follows the OS setting with its own darker, readable accent values. Density is calm: one content column of at most 1120px, generous section spacing, and body text kept to about 60 characters per line.

**Key Characteristics:**
- One shared base with themed sheets, where only theme tokens change from page to page.
- One accent per sheet, and in the arcade a second one (brass).
- See-through panels floating over a live, dimmed generative canvas.
- One small hand-made detail per component that belongs to its sheet.
- System sans for reading, monospace for labels, data and anything "technical".
- Sound and motion are opt-in or polite, never required.

## Colors

The palette is a map legend: a deep night-slate ground with one saturated ink per sheet, plus darker "day" versions of each ink for light mode.

### Primary
- **Contour Teal** (#35d0c0, day #0b7a70): the home accent and the site-wide default `--accent`. It colours the contour lines, portrait ring, brand mark, focus outline, links, the sound toggle's "on" state and the Career stations.

### Secondary
- **Route Amber** (#f2a541, day #9a5a06): the Career sheet. It colours the route line, periods, fact numbers and the kicker, and it is the Career card's accent on the main page.
- **Blueprint Blue** (#5aa2ff, day #1f66c9): the Algorithms sheet accent. It colours the braces, chip counts and card hover borders, and it is the Algorithms card's accent on the main page.
- **Signal Green** (#4cf5a0, day #0a8a55): the blueprint's "active" state only. It marks pressed filter chips, opened cards, the `$`/`>` prompt glyphs, the kicker and the live stats readout.

### Tertiary
- **Marquee Red** (#e9584c, day #b3261e): the Games sheet accent, like the red trim on an old console. It colours the ampersand in the title, the trim band, the label edge of a picked-up cartridge, toggle hover borders and text selection, and it is the Games card's accent on the main page.
- **Console Brass** (#c9a04a, day #7a5c12): the arcade's second accent, used sparingly. It colours coin buttons (Play), the hi-score badge, the cartridge count, the thin line under the trim band and the second colour in the joystick icon.

### Neutral
- **Night Map Slate** (#0d1418): the ground on home and Career, with a soft **Night Map Glow** (#12303a) pooled in an ellipse at the top of the page.
- **Blueprint Night** (#0a1726): the Algorithms ground, under a fine 24px grid with a stronger line every 120px.
- **Arcade Charcoal** (#14110e): the warm Games ground, with **Console Cream** text (#efe6d4) and **Cream Muted** (#a99c88). **Cartridge Shell** (#2b2520, hover #352e27) is the plastic of the cartridge shells, and the **Label Edge** (#0e0c0a) frames each label. **On-Coin** (#14110e) is the dark ink on brass. The game pop-up is always this dark screen. In light mode the arcade turns to **Console Paper** (#f3ecdf) with warm dark ink (#221c16), muted #665a4b and a #d8ccb6 shell with a #4a4036 label edge.
- **Night Map Surface** (rgba(17, 27, 34, 0.82)) and **Surface Strong** (rgba(22, 35, 44, 0.95)): the see-through card and panel fill. Each sheet retints these to its own ground.
- **Night Map Line** (rgba(160, 200, 210, 0.16)): every hairline border and divider. Each sheet retints it (blue on the blueprint, cream on the arcade).
- **Night Map Text** (#e7eef1) and **Muted** (#9aabb5): text and secondary text. In light mode they become **Day Map Paper** (#eef3f4), **Day Map Text** (#10222b) and **Day Map Muted** (#4a606d).

### Named Rules
**The One Ink Per Sheet Rule.** Each page has exactly one accent (the arcade has two: marquee red and console brass). The main page is the only place where all the inks appear together, and only as the per-destination `--card-accent` on the three summits, where each ink also tints its own summit's contour rings.

**The Day Ink Rule.** Every accent has a darker day version for light mode, chosen so text stays readable. A new accent isn't finished until its day version exists and is defined in a `prefers-color-scheme: light` block.

**The Signal Is State Rule.** Signal Green means "active, pressed or running". It is never used for decoration or as a second brand colour.

## Typography

**Display Font:** system-ui (with -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial)
**Body Font:** the same system sans stack
**Label/Mono Font:** ui-monospace (with Cascadia Code, SF Mono, Consolas, Liberation Mono)
**Arcade Font:** Press Start 2P (self-hosted, SIL OFL, Latin and Latin Extended subsets, so æ, ø and å work)

**Character:** A neutral, native sans does the reading so the projects and canvases carry the personality. The monospace is the atlas's annotation hand, used for taglines, kickers, periods, badges, tags, filter chips and complexity notes. Each sheet swaps its headings to that sheet's voice: monospace on the blueprint, pixel type in the arcade.

### Hierarchy
- **Display** (700, clamp(3rem, 10.5vw, 6rem), line-height 0.98, tracking -0.035em): the name on the main page, set as the title of the map sheet. It is the largest type on the site.
- **Sheet Display** (700, clamp(2.5rem, 7vw, 4.75rem), line-height 1.05, tracking -0.025em): the Career title ("From COWI to BiQ"). Blueprint and arcade titles use their own display roles below.
- **Headline** (700, clamp(1.6rem, 3.5vw, 2.1rem), tracking -0.015em): section titles.
- **Title** (700, 1.15–1.2rem on project and station cards, line-height 1.3): card titles. The main-page summit labels are larger (clamp(1.55rem, 2.7vw, 2.05rem), line-height 1.12).
- **Body** (400, 1rem, line-height 1.5; card text 1.55–1.6): all running text. Lead paragraphs step up to 1.05–1.125rem at line-height 1.65–1.7, with a max width of 56–62ch.
- **Label** (monospace, 0.7–0.95rem, tracking 0.06–0.14em, often uppercase): taglines, kickers, badges, periods and tags.
- **Blueprint Display** (monospace 700, clamp(2rem, 6vw, 3.4rem), line-height 1.1): Algorithms headings, wrapped in Blueprint Blue `{ }` braces.
- **Arcade Display** (Press Start 2P 400, clamp(1.6rem, 6vw, 3rem), line-height 1.3): the Games title, in cream with a Marquee Red ampersand and no shadow, left-aligned above the trim band. Arcade labels and buttons drop to 0.55–0.8rem.

### Named Rules
**The Annotation Rule.** Anything that reads like data (dates, periods, counts, complexity, tags, filter labels, stats) is set in monospace. Anything that reads like prose is set in the system sans.

**The Pixel Font Stays In The Arcade Rule.** Press Start 2P appears only on the Games page and in its games. It is never used for body text, and it is used at no more than about 0.8rem outside the title.

## Layout

The layout is one centred column with a maximum width of 1120px (the Career timeline narrows to 880px). Side gutters are 16px, widening to 28px from 720px up. Sections breathe with 64px of vertical padding (72px from 720px up). On subpages the content starts below a 60px fixed header plus 40–56px of air. The main page has no header. It reads as a map sheet: the title block (portrait beside the name from 720px, monospace tagline, a short intro at most 54ch wide) sits left-aligned in the top-left corner, and the three destinations sit below it on the terrain as summits.

Cards sit in CSS grids with a 20px gap. The three summits stack on mobile. From 880px they spread across three columns with a 48px gap, staggered vertically (Career 72px down, Algorithms at the top, Games 128px down) so they scatter across the terrain instead of lining up in a row. Project cards use an auto-fill grid with a 250px minimum column. The blueprint intro becomes a two-column split (text plus a 340px "title block" spec table) from 900px. The site nav appears in the header from 640px; below that, the brand and sound toggle are enough. Project images are 16:10.

**The Shared Chassis Rule.** Header, footer, sound toggle, container widths, gutters, breakpoints and the card structure (media, body, badges, title, summary, expanding details, actions) are identical on every sheet. A new page is a new theme on this same base, not a new layout.

## Elevation & Depth

Depth is **layered over terrain**. The animated canvas is the lowest layer (z-index 0, pointer-events off, dimmed). The content floats just above it on see-through panels, and the fixed header adds a 10px backdrop blur over 75% ground. At rest, depth comes from transparency and a hairline border rather than shadow. Glows appear in response to interaction: a hovered summit rises on the canvas (more rings, brighter accent) while its label stays put, a reached station badge lights up with a ring and a teal halo, and the drawn route line glows. The arcade is the one local exception, using hard pixel bevels (inset light and dark 3px edges) and stepped clip-path corners instead of soft shadows.

### Shadow Vocabulary
- **Ambient panel** (`box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35)`; day `0 12px 32px rgba(16, 40, 50, 0.12)`): the portrait frame. It is the only resting shadow.
- **Portrait halo** (`box-shadow: 0 0 0 8px color-mix(in srgb, var(--accent) 10%, transparent)`): a faint teal ring around the portrait.
- **Route glow** (`box-shadow: 0 0 12px color-mix(in srgb, var(--line-color) 45%, transparent)`): the drawn route line.
- **Station reached** (`box-shadow: 0 0 0 3px var(--station), 0 0 22px color-mix(in srgb, var(--station) 45%, transparent)`): a station badge once the route line reaches it.
- **Pixel bevel** (`box-shadow: inset -2px -2px 0 rgba(0,0,0,0.28), inset 2px 2px 0 rgba(255,255,255,0.3)`): arcade coin buttons. When pressed, it flips to `inset 2px 2px 0 rgba(0,0,0,0.28)` and the button moves 2px down.

### Named Rules
**The Glow Is A Response Rule.** Panels are flat and see-through at rest. Accent-coloured light appears only for hover, focus, open or "reached". A glow that is always on means something is wrong.

**The Canvas Stays Behind Rule.** The generative background is dimmed until it cannot compete with the text (for example at 0.6 opacity on the blueprint). It never takes pointer events, pauses when the tab is hidden, and becomes a still frame under reduced motion.

## Shapes

The base shape is gently rounded: cards at 18px, fact tiles at 14px, circles for the portrait, brand mark, icon buttons and station badges, and full pills for badges and the "more" toggle. Each sheet changes the corners as part of its theme. The blueprint tightens to engineering corners (8px on cards, 6px on chips and toggles). The arcade removes rounding entirely and cuts stepped 8px pixel notches with `clip-path`. Borders are always 1px hairlines in the sheet's line colour. Heavier strokes (1.5–4px) are kept for meaningful lines: the route, the title block frame, cartridge label borders and the portrait ring. Line icons are 24px-grid SVGs with a 1.8 round stroke in `currentColor`. The arcade's pixel sprites are the exception and fill with their own colours.

**The Circle Means Identity Rule.** Circles are reserved for identity: the portrait, the JJK brand mark, company logos in station badges, person avatars and the round sound toggle. Content cards are never circular.

## Components

### Buttons
- **Icon button** (sound toggle): a 40px circle with a hairline border on a see-through surface, in Muted ink. Hover brightens the ink to Text. When on (`aria-pressed="true"`), the border and ink turn the sheet accent. On the main page it floats fixed in the top-right corner with an 8px backdrop blur.
- **Pill toggle** ("more" on project cards): transparent, hairline border, full pill, 8px 14px, 0.9rem at weight 600. Hover turns the border to the card accent. The blueprint version is 6px radius, monospace, with a Signal Green `$ ` prefix. The arcade version is square, with a 2px border and pixel type.
- **Coin button** (Play, arcade actions): Console Brass with On-Coin ink, pixel type at 0.65rem, square with a soft pixel bevel. A stepped pixel triangle is drawn in front of "Play" with `clip-path`, never a ▶ glyph. Hover brightens it slightly, and pressing it pushes it in.
- **Links in cards**: accent-coloured, weight 600, no underline until hover. The secondary link uses the Text colour.

### Chips
- **Filter chip** (blueprint): 6px radius, see-through surface, hairline blue border, monospace 0.85rem in Muted, with a count in Blueprint Blue. Hover gives a blue border and Text ink. When pressed, the border becomes a double Signal Green line (border plus inset 1px) and the count turns green. Disabled chips are shown at 45% opacity.
- **Badge**: a monospace pill (0.7rem, 600, uppercase, tracking 0.06em) with a hairline border. The section badge takes the card accent. **The placeholder badge is dashed**: `badge-example` marks made-up content and must stay visible until the content is real.
- **Tag**: a monospace 0.75rem label on a 13% tint of the card accent, 6px radius (square in the arcade).

### Cards / Containers
- **Summit label** (main page): each destination is labelled like a peak on a map, not boxed as a card. There is no panel or border. A bare 36px line icon in the destination's ink is the summit symbol, with a ground-coloured drop-shadow halo. Below it come a large title, a teaser at most 34ch wide, and a call to action with an arrow. A radial halo in the ground colour (88%) clears the contour lines behind the text only. Hover or focus: the summit rises on the canvas, the symbol scales 1.12, the title takes the ink, and the arrow slides 4px to the right. Focus also draws a 2px outline in the ink. Each destination carries its sheet's ink as `--card-accent`.
- **Project card** (shared base): an 18px panel with overflow clipped, a 16:10 media well with a hairline bottom border, and a body padded 18px 20px with badges, title, summary, expanding details (a grid-rows 0fr→1fr transition over 0.3s) and actions. Hover or open changes the border to 60% accent. It is rendered from `data/projects.js`, never written by hand.
- **Station card** (Career): an 18px panel next to a round logo badge on the route line. It opens with a timetable row: the start year large in monospace (700, clamp(1.5rem, 3.6vw, 1.95rem), amber, or teal on the education line), then the exact period small and muted. Below that come the title and the pinned location. Several roles at one company appear as smaller ring stops on the line. Related companies share one tinted group card. Arriving from the line map (`:target`), the card's border takes the line colour and gets an offset accent shadow.
- **Fact tile** (Career, no-JS fallback only): a 14px panel whose amber number sits over a muted label. Once the line map is drawn, the facts become its dimension labels instead.

### Navigation
- **Header** (subpages only): fixed, 60px, 75% ground with a 10px backdrop blur and a hairline bottom border. On the left, the JJK brand mark (a 32px circle ringed in the accent) with the name. On the right, the nav links (Muted, 8px radius, surface background on hover or when current) and the sound toggle. Below 640px the nav links are hidden.
- **Footer**: a hairline top border, the copyright line and LinkedIn/GitHub links, in Muted at 0.9rem.

### Blueprint Card (signature)
Eight 14px×2px corner brackets drawn with background gradients 6px inside the card. On hover or open they turn Signal Green and move out to 3px. A faint 4px scan-line texture fades in over the image, and a Signal Green scan band sweeps down it every 1.8s. Complexity notes print as `complexity: O(n log n)`.

### Cartridge Card (signature)
A charcoal plastic shell with stepped pixel corners and dark grip ridges across the top. The image and body sit inside a 4px Label Edge. Hover or open lifts it 4px in two steps (`steps(2)`), lightens the plastic and turns the label edge Marquee Red. Cartridges keep their own height (the grid aligns to the top), so opening one never stretches its neighbours. Badges go square with pixel type, and the hi-score badge is solid Console Brass.

### Trim Band (signature)
A Marquee Red stripe (6px) over a Console Brass line (2px), 2px apart, with stepped 2px pixel ends, set under the Games title at the title's width. It loads in once as the page opens, left to right in 12 pixel steps (0.9s), which is the arcade's one authored moment; under reduced motion it is simply there. A thinner version (3px red over 1px brass) runs along the bottom of the game pop-up's bar.

**The Grown-Up Arcade Rule.** The arcade earns its charm through restraint: pixel type, cartridges, a slow starfield and one trim band. No HUD line, hopping sprites, blinking text, ornament glyphs or offset text shadows. The cursor trail is a faint single-colour pixel trail (`--trail`), and the Konami easter egg stays hidden in the footer.

### Route Line (signature)
A 6px line in the Route Amber (experience) or Contour Teal (education) track, drawn as a scaled bar that grows as the visitor scrolls. A dotted segment marks gaps. Station badges light up as the line reaches them.

### Line Map (signature)
The Career hero: the whole route on one horizontal line, drawn to true time scale from the first school year to today, like the strip map above a train door. It is built from `data/career.js`. A teal education stretch, a dotted gap and an amber work stretch run between terminus bars, and every station is a 16px ring (3px, line colour, filled with the ground). Its short name stands slanted above the line (-45°, or -70° on phones so stations two years apart stay clear). A monospace decade scale bar runs underneath, and dimension brackets mark the stretches the facts measure (M.Sc. under DTU; years in software and companies under the work line). The facts are set as big monospace numbers aligned under their brackets. Each station links to its card in the timeline; hover or focus fills the ring and scales it 1.3×, turns the name to the line colour and, with sound on, chimes up the scale. The line draws itself once, left to right, as the page opens (about 1.4s, exponential ease-out); under reduced motion it is simply there.

### Summits (signature)
The main page's terrain is the map the destinations sit on. `Background.peaks(elements, anchor)` in `js/background.js` raises a standing hill under each destination, topped exactly at its summit symbol, and follows it on scroll. Near a summit the noise is smoothed away (up to 80%), so its contours close into clean concentric rings, about seven at rest (height 0.75) and about twelve when hovered (1.25). A gradient redraws the contours in the destination's ink (85% at the summit, 55% halfway, fading to nothing). Its outer circle is centred about one radius below the summit, so the tint reaches a little above the symbol and much further down over the destination's text, tinting each summit amber, blue or red and blending into the teal terrain. The land rises once as the page opens. Under reduced motion the summits are drawn standing, and hover raises them instantly.

The terrain itself drifts and changes shape slowly (`DRIFT_SPEED` 0.006, `EVOLVE_SPEED` 0.022), so the visitor drives the big changes: the pointer raises a wide hill (radius 240px, height 0.7) that the lines flow around, and a click or tap sends a ring-shaped wave out from that point (420px/s, fading over 2.6s) with a short bump where it started. Waves only run while the map is animating.

## Do's and Don'ts

### Do:
- **Do** theme a new page by overriding only the theme tokens (`--bg`, `--bg-glow`, `--surface`, `--line`, `--text`, `--muted`, `--accent`, `--radius`) and the heading font in its own stylesheet. Keep the shared base untouched.
- **Do** give every new accent a day version in a `prefers-color-scheme: light` block, and check text contrast in both modes.
- **Do** give each component one crafted detail that belongs to its sheet (brackets, ridges, badges, prompt glyphs). Put it where the visitor's attention already is.
- **Do** set dates, counts, tags, periods and technical notes in the monospace stack.
- **Do** keep every generative background on the single `#bg` canvas: dimmed, pointer-events off, paused when hidden, and a still frame under `prefers-reduced-motion`.
- **Do** use `translate` for entrance animations (the `rise` keyframe) so they don't clash with the `transform` used on hover.
- **Do** keep project images at 16:10 and let `data/projects.js` drive every card.

### Don't:
- **Don't** give a sheet a second layout, header or card structure. Page themes change tokens and details, not the base.
- **Don't** put more than one accent on a subpage (the arcade's console brass is the only second accent), or use Signal Green for anything but active state.
- **Don't** use resting shadows or always-on glows on cards. Light is a response to interaction.
- **Don't** use Press Start 2P outside the Games page, or for body text.
- **Don't** make content cards circular. Circles mean identity.
- **Don't** autoplay sound, or animate anything that ignores reduced motion or hidden tabs.
- **Don't** hide the dashed placeholder badge on made-up content, or present placeholder illustrations as real project imagery.
