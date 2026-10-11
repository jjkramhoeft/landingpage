/*
  Main page behaviour: turns the three destinations into summits on the contour map, wires them to sound,
  and reveals them on scroll.
*/
(function () {
  'use strict';

  const portals = document.querySelectorAll('.portal');
  // Each destination is a summit on the contour map; hovering one raises it.
  if (window.Background) window.Background.peaks(portals, '.portal-icon');
  portals.forEach((portal, i) => {
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

  window.Site.reveal(document.querySelectorAll('.reveal'));
})();
