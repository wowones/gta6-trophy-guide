// gta6-trophy-guide-01 entry point (Node 22 standard library, erasable TypeScript, no build step).
// The guide itself is app/: static HTML, CSS and ES modules that fetch only the local trophy list.
// This program copies app/ and screenshots/ beside the output directory, then writes dossier.json
// with the vendored make.fun library. Do not edit vendor/makefun-frontend.ts: the scorer byte-matches it.
// Deterministic: no clock, no randomness, no network. MAKEFUN_OUTPUT_DIR stands in for /output locally.
// Dossier caps below: 163840 text bytes, 4 screenshots x 262144 bytes, 993 app files, 50331648 app bytes.
// The pre-build guard rejects oversized screenshots early so the dossier never exceeds those caps.
// Build-time validation now also checks that the shipped trophy document has all 55 guides.

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
const shotDir = join(here, 'screenshots');

if (!existsSync(join(appDir, 'index.html'))) throw new Error('app/index.html is missing');
if (!existsSync(join(appDir, 'data', 'trophies.json'))) throw new Error('app/data/trophies.json is missing');

const trophyDoc = JSON.parse(readFileSync(join(appDir, 'data', 'trophies.json'), 'utf8'));
if (!Array.isArray(trophyDoc.trophies) || trophyDoc.trophies.length !== 55) {
  throw new Error(`Expected 55 trophies in app/data/trophies.json, found ${Array.isArray(trophyDoc.trophies) ? trophyDoc.trophies.length : 'none'}`);
}
console.log(`gta6-trophy-guide: validated ${trophyDoc.trophies.length} trophy guides before dossier build`);

const shotFiles = existsSync(shotDir)
  ? readdirSync(shotDir).filter(name => /\.(png|jpe?g)$/i.test(name)).sort()
  : [];
if (shotFiles.length < 3 || shotFiles.length > 4) throw new Error(`Expected 3-4 screenshots, found ${shotFiles.length}`);
for (const name of shotFiles) {
  const size = statSync(join(shotDir, name)).size;
  if (size > 262144) throw new Error(`Screenshot over 256 KiB: ${name} (${size} bytes)`);
}

mkdirSync(out, { recursive: true });
cpSync(appDir, join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(shotDir)) cpSync(shotDir, join(out, 'screenshots'), { recursive: true });

const dossier = buildDossier(out, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648
});
writeFileSync(join(out, 'dossier.json'), dossier);
console.log(`gta6-trophy-guide: ${shotFiles.length} screenshots, ${dossier.length} dossier bytes -> ${out}`);
