import TodayCard from '../components/TodayCard'
import { useState } from 'react'
import { sha256Hex } from '../lib/hash'

export default function HashPage() {
  const [text, setText] = useState('hello')

  return (
    <div>
      <h2>Hash</h2>
      <p>Type anything. Change one character and the whole SHA-256 fingerprint changes.</p>
      <textarea
        rows={4}
        style={{ width: '100%', boxSizing: 'border-box' }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        title="Any text. The hash below updates on every keystroke."
      />
      <h3 title="Hash: a fixed-length fingerprint of the input. The same input always gives the same hash.">SHA-256 hash</h3>
      <div className="hash" data-testid="hash-output">
        {sha256Hex(text)}
      </div>
      <TodayCard level="hash" />
    </div>
  )
}
