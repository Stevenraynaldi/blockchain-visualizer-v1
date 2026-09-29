import { LEVEL_NAMES, TIMELINE } from '../data/today'

export default function TimelinePage() {
  return (
    <div>
      <h2>Timeline</h2>
      <p>Bitcoin combined earlier ideas rather than inventing them all. Each entry names the level it grew from.</p>
      <ol style={{ listStyle: 'none', padding: 0 }}>
        {TIMELINE.map((e) => (
          <li key={e.year + e.title} className="today-card" data-testid="timeline-entry" style={{ marginTop: 8 }}>
            <strong>
              {e.year} — {e.title}
            </strong>{' '}
            <em>(grew from: {LEVEL_NAMES[e.level]})</em>
            <div>{e.text}</div>
          </li>
        ))}
      </ol>
    </div>
  )
}
