/*
  All projects on the site. The Algorithms and Games pages list every project in their section.

  To add a project, copy one of the objects below and fill in:
    id           unique, lowercase with dashes, e.g. "pixel-snake"
    title        project name
    section      "algorithms" (Algorithms and Utilities) or "games" (Games and Fun)
    kind         "professional" or "hobby"
    topics       for Algorithms and Utilities: any of "data-quality", "geo", "tools" (used by the filter chips)
    date         "YYYY-MM", used to sort newest first
    summary      one sentence shown on the card
    description  longer text shown when the card is expanded; a list of paragraphs
    image        path to an image, 16:10 works best (e.g. "assets/projects/pixel-snake.png")
    imageAlt     short description of the image, or "" if it is only decoration
    tags         short keywords
    complexity   optional, e.g. "O(n log n)"
    link         URL to the project or live demo, or null
    source       optional URL to the source code
    play         for games: URL of a playable page; the Games page shows a Play button that opens it in a pop-up
    playHint     for games: one line about the controls, shown under the pop-up
    example      true for placeholder projects; delete the line for real ones
*/
window.PROJECTS = [
  {
    id: 'pixel-snake',
    title: 'Pixel Snake',
    section: 'games',
    kind: 'hobby',
    date: '2026-06',
    summary: 'The classic snake game in 8-bit style, with a chiptune soundtrack generated in the browser.',
    description: [
      'Steer the snake with the arrow keys or by swiping, eat the apples and avoid your own tail. The speed goes up every ten apples.',
      'All music and sound effects are generated live with the Web Audio API, so the whole game is a few kilobytes.',
    ],
    image: 'assets/projects/pixel-snake.svg',
    imageAlt: 'A pink pixel snake chasing a yellow apple on a dark purple grid',
    tags: ['JavaScript', 'Canvas', 'Web Audio'],
    link: 'games/pixel-snake/index.html',
    play: 'games/pixel-snake/index.html',
    playHint: 'Arrow keys, WASD or swipe to steer · Space to pause · Esc to close',
    example: true,
  },
  {
    id: 'tiny-tower-defense',
    title: 'Tiny Tower Defense',
    section: 'games',
    kind: 'hobby',
    date: '2025-12',
    summary: 'Place towers along a winding path and stop the pixel invaders before they reach the castle.',
    description: [
      'Three tower types, eight waves and a boss. Towers can be upgraded between waves with the coins you collect.',
      'The invaders find their way with a flow field, so they reroute when you build in their path.',
    ],
    image: 'assets/projects/tower-defense.svg',
    imageAlt: 'Pixel towers along a winding path with small invaders walking on it',
    tags: ['Game', 'Flow field', 'Canvas'],
    link: null,
    example: true,
  },
  {
    id: 'pathfinder-playground',
    title: 'Pathfinder Playground',
    section: 'algorithms',
    kind: 'hobby',
    topics: ['geo'],
    date: '2026-03',
    summary: 'Watch A*, Dijkstra and breadth-first search race to find a route through a maze you draw.',
    description: [
      'Draw walls on the grid, move the start and goal, and see how each algorithm explores the map step by step.',
      'A counter shows how many cells each algorithm visited, which makes the difference between the heuristics easy to see.',
    ],
    image: 'assets/projects/pathfinder.svg',
    imageAlt: 'A grid maze with a highlighted route from start to goal',
    tags: ['A*', 'Graphs', 'JavaScript'],
    complexity: 'O(E log V)',
    link: 'https://example.com/',
    source: 'https://example.com/',
    example: true,
  },
  {
    id: 'terrain-contours',
    title: 'Terrain Contours',
    section: 'algorithms',
    kind: 'hobby',
    topics: ['geo'],
    date: '2026-01',
    summary: 'Topographic contour lines traced from a noise field with marching squares, as on the front page of this site.',
    description: [
      'A height field is built from layered simplex noise, and marching squares traces the contour lines cell by cell, with every fifth line drawn stronger like an index contour on a real map.',
      'It runs in real time at 30 frames per second, and the mouse raises a small hill that the lines flow around.',
    ],
    image: 'assets/projects/contours.svg',
    imageAlt: 'Teal contour lines on a dark background',
    tags: ['Marching squares', 'Simplex noise', 'Canvas'],
    complexity: 'O(w × h)',
    link: 'index.html',
    example: true,
  },
  {
    id: 'address-wash',
    title: 'Address Wash',
    section: 'algorithms',
    kind: 'professional',
    topics: ['data-quality', 'tools'],
    date: '2025-11',
    summary: 'Cleans and standardises lists of Danish addresses against the official address register.',
    description: [
      'Takes a messy list of addresses, matches every line against the national address register and returns a clean, standardised address with a match score.',
      'Handles typos, abbreviations like "blvd." and missing postcodes with fuzzy matching.',
    ],
    image: 'assets/projects/address-wash.svg',
    imageAlt: 'Messy address lines on the left turned into clean, checked addresses on the right',
    tags: ['Data quality', 'C#', 'Fuzzy matching'],
    complexity: 'O(n · k)',
    link: null,
    example: true,
  },
  {
    id: 'sudoku-duel',
    title: 'Sudoku Duel',
    section: 'games',
    kind: 'hobby',
    date: '2025-08',
    summary: 'A sudoku solver that explains its reasoning step by step, then challenges you to beat it.',
    description: [
      'Enter any puzzle and the solver fills it in using the same techniques a person would, explaining each step.',
      'In duel mode you race the solver on a fresh puzzle. It deliberately slows down on the easy levels.',
    ],
    image: 'assets/projects/sudoku.svg',
    imageAlt: 'A partly solved sudoku grid',
    tags: ['Backtracking', 'TypeScript'],
    link: null,
    example: true,
  },
  {
    id: 'word-hunt',
    title: 'Word Hunt',
    section: 'games',
    kind: 'hobby',
    date: '2025-02',
    summary: 'Find as many Danish and English words as you can in a 4×4 letter grid before the time runs out.',
    description: [
      'Drag across neighbouring letters to make words. Longer words score more, and a trie of both dictionaries checks every word instantly.',
      'After each round you can see all the words you missed.',
    ],
    image: 'assets/projects/word-hunt.svg',
    imageAlt: 'A 4×4 grid of letter tiles with a word traced across them',
    tags: ['Trie', 'Game', 'TypeScript'],
    link: null,
    example: true,
  },
  {
    id: 'geohash-explorer',
    title: 'Geohash Explorer',
    section: 'algorithms',
    kind: 'hobby',
    topics: ['geo', 'tools'],
    date: '2025-04',
    summary: 'Click anywhere on a map to see its geohash, and watch the cell shrink as the hash gets longer.',
    description: [
      'Geohashes turn a latitude and longitude into a short string by repeatedly splitting the world in two. The explorer draws each split, so you can see why nearby places share a prefix.',
      'Handy for picking the right precision for a spatial index.',
    ],
    image: 'assets/projects/geohash.svg',
    imageAlt: 'A map grid split into nested geohash cells',
    tags: ['Geohash', 'Spatial index', 'Leaflet'],
    complexity: 'O(precision)',
    link: 'https://example.com/',
    source: 'https://example.com/',
    example: true,
  },
  {
    id: 'csv-profiler',
    title: 'CSV Profiler',
    section: 'algorithms',
    kind: 'professional',
    topics: ['data-quality', 'tools'],
    date: '2024-10',
    summary: 'Drop in a CSV file and get a profile of every column: types, empty values, duplicates and outliers.',
    description: [
      'A quick first look at a new data delivery before it goes anywhere near a database. Every column gets a type guess, a fill rate, the most common values and a list of suspicious rows.',
      'It runs entirely in the browser, so the file never leaves your computer.',
    ],
    image: 'assets/projects/csv-profiler.svg',
    imageAlt: 'A table of columns with fill-rate bars and warnings',
    tags: ['TypeScript', 'Web Workers', 'Data profiling'],
    complexity: 'O(n)',
    link: null,
    example: true,
  },
];
