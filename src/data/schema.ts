// ─── Shared primitives ───────────────────────────────────────────────────────

export type RelationStatus = 'Allied' | 'Friendly' | 'Neutral' | 'Wary' | 'Hostile' | 'Unknown';
export type Visibility    = 'public' | 'dm_only';
export type ItemRarity    = 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Legendary' | 'Artifact';
export type ItemCategory  = 'weapon' | 'armor' | 'magical' | 'lore_aid' | 'consumable' | 'treasure' | 'misc';

// ─── Inventory ───────────────────────────────────────────────────────────────

export interface Item {
  id:                       string;
  name:                     string;
  description:              string;
  quantity:                 number;
  rarity:                   ItemRarity;
  category?:                ItemCategory;
  gp_value?:                number;
  dm_notes?:                string;
  tags:                     string[];
  source_adventure_id?:     string;
  awarded_to_character_id?: string;   // undefined = party pool / unclaimed
  claimed:                  boolean;
  visibility?:              Visibility;
}

// ─── Stat Block (D&D 5e) ─────────────────────────────────────────────────────

export interface AbilityScores {
  str: number; dex: number; con: number;
  int: number; wis: number; cha: number;
}

export interface StatBlockAction {
  name:         string;
  description:  string;
  attack_bonus?: number;
  damage?:      string;
  range?:       string;
}

export interface StatBlock {
  hp:             number;
  hp_current?:    number;   // session-only
  ac:             number;
  speed:          string;
  cr:             string;
  size?:          string;   // "Medium", "Large", "Huge", etc.
  type_text?:     string;   // "humanoid (yuan-ti)", "monstrosity", etc.
  alignment?:     string;
  abilities:      AbilityScores;
  saving_throws:  Partial<AbilityScores>;
  skills:         Record<string, number>;
  damage_vulnerabilities?: string[];
  damage_immunities:    string[];
  damage_resistances:   string[];
  condition_immunities: string[];
  senses:         string;
  languages:      string[];
  actions:        StatBlockAction[];
  reactions?:     StatBlockAction[];
  legendary_actions?: StatBlockAction[];
  traits:         StatBlockAction[];
}

// ─── NPC ─────────────────────────────────────────────────────────────────────

export interface NPC {
  id:           string;
  name:         string;
  aliases:      string[];
  description:  string;       // public-facing lore
  appearance:   string;
  personality:  string;
  motivations:  string;
  voice?:       string;       // how they speak / sound
  status?:      string;       // "Alive", "Deceased", "Missing", etc.
  faction_id?:  string;
  role:         string;
  location_id?: string;
  kind?:        'character' | 'monster';
  relation_to_characters: Record<string, RelationStatus>;
  stat_block?:  StatBlock;
  secret_notes: string;       // DM-only
  knowledge:    string[];
  visibility:   Visibility;
  tags:         string[];
  created_at:   string;
  updated_at:   string;
}

// ─── Location ────────────────────────────────────────────────────────────────

export type LocationType =
  | 'City' | 'Town' | 'Village' | 'Dungeon' | 'Ruin' | 'Castle'
  | 'Region' | 'Sea' | 'Road' | 'Temple' | 'Port' | 'Wilderness' | 'Other';

export interface LocationSensory {
  sight?:  string;
  sound?:  string;
  smell?:  string;
  detail?: string;  // one standout tactile/visual detail
}

export interface Location {
  id:                     string;
  name:                   string;
  type:                   LocationType;
  description:            string;
  sensory?:               LocationSensory;
  interactive?:           string;   // what PCs can discover or do here
  dm_notes:               string;
  notable_npc_ids:        string[];
  connected_location_ids: string[];
  faction_ids:            string[];
  lore_entries:           string[];
  visibility:             Visibility;
  tags:                   string[];
  created_at:             string;
  updated_at:             string;
}

// ─── Faction ─────────────────────────────────────────────────────────────────

export type FactionAlignment =
  | 'Lawful Good' | 'Neutral Good' | 'Chaotic Good'
  | 'Lawful Neutral' | 'True Neutral' | 'Chaotic Neutral'
  | 'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil';

export interface Faction {
  id:                 string;
  name:               string;
  symbol_description: string;
  description:        string;
  dm_notes:           string;
  goals:              string;
  methods:            string;
  alignment:          FactionAlignment;
  notable_member_ids: string[];
  territory_ids:      string[];
  relations:          Record<string, RelationStatus>;
  visibility:         Visibility;
  tags:               string[];
  created_at:         string;
  updated_at:         string;
}

// ─── World Fact ───────────────────────────────────────────────────────────────

export type WorldFactCategory =
  | 'History' | 'Religion' | 'Magic' | 'Politics' | 'Geography'
  | 'Culture' | 'Rumor' | 'Prophecy' | 'Secret' | 'Other';

export interface WorldFact {
  id:           string;
  title:        string;
  category:     WorldFactCategory;
  content:      string;       // public / player-facing version
  dm_content?:  string;       // DM-only extended version (overrides content in DM view)
  source_id?:   string;
  visibility:   Visibility;
  tags:         string[];
  created_at:   string;
  updated_at:   string;
}

// ─── Adventure / Session ─────────────────────────────────────────────────────

export interface Adventure {
  id:                 string;
  name:               string;
  session_number:     number;
  date_played:        string;
  summary:            string;
  dm_notes:           string;
  participant_ids:    string[];
  locations_visited:  string[];
  npcs_encountered:   string[];
  loot_awarded:       string[];  // item IDs referencing LoreDatabase.items
  hooks_created:      string[];
  tags:               string[];
  created_at:         string;
  updated_at:         string;
}

// ─── Player Character ────────────────────────────────────────────────────────

export interface SheetCheckEntry {
  proficient: boolean;
  bonus:      string;   // free-form, e.g. "+5", "-1"
}

export interface CharacterFeature {
  id:          string;
  name:        string;
  source:      string;   // "Class", "Race", "Background", etc.
  description: string;
}

export type AbilityKey = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface CharacterSheet {
  locked:             boolean;
  hp_max:             string;
  hp_current:         string;
  hp_temp:            string;
  ac:                 string;
  speed:              string;
  initiative:         string;
  proficiency_bonus:  string;
  abilities:          Record<AbilityKey, string>;
  saving_throws:      Record<AbilityKey, SheetCheckEntry>;
  skills:             Record<string, SheetCheckEntry>;
  features:           CharacterFeature[];
}

export interface CharacterSessionNote {
  adventure_id: string;
  note:         string;
}

export interface Character {
  id:               string;
  name:             string;
  player_name:      string;
  class:            string;
  subclass?:        string;
  race:             string;
  level:            number;
  background:       string;
  description:      string;
  portrait_emoji:   string;
  portrait_url?:    string;
  journal?:          string;
  character_sheet?:  CharacterSheet;
  inventory:         Item[];
  faction_relations: Record<string, RelationStatus>;
  known_fact_ids:    string[];
  session_notes:     CharacterSessionNote[];
  is_active:         boolean;
  player_pin?:       string;
  tags:             string[];
  created_at:       string;
  updated_at:       string;
}

// ─── Campaign Briefing (DM reference) ────────────────────────────────────────

export interface CampaignBriefing {
  setting:           string;
  campaign_so_far:   string;
  dming_philosophy:  string;
  inspirations:      string;
  tone_preferences:  string;
  ai_instructions:   string;
  open_questions:    string;
}

// ─── Root Lore Database ───────────────────────────────────────────────────────
//
// This is the single row stored in Supabase (table `campaign_db`, id = 1).
// `version`/`campaign` are metadata; everything else is an additive entity
// list. See src/hooks/useSupabaseDb.ts for how seed data and stored data
// are reconciled on load.

export interface LoreDatabase {
  version:   string;
  campaign:  {
    name:        string;
    setting:     string;
    description: string;
    dm_name:     string;
  };
  briefing?:            CampaignBriefing;
  characters:           Character[];
  npcs:                 NPC[];
  locations:            Location[];
  factions:             Faction[];
  world_facts:          WorldFact[];
  adventures:           Adventure[];
  items?:               Item[];      // global loot registry, claimable by characters
}
