import { Block, Tx } from './block'

export const GENESIS_SENDER = 'Genesis'

export type LedgerResult = {
  balances: Record<string, number>
  invalidTxIds: Set<string>
}

/**
 * Account-model balances. Block 1's transfers from "Genesis" may send any amount.
 * Every other transfer is applied in order and is invalid (and skipped) if the
 * sender cannot afford it or the amount is not a positive number.
 */
export function computeBalances(chain: Block[]): LedgerResult {
  const balances: Record<string, number> = {}
  const invalidTxIds = new Set<string>()
  chain.forEach((block, bi) => {
    if (typeof block.data === 'string') return
    for (const tx of block.data) {
      const isGenesis = bi === 0 && tx.from === GENESIS_SENDER
      const okAmount = Number.isFinite(tx.amount) && tx.amount > 0
      if (!okAmount || (!isGenesis && (balances[tx.from] ?? 0) < tx.amount)) {
        invalidTxIds.add(tx.id)
        continue
      }
      if (!isGenesis) balances[tx.from] = (balances[tx.from] ?? 0) - tx.amount
      balances[tx.to] = (balances[tx.to] ?? 0) + tx.amount
    }
  })
  return { balances, invalidTxIds }
}

let counter = 0
export function newTx(from: string, to: string, amount: number): Tx {
  return { id: `tx${++counter}`, from, to, amount }
}
