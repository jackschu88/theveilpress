# Handoff Note — The Veil Press Platform

_Last updated: 2026-07-29_

## Where we are

Shared knowledge index + conservative scan tooling are **built and verified**. Article desk is **not started** — paused waiting on 3 answers.

## Done

- `data/schema.ts` — types: Entity (`createdBy: scan|human|seed`, `humanModified`), Observation (Bezalel score keys: `veil`, `cathedral`, `archive`, `squareMile`, `nciTechnique`), Claim, Book, Article, ScanReport, SiteIndex
- `data/site-index.json` — 28 seed entities, 3 claims, 1 book (prices/URLs match commerce.js), empty observations/articles
- `scripts/scanIndex.js` — append-only observation ingestion from `data/scored-news/`, referential integrity checks, **never auto-creates entities**, `VEIL_INDEX_DIR` env override
- `npm run scan` wired in package.json; clean scan + ingestion test + idempotency all verified
- Audit passed, no issues
- **Nothing pushed to git**

## Paused on (3 open questions)

1. Where does Bezalel live? Existing code to inspect, or design schema first and wire Bezalel to match?
2. What JSON format does Bezalel currently output for observations? (scan script must match its real format, not invented one)
3. Article workflow: does Bezalel generate full markdown, or structured JSON that a human writes prose from? (human-scored vs. Bezalel-generated)

## Next steps (once answered)

1. Finalize article frontmatter schema
2. Create `content/articles/` + markdown pipeline
3. Build article reader/listing pages
4. Wire Bezalel output into `data/scored-news/`

## Hard rules (don't forget)

- Git is the single data pipe; all AI features local (no runtime LLM calls)
- One shared index — no parallel systems; entity scores are observations, derived at query time, never static on entities
- Analytics never in content PRs (separate branch / localStorage / Vercel Analytics)
- No third-party ad networks — self-served/affiliate/direct only
- "Bezalel" everywhere, never "Bezel"
- Scan never auto-creates entities; unknown references flagged for manual review
- Human/seed fields preserved forever; machine fields may be refreshed
