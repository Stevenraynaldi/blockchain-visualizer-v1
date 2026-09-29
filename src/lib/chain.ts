import { Block, BlockData, GENESIS_PREV_HASH, computeHash, isValid } from './block'
import { mineAsync } from './mine'

/** Sets the block's data at `at`, then relinks and rehashes it and every later block. Nonces stay. */
export function editBlock(chain: Block[], at: number, data: BlockData): Block[] {
  const next = chain.map((b, i) => (i === at ? { ...b, data } : b))
  return relinkChain(next, at)
}

/** Recomputes prevHash and hash from `from` down the chain. Nonces are kept. */
export function relinkChain(chain: Block[], from = 0): Block[] {
  const out = chain.slice()
  for (let i = from; i < out.length; i++) {
    const prevHash = i === 0 ? GENESIS_PREV_HASH : out[i - 1].hash
    const b = { ...out[i], prevHash }
    out[i] = { ...b, hash: computeHash(b) }
  }
  return out
}

/**
 * Per-block validity: a block is valid only if its hash matches its contents,
 * meets the difficulty, links to the previous hash, and every earlier block is valid.
 */
export function validateChain(chain: Block[], difficulty: number): boolean[] {
  const result: boolean[] = []
  let ok = true
  chain.forEach((b, i) => {
    const expectedPrev = i === 0 ? GENESIS_PREV_HASH : chain[i - 1].hash
    ok =
      ok &&
      b.prevHash === expectedPrev &&
      b.hash === computeHash(b) &&
      isValid(b.hash, difficulty)
    result.push(ok)
  })
  return result
}

/** Mines every block in order, relinking as it goes. */
export async function mineChain(
  blocks: { data: BlockData }[],
  difficulty: number,
): Promise<Block[]> {
  const chain: Block[] = []
  for (let i = 0; i < blocks.length; i++) {
    const prevHash = i === 0 ? GENESIS_PREV_HASH : chain[i - 1].hash
    const base = { index: i + 1, nonce: 0, data: blocks[i].data, prevHash }
    const nonce = await mineAsync(base, difficulty)
    chain.push({ ...base, nonce, hash: computeHash({ ...base, nonce }) })
  }
  return chain
}

/** Builds a pre-mined chain from the given block data. */
export function buildSampleChain(data: BlockData[], difficulty = 3): Promise<Block[]> {
  return mineChain(
    data.map((d) => ({ data: d })),
    difficulty,
  )
}
