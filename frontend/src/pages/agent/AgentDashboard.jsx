import { useEffect, useState } from 'react'
import { Users, PhoneCall, Flame, Clock } from 'lucide-react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import LeadCard from '../../components/LeadCard'
import api from '../../api/axios'

export default function AgentDashboard() {
  const [leads, setLeads] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    calledToday: 0,
    followUpsDue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/leads/my/')
      const data = res.data

      setLeads(data.slice(0, 5)) // show recent 5 on dashboard
      setStats({
        total: data.length,
        hot: data.filter((l) => l.priority === 'Hot').length,
        calledToday: data.filter((l) => l.last_called_today).length,
        followUpsDue: data.filter((l) => l.followup_date).length,
      })
    } catch (err) {
      console.error('Failed to load dashboard', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Leads', value: stats.total, icon: Users },
    { label: 'Hot Leads', value: stats.hot, icon: Flame },
    { label: 'Called Today', value: stats.calledToday, icon: PhoneCall },
    { label: 'Follow-Ups Due', value: stats.followUpsDue, icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className="text-accent" />
                </div>
                <p className="text-2xl font-semibold text-text-primary">{value}</p>
                <p className="text-sm text-text-secondary">{label}</p>
              </div>
            ))}
          </div>

          <h2 className="text-sm font-medium text-text-secondary mb-3">
            Recent Leads
          </h2>

          {loading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
          ) : leads.length === 0 ? (
            <p className="text-sm text-text-secondary">No leads assigned yet.</p>
          ) : (
            <div className="space-y-3">
              {leads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}