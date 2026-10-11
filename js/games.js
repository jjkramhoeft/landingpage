/*
  Games and Fun page: lists every "games" project from data/projects.js as a cartridge card.
  Games with a `play` URL get a Play button that opens them in a pop-up (a <dialog> with an iframe).
  Also: high-score badges, the pixel cursor trail and the Konami code easter egg.
*/
(function () {
  'use strict';

  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
  const reduceMotion = window.Site.reduceMotion;
  const sound = (name) => { if (window.Sound && window.Sound[name]) window.Sound[name](); };

  const list = document.getElementById('project-list');
  const modal = document.getElementById('game-modal');
  const frame = document.getElementById('game-frame');
  const modalTitle = document.getElementById('game-modal-title');
  const modalTab = document.getElementById('game-modal-tab');
  const modalHint = document.getElementById('game-modal-hint');

  function storedNumber(key) {
    try { return Number(localStorage.getItem(key)) || 0; } catch (e) { return 0; }
  }

  // ---- Cards ----

  const games = (window.PROJECTS || [])
    .filter((p) => p.section === 'games')
    .sort(window.ProjectCards.compare);

  const cards = games.map((project, i) => {
    const card = window.ProjectCards.create(project, {
      linkLabel: 'Open full screen →',
      onPlay: openGame,
      onToggle: () => sound('coin'),
    });
    card.classList.add('reveal');
    card.style.setProperty('--delay', `${(i % 3) * 0.08}s`);
    card.addEventListener('pointerenter', () => sound('jump'));
    list.append(card);
    return { project, card };
  });
  window.ProjectCards.layout(list);

  // A game that keeps its best score in localStorage as "jjk-hiscore-<id>" gets a HI badge on its card.
  function refreshScores() {
    cards.forEach(({ project, card }) => {
      const score = storedNumber(`jjk-hiscore-${project.id}`);
      if (!score) return;
      let badge = card.querySelector('.badge-hiscore');
      if (!badge) badge = card.querySelector('.badges').appendChild(window.Site.el('span', { class: 'badge badge-hiscore' }));
      badge.textContent = `HI ${String(score).padStart(4, '0')}`;
    });
  }

  // ---- Game pop-up ----

  function openGame(project) {
    sound('coin');
    modalTitle.textContent = project.title;
    modalTab.href = project.play;
    modalHint.textContent = project.playHint || '';
    modalHint.hidden = !project.playHint;
    frame.title = project.title;
    frame.src = project.play;
    modal.showModal();
    frame.addEventListener('load', () => frame.focus(), { once: true });
  }

  modal.addEventListener('close', () => {
    frame.src = 'about:blank';
    refreshScores();
  });

  document.getElementById('game-modal-close').addEventListener('click', () => modal.close());

  // Clicking the dark backdrop around the pop-up closes it.
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

  // The game asks to close when Esc is pressed inside it (the key doesn't reach this page from the iframe).
  window.addEventListener('message', (e) => {
    if (e.source === frame.contentWindow && e.data && e.data.type === 'jjk-close-game') modal.close();
  });

  // ---- Konami code: ↑ ↑ ↓ ↓ ← → ← → B A starts Star Catcher in the background ----

  let konami = 0;
  window.addEventListener('keydown', (e) => {
    if (modal.open || (window.Starfield && window.Starfield.isPlaying())) return;
    if (e.code === KONAMI[konami]) {
      konami++;
      if (konami === KONAMI.length) {
        konami = 0;
        startEasterEgg();
      }
    } else {
      konami = e.code === KONAMI[0] ? 1 : 0;
    }
  });

  function startEasterEgg() {
    if (window.Starfield) window.Starfield.startGame();
  }

  // A small secret button in the footer does the same, for touch screens.
  const secret = document.getElementById('konami-button');
  if (secret) secret.addEventListener('click', startEasterEgg);
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

  refreshScores();
  pixelTrail();
  window.Site.reveal(document.querySelectorAll('.reveal'));
})();
