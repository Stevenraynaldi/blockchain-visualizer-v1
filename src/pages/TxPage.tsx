import TodayCard from '../components/TodayCard'
import { useState } from 'react'
import BalancesPanel from '../components/BalancesPanel'
import BlockCard from '../components/BlockCard'
import DifficultyPicker from '../components/DifficultyPicker'
import ResetButton from '../components/ResetButton'
import TxList from '../components/TxList'
import { buildTxSampleChain } from '../data/txSamples'
import { Tx } from '../lib/block'
import { editBlock, relinkChain, validateChain } from '../lib/chain'
import { computeBalances, newTx } from '../lib/ledger'

export default function TxPage() {
  const [chain, setChain] = useState(() => buildTxSampleChain())
  const [difficulty, setDifficulty] = useState(3)
  const [form, setForm] = useState({ from: 'Alice', to: 'Bob', amount: 5, block: 5 })

  const validity = validateChain(chain, difficulty)
  const { balances, invalidTxIds } = computeBalances(chain)
  const txsOf = (i: number) => chain[i].data as Tx[]

  function addTransfer() {
    const i = form.block - 1
    setChain((c) => editBlock(c, i, [...(c[i].data as Tx[]), newTx(form.from, form.to, form.amount)]))
  }

  return (
    <div>
      <h2>Transactions</h2>
      <p>
        Blocks hold transfers instead of free text. Block 1 hands out starting balances from "Genesis". A transfer the
        sender cannot afford is flagged invalid and skipped.
      </p>
      <div className="controls">
        <DifficultyPicker value={difficulty} onChange={setDifficulty} />
        <ResetButton onReset={() => setChain(buildTxSampleChain())} />
      </div>
      <div className="controls" data-testid="add-transfer">
        <strong>Add transfer</strong>
        <input size={7} value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} aria-label="From" />
        →
        <input size={7} value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} aria-label="To" />
        :
        <input
          type="number"
          style={{ width: 70 }}
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
          aria-label="Amount"
        />
        in block
        <select value={form.block} onChange={(e) => setForm({ ...form, block: Number(e.target.value) })}>
          {chain.map((b) => (
            <option key={b.index} value={b.index}>
              {b.index}
            </option>
          ))}
        </select>
        <button onClick={addTransfer}>Add</button>
      </div>
      <BalancesPanel balances={balances} />
      <div className="chain">
        {chain.map((block, i) => {
          const hasInvalidTx = txsOf(i).some((t) => invalidTxIds.has(t.id))
          return (
            <BlockCard
              key={block.index}
              block={block}
              valid={validity[i] && !hasInvalidTx}
              difficulty={difficulty}
              dataSlot={
                <TxList txs={txsOf(i)} invalidIds={invalidTxIds} onChange={(txs) => setChain((c) => editBlock(c, i, txs))} />
              }
              onMined={(nonce) =>
                setChain((c) => relinkChain(c.map((b, j) => (j === i ? { ...b, nonce } : b)), i))
              }
            />
          )
        })}
      </div>
      <TodayCard level="tx" />
    </div>
  )
}
