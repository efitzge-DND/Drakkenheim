import { useState } from 'react';
import { useSupabaseDb } from './hooks/useSupabaseDb';

const TABS = ['Characters', 'NPCs', 'Locations', 'Factions', 'Magic Items', 'Lore', 'Sessions'] as const;
type Tab = typeof TABS[number];

const styles = {
  root: {
    minHeight: '100vh',
    background: '#0e0c0a',
    color: '#c9b99a',
    fontFamily: "'Georgia', 'Times New Roman', serif",
  },
  header: {
    background: 'linear-gradient(180deg, #1a0a2e 0%, #0e0c0a 100%)',
    borderBottom: '2px solid #4a1d6e',
    padding: '2rem 1rem 1rem',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '2.4rem',
    color: '#c084fc',
    letterSpacing: '0.08em',
    textShadow: '0 0 24px #7c3aed88',
    margin: 0,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#7c6a50',
    fontSize: '0.95rem',
    marginTop: '0.4rem',
    fontStyle: 'italic',
  },
  tabBar: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '2px',
    background: '#1a0a2e',
    borderBottom: '2px solid #4a1d6e',
    padding: '0 1rem',
  },
  tab: (active: boolean) => ({
    padding: '0.6rem 1.1rem',
    cursor: 'pointer',
    background: active ? '#2d1b4e' : 'transparent',
    color: active ? '#c084fc' : '#7c6a50',
    border: 'none',
    borderBottom: active ? '2px solid #c084fc' : '2px solid transparent',
    fontFamily: 'inherit',
    fontSize: '0.9rem',
    letterSpacing: '0.04em',
    transition: 'color 0.15s, background 0.15s',
  }),
  content: {
    maxWidth: 860,
    margin: '0 auto',
    padding: '2rem 1rem',
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
      <header style={styles.header}>
        <h1 style={styles.title}>{db.campaign.name}</h1>
        <p style={styles.subtitle}>{db.campaign.description}</p>
      </header>

      <nav style={styles.tabBar}>
        {TABS.map(tab => (
          <button key={tab} style={styles.tab(activeTab === tab)} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </nav>

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
                    style={{ width: '100%', maxHeight: '260px', objectFit: 'cover', borderRadius: '4px', marginBottom: '0.8rem', border: '1px solid #2e2318' }}
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
    </div>
  );
}

export default App;

