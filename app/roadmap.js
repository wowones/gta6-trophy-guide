// Roadmap presentation helpers. The step definitions live in data/trophies.json beside the official trophy text.
export const MISSABLE_NAME = 'Positive Mental Attitude';

export function missableTrophy(doc) {
  return doc.trophies.find(t => t.missable) || null;
}

export function hiddenTrophies(doc) {
  return doc.trophies.filter(t => t.hidden);
}

export function stepCounts(doc) {
  const counts = new Map();
  for (const t of doc.trophies) counts.set(t.roadmap_step, (counts.get(t.roadmap_step) || 0) + 1);
  return counts;
}

export function roadmapCards(doc) {
  const counts = stepCounts(doc);
  return doc.roadmap.map(step => ({ ...step, count: counts.get(step.step) || 0 }));
}

export function stepTitle(doc, step) {
  const found = doc.roadmap.find(s => s.step === step);
  return found ? found.title : `Step ${step}`;
}

export function saveWarning() {
  return 'Save at the start of every chapter, keep a separate save before the final mission, and never enable cheats: cheats switch off trophies and saving.';
}
