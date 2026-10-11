/*
  Shared helpers for every page, loaded before the page's own scripts. Also fills in the footer year.

  Site.el(tag, attrs, text)  creates an element
  Site.reveal(nodes)         fades nodes in as they scroll into view (.reveal -> .is-visible)
  Site.reduceMotion          the "prefers reduced motion" media query
  Site.backdrop(options)     runs the animated <canvas id="bg"> behind a page, see below
*/
window.Site = (function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const lightScheme = window.matchMedia('(prefers-color-scheme: light)');

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (text != null) node.textContent = text;
    return node;
  }

  function reveal(nodes) {
    nodes = Array.from(nodes);
    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    nodes.forEach((node) => observer.observe(node));
  }

  /*
    The animated page background on <canvas id="bg">. Returns null if there is no canvas.
    options:
      colors          { key: ['--css-variable', fallback] }, read into view.colors (again when the colour scheme changes)
      resize()        called after the canvas has been sized to the window
      update(dt)      advances the animation by dt seconds, at most 30 times a second
      draw()          draws a frame; the canvas is already cleared and scaled to CSS pixels
      canRun()        whether to animate (default: unless "reduce motion" is on)
      onMotionChange() called when "reduce motion" is switched, before animation stops or starts
      onColors()      called after the colours have been re-read
    The returned view has ctx, width, height, colors, running, start(), stop(), redraw() and begin().
    Call begin() once the page's own setup is done. Pauses while the tab is hidden.
  */
  function backdrop(options) {
    const canvas = document.getElementById('bg');
    if (!canvas || !canvas.getContext) return null;
    const FPS = 30;
    const canRun = () => !document.hidden && (options.canRun ? options.canRun() : !reduceMotion.matches);
    let dpr = 1, rafId = 0, lastFrame = 0;

    const view = {
      ctx: canvas.getContext('2d'),
      width: 0,
      height: 0,
      colors: {},
      running: false,
      start() {
        if (view.running || !canRun()) return;
        view.running = true;
        lastFrame = 0;
        rafId = requestAnimationFrame(frame);
      },
      stop() {
        view.running = false;
        cancelAnimationFrame(rafId);
      },
      redraw() {
        view.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        view.ctx.clearRect(0, 0, view.width, view.height);
        options.draw();
      },
      begin() {
        resize();
        view.start();
      },
    };

    function readColors() {
      const style = getComputedStyle(document.documentElement);
      Object.entries(options.colors || {}).forEach(([key, [name, fallback]]) => {
        view.colors[key] = style.getPropertyValue(name).trim() || fallback;
      });
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      view.width = window.innerWidth;
      view.height = window.innerHeight;
      canvas.width = Math.round(view.width * dpr);
      canvas.height = Math.round(view.height * dpr);
      if (options.resize) options.resize();
      view.redraw();
    }

    function frame(now) {
      rafId = requestAnimationFrame(frame);
      if (now - lastFrame < 1000 / FPS) return;
      const dt = lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0;
      lastFrame = now;
      if (options.update) options.update(dt);
      view.redraw();
    }

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    document.addEventListener('visibilitychange', () => (document.hidden ? view.stop() : view.start()));

    reduceMotion.addEventListener('change', () => {
      if (options.onMotionChange) options.onMotionChange();
      if (canRun()) {
        view.start();
      } else {
        view.stop();
        view.redraw();
      }
    });

    lightScheme.addEventListener('change', () => {
      readColors();
      if (options.onColors) options.onColors();
      view.redraw();
    });

    readColors();
    return view;
  }

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  return { el, reveal, reduceMotion, backdrop };
})();
