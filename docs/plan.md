# Plan — Blockchain Visualizer v1

Sources: `docs/requirements.md` and `docs/architecture.md` (layout in §3, build order in §7). Tasks follow that layout.

## Team
- Jake (builder): tasks #1–#4, in order
- Amy (tester): task #5
- Raymond (architect): design questions

## Tasks and file ownership (no overlaps)
| # | Owner | Task | Files |
|---|---|---|---|
| 1 | Jake | Scaffold Vite app, `src/lib` core (hash, block, mine, chain) | `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `index.html`, `src/main.tsx`, `src/app.css`, `src/lib/{hash,block,mine,chain}.ts` |
| 2 | Jake | Hash, Block and Blockchain pages, BlockCard, DifficultyPicker, ResetButton, text sample chain | `src/pages/{Hash,Block,Chain}Page.tsx`, `src/components/{BlockCard,DifficultyPicker,ResetButton}.tsx`, `src/data/samples.ts` |
| 3 | Jake | Transactions: ledger, TxList, BalancesPanel, TxPage, tx sample chain | `src/lib/ledger.ts`, `src/components/{TxList,BalancesPanel}.tsx`, `src/pages/TxPage.tsx`, `src/data/txSamples.ts` |
| 4 | Jake | Content: `today.ts`, TodayCard, Timeline page (11 entries), App tab wiring | `src/data/today.ts`, `src/components/TodayCard.tsx`, `src/pages/TimelinePage.tsx`, `src/App.tsx` |
| 5 | Amy | Unit tests, acceptance walk-through, fact-check | `tests/**` |

Deviation from architecture §3: the transaction sample chain is in `src/data/txSamples.ts` rather than `samples.ts`, so #2 and #3 don't share a file.

## Order
1. #1 first, since everything imports `src/lib`.
2. #2, then #3 (reuses BlockCard), then #4.
3. After #4, Jake adds a one-line `<TodayCard>` to each of the four level pages. This is a permitted cross-file edit.
4. Amy writes lib tests once #1 is done, and does the full acceptance check once #4 is done. She reports bugs to Jake as bug tasks.

## Done means
The 8 acceptance criteria in `docs/requirements.md` §5 pass, `npm test` passes, and `today.ts` and the Timeline are fact-checked.

## Notes
- Mining must not freeze the page: batches of about 5,000 nonces, yielding between batches. The fallback is a Web Worker if difficulty 5 is too slow.
- Content caveats: hashing and chaining predate Bitcoin (Haber & Stornetta 1991, Hashcash 1997). Stablecoins are explained, not simulated.
- Out of scope for v1: multiple ledger copies, runnable smart contracts, persistence, hosting, mobile layout.
