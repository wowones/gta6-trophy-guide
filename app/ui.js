// Renders the four states (checklist, detail, roadmap, missable) from data.js state.
import * as icons from './icons.js';
import { roadmapCards, stepTitle, missableTrophy, hiddenTrophies } from './roadmap.js';

const byId = id => document.getElementById(id);
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function esc(value) { return String(value ?? '').replace(/[&<>"']/g, ch => ESC[ch]); }

function revealed(trophy, state) {
  return !trophy.hidden || state.spoilers;
}
function shownName(trophy, state) {
  return revealed(trophy, state) ? trophy.name : 'Hidden trophy';
}
function shownDescription(trophy, state) {
  return revealed(trophy, state) ? trophy.description : 'Description concealed — switch Spoilers on to reveal this secret.';
}

function chips(trophy) {
  const parts = [`<span class="chip">${esc(trophy.category)}</span>`];
  if (trophy.hidden) parts.push(`<span class="chip hiddenchip">${icons.flagIcon('hidden')} hidden</span>`);
  if (trophy.missable) parts.push(`<span class="chip miss">${icons.flagIcon('missable')} missable</span>`);
  return parts.join('');
}

function row(trophy, state) {
  const earned = state.earned.has(trophy.id);
  const selected = state.selected === trophy.id;
  return `<div class="trophy-row${selected ? ' selected' : ''}${earned ? ' earned' : ''}" role="button" tabindex="0" data-action="select" data-id="${trophy.id}">
    <button type="button" class="check${earned ? ' on' : ''}" data-action="toggle" data-id="${trophy.id}" aria-label="${earned ? 'Unmark' : 'Mark'} ${esc(shownName(trophy, state))}">${earned ? '✓' : ''}</button>
    ${icons.trophyIcon(trophy.grade)}
    <span class="row-body">
      <strong>${esc(shownName(trophy, state))}</strong>
      <small>${esc(shownDescription(trophy, state))}</small>
      <span class="row-chips">${chips(trophy)}</span>
    </span>
    <span class="row-grade grade-${esc(trophy.grade)}">${esc(trophy.grade)}</span>
  </div>`;
}

function detail(trophy, state) {
  if (!trophy) return '<section class="detail-panel"><p>Select a trophy.</p></section>';
  const earned = state.earned.has(trophy.id);
  const guide = revealed(trophy, state)
    ? `<p>${esc(trophy.guide)}</p>${trophy.tips ? `<p class="tip"><strong>TIP</strong> ${esc(trophy.tips)}</p>` : ''}`
    : '<p>This trophy is hidden. Turn Spoilers on to read its guide and sources.</p>';
  const sources = revealed(trophy, state)
    ? trophy.sources.map(s => `<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${icons.flagIcon('source')}${esc(s.name)} ↗</a>`).join('')
    : '<span class="chip">Sources concealed</span>';
  return `<section class="detail-panel">
    <div class="detail-head">
      <div class="detail-title">
        ${icons.trophyIcon(trophy.grade)}
        <div><p class="eyebrow">Trophy ${String(trophy.id).padStart(2, '0')} / 55 · ${esc(trophy.grade)}</p><h2>${esc(shownName(trophy, state))}</h2></div>
      </div>
      <button type="button" class="earn-btn${earned ? ' on' : ''}" data-action="toggle" data-id="${trophy.id}">${earned ? 'Earned ✓' : 'Mark earned'}</button>
    </div>
    <p class="detail-desc">${esc(shownDescription(trophy, state))}</p>
    <div class="detail-chips">
      ${icons.categoryIcon(trophy.category)}<span class="chip">${esc(trophy.category)}</span>
      <span class="chip">step ${trophy.roadmap_step}</span>
      ${trophy.hidden ? `<span class="chip hiddenchip">${icons.flagIcon('hidden')} hidden</span>` : ''}
      ${trophy.missable ? `<span class="chip miss">${icons.flagIcon('missable')} missable</span>` : ''}
    </div>
    <div class="guide-card"><p class="eyebrow">How to unlock</p>${guide}</div>
    <div class="sources"><span class="eyebrow">Sources</span>${sources}</div>
    <p class="detail-foot">Roadmap · ${esc(stepTitle(state.doc, trophy.roadmap_step))} · progress is saved in this browser only.</p>
  </section>`;
}

function listView(state, items) {
  const empty = items.length ? '' : `<div class="empty">No trophies match these filters. Clear the search or grade filter.</div>`;
  return `<div class="list-layout">
    <div class="trophy-list">
      <div class="list-caption">${items.length} shown · click a row for the cited guide · tick to mark earned</div>
      ${items.map(t => row(t, state)).join('')}${empty}
    </div>
    ${detail(state.doc.trophies.find(t => t.id === state.selected), state)}
  </div>`;
}

function roadmapView(state) {
  const cards = roadmapCards(state.doc).map(step => `<article class="step-card">
    <div class="step-num">0${step.step}</div>
    <div class="step-body">
      <h3>${esc(step.title)}</h3>
      <p>${esc(step.detail)}</p>
      <div class="step-meta"><span class="chip">${step.count} trophies</span>${step.step === 1 ? '<span class="chip miss">manual saves</span>' : ''}</div>
    </div>
  </article>`).join('');
  return `<div class="roadmap-view">
    <div class="roadmap-head"><div><p class="eyebrow">ROUTE TO THE PLATINUM</p><h2>Eight passes from prologue to 100%</h2></div><span class="chip miss">${icons.flagIcon('missable')} 1 missable checkpoint</span></div>
    <div class="step-grid">${cards}</div>
  </div>`;
}

function missableView(state) {
  const miss = missableTrophy(state.doc);
  const hidden = hiddenTrophies(state.doc);
  const cards = hidden.map(t => `<div class="flag-card${t.missable ? ' miss' : ''}" role="button" tabindex="0" data-action="select" data-id="${t.id}">
    ${icons.trophyIcon(t.grade)}
    <span><strong>${esc(shownName(t, state))}</strong><small>${esc(t.grade)} · ${esc(t.category)}${t.missable ? ' · MISSABLE' : ''}</small></span>
  </div>`).join('');
  return `<div class="missable-view">
    <div class="miss-cards">
      <article class="miss-hero">
        <p class="eyebrow">THE ONLY MISSABLE TROPHY</p>
        <h2>${esc(miss ? miss.name : '')}</h2>
        <p>Meditate on Lucia's balcony during Chapter 1, then save at the chapter start. There is no mission replay, so a missed balcony spot needs a reload. All other spots can be finished freely.</p>
        <button type="button" class="earn-btn" data-action="select" data-id="${miss ? miss.id : 1}">Open cited guide →</button>
      </article>
      <article class="hidden-stat"><p class="eyebrow">HIDDEN SET</p><strong>28</strong><span>secret trophy descriptions</span><p>Spoilers are currently <b>${state.spoilers ? 'ON' : 'OFF'}</b>. Toggle them in the tab bar to reveal names and guides.</p></article>
    </div>
    <div class="flag-grid">${cards}</div>
  </div>`;
}

export function render(state) {
  const items = state.view === 'list' ? requireFiltered(state) : [];
  byId('progress-count').textContent = `${state.earned.size} / ${state.doc.trophies.length}`;
  const pct = Math.round((state.earned.size / state.doc.trophies.length) * 100);
  byId('progress-label').textContent = `trophies earned · ${pct}% complete`;
  byId('progress-fill').style.width = `${pct}%`;
  byId('progress-meta').textContent = '1 platinum · 2 gold · 6 silver · 46 bronze · 28 hidden · 1 missable';

  const grade = byId('grade'), category = byId('category'), search = byId('search');
  if (grade.value !== state.grade) grade.value = state.grade;
  if (category.value !== state.category) category.value = state.category;
  if (search.value !== state.query) search.value = state.query;
  byId('only-hidden').checked = state.hidden;
  byId('only-missable').checked = state.missable;
  const spoilers = byId('spoilers');
  spoilers.textContent = `Spoilers: ${state.spoilers ? 'on' : 'off'}`;
  spoilers.setAttribute('aria-pressed', String(state.spoilers));
  spoilers.classList.toggle('on', state.spoilers);
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === state.view));

  const content = byId('content');
  content.innerHTML = state.view === 'roadmap' ? roadmapView(state)
    : state.view === 'missable' ? missableView(state)
      : listView(state, items);
}

// Kept separate so data.js stays the single source of filter truth.
let filterFn = null;
export function setFilterFn(fn) { filterFn = fn; }
function requireFiltered(state) { return filterFn ? filterFn(state) : state.doc.trophies; }
