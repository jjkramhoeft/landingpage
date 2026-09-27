/*
  Main page behaviour: wires the portal cards to the background and sound, and reveals them on scroll.
*/
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function wirePortals() {
    document.querySelectorAll('.portal').forEach((portal, i) => {
      portal.style.setProperty('--delay', `${i * 0.08}s`);
      const enter = () => {
        if (window.Background) window.Background.focus(portal);
        if (window.Sound) window.Sound.blip(Number(portal.dataset.blip) || 330);
      };
      const leave = () => {
        if (window.Background) window.Background.focus(null);
      };
      portal.addEventListener('pointerenter', enter);
      portal.addEventListener('pointerleave', leave);
      portal.addEventListener('focus', enter);
      portal.addEventListener('blur', leave);
    });
  }

  function reveal(nodes) {
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

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  wirePortals();
  reveal(Array.from(document.querySelectorAll('.reveal')));
})();
