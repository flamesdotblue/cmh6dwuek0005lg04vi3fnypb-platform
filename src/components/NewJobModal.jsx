import { useMemo, useState } from 'react'
import { X, Camera, AlertTriangle } from 'lucide-react'

const currency = (n) => `€${n.toFixed(2)}`

const NewJobModal = ({ state, onClose }) => {
  const { customers, inventory, VAT_RATE } = state
  const [form, setForm] = useState({
    customerId: customers[0]?.id || '',
    vehicleReg: customers[0]?.vehicles?.[0]?.reg || '',
    issue: '',
    emergency: false,
    scheduledAt: new Date().toISOString().slice(0, 10),
    labour: { description: '', cost: 0, applyVat: true },
    partsUsed: [],
    paymentMethod: 'Invoice',
    status: 'Pending',
    paymentStatus: 'Unpaid',
    photosBefore: [],
    photosAfter: [],
  })

  const selectedCustomer = useMemo(() => customers.find((c) => c.id === form.customerId), [customers, form.customerId])
  const vehicles = selectedCustomer?.vehicles || []

  const totals = useMemo(() => {
    const partsSubtotal = form.partsUsed.reduce((s, p) => s + p.unitCost * p.qty, 0)
    const labourSubtotal = Number(form.labour.cost) || 0
    const vatParts = form.partsUsed.reduce((s, p) => s + (p.applyVat ? p.unitCost * p.qty * VAT_RATE : 0), 0)
    const vatLabour = form.labour.applyVat ? labourSubtotal * VAT_RATE : 0
    const vatTotal = vatParts + vatLabour
    const total = partsSubtotal + labourSubtotal + vatTotal
    return { partsSubtotal, labourSubtotal, vatTotal, total }
  }, [form, VAT_RATE])

  const addPart = (partId) => {
    const part = inventory.find((p) => p.id === partId)
    if (!part) return
    setForm((prev) => ({
      ...prev,
      partsUsed: [
        ...prev.partsUsed,
        { partId: part.id, name: part.name, qty: 1, unitCost: part.cost, applyVat: true },
      ],
    }))
  }

  const submit = () => {
    const job = { ...form }
    state.actions.addJob(job)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-t-2xl md:rounded-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">New Job</div>
          <button onClick={onClose} className="p-1 text-slate-500"><X /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="text-sm">Customer
              <select value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value, vehicleReg: customers.find(c=>c.id===e.target.value)?.vehicles?.[0]?.reg || '' })} className="mt-1 w-full border rounded-md px-3 py-2">
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label className="text-sm">Vehicle
              <select value={form.vehicleReg} onChange={(e) => setForm({ ...form, vehicleReg: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2">
                {vehicles.map((v) => (
                  <option key={v.reg} value={v.reg}>{v.reg} — {v.makeModel}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="text-sm">Issue notes
            <textarea value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2" rows={2} placeholder="Describe the issue" />
          </label>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.emergency} onChange={(e) => setForm({ ...form, emergency: e.target.checked })} />
              Emergency job
            </label>
            <label className="text-sm">Schedule
              <input type="date" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className="ml-2 border rounded-md px-2 py-1" />
            </label>
          </div>

          <div className="border rounded-lg p-3">
            <div className="font-medium mb-2">Labour</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" className="border rounded-md px-3 py-2" placeholder="Description" value={form.labour.description} onChange={(e) => setForm({ ...form, labour: { ...form.labour, description: e.target.value } })} />
              <input type="number" className="border rounded-md px-3 py-2" placeholder="Cost (€)" value={form.labour.cost} onChange={(e) => setForm({ ...form, labour: { ...form.labour, cost: Number(e.target.value) } })} />
              <label className="inline-flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.labour.applyVat} onChange={(e) => setForm({ ...form, labour: { ...form.labour, applyVat: e.target.checked } })} />
                Apply VAT (23%)
              </label>
            </div>
          </div>

          <div className="border rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">Parts</div>
              <select onChange={(e) => { if (e.target.value) { addPart(e.target.value); e.target.value=''} }} className="border rounded-md px-2 py-1">
                <option value="">Add part…</option>
                {inventory.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} — {currency(p.cost)} (Stock {p.stock})</option>
                ))}
              </select>
            </div>

            {form.partsUsed.length === 0 && (
              <div className="text-sm text-slate-500">No parts added</div>
            )}

            {form.partsUsed.map((p, idx) => (
              <div key={`${p.partId}-${idx}`} className="grid grid-cols-12 items-center gap-2">
                <div className="col-span-5 text-sm">{p.name}</div>
                <input type="number" min={1} value={p.qty} onChange={(e) => setForm((prev) => ({
                  ...prev,
                  partsUsed: prev.partsUsed.map((x, i) => i===idx? { ...x, qty: Number(e.target.value) }: x),
                }))} className="col-span-2 border rounded-md px-2 py-1" />
                <input type="number" value={p.unitCost} onChange={(e) => setForm((prev) => ({
                  ...prev,
                  partsUsed: prev.partsUsed.map((x, i) => i===idx? { ...x, unitCost: Number(e.target.value) }: x),
                }))} className="col-span-3 border rounded-md px-2 py-1" />
                <label className="col-span-2 inline-flex items-center gap-2 text-xs">
                  <input type="checkbox" checked={p.applyVat} onChange={(e) => setForm((prev) => ({
                    ...prev,
                    partsUsed: prev.partsUsed.map((x, i) => i===idx? { ...x, applyVat: e.target.checked }: x),
                  }))} />
                  VAT
                </label>
              </div>
            ))}

            <div className="text-xs text-amber-600 flex items-center gap-1" hidden={!(form.partsUsed.some(p=>p.qty > (inventory.find(i=>i.id===p.partId)?.stock || 0)))}>
              <AlertTriangle size={14} /> One or more parts exceed current stock.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="text-sm">Payment Method
              <select value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2">
                {['Cash','Revolut','Card','Bank Transfer','Invoice'].map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </label>
            <label className="text-sm">Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2">
                {['Pending','In Progress','Completed','Cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="text-sm">Payment Status
              <select value={form.paymentStatus} onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })} className="mt-1 w-full border rounded-md px-3 py-2">
                {['Unpaid','Paid'].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="border rounded-md px-3 py-2 text-sm flex items-center justify-center gap-2"><Camera size={16}/> Before photos</button>
            <button className="border rounded-md px-3 py-2 text-sm flex items-center justify-center gap-2"><Camera size={16}/> After photos</button>
          </div>

          <div className="border rounded-lg p-3 bg-slate-50">
            <div className="flex justify-between text-sm">
              <span>Parts</span>
              <span>{currency(totals.partsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Labour</span>
              <span>{currency(totals.labourSubtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>VAT</span>
              <span>{currency(totals.vatTotal)}</span>
            </div>
            <div className="mt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>{currency(totals.total)}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={submit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 font-semibold">Create Job</button>
            <button onClick={onClose} className="flex-1 border rounded-md px-4 py-2">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewJobModal
