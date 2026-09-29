import { Block, GENESIS_PREV_HASH, Tx, computeHash } from '../lib/block'
import { newTx } from '../lib/ledger'
import { mineSync } from '../lib/mine'
import { SAMPLE_DIFFICULTY } from './samples'

/** Pre-mined transaction chain. Block 1 hands out starting balances; every transfer is affordable. */
export function buildTxSampleChain(difficulty = SAMPLE_DIFFICULTY): Block[] {
  const blocks: Tx[][] = [
    [newTx('Genesis', 'Alice', 50), newTx('Genesis', 'Bob', 30), newTx('Genesis', 'Carol', 20)],
    [newTx('Alice', 'Bob', 5), newTx('Bob', 'Carol', 3)],
    [newTx('Carol', 'Dave', 10), newTx('Alice', 'Carol', 7)],
    [newTx('Bob', 'Alice', 2)],
    [newTx('Dave', 'Alice', 4)],
  ]
  const chain: Block[] = []
  blocks.forEach((data, i) => {
    const prevHash = i === 0 ? GENESIS_PREV_HASH : chain[i - 1].hash
    const base = { index: i + 1, nonce: 0, data, prevHash }
    const nonce = mineSync(base, difficulty)
    chain.push({ ...base, nonce, hash: computeHash({ ...base, nonce }) })
  })
  return chain
}
