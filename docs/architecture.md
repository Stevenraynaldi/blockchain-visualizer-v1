# Blockchain Visualizer v1 — Architecture

## 1. Shape
A static single-page web app with no backend. Everything, hashing and mining included, happens in the browser.

## 2. Technology choices
| Choice | Why |
|---|---|
| **Vite + React 18 + TypeScript** | Fast local dev server with one command. React re-renders the chain as the user types, and TypeScript keeps the block and transaction shapes honest. |
| **`@noble/hashes` (`sha256`)** | Small, audited, *synchronous* SHA-256. The browser's built-in Web Crypto is async-only, which makes hashing on every keystroke and tight mining loops awkward. |
| **Plain CSS (one `app.css`)** | Few screens, so a UI framework isn't worth it. Green (`#d4edda`) and red (`#f8d7da`) block backgrounds carry the lesson. |
| **React state only (`useState`/`useReducer`)** | Each page owns its own chain. There is nothing to share or save, so no state library is needed. |
| **Simple tab navigation (no router)** | 5 tabs: Hash, Block, Blockchain, Transactions, Timeline. |

## 3. Source layout
```
src/
  main.tsx, App.tsx          tab bar + page switch
  lib/
    hash.ts                  sha256Hex(text): string
    block.ts                 types, blockPayload(), computeHash(), isValid(hash, difficulty)
    mine.ts                  mineAsync(block, difficulty, onProgress, signal): Promise<nonce>
    chain.ts                 buildSampleChain(), relinkChain() – recompute prev/hash down the chain
    ledger.ts                computeBalances(chain) → {balances, invalidTxIds}
  data/
    samples.ts               sample text chain, sample transaction chain (pre-mined at difficulty 3)
    today.ts                 "Then → Today" bullets per level + timeline entries (content from requirements §3)
  components/
    BlockCard.tsx            one block (fields, status colour, Mine button)
    TxList.tsx               editable transfer rows (from, to, amount), invalid rows flagged
    BalancesPanel.tsx
    DifficultyPicker.tsx, ResetButton.tsx
    TodayCard.tsx            renders today.ts entry for a level
  pages/
    HashPage.tsx, BlockPage.tsx, ChainPage.tsx, TxPage.tsx, TimelinePage.tsx
```

## 4. Core data and rules
```ts
type Tx = { id: string; from: string; to: string; amount: number }
type Block = { index: number; nonce: number; data: string | Tx[]; prevHash: string; hash: string }
```
- **Payload hashed:** `${index}|${nonce}|${dataString}|${prevHash}`, where transaction data is serialised as `from>to:amount;` in order. The same function is used everywhere.
- **Valid block:** `hash.startsWith("0".repeat(difficulty))` **and** `prevHash === previous block's hash`. Block 1 uses 64 zeros as its prevHash.
- **On any edit:** recompute that block's hash, then copy each block's hash into the next block's `prevHash` and recompute on down the chain. Nonces are not changed, which is why later blocks turn red (acceptance criterion 3).
- **Balances (account model):** block 1's transfers come from `"Genesis"`, which may send any amount. Every other transfer is applied in order, and a transfer is invalid if the sender's balance at that point is lower than the amount. Invalid transfers are skipped for the balances and shown red. A block holding an invalid transfer is also shown red.

## 5. Mining without freezing
`mineAsync` tries nonces in batches of about 5,000, then yields with `setTimeout(0)` and reports the current nonce so the UI can show it counting. An `AbortSignal` lets the user cancel or navigate away. At difficulty 4 (about 65k tries on average) this finishes in well under a second, and difficulty 5 (about 1M tries) takes a few seconds. If difficulty 5 turns out too slow, the fallback is to move the same loop into a Web Worker.

## 6. Risks
| Risk | Mitigation |
|---|---|
| Sample chain must be pre-mined | Generate the sample chain in `samples.ts` by mining it at startup at difficulty 3 (fast), rather than hard-coding nonces that break if the payload format changes. |
| Factual accuracy of "Today" content | All content lives in `today.ts` and is kept to widely documented facts and dates. The tester checks it against sources. |
| Scope creep into consensus or smart contracts | Out of scope for v1 per requirements §3. `chain.ts` is written so that Level 5 can later render 3 copies of the same chain. |

## 7. Suggested build order
1. **Scaffold + lib:** Vite project, `hash.ts`, `block.ts`, `mine.ts`, `chain.ts` with unit tests (Vitest) for acceptance criteria 1, 3 and 6.
2. **Pages 1–3:** Hash, Block and Blockchain pages with BlockCard, DifficultyPicker and Reset.
3. **Transactions:** `ledger.ts`, TxList, BalancesPanel and TxPage.
4. **Content:** `today.ts`, TodayCard on every page, and TimelinePage.
5. **Test:** check all 8 acceptance criteria and fact-check `today.ts`.
