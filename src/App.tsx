import { useState } from 'react';
import { useSupabaseDb } from './hooks/useSupabaseDb';

const TABS = [
  { name: 'Characters', icon: '🛡️' },
  { name: 'NPCs', icon: '🎭' },
  { name: 'Locations', icon: '🗺️' },
  { name: 'Factions', icon: '⚜️' },
  { name: 'Magic Items', icon: '✨' },
  { name: 'Lore', icon: '📖' },
  { name: 'Sessions', icon: '📜' },
] as const;
type Tab = typeof TABS[number]['name'];

const styles = {
  root: {
    minHeight: '100vh',
    background: '#0e0c0a',
    color: '#c9b99a',
    fontFamily: "'Georgia', 'Times New Roman', serif",
    display: 'flex',
    alignItems: 'stretch' as const,
  },
  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: 'linear-gradient(180deg, #1a0a2e 0%, #120a1f 100%)',
    borderRight: '2px solid #4a1d6e',
    padding: '1.6rem 0.9rem',
    position: 'sticky' as const,
    top: 0,
    alignSelf: 'flex-start' as const,
    height: '100vh',
    boxSizing: 'border-box' as const,
    overflowY: 'auto' as const,
  },
  brand: {
    padding: '0 0.6rem 1.4rem',
    borderBottom: '1px solid #2e2318',
    marginBottom: '1.2rem',
  },
  title: {
    fontSize: '1.5rem',
    color: '#c084fc',
    letterSpacing: '0.04em',
    textShadow: '0 0 18px #7c3aed88',
    margin: 0,
    fontWeight: 'bold',
    lineHeight: 1.2,
  },
  subtitle: {
    color: '#7c6a50',
    fontSize: '0.78rem',
    marginTop: '0.5rem',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  navItem: (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.7rem',
    width: '100%',
    textAlign: 'left' as const,
    padding: '0.65rem 0.8rem',
    marginBottom: '0.25rem',
    cursor: 'pointer',
    background: active ? '#2d1b4e' : 'transparent',
    color: active ? '#c084fc' : '#9a8a6c',
    border: 'none',
    borderLeft: active ? '3px solid #c084fc' : '3px solid transparent',
    borderRadius: '4px',
    fontFamily: 'inherit',
    fontSize: '0.95rem',
    letterSpacing: '0.02em',
    transition: 'color 0.15s, background 0.15s',
  }),
  navIcon: {
    fontSize: '1.05rem',
    width: '1.4rem',
    textAlign: 'center' as const,
  },
  main: {
    flex: 1,
    minWidth: 0,
    padding: '2.4rem 2rem',
  },
  content: {
    maxWidth: 820,
    margin: '0 auto',
  },
  card: {
    background: '#161310',
    border: '1px solid #2e2318',
    borderRadius: '6px',
    padding: '1.1rem 1.4rem',
    marginBottom: '1rem',
  },
  cardTitle: {
    color: '#c084fc',
    fontSize: '1.1rem',
    margin: '0 0 0.3rem 0',
  },
  cardMeta: {
    color: '#7c6a50',
    fontSize: '0.82rem',
    marginBottom: '0.5rem',
  },
  cardBody: {
    color: '#c9b99a',
    fontSize: '0.92rem',
    lineHeight: 1.6,
    margin: 0,
  },
  tag: {
    display: 'inline-block',
    background: '#2d1b4e',
    color: '#c084fc',
    borderRadius: '3px',
    padding: '0.1rem 0.5rem',
    fontSize: '0.75rem',
    marginRight: '0.3rem',
  },
  empty: {
    color: '#4a3f30',
    fontStyle: 'italic',
    textAlign: 'center' as const,
    padding: '3rem 0',
  },
  sectionHeader: {
    color: '#7c6a50',
    fontSize: '0.78rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    borderBottom: '1px solid #2e2318',
    paddingBottom: '0.5rem',
    marginBottom: '1.2rem',
  },
};

function RarityBadge({ rarity }: { rarity: string }) {
  const colors: Record<string, string> = {
    Common: '#9ca3af',
    Uncommon: '#4ade80',
    Rare: '#60a5fa',
    'Very Rare': '#a78bfa',
    Legendary: '#fbbf24',
    Artifact: '#f87171',
  };
  return (
    <span style={{ ...styles.tag, background: '#1a1a1a', color: colors[rarity] ?? '#c9b99a' }}>
      {rarity}
    </span>
  );
}

function EmptyState({ tab }: { tab: string }) {
  return <p style={styles.empty}>No {tab.toLowerCase()} recorded yet.</p>;
}

function App() {
  const { db, status } = useSupabaseDb();
  const [activeTab, setActiveTab] = useState<Tab>('Characters');

  if (status === 'loading') {
    return (
      <div style={{ ...styles.root, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', color: '#7c6a50' }}>
        Entering the Haze…
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ ...styles.root, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#f87171' }}>Failed to load campaign data. Check your Supabase credentials.</p>
      </div>
    );
  }

  const items = db.items ?? [];

  return (
    <div style={styles.root}>
      <nav style={styles.sidebar}>
        <div style={styles.brand}>
          <h1 style={styles.title}>{db.campaign.name}</h1>
          <p style={styles.subtitle}>{db.campaign.description}</p>
        </div>
        {TABS.map(tab => (
          <button key={tab.name} style={styles.navItem(activeTab === tab.name)} onClick={() => setActiveTab(tab.name)}>
            <span style={styles.navIcon}>{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </nav>

      <main style={styles.main}>
        <div style={styles.content}>

          {activeTab === 'Characters' && (
            <>
              <p style={styles.sectionHeader}>The Party</p>
              {db.characters.length === 0 ? <EmptyState tab="characters" /> : db.characters.map(c => (
                <div key={c.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{c.portrait_emoji} {c.name}</h3>
                  <p style={styles.cardMeta}>Level {c.level} {c.race} {c.class}{c.subclass ? ` (${c.subclass})` : ''} · Played by {c.player_name}</p>
                  {c.background && <p style={styles.cardMeta}>{c.background}</p>}
                  {c.description && <p style={styles.cardBody}>{c.description}</p>}
                </div>
              ))}
            </>
          )}

          {activeTab === 'NPCs' && (
            <>
              <p style={styles.sectionHeader}>Notable People</p>
              {db.npcs.length === 0 ? <EmptyState tab="NPCs" /> : db.npcs.map(npc => (
                <div key={npc.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{npc.name}</h3>
                  <p style={styles.cardMeta}>{npc.role}{npc.status ? ` · ${npc.status}` : ''}</p>
                  {npc.appearance && <p style={styles.cardMeta}>{npc.appearance}</p>}
                  {npc.description && <p style={styles.cardBody}>{npc.description}</p>}
                  {npc.personality && <p style={styles.cardBody}><em>"{npc.personality}"</em></p>}
                </div>
              ))}
            </>
          )}

          {activeTab === 'Locations' && (
            <>
              <p style={styles.sectionHeader}>Known Places</p>
              {db.locations.length === 0 ? <EmptyState tab="locations" /> : db.locations.map(loc => (
                <div key={loc.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{loc.name}</h3>
                  <p style={styles.cardMeta}>{loc.type}</p>
                  {loc.description && <p style={styles.cardBody}>{loc.description}</p>}
                  {loc.sensory?.sight && <p style={styles.cardBody}><em>👁 {loc.sensory.sight}</em></p>}
                  {loc.sensory?.sound && <p style={styles.cardBody}><em>👂 {loc.sensory.sound}</em></p>}
                </div>
              ))}
            </>
          )}

          {activeTab === 'Factions' && (
            <>
              <p style={styles.sectionHeader}>Powers at Play</p>
              {db.factions.length === 0 ? <EmptyState tab="factions" /> : db.factions.map(f => (
                <div key={f.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{f.name}</h3>
                  <p style={styles.cardMeta}>{f.alignment} · {f.symbol_description}</p>
                  {f.description && <p style={styles.cardBody}>{f.description}</p>}
                  {f.goals && <p style={styles.cardBody}><strong style={{ color: '#7c6a50' }}>Goals:</strong> {f.goals}</p>}
                  {f.methods && <p style={styles.cardBody}><strong style={{ color: '#7c6a50' }}>Methods:</strong> {f.methods}</p>}
                </div>
              ))}
            </>
          )}

          {activeTab === 'Magic Items' && (
            <>
              <p style={styles.sectionHeader}>Artifacts & Relics</p>
              {items.length === 0 ? <EmptyState tab="magic items" /> : items.map(item => (
                <div key={item.id} style={styles.card}>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'contain', borderRadius: '4px', marginBottom: '0.8rem', border: '1px solid #2e2318', background: '#0e0c0a' }}
                    />
                  )}
                  <h3 style={styles.cardTitle}>{item.name}</h3>
                  <p style={styles.cardMeta}>
                    <RarityBadge rarity={item.rarity} />
                    {item.category && <span style={styles.tag}>{item.category}</span>}
                    {item.gp_value && <span style={{ color: '#7c6a50', fontSize: '0.82rem' }}> · {item.gp_value.toLocaleString()} gp</span>}
                    {item.awarded_to_character_id && (
                      <span style={{ color: '#7c6a50', fontSize: '0.82rem' }}>
                        {' '}· held by {db.characters.find(c => c.id === item.awarded_to_character_id)?.name ?? item.awarded_to_character_id}
                      </span>
                    )}
                  </p>
                  {item.description && (
                    <p style={styles.cardBody}>
                      {item.description.split('\n').map((line, i) => (
                        <span key={i}>{line}{i < item.description.split('\n').length - 1 && <br />}</span>
                      ))}
                    </p>
                  )}
                </div>
              ))}
            </>
          )}

          {activeTab === 'Lore' && (
            <>
              <p style={styles.sectionHeader}>World Knowledge</p>
              {db.world_facts.length === 0 ? <EmptyState tab="lore" /> : db.world_facts.map(wf => (
                <div key={wf.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>{wf.title}</h3>
                  <p style={styles.cardMeta}>{wf.category}</p>
                  {wf.content && <p style={styles.cardBody}>{wf.content}</p>}
                </div>
              ))}
            </>
          )}

          {activeTab === 'Sessions' && (
            <>
              <p style={styles.sectionHeader}>Chronicle of Events</p>
              {db.adventures.length === 0 ? <EmptyState tab="sessions" /> : [...db.adventures].sort((a, b) => b.session_number - a.session_number).map(a => (
                <div key={a.id} style={styles.card}>
                  <h3 style={styles.cardTitle}>Session {a.session_number}: {a.name}</h3>
                  <p style={styles.cardMeta}>{a.date_played}</p>
                  {a.summary && <p style={styles.cardBody}>{a.summary}</p>}
                  {a.hooks_created?.length > 0 && (
                    <p style={styles.cardBody}><strong style={{ color: '#7c6a50' }}>Hooks:</strong> {a.hooks_created.join(', ')}</p>
                  )}
                </div>
              ))}
            </>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;
