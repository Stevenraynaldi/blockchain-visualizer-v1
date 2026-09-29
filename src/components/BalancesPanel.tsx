export default function BalancesPanel({ balances }: { balances: Record<string, number> }) {
  const rows = Object.entries(balances).sort(([a], [b]) => a.localeCompare(b))
  return (
    <div className="today-card" style={{ borderLeftColor: '#28a745' }}>
      <strong title="Balances after applying every valid transfer in order. Invalid transfers are skipped.">Balances</strong>
      <table>
        <tbody>
          {rows.map(([name, bal]) => (
            <tr key={name}>
              <td>{name}</td>
              <td data-testid={`balance-${name}`}>{bal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
