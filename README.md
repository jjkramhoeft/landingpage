# JJKramhoeft Landing Page

A personal and career landing page - for people and companies to get to know me.

## Site map

* Main Landing Page
  * Career
  * Algorithms and Utilities
  * Games and Fun

## Functionality

The main page is just a pleasing landing page which introduces the three subpages.

The Career page is a bit like a simple LinkedIn or CV.

The other two subpages are lists of projects—either professional or hobby projects. Each project is displayed as a card (which can be expanded if necessary) containing a description, an image, and—where applicable—a link.

It should be easy to add projects to the lists.

## Themes

The whole site shares one idea: **data as a landscape**. It is a nod to a background in computer modelling, maps and data quality. Every page uses the same base, a dark slate background with one accent colour per page, and each subpage gives it its own mood.

Rules shared by all pages:

* Sound and music are off by default and start only when the visitor clicks the speaker toggle in the top-right corner, because browsers block autoplay anyway. The choice is remembered between visits.
* Animated backgrounds run on a single `<canvas>` behind the content. They pause when the tab is hidden and are replaced by a still image when the visitor has *reduce motion* turned on.
* Light and dark mode both work. The accent colours are picked so text stays readable in both.
* On the subpages, a small fixed header holds the name, links back to the main page and the sound toggle. The main page has no header, only the sound toggle.

### Main Landing Page

* **Theme:** "Night over the map". A calm, slightly mysterious first impression that invites people to explore.
* **Layout:** A hero with the name, a one-line tagline (e.g. *Senior Developer & Data Specialist*) and a short intro. Below it are three large cards, one per subpage, side by side on desktop and stacked on mobile. Each card has an icon, a title and a one-sentence teaser.
* **Graphic elements:** Thin topographic contour lines, a small portrait in a circular frame, and one icon per card: a compass for Career, a node graph for Algorithms, a joystick for Games. When a card is hovered, the contour lines near it bend towards it.
* **Dynamic background:** Slowly drifting contour lines generated from noise (Perlin/simplex), so it looks like a terrain map that keeps changing. The mouse acts as a gentle "hill" that the lines flow around.
* **Sound/music:** A soft ambient pad with slow, warm synth chords and a faint wind texture. The cards give a quiet, low "blip" on hover.
* **Accent colour:** Teal.

### Career

* **Theme:** "The route travelled". The career is shown as a journey on a map, a nod to the map and spatial work in the CV.
* **Layout:** A vertical timeline drawn as a metro line or route. Each employer is a "station" with its logo, and the roles, dates and location sit next to it. Employers with several roles, like iDQ, become a station with smaller stops. Education follows as a separate branch line. A short "About me" block and contact or LinkedIn links sit at the top, and a "Download CV (PDF)" button sits at the bottom.
* **Graphic elements:** Company logos from `resources/logos/`, each in a round badge so logos of different shapes look consistent. Thin route lines with dotted segments for gaps and small pin markers for locations. The line draws itself as the visitor scrolls.
* **Dynamic background:** A very faint map grid of latitude and longitude lines with a few slowly pulsing points (like cities on a map). It stays subtle so the text stays the focus.
* **Sound/music:** A calm, light piano loop or lo-fi beat. There is an optional soft "station chime" when a new station scrolls into view.
* **Accent colour:** Warm amber for the route line, with the teal from the main page for the stations.

### Algorithms and Utilities

* **Theme:** "The workshop / blueprint". Technical, precise and a bit nerdy.
* **Layout:** A grid of project cards with filter chips at the top (e.g. *Data quality*, *Geo*, *Tools*, *Professional*, *Hobby*). A card expands in place to show the full description, a screenshot or animated demo, the tech used as small tags, and links to the source code or live demo.
* **Graphic elements:** A blueprint look with a monospace font for headings, thin white-blue lines, corner brackets on the cards and small "code" details such as `{ }`, `→` and `O(n log n)`. Each card image could get a thin scan-line hover effect.
* **Dynamic background:** A slowly running algorithm visualisation, for example a graph of nodes and edges where a path-finding algorithm (A*/Dijkstra) repeatedly searches for a route, or bars being sorted. It is dimmed well back, and a new algorithm is picked at random on each visit.
* **Sound/music:** A minimal electronic, synthwave-light loop. Filter chips and card expansions make soft mechanical "click" and keyboard sounds.
* **Accent colour:** Blueprint blue with a small highlight of electric green for "active" states.

### Games and Fun

* **Theme:** "The arcade". Playful, colourful and a clear contrast to the serious pages.
* **Layout:** The same card system as Algorithms and Utilities, so projects are added the same way, but styled as arcade cabinets or game cartridges. Cards can show a "Play" button that opens the game directly, in a modal or a new tab. A small "high score" or "last played" badge on each card is optional.
* **Graphic elements:** A pixel-art font for headings (e.g. *Press Start 2P*) and chunky pixel borders. Small sprites such as coins, hearts and stars. The cursor can leave a short trail of pixels.
* **Dynamic background:** A parallax starfield or scrolling pixel landscape in the style of old side-scrolling games. As a hidden easter egg, typing the Konami code (↑ ↑ ↓ ↓ ← → ← → B A) starts a tiny mini-game in the background.
* **Sound/music:** A cheerful chiptune (8-bit) loop, with coin and jump sound effects on hover and click. Everything can be generated in the browser with the Web Audio API, so no large audio files are needed.
* **Accent colour:** Magenta and yellow, on a deeper purple version of the base background.


## Tech
Should be able to be hosted on GitHub Pages and/or a small private web server.
