/*
  Career page: renders the timeline from data/career.js and draws the route line as the visitor scrolls.
  Stations light up (and chime, if sound is on) when the line reaches them.
*/
(function () {
  'use strict';

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const TRIGGER = 0.65; // how far down the viewport the "train" is, 0 = top, 1 = bottom

  const data = window.CAREER || { experience: [], education: [] };
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ---- Helpers ----

  function el(tag, attrs, text) {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
    if (text != null) node.textContent = text;
    return node;
  }

  function parseDate(value) {
    const [year, month] = String(value).split('-').map(Number);
    return { year, month: month || null };
  }

  function formatDate(value) {
    if (!value) return 'Present';
    const d = parseDate(value);
    return d.month ? `${MONTHS[d.month - 1]} ${d.year}` : String(d.year);
  }

  // Counts months inclusively, like LinkedIn: Jan 2012 – Jan 2017 is 5 yrs 1 mo.
  function duration(start, end) {
    const s = parseDate(start);
    const now = new Date();
    const e = end ? parseDate(end) : { year: now.getFullYear(), month: now.getMonth() + 1 };
    if (!s.month || !e.month) return '';
    const months = (e.year - s.year) * 12 + (e.month - s.month) + 1;
    const years = Math.floor(months / 12);
    const rest = months % 12;
    return [
      years ? `${years} yr${years > 1 ? 's' : ''}` : '',
      rest ? `${rest} mo${rest > 1 ? 's' : ''}` : '',
    ].filter(Boolean).join(' ');
  }

  function period(start, end) {
    const span = `${formatDate(start)} – ${formatDate(end)}`;
    const length = duration(start, end);
    return length ? `${span} · ${length}` : span;
  }

  const PIN_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/></svg>';

  function pin(location) {
    const span = el('span', { class: 'pin' });
    span.innerHTML = PIN_SVG;
    span.append(document.createTextNode(location));
    return span;
  }

  function badge(entry) {
    const wrap = el('span', { class: 'station-badge', 'aria-hidden': 'true' });
    if (entry.logoFit === 'contain') wrap.classList.add('fit-contain');
    if (entry.logoBg) wrap.style.setProperty('--logo-bg', entry.logoBg);
    if (entry.logoPosition) wrap.style.setProperty('--logo-position', entry.logoPosition);
    if (entry.logoScale) wrap.style.setProperty('--logo-scale', String(entry.logoScale));
    if (entry.logo) wrap.append(el('img', { src: entry.logo, alt: '', width: '68', height: '68', loading: 'lazy' }));
    return wrap;
  }

  function heading(name, link) {
    const h3 = el('h3');
    if (link) h3.append(el('a', { href: link, target: '_blank', rel: 'noopener' }, name));
    else h3.textContent = name;
    return h3;
  }

  // ---- Stations ----

  function companyStation(company) {
    const roles = company.roles || [];
    const multi = roles.length > 1;
    const li = el('li', { class: `station reveal${multi ? ' station-multi' : ''}` });
    const card = el('div', { class: 'station-card' });

    // The station's period covers all its roles.
    const start = roles.map((r) => r.start).sort()[0];
    const end = roles.some((r) => !r.end) ? null : roles.map((r) => r.end).sort().slice(-1)[0];
    card.append(el('p', { class: 'station-period' }, period(start, end)), heading(company.company, company.link));

    const stops = el('ul', { class: 'stops' });
    roles.forEach((role) => {
      const stop = el('li', { class: 'stop' });
      stop.append(el('p', { class: 'stop-title' }, role.title));
      const meta = el('p', { class: 'stop-meta' });
      if (multi) meta.append(el('span', { class: 'stop-period' }, period(role.start, role.end)));
      const kind = [role.type, role.workplace].filter(Boolean).join(' · ');
      if (kind) meta.append(el('span', {}, kind));
      if (role.location) meta.append(pin(role.location));
      if (meta.childNodes.length) stop.append(meta);
      stops.append(stop);
    });
    card.append(stops);

    li.append(badge(company), card);
    return li;
  }

  function schoolStation(school) {
    const li = el('li', { class: 'station reveal' });
    const card = el('div', { class: 'station-card' });
    card.append(el('p', { class: 'station-period' }, period(school.start, school.end)), heading(school.school, school.link));
    if (school.degree) {
      const stops = el('ul', { class: 'stops' });
      const stop = el('li', { class: 'stop' });
      stop.append(el('p', { class: 'stop-title' }, school.degree));
      stops.append(stop);
      card.append(stops);
    }
    if (school.note) card.append(el('p', { class: 'station-note' }, school.note));
    li.append(badge(school), card);
    return li;
  }

  function addLines(route, withDash) {
    route.prepend(
      el('li', { class: 'route-track', 'aria-hidden': 'true' }),
      el('li', { class: 'route-line', 'aria-hidden': 'true' }),
    );
    if (withDash) route.append(el('li', { class: 'route-dash', 'aria-hidden': 'true' }));
  }

  const NOTE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v11l-5 5H5z"/><path d="M14 20v-5h5"/><path d="M8.5 9h7M8.5 12.5h4"/></svg>';

  // Consecutive companies with the same `group` share one enclosing card, with the group's note at the bottom.
  function groupCard(id) {
    const group = (data.groups || {})[id] || {};
    const li = el('li', { class: 'station-group', 'data-group': id });
    const list = el('ol', { class: 'group-stations' });
    li.append(list);
    if (group.note) {
      const note = el('p', { class: 'group-note' });
      note.innerHTML = NOTE_SVG;
      note.append(document.createTextNode(group.note));
      li.append(note);
    }
    return { id, li, list };
  }

  function render() {
    const work = document.getElementById('experience-route');
    const school = document.getElementById('education-route');
    if (work) {
      let open = null;
      data.experience.forEach((company) => {
        const station = companyStation(company);
        if (!company.group) {
          open = null;
          work.append(station);
          return;
        }
        if (!open || open.id !== company.group) {
          open = groupCard(company.group);
          work.append(open.li);
        }
        open.list.append(station);
      });
      if (data.gap) {
        const gap = el('li', { class: 'route-gap' });
        gap.append(el('strong', {}, `${data.gap.start} – ${data.gap.end}`), document.createTextNode(` · ${data.gap.label}`));
        work.append(gap);
      }
      addLines(work, Boolean(data.gap));
    }
    if (school) {
      data.education.forEach((entry) => school.append(schoolStation(entry)));
      addLines(school, false);
    }
  }

  // ---- Influential persons ----

  function initials(name) {
    const words = name.trim().split(/\s+/);
    return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase();
  }

  function personCard(person) {
    const li = el('li', { class: 'person-card reveal' });
    li.append(el('span', { class: 'person-avatar', 'aria-hidden': 'true' }, initials(person.name)));
    const body = el('div', { class: 'person-body' });
    const links = person.links || [];
    const name = el('h4');
    if (links.length) name.append(el('a', { href: links[0].url, target: '_blank', rel: 'noopener' }, person.name));
    else name.textContent = person.name;
    body.append(name);
    if (person.role) body.append(el('p', { class: 'person-role' }, person.role));
    if (person.text) {
      // The text starts clamped to a few lines; "Read more" shows all of it.
      const textId = `person-${initials(person.name).toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`;
      const text = el('p', { class: 'person-text', id: textId }, person.text);
      const toggle = el('button', { class: 'person-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': textId }, 'Read more');
      toggle.addEventListener('click', () => {
        const open = !li.classList.contains('is-open');
        li.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Show less' : 'Read more';
      });
      body.append(text, toggle);
    }
    if (links.length) {
      const row = el('p', { class: 'person-links' });
      links.forEach((link) => {
        const a = el('a', { href: link.url, target: '_blank', rel: 'noopener' }, link.label);
        a.setAttribute('aria-label', `${person.name} on ${link.label} (opens in a new tab)`);
        row.append(a);
      });
      body.append(row);
    }
    li.append(body);
    return li;
  }

  // Only offer "Read more" where the clamped text actually hides something.
  function updatePersonToggles() {
    document.querySelectorAll('.person-card').forEach((card) => {
      const text = card.querySelector('.person-text');
      const toggle = card.querySelector('.person-toggle');
      if (!text || !toggle || card.classList.contains('is-open')) return;
      toggle.hidden = text.scrollHeight <= text.clientHeight + 1;
      // Cards that never collapse show their links straight away.
      card.classList.toggle('no-toggle', toggle.hidden);
    });
  }

  function renderInfluences() {
    const root = document.getElementById('influences');
    if (!root) return;
    (data.influences || []).forEach((group) => {
      const wrap = el('div', { class: 'influence-group' });
      wrap.append(el('h3', { class: 'influence-heading' }, group.group));
      const list = el('ul', { class: 'person-grid' });
      if (group.people && group.people.length) {
        group.people.forEach((person) => list.append(personCard(person)));
      } else {
        list.append(el('li', { class: 'person-card person-tbd reveal' }, 'To be added'));
      }
      wrap.append(list);
      root.append(wrap);
    });
  }

  // ---- Drawing the route on scroll ----

  const routes = [];
  let reachedCount = 0;

  function layout() {
    routes.forEach((route) => {
      const stations = route.el.querySelectorAll('.station');
      if (!stations.length) return;
      const box = route.el.getBoundingClientRect();
      const badgeBox = (s) => s.querySelector('.station-badge').getBoundingClientRect();
      const first = badgeBox(stations[0]);
      const last = badgeBox(stations[stations.length - 1]);
      route.start = first.top + first.height / 2 - box.top;
      route.end = last.top + last.height / 2 - box.top;
      route.el.style.setProperty('--line-start', `${route.start}px`);
      route.el.style.setProperty('--line-end', `${box.height - route.end}px`);
      route.el.style.setProperty('--dash-top', `${route.end}px`);
      route.stations = Array.from(stations);
    });
    update();
  }

  function update() {
    const trigger = window.innerHeight * TRIGGER;
    routes.forEach((route) => {
      if (!route.stations) return;
      const top = route.el.getBoundingClientRect().top;
      const length = Math.max(route.end - route.start, 1);
      const draw = reduceMotion.matches ? 1 : Math.min(Math.max((trigger - (top + route.start)) / length, 0), 1);
      route.el.style.setProperty('--draw', draw.toFixed(4));

      route.stations.forEach((station) => {
        if (station.classList.contains('is-reached')) return;
        const b = station.querySelector('.station-badge').getBoundingClientRect();
        if (reduceMotion.matches || b.top + b.height / 2 <= trigger) {
          station.classList.add('is-reached');
          if (window.Sound) window.Sound.chime(reachedCount);
          reachedCount++;
        }
      });
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      update();
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

  // ---- Start ----

  render();
  renderInfluences();
  updatePersonToggles();
  window.addEventListener('resize', updatePersonToggles);

  document.querySelectorAll('.route').forEach((routeEl) => routes.push({ el: routeEl }));

  const years = document.getElementById('fact-years');
  const firstJob = data.experience.flatMap((c) => c.roles || []).map((r) => parseDate(r.start).year).sort()[0];
  if (years && firstJob) years.textContent = String(new Date().getFullYear() - firstJob);
  const companies = document.getElementById('fact-companies');
  if (companies) companies.textContent = String(data.experience.length);

  const year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Show the whole line when printing, whatever the scroll position.
  window.addEventListener('beforeprint', () => routes.forEach((r) => r.el.style.setProperty('--draw', '1')));
  window.addEventListener('afterprint', update);

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', layout);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(layout);
    routes.forEach((r) => observer.observe(r.el));
  }
  reduceMotion.addEventListener('change', layout);

  reveal(Array.from(document.querySelectorAll('.reveal')));
  layout();
})();
