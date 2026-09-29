import { ReactNode, useEffect, useRef, useState } from 'react'
import { Block, dataToString } from '../lib/block'
import { mineAsync } from '../lib/mine'

type Props = {
  block: Block
  valid: boolean
  difficulty: number
  /** Called with the winning nonce when mining finishes. */
  onMined: (nonce: number) => void
  /** Text editor for the data field. Ignored when `dataSlot` is given. */
  onDataChange?: (data: string) => void
  /** Custom data area (e.g. a transfer list). */
  dataSlot?: ReactNode
}

export default function BlockCard({ block, valid, difficulty, onMined, onDataChange, dataSlot }: Props) {
  const [progress, setProgress] = useState<{ nonce: number; hash: string } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  const mining = progress !== null
  const shownNonce = progress ? progress.nonce : block.nonce
  const shownHash = progress ? progress.hash : block.hash

  async function mine() {
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setProgress({ nonce: block.nonce, hash: block.hash })
    try {
      const nonce = await mineAsync(block, difficulty, (n, h) => setProgress({ nonce: n, hash: h }), ctrl.signal)
      setProgress(null)
      onMined(nonce)
    } catch {
      setProgress(null)
    }
  }

  return (
    <div className={`block ${valid && !mining ? 'valid' : 'invalid'}`}>
      <strong>Block #{block.index}</strong> {valid && !mining ? '✔ valid' : '✘ invalid'}
      <label title="Nonce: a number the miner changes until the hash starts with enough zeros.">Nonce</label>
      <input readOnly value={shownNonce} />
      <label title="Data: whatever this block records. Change it and the hash changes completely.">Data</label>
      {dataSlot ??
        (onDataChange ? (
          <textarea rows={3} value={dataToString(block.data)} onChange={(e) => onDataChange(e.target.value)} disabled={mining} />
        ) : (
          <div>{dataToString(block.data)}</div>
        ))}
      <label title="Previous hash: the hash of the block before this one. This is the link that forms the chain.">
        Previous hash
      </label>
      <div className="hash">{block.prevHash}</div>
      <label title="Hash: the SHA-256 fingerprint of this block. It must start with the required zeros to be valid.">Hash</label>
      <div className="hash">{shownHash}</div>
      <p>
        <button onClick={mine} disabled={mining} title="Try nonces until the hash meets the difficulty.">
          {mining ? 'Mining…' : 'Mine'}
        </button>
        {mining && (
          <button onClick={() => abortRef.current?.abort()} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        )}
      </p>
    </div>
  )
}
