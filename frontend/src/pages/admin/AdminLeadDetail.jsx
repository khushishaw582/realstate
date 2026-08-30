import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import CallButton from '../../components/CallButton'
import StatusBadge from '../../components/StatusBadge'
import PriorityBadge from '../../components/PriorityBadge'
import Timeline from '../../components/Timeline'
import api from '../../api/axios'

export default function AdminLeadDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [lead, setLead] = useState(null)
  const [activities, setActivities] = useState([])

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

          <div className="card p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h1 className="text-lg font-semibold text-text-primary">
                  {lead.customer_name}
                </h1>
                <p className="text-sm text-text-secondary">{lead.phone_number}</p>
              </div>
              <CallButton phoneNumber={lead.phone_number} />
            </div>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              <StatusBadge status={lead.status} />
              <PriorityBadge priority={lead.priority} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-secondary">Assigned Agent</p>
                <p className="text-text-primary font-medium">
                  {lead.assigned_agent_name || 'Unassigned'}
                </p>
              </div>
              <div>
                <p className="text-text-secondary">Location</p>
                <p className="text-text-primary font-medium">{lead.location || '—'}</p>
              </div>
              <div>
                <p className="text-text-secondary">Source</p>
                <p className="text-text-primary font-medium">{lead.source || '—'}</p>
              </div>
              <div>
                <p className="text-text-secondary">Follow-Up</p>
                <p className="text-text-primary font-medium">{lead.followup_date || '—'}</p>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h2 className="font-medium text-text-primary mb-4">Lead Timeline</h2>
            <Timeline activities={activities} />
          </div>
        </main>
      </div>
    </div>
  )
}