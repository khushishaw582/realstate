import { Phone } from 'lucide-react'

export default function CallButton({ phoneNumber }) {
  const handleCall = () => {
    // Opens device dialer with number pre-filled (FR-05)
    window.location.href = `tel:${phoneNumber}`
  }

  return (
    <button
      onClick={handleCall}
      className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
    >
      <Phone size={14} />
      Call
    </button>
  )
}