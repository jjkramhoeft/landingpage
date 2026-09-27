/*
  Career page background: a faint map grid of latitude arcs and meridians (like a conic map projection)
  drifting slowly, with a few softly pulsing points, like cities on a map. The amber point is "home".
  Pauses while the tab is hidden; draws a single still frame with "reduce motion" on.
*/
(function () {
  'use strict';

  const canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const SPACING = 72;          // px between latitude lines
  const MERIDIAN_GAP = 96;     // px between meridians, measured mid-screen
  const RADIAL_SPEED = 4;      // px per second the grid drifts down
  const ANGULAR_SPEED = 0.0012; // radians per second the grid turns
  const PULSE_SECONDS = 4;
  const POINT_COUNT = 11;
  const FPS = 30;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lightScheme = window.matchMedia('(prefers-color-scheme: light)');

  let width = 0, height = 0, dpr = 1;
  let cx = 0, cy = 0, rMin = 0, rMax = 0, aMin = 0, aMax = 0, dA = 0.05;
  let colors = readColors();
  let time = 0;
  let running = false, rafId = 0, lastFrame = 0;

  // Points live in grid coordinates (u along the arcs, v along the meridians, both 0..1) so they drift with the grid.
  const points = Array.from({ length: POINT_COUNT }, (_, i) => ({
    u: i === 0 ? 0.62 : Math.random(),
    v: i === 0 ? 0.3 : Math.random(),
    phase: Math.random() * PULSE_SECONDS,
    home: i === 0,
  }));

  function readColors() {
    const style = getComputedStyle(document.documentElement);
    const get = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
    return {
      line: get('--grid-line', 'rgba(154, 171, 181, 0.07)'),
      major: get('--grid-major', 'rgba(154, 171, 181, 0.14)'),
      point: get('--grid-point', 'rgba(53, 208, 192, 0.75)'),
      home: get('--grid-home', 'rgba(242, 165, 65, 0.9)'),
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);

    // The projection's centre sits far above the screen, so latitudes are gentle arcs and meridians fan out.
    cx = width / 2;
    cy = -height * 1.4;
    const corners = [[0, 0], [width, 0], [0, height], [width, height]];
    rMin = -cy - SPACING;
    rMax = Math.max(...corners.map(([x, y]) => Math.hypot(x - cx, y - cy))) + SPACING;
    const angles = corners.map(([x, y]) => Math.atan2(y - cy, x - cx));
    aMin = Math.min(...angles) - 0.05;
    aMax = Math.max(...angles) + 0.05;
    dA = MERIDIAN_GAP / ((rMin + rMax) / 2);
    draw();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    // Latitude arcs. Every fifth line is stronger; the counter keeps that stable while the grid drifts.
    const radialTravel = time * RADIAL_SPEED;
    const radialShift = Math.floor(radialTravel / SPACING);
    let i = 0;
    for (let r = rMin + (radialTravel % SPACING); r < rMax; r += SPACING, i++) {
      ctx.strokeStyle = (i - radialShift) % 5 === 0 ? colors.major : colors.line;
      ctx.beginPath();
      ctx.arc(cx, cy, r, aMin, aMax);
      ctx.stroke();
    }

    // Meridians.
    const angularTravel = time * ANGULAR_SPEED;
    const angularShift = Math.floor(angularTravel / dA);
    let j = 0;
    for (let a = aMin + (angularTravel % dA); a < aMax; a += dA, j++) {
      ctx.strokeStyle = (j - angularShift) % 5 === 0 ? colors.major : colors.line;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * rMin, cy + Math.sin(a) * rMin);
      ctx.lineTo(cx + Math.cos(a) * rMax, cy + Math.sin(a) * rMax);
      ctx.stroke();
    }

    // Pulsing points.
    points.forEach((p) => {
      const u = (p.u + angularTravel / (aMax - aMin)) % 1;
      const v = (p.v + radialTravel / (rMax - rMin)) % 1;
      const a = aMin + u * (aMax - aMin);
      const r = rMin + v * (rMax - rMin);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (x < -40 || x > width + 40 || y < -40 || y > height + 40) return;

      const color = p.home ? colors.home : colors.point;
      const pulse = reduceMotion.matches ? 0.35 : ((time + p.phase) % PULSE_SECONDS) / PULSE_SECONDS;

      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, p.home ? 3.5 : 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = (1 - pulse) * 0.45;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(x, y, 3 + pulse * (p.home ? 30 : 18), 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1;
    });
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (now - lastFrame < 1000 / FPS) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
    lastFrame = now;
    time += dt;
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

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) { stop(); draw(); } else { start(); }
  });

  lightScheme.addEventListener('change', () => {
    colors = readColors();
    draw();
  });

  resize();
  start();
})();
