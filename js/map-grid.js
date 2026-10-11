/*
  Career page background: a faint map grid of latitude arcs and meridians (like a conic map projection)
  drifting slowly, with a few softly pulsing points, like cities on a map. The amber point is "home".
  Pauses while the tab is hidden; draws a single still frame with "reduce motion" on.
*/
(function () {
  'use strict';

  const SPACING = 72;          // px between latitude lines
  const MERIDIAN_GAP = 96;     // px between meridians, measured mid-screen
  const RADIAL_SPEED = 4;      // px per second the grid drifts down
  const ANGULAR_SPEED = 0.0012; // radians per second the grid turns
  const PULSE_SECONDS = 4;
  const POINT_COUNT = 11;

  const reduceMotion = window.Site.reduceMotion;
  const view = window.Site.backdrop({
    colors: {
      line: ['--grid-line', 'rgba(154, 171, 181, 0.07)'],
      major: ['--grid-major', 'rgba(154, 171, 181, 0.14)'],
      point: ['--grid-point', 'rgba(53, 208, 192, 0.75)'],
      home: ['--grid-home', 'rgba(242, 165, 65, 0.9)'],
    },
    resize,
    update: (dt) => { time += dt; },
    draw,
  });
  if (!view) return;
  const { ctx, colors } = view;

  let cx = 0, cy = 0, rMin = 0, rMax = 0, aMin = 0, aMax = 0, dA = 0.05;
  let time = 0;

  // Points live in grid coordinates (u along the arcs, v along the meridians, both 0..1) so they drift with the grid.
  const points = Array.from({ length: POINT_COUNT }, (_, i) => ({
    u: i === 0 ? 0.62 : Math.random(),
    v: i === 0 ? 0.3 : Math.random(),
    phase: Math.random() * PULSE_SECONDS,
    home: i === 0,
  }));

  function resize() {
    const { width, height } = view;
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
  }

  function draw() {
    const { width, height } = view;
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

  view.begin();
})();
