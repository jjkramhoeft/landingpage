/*
  Algorithms page background: a dimmed, slowly running algorithm, picked at random on each visit.

  - Graph search: A* or Dijkstra searches a random road-like graph for a route, over and over.
  - Sorting: quicksort, heapsort or insertion sort sorts a row of bars, then reshuffles.

  Add ?bg=astar, dijkstra, quicksort, heapsort or insertion to the URL to pick one.
  The name and complexity of the running algorithm are written into #viz-name and #viz-complexity.
  Pauses while the tab is hidden; draws a single finished frame with "reduce motion" on.
*/
(function () {
  'use strict';

  const canvas = document.getElementById('bg');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');

  const FPS = 30;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lightScheme = window.matchMedia('(prefers-color-scheme: light)');

  const ALGORITHMS = [
    { id: 'astar', mode: 'graph', name: 'A* search', complexity: 'O(E log V)', heuristic: true },
    { id: 'dijkstra', mode: 'graph', name: 'Dijkstra', complexity: 'O(E log V)', heuristic: false },
    { id: 'quicksort', mode: 'sort', name: 'Quicksort', complexity: 'O(n log n)', sort: quickSort, stepsPerFrame: 2 },
    { id: 'heapsort', mode: 'sort', name: 'Heapsort', complexity: 'O(n log n)', sort: heapSort, stepsPerFrame: 2 },
    { id: 'insertion', mode: 'sort', name: 'Insertion sort', complexity: 'O(n²)', sort: insertionSort, stepsPerFrame: 8 },
  ];
  // A specific algorithm can be chosen with ?bg=<id>, e.g. algorithms.html?bg=astar.
  const requested = new URLSearchParams(location.search).get('bg');
  const algo = ALGORITHMS.find((a) => a.id === requested)
    || ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)];

  let width = 0, height = 0, dpr = 1;
  let colors = readColors();
  let running = false, rafId = 0, lastFrame = 0;
  let mode = null;

  function readColors() {
    const style = getComputedStyle(document.documentElement);
    const get = (name, fallback) => style.getPropertyValue(name).trim() || fallback;
    return {
      line: get('--viz-line', 'rgba(120, 170, 255, 0.12)'),
      node: get('--viz-node', 'rgba(150, 190, 255, 0.35)'),
      visited: get('--viz-visited', 'rgba(90, 162, 255, 0.5)'),
      frontier: get('--viz-frontier', 'rgba(76, 245, 160, 0.75)'),
      path: get('--viz-path', 'rgba(76, 245, 160, 0.9)'),
      goal: get('--viz-goal', 'rgba(242, 165, 65, 0.85)'),
      bar: get('--viz-bar', 'rgba(90, 162, 255, 0.16)'),
    };
  }

  const plural = (n, word) => `${n.toLocaleString('en')} ${word}${n === 1 ? '' : 's'}`;

  function caption(stats) {
    const name = document.getElementById('viz-name');
    const complexity = document.getElementById('viz-complexity');
    const detail = document.getElementById('viz-stats');
    if (name) name.textContent = algo.name;
    if (complexity) complexity.textContent = algo.complexity;
    if (detail && stats != null) detail.textContent = stats;
  }

  // ---------------------------------------------------------------- Graph search

  function graphMode() {
    let nodes = [];
    let runs = 0;
    let search = null;

    function build() {
      const count = Math.max(30, Math.min(140, Math.round((width * height) / 15000)));
      const minDist = Math.sqrt((width * height) / count) * 0.55;
      nodes = [];
      let attempts = 0;
      while (nodes.length < count && attempts < count * 60) {
        attempts++;
        const x = 20 + Math.random() * (width - 40);
        const y = 80 + Math.random() * (height - 100);
        if (nodes.every((n) => (n.x - x) ** 2 + (n.y - y) ** 2 > minDist * minDist)) {
          nodes.push({ x, y, edges: [] });
        }
      }
      // Connect each node to its three nearest neighbours, which gives a road-like network.
      const seen = new Set();
      nodes.forEach((a, i) => {
        nodes
          .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
          .filter((o) => o.j !== i)
          .sort((p, q) => p.d - q.d)
          .slice(0, 3)
          .forEach(({ j, d }) => {
            const key = i < j ? `${i}-${j}` : `${j}-${i}`;
            if (seen.has(key)) return;
            seen.add(key);
            a.edges.push({ to: j, w: d });
            nodes[j].edges.push({ to: i, w: d });
          });
      });
    }

    function newSearch() {
      if (runs % 4 === 0) build();
      runs++;
      const start = Math.floor(Math.random() * nodes.length);
      // Pick a goal far from the start so the search has work to do.
      const far = nodes
        .map((n, i) => ({ i, d: Math.hypot(n.x - nodes[start].x, n.y - nodes[start].y) }))
        .sort((p, q) => q.d - p.d)
        .slice(0, Math.max(3, Math.floor(nodes.length / 6)));
      const goal = far[Math.floor(Math.random() * far.length)].i;

      const g = new Float64Array(nodes.length).fill(Infinity);
      const f = new Float64Array(nodes.length).fill(Infinity);
      const h = (i) => (algo.heuristic ? Math.hypot(nodes[i].x - nodes[goal].x, nodes[i].y - nodes[goal].y) : 0);
      g[start] = 0;
      f[start] = h(start);

      search = {
        start, goal, g, f, h,
        came: new Int32Array(nodes.length).fill(-1),
        open: new Set([start]),
        closed: new Set(),
        current: start,
        path: null,
        phase: 'search',
        timer: 0,
        stepClock: 0,
      };
      caption(`0 of ${nodes.length} nodes visited`);
    }

    // One step of A*/Dijkstra: expand the open node with the lowest f.
    function step() {
      const s = search;
      if (!s.open.size) { s.phase = 'fade'; s.timer = 0; return; }
      let best = -1;
      s.open.forEach((i) => { if (best < 0 || s.f[i] < s.f[best]) best = i; });
      s.open.delete(best);
      s.closed.add(best);
      s.current = best;
      if (best === s.goal) {
        s.path = [];
        for (let i = best; i >= 0; i = s.came[i]) s.path.push(i);
        s.path.reverse();
        s.phase = 'found';
        s.timer = 0;
        caption(`${s.closed.size} of ${nodes.length} nodes visited · route in ${plural(s.path.length - 1, 'hop')}`);
        return;
      }
      nodes[best].edges.forEach(({ to, w }) => {
        if (s.closed.has(to)) return;
        const tentative = s.g[best] + w;
        if (tentative < s.g[to]) {
          s.came[to] = best;
          s.g[to] = tentative;
          s.f[to] = tentative + s.h(to);
          s.open.add(to);
        }
      });
      caption(`${s.closed.size} of ${nodes.length} nodes visited`);
    }

    function update(dt) {
      const s = search;
      s.timer += dt;
      if (s.phase === 'search') {
        s.stepClock += dt;
        while (s.stepClock > 1 / 14 && s.phase === 'search') {
          s.stepClock -= 1 / 14;
          step();
        }
      } else if (s.phase === 'found' && s.timer > 3.2) {
        s.phase = 'fade';
        s.timer = 0;
      } else if (s.phase === 'fade' && s.timer > 1) {
        newSearch();
      }
    }

    function finishInstantly() {
      while (search.phase === 'search') step();
      search.timer = 10;
    }

    function dot(x, y, r, color, fill) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (fill) { ctx.fillStyle = color; ctx.fill(); } else { ctx.strokeStyle = color; ctx.stroke(); }
    }

    function draw() {
      const s = search;
      // Network.
      ctx.lineWidth = 1;
      ctx.strokeStyle = colors.line;
      ctx.beginPath();
      nodes.forEach((a, i) => a.edges.forEach(({ to }) => {
        if (to < i) return;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(nodes[to].x, nodes[to].y);
      }));
      ctx.stroke();
      nodes.forEach((n) => dot(n.x, n.y, 2, colors.node, true));

      const fade = s.phase === 'fade' ? Math.max(0, 1 - s.timer) : 1;
      ctx.globalAlpha = fade;

      // Search tree and visited nodes.
      ctx.strokeStyle = colors.visited;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      s.closed.forEach((i) => {
        const from = s.came[i];
        if (from < 0) return;
        ctx.moveTo(nodes[from].x, nodes[from].y);
        ctx.lineTo(nodes[i].x, nodes[i].y);
      });
      ctx.stroke();
      s.closed.forEach((i) => dot(nodes[i].x, nodes[i].y, 3, colors.visited, true));

      // Frontier.
      ctx.lineWidth = 1.5;
      s.open.forEach((i) => dot(nodes[i].x, nodes[i].y, 4.5, colors.frontier, false));

      // Route, drawn out over the first second after it is found.
      if (s.path) {
        const shown = Math.min(1, s.phase === 'found' ? s.timer / 1 : 1) * (s.path.length - 1);
        ctx.strokeStyle = colors.path;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(nodes[s.path[0]].x, nodes[s.path[0]].y);
        for (let k = 1; k <= Math.floor(shown); k++) ctx.lineTo(nodes[s.path[k]].x, nodes[s.path[k]].y);
        const partial = shown - Math.floor(shown);
        if (partial > 0 && Math.floor(shown) + 1 < s.path.length) {
          const a = nodes[s.path[Math.floor(shown)]], b = nodes[s.path[Math.floor(shown) + 1]];
          ctx.lineTo(a.x + (b.x - a.x) * partial, a.y + (b.y - a.y) * partial);
        }
        ctx.stroke();
      } else if (s.phase === 'search') {
        dot(nodes[s.current].x, nodes[s.current].y, 6, colors.frontier, false);
      }

      // Start and goal.
      ctx.lineWidth = 2;
      dot(nodes[s.start].x, nodes[s.start].y, 6, colors.visited, true);
      dot(nodes[s.goal].x, nodes[s.goal].y, 6, colors.goal, true);
      ctx.globalAlpha = 1;
    }

    return {
      resize() { runs = 0; newSearch(); },
      update,
      draw,
      finishInstantly,
    };
  }

  // ---------------------------------------------------------------- Sorting

  function* insertionSort(a) {
    for (let i = 1; i < a.length; i++) {
      for (let j = i; j > 0; j--) {
        yield ['compare', j - 1, j];
        if (a[j - 1] <= a[j]) break;
        swap(a, j - 1, j);
        yield ['swap', j - 1, j];
      }
    }
  }

  function* quickSort(a, lo = 0, hi = a.length - 1) {
    if (lo >= hi) return;
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      yield ['compare', j, hi];
      if (a[j] < pivot) {
        swap(a, i, j);
        yield ['swap', i, j];
        i++;
      }
    }
    swap(a, i, hi);
    yield ['swap', i, hi];
    yield* quickSort(a, lo, i - 1);
    yield* quickSort(a, i + 1, hi);
  }

  function* heapSort(a) {
    function* sift(start, end) {
      let root = start;
      while (2 * root + 1 <= end) {
        const child = 2 * root + 1;
        let target = root;
        yield ['compare', target, child];
        if (a[target] < a[child]) target = child;
        if (child + 1 <= end) {
          yield ['compare', target, child + 1];
          if (a[target] < a[child + 1]) target = child + 1;
        }
        if (target === root) return;
        swap(a, root, target);
        yield ['swap', root, target];
        root = target;
      }
    }
    for (let s = Math.floor((a.length - 2) / 2); s >= 0; s--) yield* sift(s, a.length - 1);
    for (let end = a.length - 1; end > 0; end--) {
      swap(a, 0, end);
      yield ['swap', 0, end];
      yield* sift(0, end - 1);
    }
  }

  function swap(a, i, j) {
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }

  function sortMode() {
    let values = [];
    let steps = null;
    let highlight = null;
    let comparisons = 0;
    let phase = 'sort';
    let timer = 0;

    function reset() {
      const count = Math.max(24, Math.min(120, Math.floor(width / 12)));
      values = Array.from({ length: count }, () => 0.06 + Math.random() * 0.94);
      steps = algo.sort(values);
      highlight = null;
      comparisons = 0;
      phase = 'sort';
      timer = 0;
      caption(plural(0, 'comparison'));
    }

    function advance() {
      const next = steps.next();
      if (next.done) {
        phase = 'sorted';
        timer = 0;
        highlight = null;
        caption(`${plural(comparisons, 'comparison')} · sorted`);
        return;
      }
      highlight = next.value;
      if (highlight[0] === 'compare') comparisons++;
    }

    function update(dt) {
      timer += dt;
      if (phase === 'sort') {
        for (let k = 0; k < algo.stepsPerFrame && phase === 'sort'; k++) advance();
        if (phase === 'sort') caption(plural(comparisons, 'comparison'));
      } else if (phase === 'sorted' && timer > 3.5) {
        reset();
      }
    }

    function finishInstantly() {
      while (phase === 'sort') advance();
      timer = 10;
    }

    function draw() {
      const n = values.length;
      const barWidth = width / n;
      const maxHeight = height * 0.4;
      const sweep = phase === 'sorted' ? Math.min(1, timer / 1.2) * n : 0;
      for (let i = 0; i < n; i++) {
        const h = values[i] * maxHeight;
        const x = i * barWidth + 1;
        const y = height - h;
        let color = colors.bar;
        if (highlight && (highlight[1] === i || highlight[2] === i)) {
          color = highlight[0] === 'swap' ? colors.path : colors.frontier;
        } else if (i < sweep) {
          color = colors.visited;
        }
        ctx.fillStyle = color;
        ctx.fillRect(x, y, Math.max(1, barWidth - 2), h);
      }
    }

    return {
      resize: reset,
      update,
      draw,
      finishInstantly,
    };
  }

  // ---------------------------------------------------------------- Loop

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    mode.resize();
    if (reduceMotion.matches) mode.finishInstantly();
    render();
  }

  function render() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    mode.draw();
  }

  function frame(now) {
    rafId = requestAnimationFrame(frame);
    if (now - lastFrame < 1000 / FPS) return;
    const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
    lastFrame = now;
    mode.update(dt);
    render();
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
    resizeTimer = setTimeout(resize, 200);
  });

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) { stop(); mode.finishInstantly(); render(); } else { start(); }
  });

  lightScheme.addEventListener('change', () => {
    colors = readColors();
    render();
  });

  mode = algo.mode === 'graph' ? graphMode() : sortMode();
  caption();
  resize();
  start();
})();
