import { describe, expect, it } from 'vitest'
import { sha256Hex } from '../src/lib/hash'
import { GENESIS_PREV_HASH, computeHash, isValid } from '../src/lib/block'
import { buildSampleChain, editBlock, validateChain } from '../src/lib/chain'
import { mineAsync } from '../src/lib/mine'
import { computeBalances, newTx } from '../src/lib/ledger'
import { buildTxSampleChain } from '../src/data/txSamples'
import { buildTextSampleChain } from '../src/data/samples'
import { TIMELINE, TODAY } from '../src/data/today'

describe('sha256', () => {
  it('matches known vectors', () => {
    expect(sha256Hex('hello')).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824')
    expect(sha256Hex('')).toBe('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
  })
  it('changes completely on a one-character change', () => {
    expect(sha256Hex('hello')).not.toBe(sha256Hex('hellp'))
  })
})

describe('isValid', () => {
  it('checks leading zeros', () => {
    expect(isValid('000abc', 3)).toBe(true)
    expect(isValid('000abc', 4)).toBe(false)
    expect(isValid('abc', 1)).toBe(false)
  })
})

describe('mining', () => {
  it('finds a nonce whose hash starts with N zeros', async () => {
    const base = { index: 1, nonce: 0, data: 'x', prevHash: GENESIS_PREV_HASH }
    for (const d of [1, 2, 3]) {
      const nonce = await mineAsync(base, d)
      expect(computeHash({ ...base, nonce }).startsWith('0'.repeat(d))).toBe(true)
    }
  })
  it('rejects when aborted', async () => {
    const ac = new AbortController()
    ac.abort()
    const base = { index: 1, nonce: 0, data: 'x', prevHash: GENESIS_PREV_HASH }
    await expect(mineAsync(base, 8, undefined, ac.signal)).rejects.toThrow()
  })
})

describe('chain', () => {
  it('sample chain is fully valid and linked', async () => {
    const chain = await buildSampleChain(['a', 'b', 'c', 'd', 'e'], 3)
    expect(validateChain(chain, 3)).toEqual([true, true, true, true, true])
    expect(chain[0].prevHash).toBe(GENESIS_PREV_HASH)
    for (let i = 1; i < 5; i++) expect(chain[i].prevHash).toBe(chain[i - 1].hash)
  })
  it('editing block 2 invalidates blocks 2-5 only, and re-mining in order repairs', async () => {
    let chain = await buildSampleChain(['a', 'b', 'c', 'd', 'e'], 3)
    chain = editBlock(chain, 1, 'changed')
    expect(validateChain(chain, 3)).toEqual([true, false, false, false, false])
    for (let i = 1; i < 5; i++) {
      const prevHash = chain[i - 1].hash
      const base = { ...chain[i], prevHash }
      const nonce = await mineAsync(base, 3)
      chain = chain.slice()
      chain[i] = { ...base, nonce, hash: computeHash({ ...base, nonce }) }
      const v = validateChain(chain, 3)
      expect(v.slice(0, i + 1).every(Boolean)).toBe(true)
    }
    expect(validateChain(chain, 3)).toEqual([true, true, true, true, true])
  })
  it('raising difficulty re-checks blocks (mined at 1, checked at 6)', async () => {
    const chain = await buildSampleChain(['a', 'b', 'c', 'd', 'e'], 1)
    expect(validateChain(chain, 1).every(Boolean)).toBe(true)
    expect(validateChain(chain, 6).every(Boolean)).toBe(false)
  })
  it('text sample chain is valid at default difficulty', () => {
    const chain = buildTextSampleChain()
    expect(chain).toHaveLength(5)
    expect(validateChain(chain, 3).every(Boolean)).toBe(true)
  })
})

describe('ledger', () => {
  it('sample tx chain is valid with no invalid transfers', () => {
    const chain = buildTxSampleChain()
    expect(validateChain(chain, 3).every(Boolean)).toBe(true)
    const { balances, invalidTxIds } = computeBalances(chain)
    expect(invalidTxIds.size).toBe(0)
    const total = Object.values(balances).reduce((a, b) => a + b, 0)
    expect(total).toBe(100)
  })
  it('flags Alice -> Bob: 1000 and ignores it in balances', () => {
    const chain = buildTxSampleChain()
    const before = computeBalances(chain).balances
    const bad = newTx('Alice', 'Bob', 1000)
    const last = chain[4]
    const edited = editBlock(chain, 4, [...(last.data as any[]), bad])
    const r = computeBalances(edited)
    expect(r.invalidTxIds.has(bad.id)).toBe(true)
    expect(r.balances).toEqual(before)
  })
  it('valid transfer updates balances', () => {
    const chain = buildTxSampleChain()
    const before = computeBalances(chain).balances
    const ok = newTx('Alice', 'Bob', 1)
    const edited = editBlock(chain, 4, [...(chain[4].data as any[]), ok])
    const r = computeBalances(edited)
    expect(r.invalidTxIds.size).toBe(0)
    expect(r.balances.Alice).toBe(before.Alice - 1)
    expect(r.balances.Bob).toBe(before.Bob + 1)
  })
  it('rejects zero, negative and NaN amounts', () => {
    const chain = buildTxSampleChain()
    const txs = [newTx('Alice', 'Bob', 0), newTx('Alice', 'Bob', -5), newTx('Alice', 'Bob', NaN)]
    const r = computeBalances(editBlock(chain, 4, [...(chain[4].data as any[]), ...txs]))
    txs.forEach((t) => expect(r.invalidTxIds.has(t.id)).toBe(true))
  })
})

describe('content', () => {
  it('has a card for each level and 11 timeline entries', () => {
    for (const k of ['hash', 'block', 'chain', 'tx'] as const) {
      expect(TODAY[k].length).toBeGreaterThanOrEqual(2)
      expect(TODAY[k].length).toBeLessThanOrEqual(4)
    }
    expect(TIMELINE).toHaveLength(11)
    expect(TIMELINE.map((t) => t.year)).toEqual(
      ['1991', '1994', '1997', '2008', '2009', '2014', '2015', '2017', '2018', '2020', '2022'],
    )
  })
})
