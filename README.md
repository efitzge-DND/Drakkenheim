# TTRPG Campaign Starter

A minimal starting point for a campaign-wiki-style website: a typed data
schema, a Supabase-backed data layer, and a tiny React shell that proves the
two are wired up correctly.

This was extracted from a working campaign site, with the campaign-specific
content and extra features (maps, combat tracker, cosmology, etc.) stripped
out. What's left is the part worth copying: **the data layer pattern**.

## The core idea

All campaign data — NPCs, locations, factions, world facts, sessions,
characters — lives in **one JSON blob**, in one row of one Supabase table
(`campaign_db`, `id = 1`). There's no per-entity table, no foreign keys, no
migrations in the SQL sense.

Structure (what fields exist, what the seed examples look like) lives in
git, in [`src/data/sampleData.ts`](src/data/sampleData.ts). Live content
(actual play edits, DM notes added through the app) lives in Supabase.

On every page load, [`useSupabaseDb.ts`](src/hooks/useSupabaseDb.ts) fetches
the Supabase row and merges it with the seed file via `additiveMerge`:

- An entry's `id` exists in the seed but not in Supabase → it gets added.
- An entry's `id` already exists in Supabase → the stored version wins,
  untouched.

That means you can keep adding NPCs/locations/etc. to `sampleData.ts`,
commit, and deploy — new entries show up automatically, and nothing a DM
edited through the app ever gets clobbered by a redeploy.

If you ever need to force an existing entry to refresh from the seed (you
rewrote an NPC's backstory and want it to take), add a one-time block to
`migrateDb()` in `useSupabaseDb.ts` that replaces that one entry by id —
see the comment in that file.

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is fine).

3. **Run the table setup SQL** — open the SQL editor in your Supabase
   project and run [`supabase-setup.sql`](supabase-setup.sql). This creates
   the `campaign_db` table.

4. **Copy your Supabase credentials** into a local env file:
   ```
   cp .env.example .env.local
   ```
   Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your
   Supabase project's API settings.

5. **Run the dev server**
   ```
   npm run dev
   ```
   On first load with an empty table, the app seeds Supabase from
   `sampleData.ts` automatically. You should see the sample NPC, location,
   faction, etc. rendered on the page.

## Customizing for your game

- **Schema** — [`src/data/schema.ts`](src/data/schema.ts) defines the
  TypeScript shape of everything (`NPC`, `Location`, `Faction`, `WorldFact`,
  `Adventure`, `Character`, `Item`). It's written D&D-5e-flavored (the
  `StatBlock` type has `ac`/`hp`/ability scores/etc.) — if your game uses a
  different system, edit `StatBlock` and `CharacterSheet` to match.
- **Content** — replace the placeholder entries in
  [`src/data/sampleData.ts`](src/data/sampleData.ts) with your own setting.
- **UI** — [`src/App.tsx`](src/App.tsx) is intentionally bare (it just lists
  everything in the database to prove the load worked). Build your actual
  views from there.

See [`PROMPTS.md`](PROMPTS.md) for ready-to-use prompts if you're working
with Claude Code or another AI coding assistant to do this.

## Deploying

There's no special deploy config here — this is a static Vite app. Push to
GitHub and connect the repo to Vercel/Netlify/GitHub Pages/Cloudflare
Pages, or run `npm run build` and serve the `dist/` folder anywhere. Set
the two `VITE_SUPABASE_*` env vars in whichever host you use.
