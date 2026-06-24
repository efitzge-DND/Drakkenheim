import { useState, useEffect, useCallback } from 'react';
import type { LoreDatabase } from '../data/schema';
import { initialLoreDatabase } from '../data/sampleData';
import { supabase } from '../lib/supabase';

export type DbStatus = 'loading' | 'ready' | 'error';

const ROW_ID = 1;

/**
 * Additive merge: seed entries whose IDs aren't yet in storage get added.
 * Existing stored entries are NEVER overwritten, so live edits made through
 * the app survive future deploys that add new seed content.
 */
function additiveMerge<T extends { id: string }>(
  storedList: T[] | undefined, seedList: T[] | undefined,
): T[] {
  if (!seedList && !storedList) return [];
  if (!seedList)   return storedList ?? [];
  if (!storedList) return seedList;
  const ids = new Set(storedList.map(x => x.id));
  return [...storedList, ...seedList.filter(x => !ids.has(x.id))];
}

/**
 * Merges stored Supabase data with initialLoreDatabase (the seed).
 * Top-level keys fall back to the seed when missing; each entity array is
 * merged additively via additiveMerge above.
 *
 * To force-refresh a specific existing entry from the seed (e.g. you
 * rewrote an NPC's lore and want it to overwrite what's stored), add a
 * one-time migration block here that replaces that entry by id — see the
 * README for an example.
 */
function migrateDb(stored: LoreDatabase): LoreDatabase {
  const base   = initialLoreDatabase;
  const merged = { ...base, ...stored };

  merged.characters  = additiveMerge(stored.characters,  base.characters);
  merged.npcs        = additiveMerge(stored.npcs,        base.npcs);
  merged.locations   = additiveMerge(stored.locations,   base.locations);
  merged.factions    = additiveMerge(stored.factions,    base.factions);
  merged.world_facts = additiveMerge(stored.world_facts, base.world_facts);
  merged.adventures  = additiveMerge(stored.adventures,  base.adventures);
  if (base.items || stored.items) {
    merged.items = additiveMerge(stored.items, base.items);
  }

  return merged;
}

export function useSupabaseDb() {
  const [db, setDbState] = useState<LoreDatabase>(initialLoreDatabase);
  const [status, setStatus] = useState<DbStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data, error } = await supabase
          .from('campaign_db')
          .select('data')
          .eq('id', ROW_ID)
          .maybeSingle();

        if (cancelled) return;

        if (error) throw error;

        if (data) {
          setDbState(migrateDb(data.data as LoreDatabase));
        } else {
          // No row yet — seed from static data
          const { error: insertErr } = await supabase
            .from('campaign_db')
            .insert({ id: ROW_ID, data: initialLoreDatabase });
          if (insertErr) throw insertErr;
          setDbState(initialLoreDatabase);
        }

        setStatus('ready');
      } catch (err) {
        console.error('[useSupabaseDb] load failed:', err);
        if (!cancelled) setStatus('error');
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const setDb = useCallback((next: LoreDatabase) => {
    setDbState(next);
    // Fire-and-forget write; local state is already updated
    supabase
      .from('campaign_db')
      .upsert({ id: ROW_ID, data: next, updated_at: new Date().toISOString() })
      .then(({ error }) => {
        if (error) console.error('[useSupabaseDb] write failed:', error);
      });
  }, []);

  return { db, setDb, status } as const;
}
