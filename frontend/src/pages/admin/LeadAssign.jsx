import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function LeadAssign() {
  const [unassignedLeads, setUnassignedLeads] = useState([])
  const [agents, setAgents] = useState([])
  const [selectedLeads, setSelectedLeads] = useState([])
  const [selectedAgent, setSelectedAgent] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [leadsRes, agentsRes] = await Promise.all([
        api.get('/leads/unassigned/'),
        api.get('/users/agents/'),
      ])
      setUnassignedLeads(leadsRes.data)
      setAgents(agentsRes.data)
    } catch (err) {
      console.error('Failed to load data', err)
    }
  }

  const toggleLead = (id) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedLeads.length === unassignedLeads.length) {
      setSelectedLeads([])
    } else {
      setSelectedLeads(unassignedLeads.map((l) => l.id))
    }
  }

  const handleAssign = async () => {
    if (!selectedAgent || selectedLeads.length === 0) return

    setSaving(true)
    try {
      await api.post('/leads/assign/', {
        lead_ids: selectedLeads,
        agent_id: selectedAgent,
      })
      setSuccess(`${selectedLeads.length} lead(s) assigned successfully`)
      setSelectedLeads([])
      setSelectedAgent('')
      fetchData()
    } catch (err) {
      console.error('Failed to assign leads', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            Assign Leads
          </h1>

          {success && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2 mb-4">
              <CheckCircle2 size={16} />
              {success}
            </div>
          )}

          <div className="card p-4 mb-4 flex flex-wrap items-center gap-3">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="">Select agent</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssign}
              disabled={!selectedAgent || selectedLeads.length === 0 || saving}
              className="btn-primary disabled:opacity-60"
            >
              {saving
                ? 'Assigning...'
                : `Assign ${selectedLeads.length || ''} Lead(s)`}
            </button>
          </div>

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={
                        unassignedLeads.length > 0 &&
                        selectedLeads.length === unassignedLeads.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Customer Name
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Phone Number
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {unassignedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-text-secondary">
                      No unassigned leads.
                    </td>
                  </tr>
                ) : (
                  unassignedLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => toggleLead(lead.id)}
                        />
                      </td>
                      <td className="px-4 py-3 text-text-primary">
                        {lead.customer_name}
                      </td>
                      <td className="px-4 py-3 text-text-primary">
                        {lead.phone_number}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {lead.source || '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}