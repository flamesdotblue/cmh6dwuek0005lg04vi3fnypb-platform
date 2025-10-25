import { useMemo, useState } from 'react'
import { Phone, Mail, MapPin, Car, PlusCircle } from 'lucide-react'

const Customers = ({ state }) => {
  const { customers, actions } = state
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name:'', phone:'', email:'', address:'', vehicles:[{reg:'', makeModel:'', mileage:0, nctExpiry:''}] })

  const submit = () => {
    actions.addCustomer({ id: `c${Date.now()}`, ...form })
    setForm({ name:'', phone:'', email:'', address:'', vehicles:[{reg:'', makeModel:'', mileage:0, nctExpiry:''}] })
    setOpen(false)
  }

  return (
    <div className="py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="font-semibold">Customers & Vehicles</div>
        <button onClick={()=>setOpen(true)} className="text-blue-600 text-sm flex items-center gap-1"><PlusCircle size={16}/> Add</button>
      </div>

      <div className="space-y-3">
        {customers.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border shadow-sm p-3">
            <div className="font-semibold">{c.name}</div>
            <div className="text-xs text-slate-600 flex flex-wrap gap-3 mt-1">
              <span className="flex items-center gap-1"><Phone size={14}/> {c.phone}</span>
              <span className="flex items-center gap-1"><Mail size={14}/> {c.email}</span>
              <span className="flex items-center gap-1"><MapPin size={14}/> {c.address}</span>
            </div>
            <div className="mt-2">
              <div className="text-xs text-slate-500 mb-1">Vehicles</div>
              <div className="space-y-2">
                {c.vehicles.map((v) => (
                  <div key={v.reg} className="border rounded-md p-2 text-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Car size={16}/>
                      <div>
                        <div className="font-medium">{v.reg} — {v.makeModel}</div>
                        <div className="text-xs text-slate-500">Mileage {v.mileage.toLocaleString()} · NCT {v.nctExpiry}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-t-2xl md:rounded-2xl p-4 space-y-3">
            <div className="font-semibold">Add Customer</div>
            <input className="border rounded-md px-3 py-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
            <input className="border rounded-md px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})}/>
            <input className="border rounded-md px-3 py-2" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>
            <input className="border rounded-md px-3 py-2" placeholder="Address" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})}/>
            <div className="border rounded-md p-3 space-y-2">
              <div className="text-sm font-medium">Vehicle</div>
              <input className="border rounded-md px-3 py-2 w-full" placeholder="Registration" value={form.vehicles[0].reg} onChange={(e)=>setForm({...form, vehicles:[{...form.vehicles[0], reg:e.target.value}]})}/>
              <input className="border rounded-md px-3 py-2 w-full" placeholder="Make/Model" value={form.vehicles[0].makeModel} onChange={(e)=>setForm({...form, vehicles:[{...form.vehicles[0], makeModel:e.target.value}]})}/>
              <input className="border rounded-md px-3 py-2 w-full" placeholder="Mileage" type="number" value={form.vehicles[0].mileage} onChange={(e)=>setForm({...form, vehicles:[{...form.vehicles[0], mileage:Number(e.target.value)}]})}/>
              <label className="text-sm">NCT Expiry <input type="date" className="ml-2 border rounded-md px-2 py-1" value={form.vehicles[0].nctExpiry} onChange={(e)=>setForm({...form, vehicles:[{...form.vehicles[0], nctExpiry:e.target.value}]})}/></label>
            </div>
            <div className="flex gap-3">
              <button onClick={submit} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 font-semibold">Save</button>
              <button onClick={()=>setOpen(false)} className="flex-1 border rounded-md px-4 py-2">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers
