/*
  Animated topographic background: contour lines of a slowly changing noise field,
  traced with marching squares on a <canvas id="bg">.

  - The mouse raises a gentle "hill" the lines flow around.
  - Background.focus(element) raises a hill under an element (used for the hovered card).
  - Pauses while the tab is hidden; draws a single still frame with "reduce motion" on.
*/
(function () {
  'use strict';

  const canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const CELL = 14;          // grid spacing in CSS pixels
  const SCALE = 1 / 460;    // noise feature size
  const STEP = 0.1;         // height difference between contour lines
  const LEVELS = 12;        // contour lines from -LEVELS*STEP to +LEVELS*STEP
  const FPS = 30;
  const MOUSE_RADIUS = 170;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lightScheme = window.matchMedia('(prefers-color-scheme: light)');

  // ---- 3D simplex noise (after Stefan Gustavson's reference implementation) ----
  const GRAD3 = new Float32Array([
    1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0,
    1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1,
    0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
  ]);
  const perm = new Uint8Array(512);
  const permMod12 = new Uint8Array(512);
  (function seed() {
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) p[i] = i;
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
    }
    for (let i = 0; i < 512; i++) {
      perm[i] = p[i & 255];
      permMod12[i] = perm[i] % 12;
    }
  })();

  const F3 = 1 / 3;
  const G3 = 1 / 6;

  function noise3(xin, yin, zin) {
    const s = (xin + yin + zin) * F3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) * G3;
    const x0 = xin - (i - t);
    const y0 = yin - (j - t);
    const z0 = zin - (k - t);

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
    else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
    else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }

    const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
    const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3;
    const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
    const ii = i & 255, jj = j & 255, kk = k & 255;

    let n = 0;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) {
      const g = permMod12[ii + perm[jj + perm[kk]]] * 3;
      t0 *= t0;
      n += t0 * t0 * (GRAD3[g] * x0 + GRAD3[g + 1] * y0 + GRAD3[g + 2] * z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) {
      const g = permMod12[ii + i1 + perm[jj + j1 + perm[kk + k1]]] * 3;
      t1 *= t1;
      n += t1 * t1 * (GRAD3[g] * x1 + GRAD3[g + 1] * y1 + GRAD3[g + 2] * z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) {
      const g = permMod12[ii + i2 + perm[jj + j2 + perm[kk + k2]]] * 3;
      t2 *= t2;
      n += t2 * t2 * (GRAD3[g] * x2 + GRAD3[g + 1] * y2 + GRAD3[g + 2] * z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) {
      const g = permMod12[ii + 1 + perm[jj + 1 + perm[kk + 1]]] * 3;
      t3 *= t3;
      n += t3 * t3 * (GRAD3[g] * x3 + GRAD3[g + 1] * y3 + GRAD3[g + 2] * z3);
    }
    return 32 * n; // roughly -1..1
  }

  // ---- State ----
  let width = 0, height = 0, dpr = 1, cols = 0, rows = 0;
  let field = new Float32Array(0);
  let colors = readColors();
  let time = Math.random() * 100;
  let running = false, rafId = 0, lastFrame = 0;

  const mouse = { x: 0, y: 0, tx: 0, ty: 0, amp: 0, target: 0, seen: false };
  const focus = { el: null, x: 0, y: 0, radius: 200, amp: 0, target: 0 };

  function readColors() {
    const style = getComputedStyle(document.documentElement);
    return {
      line: style.getPropertyValue('--contour').trim() || 'rgba(53, 208, 192, 0.12)',
      strong: style.getPropertyValue('--contour-strong').trim() || 'rgba(53, 208, 192, 0.3)',
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    cols = Math.ceil(width / CELL) + 2;
    rows = Math.ceil(height / CELL) + 2;
    field = new Float32Array(cols * rows);
    draw();
  }

  function computeField() {
    const z = time * 0.045;
    const drift = time * 0.012;
    const mouseAmp = mouse.amp;
    const focusAmp = focus.amp;
    const mouseR2 = MOUSE_RADIUS * MOUSE_RADIUS;
    const focusR2 = focus.radius * focus.radius;
    let idx = 0;
    for (let gy = 0; gy < rows; gy++) {
      const y = gy * CELL;
      for (let gx = 0; gx < cols; gx++) {
        const x = gx * CELL;
        let v = 0.7 * noise3(x * SCALE + drift, y * SCALE, z)
              + 0.3 * noise3(x * SCALE * 2.3, y * SCALE * 2.3 - drift, z * 1.4 + 17);
        if (mouseAmp > 0.001) {
          const dx = x - mouse.x, dy = y - mouse.y;
          v += mouseAmp * Math.exp(-(dx * dx + dy * dy) / mouseR2);
        }
        if (focusAmp > 0.001) {
          const dx = x - focus.x, dy = y - focus.y;
          v += focusAmp * Math.exp(-(dx * dx + dy * dy) / focusR2);
        }
        field[idx++] = v;
      }
    }
  }

  // Marching squares for one contour level. Corners: a = top-left, b = top-right, c = bottom-right, d = bottom-left.
  function trace(level) {
    for (let gy = 0; gy < rows - 1; gy++) {
      const y = gy * CELL;
      let i = gy * cols;
      for (let gx = 0; gx < cols - 1; gx++, i++) {
        const a = field[i], b = field[i + 1], c = field[i + cols + 1], d = field[i + cols];
        let code = 0;
        if (a > level) code |= 8;
        if (b > level) code |= 4;
        if (c > level) code |= 2;
        if (d > level) code |= 1;
        if (code === 0 || code === 15) continue;

        const x = gx * CELL;
        // Edge crossings: top, right, bottom, left.
        const tx = x + CELL * (level - a) / (b - a);
        const ry = y + CELL * (level - b) / (c - b);
        const bx = x + CELL * (level - d) / (c - d);
        const ly = y + CELL * (level - a) / (d - a);
        const x1 = x + CELL, y1 = y + CELL;

        switch (code) {
          case 1: case 14: ctx.moveTo(x, ly); ctx.lineTo(bx, y1); break;
          case 2: case 13: ctx.moveTo(bx, y1); ctx.lineTo(x1, ry); break;
          case 3: case 12: ctx.moveTo(x, ly); ctx.lineTo(x1, ry); break;
          case 4: case 11: ctx.moveTo(tx, y); ctx.lineTo(x1, ry); break;
          case 6: case 9: ctx.moveTo(tx, y); ctx.lineTo(bx, y1); break;
          case 7: case 8: ctx.moveTo(x, ly); ctx.lineTo(tx, y); break;
          case 5: ctx.moveTo(x, ly); ctx.lineTo(bx, y1); ctx.moveTo(tx, y); ctx.lineTo(x1, ry); break;
          case 10: ctx.moveTo(x, ly); ctx.lineTo(tx, y); ctx.moveTo(bx, y1); ctx.lineTo(x1, ry); break;
        }
      }
    }
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    computeField();
    ctx.lineCap = 'round';
    for (let k = -LEVELS; k <= LEVELS; k++) {
      const major = k % 5 === 0; // every fifth line is an "index contour", as on a real map
      ctx.strokeStyle = major ? colors.strong : colors.line;
      ctx.lineWidth = major ? 1.4 : 1;
      ctx.beginPath();
      trace(k * STEP + 0.0001);
      ctx.stroke();
    }
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (now - lastFrame < 1000 / FPS) return;
    const dt = Math.min((now - lastFrame) / 1000, 0.1);
    lastFrame = now;
    time += dt;

    mouse.x += (mouse.tx - mouse.x) * 0.08;
    mouse.y += (mouse.ty - mouse.y) * 0.08;
    mouse.amp += (mouse.target - mouse.amp) * 0.05;

    if (focus.el) {
      const r = focus.el.getBoundingClientRect();
      focus.x = r.left + r.width / 2;
      focus.y = r.top + r.height / 2;
      focus.radius = Math.max(r.width, r.height) * 0.75;
    }
    focus.amp += (focus.target - focus.amp) * 0.06;

    draw();
  }

  function start() {
    if (running || reduceMotion.matches || document.hidden) return;
    running = true;
    lastFrame = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  // ---- Events ----
  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  window.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    mouse.tx = e.clientX;
    mouse.ty = e.clientY;
    if (!mouse.seen) { mouse.x = mouse.tx; mouse.y = mouse.ty; mouse.seen = true; }
    mouse.target = 0.35;
  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', () => { mouse.target = 0; });

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) { stop(); draw(); } else { start(); }
  });

  lightScheme.addEventListener('change', () => {
    colors = readColors();
    draw();
  });

  window.Background = {
    // Raise a hill under an element (or pass null to let it settle again).
    focus(element) {
      if (element) {
        focus.el = element;
        focus.target = 0.55;
      } else {
        focus.target = 0;
      }
    },
  };

  resize();
  start();
})();
