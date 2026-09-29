# Plan — Blockchain Visualizer v1

Source: `docs/requirements.md`. `docs/architecture.md` did not exist when this plan was written, so the stack (Vite, React, TypeScript, vitest) and file layout below are the PM's defaults. Raymond can override them.

## Team
- Jake (builder): tasks #1–#4
- Amy (tester): task #5
- Raymond (architect): reviews design questions

## Order of work
1. **#1 Scaffold and core logic** (Jake). Everything else depends on it. Owns the project root files, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/core/**`.
2. **#2 Hash and Block pages plus shared components** (Jake). Owns `src/pages/HashPage.tsx`, `src/pages/BlockPage.tsx`, `src/components/**`, `src/content/thenToday.ts`.
3. **#3 Blockchain page** (Jake), after #2. Owns `src/pages/ChainPage.tsx`, `src/state/chainStore.ts`.
4. **#4 Transactions and Timeline pages** (Jake), after #2. Owns `src/pages/TransactionsPage.tsx`, `src/pages/TimelinePage.tsx`, `src/state/txStore.ts`, `src/content/timeline.ts`.
5. **#5 Tests and acceptance check** (Amy). Core tests can start once #1 is done. The acceptance walk-through starts when #2–#4 are done. Owns `tests/**`.

File ownership does not overlap. If a task needs a change in a file it doesn't own, ask the owner or the PM.

## Done means
The 8 acceptance criteria in `docs/requirements.md` §5 pass, and `npm test` passes.

## Notes
- Mining must not freeze the page. Yield to the UI between batches of nonces.
- Content caveats (Mozart's fact-check): hashing and chaining predate Bitcoin (Haber & Stornetta 1991, Hashcash 1997). Stablecoin text is explanatory, not simulated.
- Out of scope for v1: multiple ledger copies, runnable smart contracts, persistence, hosting, mobile layout.
