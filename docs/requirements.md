# Blockchain Visualizer v1 — Requirements

## 1. Purpose
A hands-on learning toy that shows how a blockchain works by letting the user edit blocks and watch the chain react. Each concept also has a short "Then → Today" note on what it grew into (smart contracts, stablecoins, proof-of-stake, etc.).

## 2. User
One person (the operator) learning blockchain basics. They are curious and technical, but not a cryptographer. The app runs only on their own computer and has no accounts, server or network use.

## 3. Scope

### In v1: four levels, each on its own page, in this order
| # | Level | What the user can do |
|---|-------|----------------------|
| 1 | **Hash** | Type any text and see its SHA-256 hash update on every keystroke. Changing one character changes the whole hash. |
| 2 | **Block** | One block with the fields: block number, nonce, data, previous hash, hash. The block shows green when its hash meets the difficulty (starts with N zeros) and red when it doesn't. A **Mine** button counts the nonce up in view until the hash is valid. |
| 3 | **Blockchain** | 5 pre-mined blocks side by side. Each block's "previous hash" is the hash of the block before it. Editing any block turns it and **every block after it** red. Re-mining repairs them one at a time. |
| 4 | **Transactions** | The same chain, but each block holds a list of transfers such as "Alice → Bob: 5" instead of free text. Block 1 hands out starting balances. A balance panel shows everyone's balance. A transfer that spends more than the sender has is flagged invalid. |

### Controls on every page
- **Difficulty:** a selector from 1 to 5 leading hex zeros. The default is 3.
- **Reset:** puts the page back to its sample data.

### "Then → Today" panel (required on every level page)
A short card below the demo, with 2–4 bullets, that says what the concept became in real systems:

| Level | Today (content to cover) |
|---|---|
| Hash | Hashes as digital fingerprints. Merkle trees summarise all of a block's transactions in one hash. The same idea identifies files in Git and IPFS. |
| Block / Mining | Bitcoin still uses proof-of-work. Ethereum moved to **proof-of-stake** in "The Merge" (Sept 2022), cutting its energy use by about 99.9%. Other systems use validators instead of miners. |
| Blockchain | Tamper-evidence is the core value. It underlies public ledgers, audit trails and asset registries. Layer-2 networks batch many transactions and anchor them to the main chain. |
| Transactions | Bitcoin records coins as "unspent outputs" (UTXOs), while Ethereum keeps account balances like this demo does. Programs that run on the chain became **smart contracts** (Ethereum, 2015). Those enabled **tokens** (ERC-20), **stablecoins** and **DeFi** (lending and trading without a bank). Stablecoins are backed by cash reserves (USDT 2014, USDC 2018), by crypto collateral (DAI 2017), or by an algorithm (Terra UST, which collapsed in May 2022). |

### Timeline page
One extra page with a simple vertical timeline linking the levels to history: 1991 Haber & Stornetta, a timestamped chain of document hashes (Hash, Blockchain) · 1994 Nick Szabo coins the term "smart contract" (Transactions) · 1997 Hashcash proof-of-work, as anti-spam (Mining) · 2008 Bitcoin whitepaper · 2009 Bitcoin launch, using the UTXO model · 2014 Tether (USDT) · 2015 Ethereum, with account balances and smart contracts · 2017 DAI and the ERC-20 token boom · 2018 USDC · 2020 "DeFi summer" · 2022 The Merge and the UST collapse. Each entry names the level it grew from.

Framing rules for the history content:
- Don't imply that Bitcoin invented every idea. It combined earlier ones.
- Present stablecoins as a "how it works" explanation (reserves, collateral or algorithm), not as a simulation.
- CBDCs and Layer-2 rollups get one mention at most. They are not timeline entries.

### Out of scope for v1 (next version)
- Level 5, multiple copies of the ledger (peer-to-peer consensus with 3 copies side by side).
- A runnable smart-contract demo.
- Saving state between sessions, hosting online, and mobile layout.

## 4. Non-functional
- Runs locally with `npm install` then `npm run dev`, and opens in a desktop browser (Chrome or Edge).
- Mining at difficulty 4 finishes within a few seconds, and the page never freezes while mining.
- Hashes are real SHA-256, so they match any online SHA-256 tool for the same input.
- The text is written for learners: each field has a one-line tooltip explaining it.

## 5. Acceptance criteria
1. **Hash:** typing "hello" shows `2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824`.
2. **Mining:** at difficulty 3, clicking **Mine** on a red block visibly counts the nonce up and stops on a hash starting with `000`. The block turns green and the page stays responsive.
3. **Chain break:** on the Blockchain page, editing block 2's data turns blocks 2–5 red and leaves block 1 green.
4. **Chain repair:** after that edit, mining blocks 2, 3, 4 and 5 in order turns all five green again.
5. **Transactions:** in the sample data, adding "Alice → Bob: 1000" is flagged invalid (Alice cannot afford it), and the balances panel updates for valid transfers.
6. **Difficulty:** changing the difficulty from 3 to 4 re-checks every block, so blocks mined at 3 whose hash lacks a fourth zero turn red.
7. **Then → Today:** every level page shows its card with the content in §3, and the Timeline page lists all 11 entries.
8. **Reset:** Reset on any page restores the sample data with every block green.
