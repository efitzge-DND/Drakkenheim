# Prompts for getting your own campaign site up quickly

These are written for [Claude Code](https://claude.com/claude-code), but
the underlying instructions work with any AI coding assistant pointed at
this repo. Run them in order — each one assumes the previous step is done.

Before starting, skim [README.md](README.md) once yourself so you know
what you're approving when the assistant proposes changes.

---

### 1. Set up Supabase

```
Walk me through setting up a free Supabase project for this app: creating
the project, running supabase-setup.sql in the SQL editor, and finding the
URL/anon key I need to put in .env.local. I haven't used Supabase before.
```

### 2. Adapt the schema to your game system

If you're not running D&D 5e, do this before adding any real content —
it's much easier to change the shape of the data before it exists.

```
I'm building a campaign site for [your game system / setting — e.g.
"a homebrew sci-fi system" or "Pathfinder 2e" or "a horror one-shot with
no combat stats at all"]. Look at src/data/schema.ts, specifically the
StatBlock and CharacterSheet types — they're currently written for D&D 5e
(ac, hp, ability scores, saving throws). Help me redesign those two types
to fit my system, and update src/data/sampleData.ts's placeholder entries
to match the new shape. Don't touch NPC, Location, Faction, WorldFact, or
Adventure — those are already system-agnostic.
```

### 3. Replace the placeholder content with your own setting

```
I want to replace the placeholder content in src/data/sampleData.ts with
my own campaign. Here's what I've got: [describe your setting, starting
location, a few NPCs, the party's characters — as much or as little detail
as you have]. Help me turn this into properly typed entries matching the
LoreDatabase schema in src/data/schema.ts. Ask me clarifying questions for
any required fields I haven't given you info for, rather than inventing
lore I didn't mention.
```

### 4. Build your first real view

```
Right now src/App.tsx just dumps every NPC/Location/Faction/etc. in a flat
list to prove the data loads. I want a real first view: [describe what you
want — e.g. "a single page per NPC with their description and stat block",
"a map-free location list grouped by region", "a session log timeline"].
Keep it simple for now — no routing library, just conditional rendering in
App.tsx is fine until there's more than one or two views.
```

### 5. Add an editing UI (once you trust the read side)

```
I want to be able to add/edit NPCs (or: locations / world facts / whatever
you're working on first) directly from the website instead of editing
sampleData.ts and redeploying every time. Add a form-based editor that
calls setDb from useSupabaseDb to persist changes. Keep it scoped to one
entity type for now — I'll ask for the others once this one works.
```

### 6. Deploy

```
I want to deploy this to [Vercel / Netlify / GitHub Pages / Cloudflare
Pages — pick one]. Walk me through connecting this repo and setting the
VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables there.
```

---

## Tips

- Keep `id` fields stable once you've deployed once — the additive-merge
  logic in `useSupabaseDb.ts` treats a changed id as a brand-new entry, not
  an edit to an existing one.
- If you ask the assistant to rewrite an existing seed entry's lore after
  you've already deployed, remind it that the additive merge won't
  overwrite what's already stored in Supabase — it'll need to add a
  one-time migration block to `migrateDb()` if you want the rewrite to take
  effect on a live site that already has data. See the comment above
  `migrateDb()` in `src/hooks/useSupabaseDb.ts` for the pattern.
- This starter has no authentication. Anyone with your Supabase anon key
  (which is visible in the deployed JS bundle) can read and write the
  table. That's fine for a private group sharing a link, but don't put
  anything truly sensitive in it, and don't reuse this table design for a
  public-facing product without adding real auth and row-level security.
