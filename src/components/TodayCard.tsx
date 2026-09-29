import { LEVEL_NAMES, Level, TODAY } from '../data/today'

export default function TodayCard({ level }: { level: Level }) {
  return (
    <div className="today-card" data-testid="today-card">
      <strong>Then → Today: {LEVEL_NAMES[level]}</strong>
      <ul>
        {TODAY[level].map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </div>
  )
}
