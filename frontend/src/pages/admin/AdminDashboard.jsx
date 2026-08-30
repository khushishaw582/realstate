import { useEffect, useState } from 'react'
import { Users, PhoneCall, Flame, Clock, UserCheck } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import api from '../../api/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalLeads: 0,
    activeLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    totalCalls: 0,
    interested: 0,
    noAnswer: 0,
    followUpsPending: 0,
  })
  const [agentStats, setAgentStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/stats/')
      setStats(res.data.leadStats)
      setAgentStats(res.data.agentStats)
    } catch (err) {
      console.error('Failed to load dashboard', err)
    } finally {
      setLoading(false)
    }
  }

  const leadStatCards = [
    { label: 'Total Leads', value: stats.totalLeads, icon: Users },
    { label: 'Active Leads', value: stats.activeLeads, icon: UserCheck },
    { label: 'Hot Leads', value: stats.hotLeads, icon: Flame },
    { label: 'Follow-Ups Pending', value: stats.followUpsPending, icon: Clock },
  ]

  const callStatCards = [
    { label: 'Total Calls', value: stats.totalCalls, icon: PhoneCall },
    { label: 'Interested', value: stats.interested, icon: UserCheck },
    { label: 'No Answer', value: stats.noAnswer, icon: PhoneCall },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            Admin Dashboard
          </h1>

          {loading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
          ) : (
            <>
              <h2 className="text-sm font-medium text-text-secondary mb-3">
                Lead Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {leadStatCards.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="card p-4">
                    <Icon size={18} className="text-accent mb-2" />
                    <p className="text-2xl font-semibold text-text-primary">{value}</p>
                    <p className="text-sm text-text-secondary">{label}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-sm font-medium text-text-secondary mb-3">
                Call Statistics
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {callStatCards.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="card p-4">
                    <Icon size={18} className="text-accent mb-2" />
                    <p className="text-2xl font-semibold text-text-primary">{value}</p>
                    <p className="text-sm text-text-secondary">{label}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-sm font-medium text-text-secondary mb-3">
                Agent Performance
              </h2>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">Agent</th>
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">Assigned</th>
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">Updated</th>
                      <th className="text-left px-4 py-3 font-medium text-text-secondary">Follow-Ups Due</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentStats.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-text-secondary">
                          No agent data available.
                        </td>
                      </tr>
                    ) : (
                      agentStats.map((agent) => (
                        <tr key={agent.id} className="border-b border-border last:border-0">
                          <td className="px-4 py-3 text-text-primary">{agent.name}</td>
                          <td className="px-4 py-3 text-text-primary">{agent.leadsAssigned}</td>
                          <td className="px-4 py-3 text-text-primary">{agent.leadsUpdated}</td>
                          <td className="px-4 py-3 text-text-primary">{agent.followUpsDue}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}