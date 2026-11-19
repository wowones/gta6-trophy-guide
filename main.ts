// gta6-trophy-guide-01 entry point (Node 22 standard library, erasable TypeScript, no build step).
// The guide itself is app/: static HTML, CSS and ES modules that fetch only the local trophy list.
// This program copies app/ and screenshots/ beside the output directory, then writes dossier.json
// with the vendored make.fun library. Do not edit vendor/makefun-frontend.ts: the scorer byte-matches it.
// Deterministic: no clock, no randomness, no network. MAKEFUN_OUTPUT_DIR stands in for /output locally.

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const appDir = join(here, 'app');
const shotDir = join(here, 'screenshots');

if (!existsSync(join(appDir, 'index.html'))) throw new Error('app/index.html is missing');
if (!existsSync(join(appDir, 'data', 'trophies.json'))) throw new Error('app/data/trophies.json is missing');

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
