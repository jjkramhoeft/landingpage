/*
  Games and Fun page: lists every "games" project from data/projects.js as a cartridge card.
  Games are played full screen through the card's link.
  Also: the pixel cursor trail and the secret code easter egg.
*/
(function () {
  'use strict';

  const SECRET_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'KeyB', 'KeyA'];
  const reduceMotion = window.Site.reduceMotion;
  const sound = (name) => { if (window.Sound && window.Sound[name]) window.Sound[name](); };

  const list = document.getElementById('project-list');

  // ---- Cards ----

  const games = (window.PROJECTS || [])
    .filter((p) => p.section === 'games')
    .sort(window.ProjectCards.compare);

  games.forEach((project, i) => {
    const card = window.ProjectCards.create(project, {
      linkLabel: 'Open full screen →',
      onToggle: () => sound('coin'),
    });
    card.classList.add('reveal');
    card.style.setProperty('--delay', `${(i % 3) * 0.08}s`);
    card.addEventListener('pointerenter', () => sound('jump'));
    list.append(card);
  });
  window.ProjectCards.layout(list);

  // ---- Secret code: ↑ ↑ ↓ ↓ B A starts Star Catcher in the background ----
  // Typing the code is the only way in; the footer only hints at it.

  let progress = 0;
  window.addEventListener('keydown', (e) => {
    if (window.Starfield && window.Starfield.isPlaying()) return;
    if (e.code === SECRET_CODE[progress]) {
      progress++;
      if (progress === SECRET_CODE.length) {
        progress = 0;
        if (window.Starfield) window.Starfield.startGame();
      }
    } else if (e.code === 'ArrowUp' && progress === 2) {
      // An extra ↑ before the ↓s still leaves ↑ ↑ typed.
    } else {
      progress = e.code === SECRET_CODE[0] ? 1 : 0;
    }
  });

  const quit = document.getElementById('quit-game');
  if (quit) quit.addEventListener('click', () => window.Starfield && window.Starfield.stopGame());

  // ---- Pixel cursor trail ----

  function pixelTrail() {
    const trail = document.getElementById('trail');
    if (!trail || !trail.getContext) return;
    const tctx = trail.getContext('2d');
    const LIFE = 450;
    const SIZE = 6;
    let pixels = [];
    let running = false;
    let dpr = 1;
    // A faint single-colour trail, from the page's --trail colour.
    const color = getComputedStyle(document.documentElement).getPropertyValue('--trail').trim() || '#efe6d4';

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      trail.width = Math.round(window.innerWidth * dpr);
      trail.height = Math.round(window.innerHeight * dpr);
    }

    function draw(now) {
      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      tctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      pixels = pixels.filter((p) => now - p.born < LIFE);
      pixels.forEach((p) => {
        const age = (now - p.born) / LIFE;
        tctx.globalAlpha = (1 - age) * 0.45;
        tctx.fillStyle = color;
        const s = Math.max(2, Math.round(SIZE * (1 - age * 0.5)));
        tctx.fillRect(p.x - s / 2, p.y - s / 2 + age * 10, s, s);
      });
      tctx.globalAlpha = 1;
      if (pixels.length) requestAnimationFrame(draw); else running = false;
    }

    window.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || reduceMotion.matches) return;
      // Snap to a coarse grid so the trail looks pixelated.
      pixels.push({
        x: Math.round(e.clientX / SIZE) * SIZE,
        y: Math.round(e.clientY / SIZE) * SIZE,
        born: performance.now(),
      });
      if (pixels.length > 40) pixels.shift();
      if (!running) {
        running = true;
        requestAnimationFrame(draw);
      }
    }, { passive: true });

    window.addEventListener('resize', resize);
    resize();
  }

  const count = document.getElementById('game-count');
  if (count) count.textContent = String(games.length).padStart(2, '0');

  pixelTrail();
  window.Site.reveal(document.querySelectorAll('.reveal'));
})();
