import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'
import LeadCard from '../../components/LeadCard'
import SearchFilterBar from '../../components/SearchFilterBar'
import api from '../../api/axios'

export default function MyLeads() {
  const [leads, setLeads] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await api.get('/leads/my/')
      setLeads(res.data)
    } catch (err) {
      console.error('Failed to load leads', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_number.includes(searchTerm)

    if (!activeFilter) return matchesSearch

    const isPriorityFilter = activeFilter.includes('Lead')
    const isFollowUpFilter = activeFilter === 'Follow-Up Pending'

    if (isFollowUpFilter) {
      return matchesSearch && !!lead.followup_date
    }
    if (isPriorityFilter) {
      const priority = activeFilter.replace(' Lead', '')
      return matchesSearch && lead.priority === priority
    }
    return matchesSearch && lead.status === activeFilter
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            My Leads
          </h1>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {loading ? (
            <p className="text-sm text-text-secondary">Loading...</p>
          ) : filteredLeads.length === 0 ? (
            <p className="text-sm text-text-secondary">No leads found.</p>
          ) : (
            <div className="space-y-3">
              {filteredLeads.map((lead) => (
                <LeadCard key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}