import { Wrench } from 'lucide-react'

const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 text-white rounded-md p-2">
            <Wrench size={20} />
          </div>
          <div>
            <div className="font-semibold tracking-tight">QikMech</div>
            <div className="text-xs text-slate-500">Mobile Workshop Admin</div>
          </div>
        </div>
        <span className="text-xs font-medium px-2 py-1 rounded-full bg-lime-100 text-lime-700">Ireland</span>
      </div>
    </header>
  )
}

export default Header
