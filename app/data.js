// Loads the trophy document, keeps progress in localStorage, and owns every filter / deep-link value.
const KEY = 'gta6-neon-progress-v1';
const GRADES = new Set(['platinum', 'gold', 'silver', 'bronze']);
const VIEWS = new Set(['list', 'roadmap', 'missable']);

const state = {
  doc: null,
  earned: new Set(),
  view: 'list',
  grade: 'all',
  category: 'all',
  hidden: false,
  missable: false,
  query: '',
  spoilers: false,
  selected: null
};

function truthy(value) {
  return value === '1' || value === 'true' || value === 'on' || value === 'yes';
}

export function getState() {
  return state;
}

export async function load() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error(`Could not load trophy data (${response.status})`);
  state.doc = await response.json();
  const known = new Set(state.doc.trophies.map(t => t.id));
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (Array.isArray(saved)) state.earned = new Set(saved.map(Number).filter(id => known.has(id)));
  } catch { /* a corrupt save is simply ignored */ }
  readHash();
  if (!known.has(state.selected)) state.selected = state.doc.trophies[0].id;
  return state;
}

export function readHash() {
  const raw = location.hash.replace(/^#/, '');
  const params = new URLSearchParams(raw);
  const view = params.get('view');
  if (view && VIEWS.has(view)) state.view = view;
  const grade = params.get('grade');
  if (grade && (grade === 'all' || GRADES.has(grade))) state.grade = grade;
  const category = params.get('category');
  if (category) state.category = category;
  const trophy = Number(params.get('trophy'));
  if (Number.isInteger(trophy)) state.selected = trophy;
  if (params.has('hidden')) state.hidden = truthy(params.get('hidden'));
  if (params.has('missable')) state.missable = truthy(params.get('missable'));
  if (params.has('spoilers')) state.spoilers = truthy(params.get('spoilers'));
  const q = params.get('q');
  if (q) state.query = q;
  return state;
}

export function syncHash() {
  const p = new URLSearchParams();
  if (state.view !== 'list') p.set('view', state.view);
  if (state.grade !== 'all') p.set('grade', state.grade);
  if (state.category !== 'all') p.set('category', state.category);
  if (state.hidden) p.set('hidden', '1');
  if (state.missable) p.set('missable', '1');
  if (state.spoilers) p.set('spoilers', 'on');
  if (state.selected) p.set('trophy', String(state.selected));
  const query = p.toString();
  history.replaceState(null, '', `${location.pathname}${location.search}${query ? `#${query}` : ''}`);
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...state.earned].sort((a, b) => a - b)));
  } catch { /* private browsing still works for the current visit */ }
}

export function setView(view) { if (VIEWS.has(view)) state.view = view; }
export function setGrade(grade) { if (grade === 'all' || GRADES.has(grade)) state.grade = grade; }
export function setCategory(category) { state.category = category || 'all'; }
export function setHidden(value) { state.hidden = Boolean(value); }
export function setMissable(value) { state.missable = Boolean(value); }
export function setQuery(value) { state.query = String(value || ''); }
export function setSpoilers(value) { state.spoilers = Boolean(value); }
export function select(id) { state.selected = Number(id); }

export function toggleEarned(id) {
  const n = Number(id);
  if (state.earned.has(n)) state.earned.delete(n);
  else state.earned.add(n);
  persist();
}

export function filteredTrophies() {
  const q = state.query.trim().toLowerCase();
  return state.doc.trophies.filter(t => {
    if (state.grade !== 'all' && t.grade !== state.grade) return false;
    if (state.category !== 'all' && t.category !== state.category) return false;
    if (state.hidden && !t.hidden) return false;
    if (state.missable && !t.missable) return false;
    if (q) {
      const haystack = [t.name, t.description, t.guide, t.category, t.grade, t.tips || '', ...t.sources.map(s => s.name)].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function exportProgress() {
  return JSON.stringify({
    game: state.doc.game,
    platform: state.doc.platform,
    count: state.earned.size,
    earned: [...state.earned].sort((a, b) => a - b)
  }, null, 2);
}

export function importProgress(text) {
  const parsed = JSON.parse(text);
  const incoming = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(incoming)) throw new Error('Expected an array of trophy ids');
  const known = new Set(state.doc.trophies.map(t => t.id));
  state.earned = new Set(incoming.map(Number).filter(id => known.has(id)));
  persist();
  return state.earned.size;
}
