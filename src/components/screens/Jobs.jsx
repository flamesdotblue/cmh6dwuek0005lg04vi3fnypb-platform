import { useMemo, useState } from 'react'
import { CheckCircle, Filter, AlertTriangle, CreditCard, Banknote } from 'lucide-react'

const currency = (n) => `€${(n||0).toFixed(2)}`

const Jobs = ({ state }) => {
  const { jobs, customers, computed, VAT_RATE, actions, inventory } = state
  const [statusFilter, setStatusFilter] = useState('All')
  const [payFilter, setPayFilter] = useState('All')

  const filtered = useMemo(() => jobs.filter((j) => {
    const s = statusFilter === 'All' || j.status === statusFilter
    const p = payFilter === 'All' || j.paymentStatus === payFilter
    return s && p
  }), [jobs, statusFilter, payFilter])

  const totalFor = (jobId) => {
    const t = computed.totals.find((t) => t.id === jobId)
    return t ? t.total : 0
  }

  const lowStock = (job) => job.partsUsed.some((u) => (inventory.find((p)=>p.id===u.partId)?.stock || 0) < u.qty)

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Jobs</div>
        <div className="flex items-center gap-2 text-sm">
          <Filter size={18} className="text-slate-500"/>
          <select value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)} className="border rounded-md px-2 py-1">
            {['All','Pending','In Progress','Completed','Cancelled'].map((s)=>(<option key={s} value={s}>{s}</option>))}
          </select>
          <select value={payFilter} onChange={(e)=>setPayFilter(e.target.value)} className="border rounded-md px-2 py-1">
            {['All','Unpaid','Paid'].map((s)=>(<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((job) => {
          const customer = customers.find((c) => c.id === job.customerId)
          const t = totalFor(job.id)
          const totals = computed.totals.find((x)=>x.id===job.id) || { partsSubtotal:0, labourSubtotal:0, vatTotal:0, total:0 }
          return (
            <div key={job.id} className="bg-white rounded-xl border shadow-sm p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">{customer?.name} — {job.vehicleReg}</div>
                  <div className="text-sm text-slate-600">{job.issue}</div>
                  <div className="text-xs mt-1 flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full ${job.status==='Completed'?'bg-emerald-100 text-emerald-700': job.status==='In Progress'?'bg-blue-100 text-blue-700': job.status==='Pending'?'bg-slate-100 text-slate-700':'bg-rose-100 text-rose-700'}`}>{job.status}</span>
                    <span className={`px-2 py-0.5 rounded-full ${job.paymentStatus==='Paid'?'bg-emerald-100 text-emerald-700':'bg-amber-100 text-amber-700'}`}>{job.paymentStatus}</span>
                    {job.emergency && <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">Emergency</span>}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{currency(t)}</div>
                  <div className="text-xs text-slate-500">Parts {currency(totals.partsSubtotal)} · Labour {currency(totals.labourSubtotal)} · VAT {currency(totals.vatTotal)}</div>
                </div>
              </div>

              {lowStock(job) && (
                <div className="mt-2 text-xs text-amber-600 flex items-center gap-1"><AlertTriangle size={14}/> Parts exceed stock</div>
              )}

              <div className="mt-3 flex items-center gap-2">
                {job.status !== 'Completed' && (
                  <button onClick={() => actions.completeJob(job.id)} className="flex-1 bg-lime-500 hover:bg-lime-600 text-white rounded-md px-3 py-2 text-sm flex items-center justify-center gap-1"><CheckCircle size={16}/> Mark Completed</button>
                )}
                {job.paymentStatus !== 'Paid' && (
                  <button onClick={() => actions.updateJob({ ...job, paymentStatus: 'Paid' })} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm flex items-center justify-center gap-1"><CreditCard size={16}/> Mark Paid</button>
                )}
                {job.paymentStatus === 'Paid' && (
                  <div className="flex-1 border rounded-md px-3 py-2 text-sm flex items-center justify-center gap-1"><Banknote size={16}/> {job.paymentMethod}</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Jobs
