type Props = { value: number; onChange: (d: number) => void }

export default function DifficultyPicker({ value, onChange }: Props) {
  return (
    <label title="Difficulty: how many leading zeros a valid hash must start with. Each extra zero makes mining about 16 times harder.">
      Difficulty{' '}
      <select value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((d) => (
          <option key={d} value={d}>
            {d} ({'0'.repeat(d)}…)
          </option>
        ))}
      </select>
    </label>
  )
}
