import { useState } from 'react'
import { X } from 'lucide-react'

export default function FollowUpModal({ isOpen, onClose, onSave }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSave = () => {
    if (!date || !time) {
      setError('Date and time are required')
      return
    }
    onSave({ followup_date: date, followup_time: time })
    setDate('')
    setTime('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4">
      <div className="card w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-text-primary">Schedule Follow-Up</h3>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="text-sm text-hot bg-hot/5 border border-hot/20 rounded-md px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Follow-up Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">
              Follow-up Time
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSave} className="btn-primary flex-1">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}