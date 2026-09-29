import { Tx } from '../lib/block'
import { newTx } from '../lib/ledger'

type Props = {
  txs: Tx[]
  invalidIds: Set<string>
  onChange: (txs: Tx[]) => void
  disabled?: boolean
}

export default function TxList({ txs, invalidIds, onChange, disabled }: Props) {
  const update = (id: string, patch: Partial<Tx>) =>
    onChange(txs.map((t) => (t.id === id ? { ...t, ...patch } : t)))

  return (
    <div>
      {txs.map((t) => {
        const bad = invalidIds.has(t.id)
        return (
          <div
            key={t.id}
            className={`tx ${bad ? 'invalid' : ''}`}
            title={bad ? 'Invalid: the sender cannot afford this transfer.' : undefined}
          >
            <input size={7} value={t.from} disabled={disabled} onChange={(e) => update(t.id, { from: e.target.value })} />
            {' → '}
            <input size={7} value={t.to} disabled={disabled} onChange={(e) => update(t.id, { to: e.target.value })} />
            {': '}
            <input
              type="number"
              style={{ width: 60 }}
              value={t.amount}
              disabled={disabled}
              onChange={(e) => update(t.id, { amount: Number(e.target.value) })}
            />
            <button disabled={disabled} onClick={() => onChange(txs.filter((x) => x.id !== t.id))} title="Remove transfer">
              ✕
            </button>
            {bad && <strong> invalid</strong>}
          </div>
        )
      })}
      <button disabled={disabled} onClick={() => onChange([...txs, newTx('', '', 1)])}>
        + transfer
      </button>
    </div>
  )
}
