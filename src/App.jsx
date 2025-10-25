import { useMemo, useState } from 'react'
import Header from './components/Header'
import BottomNav from './components/BottomNav'
import FloatingNewJobButton from './components/FloatingNewJobButton'
import TabRouter from './components/TabRouter'

function App() {
  const [activeTab, setActiveTab] = useState('Dashboard')

  // Global app state (simple in-memory store for demo)
  const [customers, setCustomers] = useState([
    {
      id: 'c1',
      name: 'John Murphy',
      phone: '+353 86 123 4567',
      email: 'john.murphy@example.com',
      address: '12 Main St, Dublin',
      vehicles: [
        { reg: '201-D-12345', makeModel: 'VW Golf 1.6 TDI', mileage: 145230, nctExpiry: '2026-02-10' },
      ],
    },
    {
      id: 'c2',
      name: 'Aoife O’Connor',
      phone: '+353 87 987 6543',
      email: 'aoife.oconnor@example.com',
      address: '7 Seaview Rd, Cork',
      vehicles: [
        { reg: '152-C-54321', makeModel: 'Toyota Yaris 1.3', mileage: 99500, nctExpiry: '2025-12-01' },
      ],
    },
  ])

  const [inventory, setInventory] = useState([
    { id: 'p1', name: 'Oil Filter', stock: 8, cost: 6.5, supplier: 'PartsCo', lowThreshold: 3 },
    { id: 'p2', name: 'Air Filter', stock: 2, cost: 12.0, supplier: 'PartsCo', lowThreshold: 3 },
    { id: 'p3', name: 'Brake Pads (Front)', stock: 5, cost: 28.0, supplier: 'BrakeWorld', lowThreshold: 2 },
  ])

  const [jobs, setJobs] = useState([
    {
      id: 'j1',
      customerId: 'c1',
      vehicleReg: '201-D-12345',
      issue: 'Engine service and oil change',
      photosBefore: [],
      photosAfter: [],
      status: 'Pending', // Pending | In Progress | Completed | Cancelled
      paymentStatus: 'Unpaid', // Paid | Unpaid
      emergency: false,
      scheduledAt: new Date().toISOString().slice(0, 10),
      labour: { description: 'Standard service', cost: 120, applyVat: true },
      partsUsed: [
        { partId: 'p1', name: 'Oil Filter', qty: 1, unitCost: 6.5, applyVat: true },
      ],
      paymentMethod: 'Invoice', // Cash | Revolut | Card | Bank Transfer | Invoice
    },
    {
      id: 'j2',
      customerId: 'c2',
      vehicleReg: '152-C-54321',
      issue: 'Brake squeal, check pads',
      photosBefore: [],
      photosAfter: [],
      status: 'In Progress',
      paymentStatus: 'Unpaid',
      emergency: true,
      scheduledAt: new Date().toISOString().slice(0, 10),
      labour: { description: 'Brake inspection', cost: 60, applyVat: true },
      partsUsed: [],
      paymentMethod: 'Cash',
    },
  ])

  const [expenses, setExpenses] = useState([
    { id: 'e1', category: 'Van', subcategory: 'Fuel', amount: 45.2, date: new Date().toISOString().slice(0,10), notes: 'Diesel - Circle K', photo: null },
    { id: 'e2', category: 'Tools', subcategory: 'Purchase', amount: 120.0, date: new Date().toISOString().slice(0,10), notes: 'Torque wrench', photo: null },
    { id: 'e3', category: 'Van', subcategory: 'Service', amount: 180.0, date: '2025-02-01', notes: 'Annual service', photo: null },
  ])

  const VAT_RATE = 0.23

  const computed = useMemo(() => {
    const totals = jobs.map((job) => {
      const partsSubtotal = job.partsUsed.reduce((sum, p) => sum + p.unitCost * p.qty, 0)
      const labourSubtotal = job.labour?.cost || 0
      const vatParts = job.partsUsed.reduce((sum, p) => sum + (p.applyVat ? p.unitCost * p.qty * VAT_RATE : 0), 0)
      const vatLabour = job.labour?.applyVat ? labourSubtotal * VAT_RATE : 0
      const total = partsSubtotal + labourSubtotal + vatParts + vatLabour
      const vatTotal = vatParts + vatLabour
      return { id: job.id, partsSubtotal, labourSubtotal, vatTotal, total }
    })

    const revenueByDate = {}
    const vatCollectedByDate = {}
    let revenueToday = 0
    let vatToday = 0
    const today = new Date().toISOString().slice(0, 10)

    jobs.forEach((job) => {
      const t = totals.find((t) => t.id === job.id)
      if (!t) return
      const d = job.scheduledAt || today
      if (!revenueByDate[d]) revenueByDate[d] = 0
      if (!vatCollectedByDate[d]) vatCollectedByDate[d] = 0
      if (job.status === 'Completed') {
        revenueByDate[d] += t.total
        vatCollectedByDate[d] += t.vatTotal
      }
      if (d === today && job.status !== 'Cancelled') {
        revenueToday += job.status === 'Completed' ? t.total : 0
        vatToday += job.status === 'Completed' ? t.vatTotal : 0
      }
    })

    const outstanding = jobs.filter((j) => j.paymentStatus === 'Unpaid' && j.status !== 'Cancelled')

    const paymentMethodTotals = jobs.reduce((acc, job) => {
      const t = totals.find((x) => x.id === job.id)
      if (!t) return acc
      if (job.status !== 'Completed') return acc
      acc[job.paymentMethod] = (acc[job.paymentMethod] || 0) + t.total
      return acc
    }, {})

    const expensesTotal = expenses.reduce((s, e) => s + e.amount, 0)

    return { totals, revenueByDate, vatCollectedByDate, outstanding, paymentMethodTotals, revenueToday, vatToday, expensesTotal }
  }, [jobs, expenses])

  const handleAddCustomer = (cust) => setCustomers((prev) => [...prev, cust])
  const handleUpdateCustomer = (cust) => setCustomers((prev) => prev.map((c) => (c.id === cust.id ? cust : c)))

  const handleAddJob = (job) => {
    setJobs((prev) => [{ ...job, id: `j${Date.now()}` }, ...prev])
  }

  const handleUpdateJob = (updated) => {
    setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)))
  }

  const handleMarkCompleted = (jobId) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'Completed' } : j))
    )
    // Deduct parts from inventory
    const job = jobs.find((j) => j.id === jobId)
    if (job) {
      setInventory((prev) =>
        prev.map((p) => {
          const used = job.partsUsed.find((u) => u.partId === p.id)
          if (!used) return p
          return { ...p, stock: Math.max(0, p.stock - used.qty) }
        })
      )
    }
  }

  const handleAddExpense = (expense) => setExpenses((prev) => [{ ...expense, id: `e${Date.now()}` }, ...prev])

  const appState = {
    activeTab,
    setActiveTab,
    customers,
    setCustomers,
    inventory,
    setInventory,
    jobs,
    setJobs,
    expenses,
    setExpenses,
    VAT_RATE,
    computed,
    actions: {
      addCustomer: handleAddCustomer,
      updateCustomer: handleUpdateCustomer,
      addJob: handleAddJob,
      updateJob: handleUpdateJob,
      completeJob: handleMarkCompleted,
      addExpense: handleAddExpense,
      setActiveTab,
    },
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-md md:max-w-lg lg:max-w-2xl">
        <Header />
        <main className="pb-24 px-3">
          <TabRouter state={appState} />
        </main>
        <FloatingNewJobButton state={appState} />
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
    </div>
  )
}

export default App
