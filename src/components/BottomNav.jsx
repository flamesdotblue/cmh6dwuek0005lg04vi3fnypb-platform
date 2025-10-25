import { Home, Briefcase, Users, Wallet, Receipt } from 'lucide-react'

const items = [
  { key: 'Dashboard', label: 'Dashboard', icon: Home },
  { key: 'Jobs', label: 'Jobs', icon: Briefcase },
  { key: 'Customers', label: 'Customers', icon: Users },
  { key: 'Finance', label: 'Finance', icon: Wallet },
  { key: 'Expenses', label: 'Expenses', icon: Receipt },
]

const BottomNav = ({ activeTab, onChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-2xl grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon
          const active = activeTab === it.key
          return (
            <button
              key={it.key}
              onClick={() => onChange(it.key)}
              className={`flex flex-col items-center justify-center py-2 text-xs ${
                active ? 'text-blue-600' : 'text-slate-500'
              }`}
            >
              <Icon size={20} />
              <span className="mt-1">{it.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
