// Entry point: load data, wire the controls, and render after every state change.
import * as data from './data.js';
import { render, setFilterFn } from './ui.js';
import { missableTrophy } from './roadmap.js';

const $ = id => document.getElementById(id);
setFilterFn(() => data.filteredTrophies());

function refresh() {
  data.syncHash();
  render(data.getState());
}

try {
  const state = await data.load();
  render(state);

  document.querySelectorAll('[data-view]').forEach(button => {
    button.addEventListener('click', () => { data.setView(button.dataset.view); refresh(); });
  });

  $('spoilers').addEventListener('click', () => { data.setSpoilers(!data.getState().spoilers); refresh(); });
  $('grade').addEventListener('change', event => { data.setGrade(event.target.value); refresh(); });
  $('category').addEventListener('change', event => { data.setCategory(event.target.value); refresh(); });
  $('search').addEventListener('input', event => { data.setQuery(event.target.value); refresh(); });
  $('only-hidden').addEventListener('change', event => { data.setHidden(event.target.checked); refresh(); });
  $('only-missable').addEventListener('change', event => { data.setMissable(event.target.checked); refresh(); });

  $('content').addEventListener('click', event => {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    if (target.dataset.action === 'toggle') {
      event.stopPropagation();
      data.toggleEarned(target.dataset.id);
      refresh();
      return;
    }
    if (target.dataset.action === 'select') data.select(target.dataset.id);
    refresh();
  });
  $('content').addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const target = event.target.closest('[data-action="select"]');
    if (!target) return;
    event.preventDefault();
    data.select(target.dataset.id);
    refresh();
  });
  $('save-banner').addEventListener('click', event => {
    const button = event.target.closest('[data-missable]');
    if (!button) return;
    const miss = missableTrophy(data.getState().doc);
    if (miss) { data.select(miss.id); data.setView('list'); refresh(); }
  });

  $('export').addEventListener('click', () => {
    const blob = new Blob([data.exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gta6-trophy-progress.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  });
  $('import').addEventListener('change', async event => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    try {
      const count = data.importProgress(await file.text());
      $('footer-status').textContent = `imported ${count} earned trophies`;
    } catch (error) {
      $('footer-status').textContent = `import failed: ${error.message}`;
    }
    event.target.value = '';
    refresh();
  });

  window.addEventListener('hashchange', () => { data.readHash(); render(data.getState()); });
  $('footer-status').textContent = `${state.doc.trophies.length} guides · localStorage progress · no network calls`;
} catch (error) {
  $('content').innerHTML = `<div class="empty">Could not start the guide: ${String(error.message || error)}</div>`;
  $('footer-status').textContent = 'startup error';
}
