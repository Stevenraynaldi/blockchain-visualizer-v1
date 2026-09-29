import { sha256Hex } from './hash'

export type Tx = { id: string; from: string; to: string; amount: number }
export type BlockData = string | Tx[]
export type Block = {
  index: number
  nonce: number
  data: BlockData
  prevHash: string
  hash: string
}

export const GENESIS_PREV_HASH = '0'.repeat(64)

/** Text form of a block's data. Transfers become `from>to:amount;` in order. */
export function dataToString(data: BlockData): string {
  if (typeof data === 'string') return data
  return data.map((t) => `${t.from}>${t.to}:${t.amount};`).join('')
}

export function blockPayload(b: Pick<Block, 'index' | 'nonce' | 'data' | 'prevHash'>): string {
  return `${b.index}|${b.nonce}|${dataToString(b.data)}|${b.prevHash}`
}

export function computeHash(b: Pick<Block, 'index' | 'nonce' | 'data' | 'prevHash'>): string {
  return sha256Hex(blockPayload(b))
}

export function isValid(hash: string, difficulty: number): boolean {
  return hash.startsWith('0'.repeat(difficulty))
}
