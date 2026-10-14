/*
  Shared project card, used by the Algorithms and Games pages.

  ProjectCards.create(project, options) returns an <article> that expands in place.
  options:
    linkLabel    text for project.link (default "Open project →")
    onToggle     called with true/false when the card opens or closes

  Only one card in a grid is open at a time: opening a card closes the one that was open.
  A card shows the project's date in its bottom right corner.

  ProjectCards.layout(grid) widens the grid column holding the open card and narrows the others,
  so a long description reads at a comfortable line length instead of in a tall, slim card.
  It returns { update }, to call after cards are shown or hidden.

  ProjectCards.compare(a, b) is the sort order the project pages use.
*/
window.ProjectCards = (function () {
  'use strict';

  const el = window.Site.el;

  // How much wider the open card's column is than the others, by number of columns.
  const WIDE_COLUMN = { 2: 1.5, 3: 2 };

  // Opens or closes a card without telling the page, keyed by card.
  const setters = new WeakMap();

  function linkTo(href, label, className) {
    const attrs = { class: className, href };
    if (/^https?:/.test(href)) Object.assign(attrs, { target: '_blank', rel: 'noopener' });
    return el('a', attrs, label);
  }

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // "2024-05" reads as "May 2024"; a plain year such as "2018" stays as it is.
  function formatDate(date) {
    const [year, month] = String(date).split('-');
    return MONTHS[month - 1] ? `${MONTHS[month - 1]} ${year}` : year;
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
    const opts = Object.assign({ linkLabel: 'Open project →' }, options);
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
    if (project.example) badges.append(el('span', { class: 'badge badge-example' }, 'Example'));

    body.append(badges, el('h3', {}, project.title));
    if (project.complexity) {
      body.append(el('code', { class: 'project-complexity', title: 'Time complexity' }, project.complexity));
    }
    body.append(el('p', { class: 'project-summary' }, project.summary));

    const actions = el('div', { class: 'project-actions' });

    const date = project.date
      ? el('time', { class: 'project-date', datetime: project.date }, formatDate(project.date))
      : null;

    // Projects that are only a title so far have nothing to expand, so they get no "Read more".
    const hasDetails = [].concat(project.description || []).length
      || (project.tags && project.tags.length) || project.link || project.source;
    if (!hasDetails) {
      if (date) actions.append(date);
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
    function setOpen(open) {
      card.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Show less' : 'Read more';
      if (open) details.removeAttribute('inert'); else details.setAttribute('inert', '');
      const images = card.querySelectorAll('.project-image');
      if (images.length > 1) {
        images[0].setAttribute('aria-hidden', String(open));
        images[1].setAttribute('aria-hidden', String(!open));
      }
    }
    setters.set(card, setOpen);

    toggle.addEventListener('click', () => {
      const open = !card.classList.contains('is-open');
      if (open && card.parentElement) {
        card.parentElement.querySelectorAll('.project-card.is-open').forEach((other) => setters.get(other)(false));
      }
      setOpen(open);
      card.dispatchEvent(new CustomEvent('project-toggle', { bubbles: true, detail: { open } }));
      if (opts.onToggle) opts.onToggle(open);
    });

    actions.append(toggle);
    if (date) actions.append(date);

    body.append(details, actions);
    card.append(body);
    return card;
  }

  function layout(grid) {
    function update() {
      // A card hidden by a filter can't stay open.
      grid.querySelectorAll('.project-card.is-open[hidden]').forEach((card) => setters.get(card)(false));

      const cols = parseInt(getComputedStyle(grid).getPropertyValue('--cols'), 10) || 1;
      const visible = Array.from(grid.children).filter((card) => !card.hidden);
      const open = visible.findIndex((card) => card.classList.contains('is-open'));
      const wide = open >= 0 && WIDE_COLUMN[cols] ? open % cols : -1;
      const tracks = [];
      for (let i = 0; i < cols; i++) tracks.push(`minmax(0, ${i === wide ? WIDE_COLUMN[cols] : 1}fr)`);
      grid.style.gridTemplateColumns = tracks.join(' ');
    }

    // When another card closes above the one just opened, the opened card moves up and can end up
    // above the top of the screen; bring it back once the columns have settled.
    grid.addEventListener('project-toggle', (e) => {
      update();
      if (!e.detail.open) return;
      const card = e.target;
      setTimeout(() => {
        const header = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
        if (card.getBoundingClientRect().top < header) {
          card.scrollIntoView({ block: 'start', behavior: window.Site.reduceMotion.matches ? 'auto' : 'smooth' });
        }
      }, 380);
    });

    if ('ResizeObserver' in window) new ResizeObserver(update).observe(grid);
    else window.addEventListener('resize', update);
    update();
    return { update };
  }

  // Sort order for the project lists: real projects before examples, then newest first,
  // and undated projects after the dated ones, in the order they appear in data/projects.js.
  function compare(a, b) {
    if (!a.example !== !b.example) return a.example ? 1 : -1;
    if (!a.date !== !b.date) return a.date ? -1 : 1;
    return String(b.date || '').localeCompare(String(a.date || ''));
  }

  return { create, layout, compare };
})();
