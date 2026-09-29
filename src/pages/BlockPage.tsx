import TodayCard from '../components/TodayCard'
import { useState } from 'react'
import BlockCard from '../components/BlockCard'
import DifficultyPicker from '../components/DifficultyPicker'
import ResetButton from '../components/ResetButton'
import { buildSingleBlock } from '../data/samples'
import { computeHash, isValid } from '../lib/block'

export default function BlockPage() {
  const [block, setBlock] = useState(buildSingleBlock)
  const [difficulty, setDifficulty] = useState(3)

  return (
    <div>
      <h2>Block</h2>
      <p>A block is valid when its hash starts with enough zeros. Edit the data, then press Mine to find a nonce that works.</p>
      <div className="controls">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        <ResetButton onReset={() => setBlock(buildSingleBlock())} />
      </div>
      <div style={{ maxWidth: 480 }}>
        <BlockCard
          block={block}
          valid={isValid(block.hash, difficulty)}
          difficulty={difficulty}
          onDataChange={(data) => {
            const next = { ...block, data }
            setBlock({ ...next, hash: computeHash(next) })
          }}
          onMined={(nonce) => {
            const next = { ...block, nonce }
            setBlock({ ...next, hash: computeHash(next) })
          }}
        />
      </div>
      <TodayCard level="block" />
    </div>
  )
}
