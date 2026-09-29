import { Block, computeHash, isValid } from './block'

const BATCH = 5000

/**
 * Tries nonces from the block's current nonce upward until the hash meets the
 * difficulty. Yields to the UI between batches and reports the current nonce.
 * Resolves with the winning nonce; rejects with an AbortError if cancelled.
 */
export async function mineAsync(
  block: Pick<Block, 'index' | 'nonce' | 'data' | 'prevHash'>,
  difficulty: number,
  onProgress?: (nonce: number, hash: string) => void,
  signal?: AbortSignal,
): Promise<number> {
  let nonce = 0
  for (;;) {
    for (let i = 0; i < BATCH; i++, nonce++) {
      const hash = computeHash({ ...block, nonce })
      if (isValid(hash, difficulty)) {
        onProgress?.(nonce, hash)
        return nonce
      }
    }
    if (signal?.aborted) throw new DOMException('Mining aborted', 'AbortError')
    onProgress?.(nonce, computeHash({ ...block, nonce }))
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
    if (signal?.aborted) throw new DOMException('Mining aborted', 'AbortError')
  }
}

/** Synchronous mining, for pre-mining sample data at startup. */
export function mineSync(
  block: Pick<Block, 'index' | 'nonce' | 'data' | 'prevHash'>,
  difficulty: number,
): number {
  for (let nonce = 0; ; nonce++) {
    if (isValid(computeHash({ ...block, nonce }), difficulty)) return nonce
  }
}
