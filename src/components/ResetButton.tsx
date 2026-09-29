export default function ResetButton({ onReset }: { onReset: () => void }) {
  return (
    <button onClick={onReset} title="Restore this page's sample data.">
      Reset
    </button>
  )
}
