/*
  Shared project card, used by the main page and the project pages.

  ProjectCards.create(project, options) returns an <article> that expands in place.
  options:
    showSection  show the "Algorithms & Utilities" / "Games & Fun" badge (default true)
    linkLabel    text for project.link (default "Open project →")
    onToggle     called with true/false when the card opens or closes
    onPlay       if given, projects with a `play` URL get a Play button that calls onPlay(project, button)
    playLabel    text for the Play button (default "Play")

  ProjectCards.compare(a, b) is the sort order the project pages use.
*/
window.ProjectCards = (function () {
  'use strict';

  const SECTION_LABELS = {
    algorithms: 'Algorithms & Utilities',
    games: 'Games & Fun',
  };

  const KIND_LABELS = {
    professional: 'Professional',
    hobby: 'Hobby',
    tool: 'Tool',
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

  function isVideo(src) {
    return /\.(mp4|webm)$/i.test(src);
  }

  // A silent, looping video in place of the image. It only loads and plays while the card is on screen,
  // and it stays on its poster for visitors who prefer reduced motion.
  function createVideo(project) {
    const video = el('video', {
      class: 'project-image',
      src: project.image,
      width: '640',
      height: '400',
      preload: 'none',
      playsinline: '',
      loop: '',
      role: 'img',
      'aria-label': project.imageAlt || '',
    });
    if (project.imagePoster) video.setAttribute('poster', project.imagePoster);
    video.muted = true;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return video;

    new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
    }, { threshold: 0.25 }).observe(video);
    return video;
  }

  function create(project, options) {
    const opts = Object.assign({ showSection: true, linkLabel: 'Open project →' }, options);
    const detailsId = `project-${project.id}-details`;
    const card = el('article', { class: 'project-card', 'data-section': project.section, id: `project-${project.id}` });

    if (project.image) {
      const media = el('div', { class: 'project-media' });
      const image = isVideo(project.image) ? createVideo(project) : el('img', {
        class: 'project-image',
        src: project.image,
        alt: project.imageAlt || '',
        width: '640',
        height: '400',
        loading: 'lazy',
      });
      if (project.imagePosition) image.style.objectPosition = project.imagePosition;
      media.append(image);
      // An optional second image fades in over the first while the card is open.
      if (project.imageOpen) {
        media.append(el('img', {
          class: 'project-image project-image-open',
          src: project.imageOpen,
          alt: project.imageOpenAlt || '',
          width: '640',
          height: '400',
          loading: 'lazy',
          'aria-hidden': 'true',
        }));
      }
      card.append(media);
    }

    const body = el('div', { class: 'project-body' });

    const badges = el('p', { class: 'badges' });
    if (opts.showSection) {
      badges.append(el('span', { class: 'badge badge-section' }, SECTION_LABELS[project.section] || project.section));
    }
    badges.append(el('span', { class: 'badge' }, KIND_LABELS[project.kind] || 'Hobby'));
    if (project.example) badges.append(el('span', { class: 'badge badge-example' }, 'Example'));

    body.append(badges, el('h3', {}, project.title));
    if (project.complexity) {
      body.append(el('code', { class: 'project-complexity', title: 'Time complexity' }, project.complexity));
    }
    body.append(el('p', { class: 'project-summary' }, project.summary));

    const actions = el('div', { class: 'project-actions' });
    if (project.play && opts.onPlay) {
      const play = el('button', { class: 'project-play', type: 'button' }, opts.playLabel || 'Play');
      play.setAttribute('aria-label', `Play ${project.title}`);
      play.addEventListener('click', () => opts.onPlay(project, play));
      actions.append(play);
    }

    // Projects that are only a title so far have nothing to expand, so they get no "Read more".
    const hasDetails = [].concat(project.description || []).length
      || (project.tags && project.tags.length) || project.link || project.source;
    if (!hasDetails) {
      if (actions.childElementCount) body.append(actions);
      card.append(body);
      return card;
    }

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
      if (project.link) links.append(linkTo(project.link, project.linkLabel || opts.linkLabel, 'project-link'));
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
      const images = card.querySelectorAll('.project-image');
      if (images.length > 1) {
        images[0].setAttribute('aria-hidden', String(open));
        images[1].setAttribute('aria-hidden', String(!open));
      }
      if (opts.onToggle) opts.onToggle(open);
    });

    actions.append(toggle);

    body.append(details, actions);
    card.append(body);
    return card;
  }

  // Sort order for the project lists: real projects before examples, then newest first,
  // and undated projects after the dated ones, in the order they appear in data/projects.js.
  function compare(a, b) {
    if (!a.example !== !b.example) return a.example ? 1 : -1;
    if (!a.date !== !b.date) return a.date ? -1 : 1;
    return String(b.date || '').localeCompare(String(a.date || ''));
  }

  return { create, compare, SECTION_LABELS };
})();
