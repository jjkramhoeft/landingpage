/*
  Games page background: a parallax pixel starfield over scrolling pixel hills, like an old side-scroller.
  Stars drift left at three speeds and shift slightly as the page scrolls.

  It also hosts the hidden mini-game "Star Catcher" (started by the Konami code, see js/games.js):
  move the ship with the arrow keys, A/D, the mouse or a finger, and catch the falling coins. Invaders zigzag down too:
  shoot them with Space, W or the up arrow, or by holding the mouse button or a finger down. Shooting a coin catches it.
  A missed coin, or an invader
  that reaches the ground or the ship, costs a life. Three lives and it's over.

  Starfield.startGame() / Starfield.stopGame() / Starfield.isPlaying()
  Pauses while the tab is hidden; with "reduce motion" on it draws a still frame (the game still runs if started).
*/
window.Starfield = (function () {
  'use strict';

  const canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return { startGame() {}, stopGame() {}, isPlaying: () => false };
  const ctx = canvas.getContext('2d');

  const FPS = 30;
  const BLOCK = 8; // hill "pixel" size
  const LAYERS = [
    { speed: 5, size: 2, density: 1 / 9000, parallax: 0.03, alpha: 0.45 },
    { speed: 12, size: 3, density: 1 / 22000, parallax: 0.07, alpha: 0.7 },
    { speed: 26, size: 4, density: 1 / 60000, parallax: 0.14, alpha: 0.95 },
  ];
  const HILLS = [
    { speed: 8, base: 0.2, amp: [36, 18], freq: [0.045, 0.13], color: '--land-far' },
    { speed: 20, base: 0.11, amp: [22, 12], freq: [0.07, 0.19], color: '--land-near' },
  ];
  const FONT = '"Press Start 2P", ui-monospace, monospace';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lightScheme = window.matchMedia('(prefers-color-scheme: light)');

  let width = 0, height = 0, dpr = 1;
  let stars = [];
  let colors = readColors();
  let time = 0;
  let running = false, rafId = 0, lastFrame = 0;

  function readColors() {
    const style = getComputedStyle(document.documentElement);
    const get = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
    return {
      star: get('--star', 'rgba(255, 255, 255, 0.85)'),
      star2: get('--star-2', 'rgba(201, 160, 74, 0.8)'),
      '--land-far': get('--land-far', '#1b1713'),
      '--land-near': get('--land-near', '#221d18'),
      hud: get('--coin', '#c9a04a'),
      hud2: get('--games', '#e9584c'),
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    stars = [];
    LAYERS.forEach((layer, li) => {
      const count = Math.round(width * height * layer.density);
      for (let i = 0; i < count; i++) {
        stars.push({
          layer: li,
          x: Math.random() * width,
          y: Math.random() * height,
          yellow: Math.random() < 0.15,
          twinkle: Math.random() < 0.3 ? 1.5 + Math.random() * 3 : 0,
          phase: Math.random() * Math.PI * 2,
        });
      }
    });
    if (game.active) game.shipX = Math.min(Math.max(game.shipX, 30), width - 30);
    draw();
  }

  // Height of a hill column, as a smooth function of its position in the (endless) landscape.
  function hillHeight(hill, column) {
    const h = height * hill.base
      + hill.amp[0] * Math.sin(column * hill.freq[0])
      + hill.amp[1] * Math.sin(column * hill.freq[1] + 1.7);
    return Math.max(BLOCK, Math.round(h / BLOCK) * BLOCK);
  }

  function groundY() {
    return height - hillHeight(HILLS[1], 0) - 10;
  }

  function drawStars() {
    const scroll = window.scrollY;
    stars.forEach((s) => {
      const layer = LAYERS[s.layer];
      let x = (s.x - time * layer.speed) % width;
      if (x < 0) x += width;
      let y = (s.y - scroll * layer.parallax) % height;
      if (y < 0) y += height;
      let alpha = layer.alpha;
      if (s.twinkle) alpha *= 0.55 + 0.45 * Math.sin(time * s.twinkle + s.phase);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.yellow ? colors.star2 : colors.star;
      ctx.fillRect(Math.round(x), Math.round(y), layer.size, layer.size);
    });
    ctx.globalAlpha = 1;
  }

  function drawHills() {
    HILLS.forEach((hill) => {
      const offset = time * hill.speed;
      const first = Math.floor(offset / BLOCK);
      const shift = offset - first * BLOCK;
      ctx.fillStyle = colors[hill.color];
      for (let i = 0; i * BLOCK - shift < width + BLOCK; i++) {
        const h = hillHeight(hill, first + i);
        ctx.fillRect(Math.round(i * BLOCK - shift), height - h, BLOCK, h);
      }
    });
  }

  // ---------------------------------------------------------------- Star Catcher

  const game = {
    active: false, over: false, overTimer: 0, playTime: 0,
    shipX: 0, targetX: null, left: false, right: false,
    coins: [], spawnTimer: 0, score: 0, lives: 3,
    firing: false, fireCooldown: 0, bullets: [],
    invaders: [], invaderTimer: 0, explosions: [],
  };

  function startGame() {
    if (game.active) return;
    Object.assign(game, {
      active: true, over: false, overTimer: 0, playTime: 0, shipX: width / 2, targetX: null,
      left: false, right: false, coins: [], spawnTimer: 0.5, score: 0, lives: 3,
      firing: false, fireCooldown: 0, bullets: [], invaders: [], invaderTimer: 4, explosions: [],
    });
    document.body.classList.add('arcade-game-on');
    if (window.Sound) window.Sound.jump();
    start();
  }

  function stopGame() {
    if (!game.active) return;
    game.active = false;
    game.coins = [];
    game.bullets = [];
    game.invaders = [];
    game.explosions = [];
    document.body.classList.remove('arcade-game-on');
    if (reduceMotion.matches) { stop(); draw(); }
  }

  function shipY() {
    return groundY() - 20;
  }

  function loseLife() {
    if (game.over) return;
    game.lives--;
    if (game.lives <= 0) {
      game.over = true;
      game.overTimer = 0;
      game.firing = false;
      if (window.Sound) window.Sound.over();
    }
  }

  function fire() {
    if (!game.active || game.over || game.fireCooldown > 0) return;
    game.bullets.push({ x: game.shipX, y: shipY() - 18 });
    game.fireCooldown = 0.25;
    if (window.Sound) window.Sound.shoot();
  }

  function explode(x, y) {
    game.explosions.push({ x, y, t: 0 });
    if (window.Sound) window.Sound.boom();
  }

  function updateGame(dt) {
    game.explosions = game.explosions.filter((e) => (e.t += dt) < 0.35);
    if (game.over) {
      game.overTimer += dt;
      if (game.overTimer > 4) stopGame();
      return;
    }
    game.playTime += dt;
    const speed = 380;
    if (game.left) game.shipX -= speed * dt;
    if (game.right) game.shipX += speed * dt;
    if (game.targetX != null) game.shipX += (game.targetX - game.shipX) * Math.min(1, dt * 10);
    game.shipX = Math.min(Math.max(game.shipX, 30), width - 30);

    game.spawnTimer -= dt;
    if (game.spawnTimer <= 0) {
      game.coins.push({ x: 30 + Math.random() * (width - 60), y: 70, vy: 90 + Math.random() * 60 + game.score * 6 });
      game.spawnTimer = Math.max(0.35, 1.1 - game.score * 0.03);
    }

    const ship = shipY();
    game.coins = game.coins.filter((coin) => {
      coin.y += coin.vy * dt;
      // Shooting a coin counts as catching it.
      const shot = game.bullets.findIndex((b) => Math.abs(b.x - coin.x) < 18 && Math.abs(b.y - coin.y) < 18);
      if (shot >= 0) game.bullets.splice(shot, 1);
      if (shot >= 0 || (Math.abs(coin.x - game.shipX) < 34 && Math.abs(coin.y - ship) < 22)) {
        game.score++;
        if (window.Sound) window.Sound.coin();
        return false;
      }
      if (coin.y > groundY() + 12) {
        loseLife();
        return false;
      }
      return true;
    });

    // Invaders start after a few seconds and come more often as the score goes up.
    game.invaderTimer -= dt;
    if (game.invaderTimer <= 0) {
      const baseX = 60 + Math.random() * (width - 120);
      game.invaders.push({ baseX, x: baseX, y: 70, vy: 40 + Math.random() * 25 + game.score * 1.5, phase: Math.random() * Math.PI * 2 });
      game.invaderTimer = Math.max(1.2, 3.5 - game.score * 0.05);
    }

    game.fireCooldown -= dt;
    if (game.firing) fire();
    game.bullets = game.bullets.filter((bullet) => (bullet.y -= 560 * dt) > 60);

    game.invaders = game.invaders.filter((inv) => {
      inv.y += inv.vy * dt;
      inv.x = Math.min(Math.max(inv.baseX + Math.sin(game.playTime * 2 + inv.phase) * 50, 30), width - 30);
      const hit = game.bullets.findIndex((b) => Math.abs(b.x - inv.x) < 26 && Math.abs(b.y - inv.y) < 20);
      if (hit >= 0) {
        game.bullets.splice(hit, 1);
        game.score += 2;
        explode(inv.x, inv.y);
        return false;
      }
      const reachedShip = Math.abs(inv.x - game.shipX) < 40 && Math.abs(inv.y - ship) < 26;
      if (reachedShip || inv.y > groundY()) {
        explode(inv.x, inv.y);
        loseLife();
        return false;
      }
      return true;
    });
  }

  function drawGame() {
    game.coins.forEach((coin) => window.Sprites.draw(ctx, 'coin', coin.x, coin.y, 3));
    game.invaders.forEach((inv) => window.Sprites.draw(ctx, 'invader', inv.x, inv.y, 3));
    ctx.fillStyle = colors.hud;
    game.bullets.forEach((b) => ctx.fillRect(Math.round(b.x) - 2, Math.round(b.y) - 8, 4, 12));
    // An explosion is a ring of pixel squares flying apart.
    game.explosions.forEach((e) => {
      const r = 6 + e.t * 90;
      ctx.globalAlpha = 1 - e.t / 0.35;
      ctx.fillStyle = colors.hud2;
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        ctx.fillRect(Math.round(e.x + Math.cos(a) * r) - 3, Math.round(e.y + Math.sin(a) * r) - 3, 6, 6);
      }
      ctx.globalAlpha = 1;
    });
    if (!game.over) window.Sprites.draw(ctx, 'ship', game.shipX, shipY(), 5);

    // HUD, just below the site header.
    const size = width < 500 ? 9 : 12;
    ctx.font = `${size}px ${FONT}`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillStyle = colors.hud2;
    ctx.fillText('STAR CATCHER', 16, 78);
    ctx.fillStyle = colors.hud;
    ctx.fillText(`SCORE ${game.score}`, 16, 78 + size * 2);
    for (let i = 0; i < game.lives; i++) window.Sprites.draw(ctx, 'heart', 22 + i * 26, 78 + size * 4 + 12, 3);
    if (game.playTime < 6 && !game.over) {
      ctx.fillStyle = colors.hud2;
      ctx.fillText(width < 500 ? 'TAP TO SHOOT' : 'SPACE TO SHOOT', 16, 78 + size * 4 + 32);
    }

    if (game.over) {
      const big = width < 500 ? 16 : 28;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${big}px ${FONT}`;
      ctx.fillStyle = colors.hud2;
      ctx.fillText('GAME OVER', width / 2, height / 2 - big);
      ctx.font = `${Math.round(big * 0.5)}px ${FONT}`;
      ctx.fillStyle = colors.hud;
      ctx.fillText(`YOU SCORED ${game.score}`, width / 2, height / 2 + big * 0.6);
    }
  }

  window.addEventListener('keydown', (e) => {
    if (!game.active) return;
    if (e.code === 'Escape') { stopGame(); return; }
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') { game.left = true; game.targetX = null; e.preventDefault(); }
    if (e.code === 'ArrowRight' || e.code === 'KeyD') { game.right = true; game.targetX = null; e.preventDefault(); }
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') { game.firing = true; fire(); e.preventDefault(); }
    if (e.code === 'ArrowDown') e.preventDefault();
  });

  window.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') game.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') game.right = false;
    if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') game.firing = false;
  });

  // The mouse or a finger steers, and holding it down keeps firing. The Quit button is left alone.
  window.addEventListener('pointermove', (e) => { if (game.active) game.targetX = e.clientX; }, { passive: true });
  window.addEventListener('pointerdown', (e) => {
    if (!game.active || (e.target instanceof Element && e.target.closest('button, a'))) return;
    game.targetX = e.clientX;
    game.firing = true;
    fire();
  }, { passive: true });
  ['pointerup', 'pointercancel', 'blur'].forEach((type) => window.addEventListener(type, () => { game.firing = false; }));

  // ---------------------------------------------------------------- Loop

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    drawStars();
    drawHills();
    if (game.active) drawGame();
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (now - lastFrame < 1000 / FPS) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
    lastFrame = now;
    if (!reduceMotion.matches || game.active) time += dt;
    if (game.active) updateGame(dt);
    draw();
  }

  function start() {
    if (running || document.hidden || (reduceMotion.matches && !game.active)) return;
    running = true;
    lastFrame = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  // With the animation stopped, still redraw when scrolling so the parallax follows.
  window.addEventListener('scroll', () => { if (!running) draw(); }, { passive: true });

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches && !game.active) { stop(); draw(); } else { start(); }
  });

  lightScheme.addEventListener('change', () => {
    colors = readColors();
    draw();
  });

  resize();
  start();

  return { startGame, stopGame, isPlaying: () => game.active };
})();
