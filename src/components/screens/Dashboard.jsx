import { AlertTriangle, Calendar, CheckCircle, Clock, Euro, Wrench } from 'lucide-react'

const currency = (n) => `€${(n||0).toFixed(2)}`

const Dashboard = ({ state }) => {
  const { jobs, expenses, computed } = state
  const today = new Date().toISOString().slice(0,10)
  const todaysJobs = jobs.filter((j) => j.scheduledAt === today && j.status !== 'Cancelled')
  const unpaidCount = jobs.filter((j) => j.paymentStatus === 'Unpaid' && j.status !== 'Cancelled').length
  const nextJob = jobs
    .filter((j) => j.status !== 'Cancelled')
    .sort((a, b) => (a.scheduledAt > b.scheduledAt ? 1 : -1))[0]

  // Van service reminder: if last van service > 180 days
  const lastService = expenses
    .filter((e) => e.category === 'Van' && e.subcategory === 'Service')
    .sort((a,b) => (a.date < b.date ? 1 : -1))[0]
  const daysSinceService = lastService ? Math.floor((Date.now() - new Date(lastService.date).getTime()) / (1000*60*60*24)) : null
  const serviceDue = daysSinceService !== null && daysSinceService > 180

  return (
    <div className="py-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="text-xs text-slate-500">Today’s Jobs</div>
          <div className="text-2xl font-semibold">{todaysJobs.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="text-xs text-slate-500">Revenue Today</div>
          <div className="text-2xl font-semibold">{currency(computed.revenueToday)}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="text-xs text-slate-500">Unpaid Jobs</div>
          <div className="text-2xl font-semibold">{unpaidCount}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border shadow-sm">
          <div className="text-xs text-slate-500">VAT Today</div>
          <div className="text-2xl font-semibold">{currency(computed.vatToday)}</div>
        </div>
      </div>

      <div className="bg-blue-600 text-white rounded-xl p-4 flex items-center gap-3">
        <Clock />
        <div>
          <div className="text-sm opacity-90">Next Job</div>
          {nextJob ? (
            <div className="font-semibold">{nextJob.scheduledAt} — {nextJob.issue}</div>
          ) : (
            <div className="font-semibold">No jobs scheduled</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Van Service Reminder</div>
          <Wrench />
        </div>
        {serviceDue ? (
          <div className="mt-2 flex items-center gap-2 text-amber-600"><AlertTriangle /> Van service overdue by {daysSinceService - 180} days</div>
        ) : (
          <div className="mt-2 text-sm text-slate-600">Last service {lastService ? `${lastService.date} (${daysSinceService} days ago)` : 'N/A'}</div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="font-semibold mb-2">Quick Stats</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-slate-50 flex items-center justify-between"><span>Outstanding</span><span className="font-semibold text-blue-700">{computed.outstanding.length}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 flex items-center justify-between"><span>Expenses</span><span className="font-semibold text-rose-600">{currency(computed.expensesTotal)}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 flex items-center justify-between"><span>Payment Methods</span><span className="font-semibold">{Object.keys(computed.paymentMethodTotals).length}</span></div>
          <div className="p-3 rounded-lg bg-slate-50 flex items-center justify-between"><span>VAT Collected</span><span className="font-semibold text-emerald-600">{currency(Object.values(computed.vatCollectedByDate).reduce((a,b)=>a+b,0))}</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 border shadow-sm">
        <div className="flex items-center gap-2 text-blue-700 font-medium"><Euro /> Finance Snapshot</div>
        <div className="mt-2 text-sm text-slate-600">Track revenue by day/week/month, VAT vs Non-VAT, payment methods, and outstanding invoices in Finance tab.</div>
      </div>

      <div className="text-xs text-slate-400 flex items-center gap-2 justify-center">
        <Calendar size={14}/> {today}
      </div>
    </div>
  )
}

export default Dashboard
