# TTRPG Campaign Starter — Claude Code Reference

## What this is

A minimal starter for a campaign-wiki-style site: a typed schema + a
Supabase-backed data layer with an additive-merge pattern, plus a bare
React shell proving the two are wired together. There is no UI to speak of
yet — that's the next thing to build, tailored to the user's actual game.

## Data architecture (read this before touching data)

Two layers, both must be understood before editing data:

- **Seed (source of truth for structure):** [src/data/sampleData.ts](src/data/sampleData.ts)
  exports `initialLoreDatabase`, typed by [src/data/schema.ts](src/data/schema.ts).
  This is committed to git and deployed with the app.
- **Runtime (what the live site actually reads):** [src/hooks/useSupabaseDb.ts](src/hooks/useSupabaseDb.ts)
  loads from Supabase, table `campaign_db`, row `id = 1`.

On load, `migrateDb()` inside `useSupabaseDb.ts` merges the Supabase row
with the seed via `additiveMerge`:
- New seed IDs not yet in Supabase → added automatically on next load.
- Existing stored entries → never overwritten (live edits are preserved).

**Consequence:** adding a new entry to `sampleData.ts`, committing, and
deploying is all that's needed to ship new content. No manual Supabase
migration, no row reset.

**Exception:** to force-update an existing entry (e.g. you rewrote an NPC's
lore and want the new version to win even though it's already stored), add
a one-time migration block inside `migrateDb()` that replaces that one
entry by id from the seed.

## Adding new data entries

1. Add an object with a unique `id` to the relevant array in
   `src/data/sampleData.ts`.
2. Run `npx tsc --noEmit` to verify types compile cleanly.
3. Commit and deploy.
4. Reload the live site — the new entry appears via `additiveMerge`.

## Schema

`src/data/schema.ts` defines all TypeScript interfaces. Key types:

| Type | Used for |
|------|----------|
| `NPC` | NPCs and monsters (`kind: 'monster'`) |
| `StatBlock` | Combat stats; written D&D-5e-flavored — adapt the fields if your game uses a different system |
| `Character` | Player characters |
| `Location`, `Faction`, `WorldFact`, `Adventure` | Lore entries |
| `LoreDatabase` | Root — the single Supabase row |

If your game isn't D&D 5e, the type to change first is `StatBlock` (and
`CharacterSheet`'s ability/skill fields) — everything else (NPCs, locations,
factions, world facts, sessions) is system-agnostic.

## What's deliberately NOT here

This starter strips out several features that existed in the site it was
extracted from, because they were specific to that campaign's needs:
session-prep tooling, a Leaflet-based interactive map system, a combat
initiative tracker, and a deity/cosmology layer. The underlying pattern
(seed file + Supabase + additive merge) generalizes to all of those if you
want to build them later — they'd just be more arrays on `LoreDatabase` and
more views reading/writing them the same way `npcs`/`locations` do now.

## Local dev

```
npm install
cp .env.example .env.local   # fill in Supabase credentials, see README.md
npm run dev
```

`npx tsc --noEmit` to type-check. `npm run lint` for eslint.
