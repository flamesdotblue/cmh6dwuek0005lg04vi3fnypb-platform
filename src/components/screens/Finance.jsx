import { useMemo } from 'react'
import { Download } from 'lucide-react'

const currency = (n) => `€${(n||0).toFixed(2)}`

const Finance = ({ state }) => {
  const { jobs, computed } = state

  const completed = jobs.filter((j) => j.status === 'Completed')

  const revenueByMonth = useMemo(() => {
    const out = {}
    completed.forEach((j) => {
      const d = j.scheduledAt || new Date().toISOString().slice(0,10)
      const m = d.slice(0,7)
      const t = computed.totals.find((x)=>x.id===j.id)?.total || 0
      out[m] = (out[m] || 0) + t
    })
    return out
  }, [completed, computed])

  const vatCollected = completed.reduce((s, j) => s + (computed.totals.find((x)=>x.id===j.id)?.vatTotal || 0), 0)

  const methodTotals = computed.paymentMethodTotals

  const outstanding = computed.outstanding

  const exportCSV = () => {
    const rows = [['JobID','Date','Status','PaymentStatus','Method','Total','VAT']]
    jobs.forEach((j)=>{
      const t = computed.totals.find((x)=>x.id===j.id) || { total:0, vatTotal:0 }
      rows.push([j.id, j.scheduledAt, j.status, j.paymentStatus, j.paymentMethod, t.total, t.vatTotal])
    })
    const csv = rows.map(r=>r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'qikmech_finance.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Finance</div>
        <button onClick={exportCSV} className="text-sm text-blue-600 flex items-center gap-1"><Download size={16}/> Export</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="text-xs text-slate-500">VAT Collected</div>
          <div className="text-2xl font-semibold">{currency(vatCollected)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="text-xs text-slate-500">Outstanding Invoices</div>
          <div className="text-2xl font-semibold">{outstanding.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="font-semibold mb-2">Revenue by Month</div>
        <div className="space-y-2 text-sm">
          {Object.keys(revenueByMonth).length === 0 && <div className="text-slate-500">No data</div>}
          {Object.entries(revenueByMonth).map(([m,v]) => (
            <div key={m} className="flex items-center justify-between"><span>{m}</span><span className="font-medium">{currency(v)}</span></div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="font-semibold mb-2">Payment Methods</div>
        <div className="space-y-1 text-sm">
          {Object.keys(methodTotals).length === 0 && <div className="text-slate-500">No payments yet</div>}
          {Object.entries(methodTotals).map(([m,v]) => (
            <div key={m} className="flex items-center justify-between"><span>{m}</span><span className="font-medium">{currency(v)}</span></div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Finance
