import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mic, X } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import CallButton from '../../components/CallButton'
import Timeline from '../../components/Timeline'
import FollowUpModal from '../../components/FollowUpModal'
import api from '../../api/axios'

const statusOptions = [
  'Interested',
  'Not Interested',
  'No Answer',
  'Call Back Later',
  'Wrong Number',
]

const priorityOptions = ['Hot', 'Warm', 'Cold']

export default function LeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lead, setLead] = useState(null)
  const [activities, setActivities] = useState([])
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [notes, setNotes] = useState('')
  const [recording, setRecording] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showFollowUpModal, setShowFollowUpModal] = useState(false)
  const [pendingFollowUp, setPendingFollowUp] = useState(null)

  useEffect(() => {
    fetchLeadData()
  }, [id])

  const fetchLeadData = async () => {
    try {
      const leadRes = await api.get(`/leads/${id}/`)
      const activitiesRes = await api.get(`/leads/${id}/activities/`)
      setLead(leadRes.data)
      setActivities(activitiesRes.data)
    } catch (err) {
      console.error('Failed to load lead', err)
    }
  }

  const handleStatusChange = (value) => {
    setStatus(value)
    setError('')
    if (value === 'Call Back Later') {
      setShowFollowUpModal(true)
    } else {
      setPendingFollowUp(null)
    }
  }

  const handleRecordingChange = (e) => {
    const file = e.target.files[0]
    if (file) setRecording(file)
  }

  const handleSaveUpdate = async () => {
    if (!status) {
      setError('Status selection is mandatory')
      return
    }
    if (!priority) {
      setError('Priority selection is mandatory')
      return
    }
    if (status === 'Call Back Later' && !pendingFollowUp) {
      setError('Follow-up date and time are required')
      return
    }

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('status', status)
      formData.append('priority', priority)
      formData.append('notes', notes)
      if (recording) formData.append('recording', recording)
      if (pendingFollowUp) {
        formData.append('followup_date', pendingFollowUp.followup_date)
        formData.append('followup_time', pendingFollowUp.followup_time)
      }

      await api.post(`/leads/${id}/activities/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setStatus('')
      setPriority('')
      setNotes('')
      setRecording(null)
      setPendingFollowUp(null)
      fetchLeadData()
    } catch (err) {
      setError('Failed to save update')
    } finally {
      setSaving(false)
    }
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <p className="text-sm text-text-secondary">Loading...</p>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="card p-5 mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-text-primary">
                {lead.customer_name}
              </h1>
              <p className="text-sm text-text-secondary">{lead.phone_number}</p>
            </div>
            <CallButton phoneNumber={lead.phone_number} />
          </div>

          <div className="card p-5 mb-6">
            <h2 className="font-medium text-text-primary mb-4">Update Call Outcome</h2>

            {error && (
              <div className="text-sm text-hot bg-hot/5 border border-hot/20 rounded-md px-3 py-2 mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Call Status
                </label>
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select status</option>
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Lead Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select priority</option>
                  {priorityOptions.map((p) => (
                    <option key={p} value={p}>{p} Lead</option>
                  ))}
                </select>
              </div>
            </div>

            {pendingFollowUp && (
              <p className="text-xs text-text-secondary mb-4">
                Follow-up set: {pendingFollowUp.followup_date} at {pendingFollowUp.followup_time}
              </p>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Add call notes..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-text-primary mb-1">
                Call Recording (optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer">
                  <div className="input-field flex items-center gap-2 text-text-secondary">
                    <Mic size={16} />
                    {recording ? recording.name : 'Attach recorded audio file'}
                  </div>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleRecordingChange}
                    className="hidden"
                  />
                </label>
                {recording && (
                  <button
                    onClick={() => setRecording(null)}
                    className="text-text-secondary hover:text-hot"
                    title="Remove file"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleSaveUpdate}
              disabled={saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Update'}
            </button>
          </div>

          <div className="card p-5">
            <h2 className="font-medium text-text-primary mb-4">Lead Timeline</h2>
            <Timeline activities={activities} />
          </div>
        </main>
      </div>

      <FollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        onSave={(data) => setPendingFollowUp(data)}
      />
    </div>
  )
}