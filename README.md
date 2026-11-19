# gta6-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/wowones/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/wowones/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An original, offline neon-Vice-City field manual for all 55 *Grand Theft Auto VI* PlayStation trophies: every official name, description and grade preserved verbatim, plus a short cited guide written from scratch for each one. The tracker includes an eight-step roadmap to the platinum, the single missable trophy warning, grade/category/hidden/missable filters, text search, a spoiler switch, a per-trophy detail panel with clickable sources, local progress with JSON export/import, and deep links for screenshots.

## Run locally

No build step, no dependencies, no network requests from the app.

```bash
node serve.ts
# open http://localhost:8080
```

Build the submission directory (writes `out/app`, `out/screenshots` and `out/dossier.json`):

```bash
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Deep links

`#view=roadmap`, `#view=missable`, `#trophy=14`, `#grade=silver`, `#spoilers=on` (they can be combined with `&`).

## Data and sources

The official trophy list is the starting point; the guides paraphrase and cite [AlcastHQ](https://alcasthq.com/gta-6-trophy-list/), [Output Lag](https://outputlag.com/guides/gta-6-trophy-list/), [Mobalytics](https://mobalytics.gg/gamebase/guides/grand-theft-auto-6-all-trophies), [HowToVideoGame](https://howtovideogame.com/gta-6-trophies/), [XBoosty](https://xboosty.com/blog/gta/gta-6/gta-6-trophy-list-all-55-achievements-and-the-hardest-ones-to-unlock-74), [TheGamesWiki](https://thegameswiki.com/gta6/wiki/trophies-and-achievements), [CULTR](https://www.cultr.com/news/complete-gta-6-trophy-list-every-trophy-and-achievement/) and [TechNerdiness](https://www.technerdiness.com/gta/gta-6-trophy-list/). Each trophy carries its own source array in `app/data/trophies.json`. Cryptic secrets are marked as leads where public guides disagree; no location is invented.

## License

MIT — see [LICENSE](LICENSE). Trophy names and descriptions remain the property of their respective owners; this is an unofficial fan guide.
