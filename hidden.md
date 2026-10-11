# Easter eggs and hidden features

Things on the site that aren't obvious at first glance, page by page.

## Everywhere

- **Sound is off by default.** The speaker button in the corner turns on generated music (Web Audio, no audio files) and sound effects. Each page has its own track:

  | Page | Track |
  |---|---|
  | Main | Slow, warm synth chords with a soft wind texture |
  | Career | Calm lo-fi piano loop |
  | Algorithms | Light synthwave loop with arpeggio, bass and soft drums |
  | Games | Cheerful 8-bit chiptune |

- **The sound choice is remembered** across pages and visits. Browsers only allow audio after a user action, so a remembered "on" starts at your first click or key press.
- **Everything pauses while the tab is hidden**, both the animated background and the music.
- **"Reduce motion" is respected.** With the OS setting on, every background draws a single still frame and nothing fades or slides in.
- **Light and dark mode** follow the OS setting, and the canvas backgrounds recolour live when it changes.

## Main page

- **The background is a living contour map.** The terrain slowly drifts and changes shape.
- **The mouse raises a hill** that the contour lines flow around.
- **Clicking or tapping drops a wave** into the terrain: a ring that travels outwards and fades.
- **The three destinations are summits.** Each link has its own hill topped by its icon and tinted in its colour (amber, blue, red). The land rises under them as the page opens.
- **Hovering or tabbing to a destination raises its summit higher**, and with sound on it plays a short blip in its own pitch.

## Career page

- **The background is a drifting map grid** (a conic map projection) with softly pulsing "cities". The single amber point is *home*.
- **The route line draws itself as you scroll.** Each station lights up when the line reaches it, and with sound on it chimes. Consecutive chimes walk up a pentatonic scale, so scrolling down plays a little melody.
- **Hovering a stop on the line map** at the top chimes too, and clicking it jumps to that station.
- **The numbers update themselves.** "Years in software" and the company count are calculated from the timeline data, so they stay correct each year. The related companies DM Partner, iDQ, bdq and BiQ count as one.
- **Printing shows the whole route line**, whatever the scroll position.

## Algorithms page

- **The background runs a real algorithm**, picked at random on each visit: A* search, Dijkstra, quicksort, heapsort or insertion sort. The title block shows its name, its complexity and live stats ("37 of 52 nodes visited", "412 comparisons").
- **Pause and Next buttons** in the title block's "Now" row pause it or switch to the next algorithm.
- **Pick the algorithm in the URL** with `?bg=`: `algorithms.html?bg=astar`, `dijkstra`, `quicksort`, `heapsort` or `insertion`.
- **Filters are linkable.** The chosen filter goes into the URL hash, e.g. `algorithms.html#geo` or `#data-quality`, so a filtered view can be shared.
- **With sound on:** filter chips click like a mechanical key, and opening or closing a card plays a short burst of keyboard typing.
- **The Picture Morpher card is a video**, playing only while it's on screen.

## Games page

### Star Catcher, the hidden mini-game

- **Type the Konami code** (↑ ↑ ↓ ↓ ← → ← → B A) anywhere on the page. The page dims and the starfield background turns into a game.
- **On a touch screen**, tap the small `↑↑↓↓←→←→BA` text in the footer instead.
- **How to play:** catch the falling coins with your ship. Invaders zigzag down too, so shoot them.

  | Action | Controls |
  |---|---|
  | Move | Arrow keys, A/D, the mouse or a finger |
  | Shoot | Space, W or ↑, or hold the mouse button or a finger down |
  | Quit | Esc or the "Quit game" button |

- **Scoring:** a coin is worth 1 point and an invader 2. Shooting a coin also counts as catching it.
- **Lives:** a missed coin costs a life, and so does an invader that reaches the ground or your ship. You have three lives.
- **It gets harder:** coins and invaders come faster and more often as your score goes up.

### Other details

- **Pixel cursor trail.** The mouse leaves a short, fading trail of pixels.
- **Parallax starfield.** Stars drift at three speeds over scrolling pixel hills, like an old side-scroller, and shift slightly as you scroll.
- **Sound effects:** hovering a cartridge plays a jump sound, and opening a card or pressing Play plays a coin sound.
- **High scores.** Pixel Snake saves your best score, and the card shows it as a `HI 0042` badge after you close the game.
- **Pixel Snake details:** it speeds up every ten apples, Space pauses, and Esc closes the pop-up from inside the game. It uses the page's sound, so the speaker button applies to it too.
- **The Themed Bullet Heaven card changes picture.** Opening it swaps the screenshot for a boss fight in another theme.
