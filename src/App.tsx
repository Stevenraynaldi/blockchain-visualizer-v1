import { useState } from 'react'
import BlockPage from './pages/BlockPage'
import ChainPage from './pages/ChainPage'
import HashPage from './pages/HashPage'
import TimelinePage from './pages/TimelinePage'
import TxPage from './pages/TxPage'

const TABS = [
  { id: 'hash', label: 'Hash', Page: HashPage },
  { id: 'block', label: 'Block', Page: BlockPage },
  { id: 'chain', label: 'Blockchain', Page: ChainPage },
  { id: 'tx', label: 'Transactions', Page: TxPage },
  { id: 'timeline', label: 'Timeline', Page: TimelinePage },
]

export default function App() {
  const [tab, setTab] = useState('hash')
  const Active = TABS.find((t) => t.id === tab)!.Page
  return (
    <div>
      <h1>Blockchain Visualizer</h1>
      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={t.id === tab ? 'active' : ''} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </nav>
      <Active />
    </div>
  )
}
