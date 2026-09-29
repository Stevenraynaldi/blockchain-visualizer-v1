import TodayCard from '../components/TodayCard'
import { useState } from 'react'
import BlockCard from '../components/BlockCard'
import DifficultyPicker from '../components/DifficultyPicker'
import ResetButton from '../components/ResetButton'
import { buildTextSampleChain } from '../data/samples'
import { editBlock, relinkChain, validateChain } from '../lib/chain'

export default function ChainPage() {
  const [chain, setChain] = useState(() => buildTextSampleChain())
  const [difficulty, setDifficulty] = useState(3)
  const validity = validateChain(chain, difficulty)

  return (
    <div>
      <h2>Blockchain</h2>
      <p>
        Each block stores the previous block's hash. Edit a block's data and it, plus every block after it, turns red.
        Mine the blocks in order to repair the chain.
      </p>
      <div className="controls">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        <ResetButton onReset={() => setChain(buildTextSampleChain())} />
      </div>
      <div className="chain">
        {chain.map((block, i) => (
          <BlockCard
            key={block.index}
            block={block}
            valid={validity[i]}
            difficulty={difficulty}
            onDataChange={(data) => setChain((c) => editBlock(c, i, data))}
            onMined={(nonce) =>
              setChain((c) => {
                const next = c.map((b, j) => (j === i ? { ...b, nonce } : b))
                return relinkChain(next, i)
              })
            }
          />
        ))}
      </div>
      <TodayCard level="chain" />
    </div>
  )
}
