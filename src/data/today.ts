export type Level = 'hash' | 'block' | 'chain' | 'tx'

export const LEVEL_NAMES: Record<Level, string> = {
  hash: 'Hash',
  block: 'Block / Mining',
  chain: 'Blockchain',
  tx: 'Transactions',
}

/** "Then → Today" bullets per level page. */
export const TODAY: Record<Level, string[]> = {
  hash: [
    'Hashes work as digital fingerprints: change one character of the input and the whole hash changes.',
    'Merkle trees summarise all of a block\'s transactions in a single hash.',
    'The same idea identifies files in Git commits and in IPFS content addresses.',
  ],
  block: [
    'Bitcoin still uses proof-of-work: miners spend computing power to find a valid nonce, as you just did.',
    'Ethereum moved to proof-of-stake in "The Merge" (September 2022), cutting its energy use by about 99.9%.',
    'Other systems use validators instead of miners.',
  ],
  chain: [
    'Tamper-evidence is the core value: changing history is visible to everyone who checks the hashes.',
    'It underlies public ledgers, audit trails and asset registries.',
    'Layer-2 networks batch many transactions and anchor them to the main chain.',
  ],
  tx: [
    'Bitcoin records coins as "unspent outputs" (UTXOs), while Ethereum keeps account balances like this demo does.',
    'Programs that run on the chain became smart contracts (Ethereum, 2015). They enabled tokens (ERC-20), stablecoins and DeFi (lending and trading without a bank).',
    'Stablecoins are explained by what backs them, not by chain mechanics: cash reserves (USDT 2014, USDC 2018), crypto collateral (DAI 2017), or an algorithm (Terra UST, which collapsed in May 2022).',
  ],
}

export type TimelineEntry = { year: string; title: string; text: string; level: Level }

export const TIMELINE: TimelineEntry[] = [
  { year: '1991', title: 'Haber & Stornetta', text: 'A timestamped chain of document hashes, so documents could not be quietly backdated or altered.', level: 'chain' },
  { year: '1994', title: 'Nick Szabo coins "smart contract"', text: 'The idea of agreements that execute themselves, decades before a chain could run them.', level: 'tx' },
  { year: '1997', title: 'Hashcash', text: 'Adam Back proposes proof-of-work as an anti-spam stamp: make senders spend a little computing effort.', level: 'block' },
  { year: '2008', title: 'Bitcoin whitepaper', text: 'Satoshi Nakamoto combines hash chains, proof-of-work and peer-to-peer networking into one design.', level: 'chain' },
  { year: '2009', title: 'Bitcoin launches', text: 'The network goes live and tracks coins as unspent transaction outputs (UTXOs).', level: 'tx' },
  { year: '2014', title: 'Tether (USDT)', text: 'The first widely used stablecoin, backed by claimed cash reserves.', level: 'tx' },
  { year: '2015', title: 'Ethereum', text: 'Account balances plus programs that run on the chain: smart contracts become real.', level: 'tx' },
  { year: '2017', title: 'DAI and the ERC-20 token boom', text: 'DAI is a stablecoin backed by crypto collateral. The ERC-20 standard makes launching tokens easy.', level: 'tx' },
  { year: '2018', title: 'USDC', text: 'A reserve-backed stablecoin that becomes a major settlement currency in crypto markets.', level: 'tx' },
  { year: '2020', title: 'DeFi summer', text: 'Lending and trading run by smart contracts, without a bank in the middle, take off.', level: 'tx' },
  { year: '2022', title: 'The Merge and the UST collapse', text: 'Ethereum switches from proof-of-work to proof-of-stake (September). In May, the algorithmic stablecoin Terra UST collapses, a lesson in why backing matters.', level: 'block' },
]
