/*
  Shared project card, used by the main page and the project pages.

  ProjectCards.create(project, options) returns an <article> that expands in place.
  options:
    showSection  show the "Algorithms & Utilities" / "Games & Fun" badge (default true)
    linkLabel    text for project.link (default "Open project →")
    onToggle     called with true/false when the card opens or closes
    onPlay       if given, projects with a `play` URL get a Play button that calls onPlay(project, button)
    playLabel    text for the Play button (default "Play")
*/
window.ProjectCards = (function () {
  'use strict';

  const SECTION_LABELS = {
    algorithms: 'Algorithms & Utilities',
    games: 'Games & Fun',
  };

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (text != null) node.textContent = text;
    return node;
  }

  function linkTo(href, label, className) {
    const attrs = { class: className, href };
    if (/^https?:/.test(href)) Object.assign(attrs, { target: '_blank', rel: 'noopener' });
    return el('a', attrs, label);
  }

  function create(project, options) {
    const opts = Object.assign({ showSection: true, linkLabel: 'Open project →' }, options);
    const detailsId = `project-${project.id}-details`;
    const card = el('article', { class: 'project-card', 'data-section': project.section, id: `project-${project.id}` });

    if (project.image) {
      const media = el('div', { class: 'project-media' });
      media.append(el('img', {
        class: 'project-image',
        src: project.image,
        alt: project.imageAlt || '',
        width: '640',
        height: '400',
        loading: 'lazy',
      }));
      card.append(media);
    }

    const body = el('div', { class: 'project-body' });

    const badges = el('p', { class: 'badges' });
    if (opts.showSection) {
      badges.append(el('span', { class: 'badge badge-section' }, SECTION_LABELS[project.section] || project.section));
    }
    badges.append(el('span', { class: 'badge' }, project.kind === 'professional' ? 'Professional' : 'Hobby'));
    if (project.example) badges.append(el('span', { class: 'badge badge-example' }, 'Example'));

    body.append(badges, el('h3', {}, project.title));
    if (project.complexity) {
      body.append(el('code', { class: 'project-complexity', title: 'Time complexity' }, project.complexity));
    }
    body.append(el('p', { class: 'project-summary' }, project.summary));

    const details = el('div', { class: 'project-details', id: detailsId, inert: '' });
    const inner = el('div', { class: 'project-details-inner' });
    [].concat(project.description || []).forEach((paragraph) => inner.append(el('p', {}, paragraph)));
    if (project.tags && project.tags.length) {
      const tags = el('ul', { class: 'tags', 'aria-label': 'Tags' });
      project.tags.forEach((tag) => tags.append(el('li', {}, tag)));
      inner.append(tags);
    }
    if (project.link || project.source) {
      const links = el('p', { class: 'project-links' });
      if (project.link) links.append(linkTo(project.link, opts.linkLabel, 'project-link'));
      if (project.source) links.append(linkTo(project.source, 'Source code', 'project-link project-link-secondary'));
      inner.append(links);
    }
    details.append(inner);

    const toggle = el('button', { class: 'project-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': detailsId }, 'Read more');
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      card.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Show less' : 'Read more';
      if (open) details.removeAttribute('inert'); else details.setAttribute('inert', '');
      if (opts.onToggle) opts.onToggle(open);
    });

    const actions = el('div', { class: 'project-actions' });
    if (project.play && opts.onPlay) {
      const play = el('button', { class: 'project-play', type: 'button' }, opts.playLabel || 'Play');
      play.setAttribute('aria-label', `Play ${project.title}`);
      play.addEventListener('click', () => opts.onPlay(project, play));
      actions.append(play);
    }
    actions.append(toggle);

    body.append(details, actions);
    card.append(body);
    return card;
  }

  return { create, SECTION_LABELS };
})();
