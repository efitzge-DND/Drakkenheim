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

      <h2>NPCs ({db.npcs.length})</h2>
      <ul>
        {db.npcs.map(npc => <li key={npc.id}>{npc.name} — {npc.role}</li>)}
      </ul>

      <h2>Locations ({db.locations.length})</h2>
      <ul>
        {db.locations.map(loc => <li key={loc.id}>{loc.name} ({loc.type})</li>)}
      </ul>

      <h2>Factions ({db.factions.length})</h2>
      <ul>
        {db.factions.map(f => <li key={f.id}>{f.name}</li>)}
      </ul>

      <h2>World Facts ({db.world_facts.length})</h2>
      <ul>
        {db.world_facts.map(wf => <li key={wf.id}>{wf.title}</li>)}
      </ul>

      <h2>Adventures ({db.adventures.length})</h2>
      <ul>
        {db.adventures.map(a => <li key={a.id}>Session {a.session_number}: {a.name}</li>)}
      </ul>
    </main>
  );
}

export default App
