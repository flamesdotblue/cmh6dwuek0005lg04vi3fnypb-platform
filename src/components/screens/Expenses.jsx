import { useState } from 'react'
import { Camera, Euro } from 'lucide-react'

const currency = (n) => `€${(n||0).toFixed(2)}`

const Expenses = ({ state }) => {
  const { expenses, actions, computed } = state
  const [form, setForm] = useState({ category:'Van', subcategory:'Fuel', amount:0, date:new Date().toISOString().slice(0,10), notes:'', photo:null })

  const submit = () => {
    actions.addExpense(form)
    setForm({ category:'Van', subcategory:'Fuel', amount:0, date:new Date().toISOString().slice(0,10), notes:'', photo:null })
  }

  return (
    <div className="py-4 space-y-4">
      <div className="font-semibold">Expenses</div>

      <div className="bg-white rounded-xl border shadow-sm p-3 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm">Category
            <select value={form.category} onChange={(e)=>setForm({...form, category:e.target.value, subcategory: e.target.value==='Van'?'Fuel':'Purchase'})} className="mt-1 w-full border rounded-md px-3 py-2">
              <option>Van</option>
              <option>Tools</option>
            </select>
          </label>
          <label className="text-sm">Type
            <select value={form.subcategory} onChange={(e)=>setForm({...form, subcategory:e.target.value})} className="mt-1 w-full border rounded-md px-3 py-2">
              {form.category==='Van' ? (
                <>
                  <option>Fuel</option>
                  <option>Repairs</option>
                  <option>Insurance</option>
                  <option>Tax</option>
                  <option>Service</option>
                </>
              ) : (
                <>
                  <option>Purchase</option>
                  <option>Maintenance</option>
                </>
              )}
            </select>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-sm">Amount (€)
            <input type="number" value={form.amount} onChange={(e)=>setForm({...form, amount:Number(e.target.value)})} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </label>
          <label className="text-sm">Date
            <input type="date" value={form.date} onChange={(e)=>setForm({...form, date:e.target.value})} className="mt-1 w-full border rounded-md px-3 py-2"/>
          </label>
        </div>
        <input className="border rounded-md px-3 py-2 w-full" placeholder="Notes" value={form.notes} onChange={(e)=>setForm({...form, notes:e.target.value})}/>
        <button className="border rounded-md px-3 py-2 text-sm flex items-center gap-2"><Camera size={16}/> Attach Invoice Photo</button>
        <button onClick={submit} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 font-semibold">Add Expense</button>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-3">
        <div className="font-semibold mb-2">Recent Expenses</div>
        <div className="space-y-2 text-sm">
          {expenses.length===0 && <div className="text-slate-500">No expenses yet</div>}
          {expenses.map((e)=>(
            <div key={e.id} className="flex items-center justify-between border rounded-md px-3 py-2">
              <div>
                <div className="font-medium">{e.category} — {e.subcategory}</div>
                <div className="text-xs text-slate-500">{e.date} · {e.notes}</div>
              </div>
              <div className="font-semibold">{currency(e.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-3">
        <div className="flex items-center gap-2 text-blue-700 font-medium"><Euro/> Profit</div>
        <div className="mt-2 text-2xl font-semibold">{currency(Object.values(state.computed.revenueByDate).reduce((a,b)=>a+b,0) - computed.expensesTotal)}</div>
        <div className="text-xs text-slate-500">Revenue - Expenses</div>
      </div>
    </div>
  )
}

export default Expenses
