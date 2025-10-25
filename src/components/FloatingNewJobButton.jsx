import { useState } from 'react'
import { PlusCircle } from 'lucide-react'
import NewJobModal from './NewJobModal'

const FloatingNewJobButton = ({ state }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 z-40 bg-lime-500 hover:bg-lime-600 text-white shadow-lg rounded-full px-4 py-3 flex items-center gap-2"
      >
        <PlusCircle />
        <span className="font-semibold">New Job</span>
      </button>
      {open && <NewJobModal state={state} onClose={() => setOpen(false)} />}
    </>
  )
}

export default FloatingNewJobButton
