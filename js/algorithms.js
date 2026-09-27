/*
  Algorithms and Utilities page: lists every "algorithms" project from data/projects.js
  with filter chips. The chosen filter is kept in the URL hash, e.g. algorithms.html#geo.
*/
(function () {
  'use strict';

  const hasTopic = (topic) => (p) => (p.topics || []).includes(topic);
  const FILTERS = [
    { id: 'all', label: 'All', test: () => true },
    { id: 'data-quality', label: 'Data quality', test: hasTopic('data-quality') },
    { id: 'geo', label: 'Geo', test: hasTopic('geo') },
    { id: 'tools', label: 'Tools', test: hasTopic('tools') },
    { id: 'professional', label: 'Professional', test: (p) => p.kind === 'professional' },
    { id: 'hobby', label: 'Hobby', test: (p) => p.kind === 'hobby' },
  ];

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const list = document.getElementById('project-list');
  const filterBar = document.getElementById('filters');
  const status = document.getElementById('filter-status');
  const empty = document.getElementById('empty-state');

  const projects = (window.PROJECTS || [])
    .filter((p) => p.section === 'algorithms')
    .sort((a, b) => String(b.date).localeCompare(String(a.date)));

  const cards = projects.map((project, i) => {
    const card = window.ProjectCards.create(project, {
      showSection: false,
      linkLabel: 'Live demo →',
      onToggle: (open) => { if (window.Sound) window.Sound.keys(open ? 5 : 3); },
    });
    card.classList.add('reveal');
    card.style.setProperty('--delay', `${(i % 3) * 0.08}s`);
    list.append(card);
    return { project, card };
  });

  const chips = FILTERS.map((filter) => {
    const count = projects.filter(filter.test).length;
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.dataset.filter = filter.id;
    chip.setAttribute('aria-pressed', 'false');
    chip.disabled = count === 0;
    chip.append(document.createTextNode(filter.label));
    const badge = document.createElement('span');
    badge.className = 'chip-count';
    badge.textContent = String(count);
    chip.append(badge);
    chip.addEventListener('click', () => {
      apply(filter.id, true);
      if (window.Sound) window.Sound.click();
    });
    filterBar.append(chip);
    return chip;
  });

  function apply(id, updateHash) {
    const filter = FILTERS.find((f) => f.id === id) || FILTERS[0];
    let shown = 0;
    cards.forEach(({ project, card }) => {
      const match = filter.test(project);
      card.hidden = !match;
      if (match) shown++;
    });
    chips.forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter.id)));
    status.textContent = filter.id === 'all'
      ? `Showing all ${projects.length} projects`
      : `Showing ${shown} of ${projects.length} projects · ${filter.label}`;
    empty.hidden = shown > 0;
    if (updateHash) {
      const base = location.pathname + location.search;
      history.replaceState(null, '', filter.id === 'all' ? base : `${base}#${filter.id}`);
    }
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

  const count = document.getElementById('project-count');
  if (count) count.textContent = String(projects.length);

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  apply(location.hash.slice(1) || 'all', false);
  window.addEventListener('hashchange', () => apply(location.hash.slice(1) || 'all', false));
  reveal(Array.from(document.querySelectorAll('.reveal')));
})();
