import { useSupabaseDb } from './hooks/useSupabaseDb';

// Minimal proof-of-life shell: confirms the Supabase connection and the
// additive-merge data layer work end to end. Replace this with your own
// views/components once the data layer is wired up — see README.md.
function App() {
  const { db, status } = useSupabaseDb();

  if (status === 'loading') return <p>Loading campaign data…</p>;
  if (status === 'error') {
    return (
      <p>
        Failed to load campaign data. Check your <code>.env.local</code> Supabase
        credentials and that the <code>campaign_db</code> table exists (see README.md).
      </p>
    );
  }

  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>{db.campaign.name}</h1>
      <p>{db.campaign.description}</p>

      <h2>Characters ({db.characters.length})</h2>
      <ul>
        {db.characters.map(c => (
          <li key={c.id}>{c.portrait_emoji} <strong>{c.name}</strong> — Level {c.level} {c.race} {c.class} (played by {c.player_name}){c.description ? ` — ${c.description}` : ''}</li>
        ))}
      </ul>

      <h2>NPCs ({db.npcs.length})</h2>
      <ul>
        {db.npcs.map(npc => <li key={npc.id}><strong>{npc.name}</strong> — {npc.role}{npc.description ? ` — ${npc.description}` : ''}</li>)}
      </ul>

      <h2>Locations ({db.locations.length})</h2>
      <ul>
        {db.locations.map(loc => <li key={loc.id}><strong>{loc.name}</strong> ({loc.type}){loc.description ? ` — ${loc.description}` : ''}</li>)}
      </ul>

      <h2>Factions ({db.factions.length})</h2>
      <ul>
        {db.factions.map(f => (
          <li key={f.id}><strong>{f.name}</strong> — {f.description}</li>
        ))}
      </ul>

      <h2>Magic Items ({(db.items ?? []).length})</h2>
      <ul>
        {(db.items ?? []).map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> ({item.rarity}){item.description ? ` — ${item.description}` : ''}
            {item.awarded_to_character_id ? ` [held by ${db.characters.find(c => c.id === item.awarded_to_character_id)?.name ?? item.awarded_to_character_id}]` : ''}
          </li>
        ))}
      </ul>

      <h2>World Facts ({db.world_facts.length})</h2>
      <ul>
        {db.world_facts.map(wf => <li key={wf.id}><strong>{wf.title}</strong> ({wf.category}) — {wf.content}</li>)}
      </ul>

      <h2>Adventures ({db.adventures.length})</h2>
      <ul>
        {db.adventures.map(a => <li key={a.id}><strong>Session {a.session_number}: {a.name}</strong>{a.summary ? ` — ${a.summary}` : ''}</li>)}
      </ul>
    </main>
  );
}

export default App

