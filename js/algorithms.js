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
    { id: 'graphics', label: 'Graphics', test: hasTopic('graphics') },
    { id: 'ai', label: 'AI', test: hasTopic('ai') },
  ];

  const list = document.getElementById('project-list');
  const filterBar = document.getElementById('filters');
  const status = document.getElementById('filter-status');
  const empty = document.getElementById('empty-state');

  const projects = (window.PROJECTS || [])
    .filter((p) => p.section === 'algorithms')
    .sort(window.ProjectCards.compare);

  const cards = projects.map((project, i) => {
    const card = window.ProjectCards.create(project, {
      linkLabel: 'Try on PC →',
      onToggle: (open) => { if (window.Sound) window.Sound.keys(open ? 5 : 3); },
    });
    card.classList.add('reveal');
    card.style.setProperty('--delay', `${(i % 3) * 0.08}s`);
    list.append(card);
    return { project, card };
  });
  const grid = window.ProjectCards.layout(list);

  const chips = FILTERS.map((filter) => {
    const count = projects.filter(filter.test).length;
    const chip = window.Site.el('button', { type: 'button', class: 'chip', 'data-filter': filter.id, 'aria-pressed': 'false' }, filter.label);
    chip.disabled = count === 0;
    chip.append(window.Site.el('span', { class: 'chip-count' }, String(count)));
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
    grid.update();
    if (updateHash) {
      const base = location.pathname + location.search;
      history.replaceState(null, '', filter.id === 'all' ? base : `${base}#${filter.id}`);
    }
  }

  const count = document.getElementById('project-count');
  if (count) count.textContent = String(projects.length);

  apply(location.hash.slice(1) || 'all', false);
  window.addEventListener('hashchange', () => apply(location.hash.slice(1) || 'all', false));
  window.Site.reveal(document.querySelectorAll('.reveal'));
})();
