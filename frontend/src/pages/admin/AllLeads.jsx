import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import SearchFilterBar from "../../components/SearchFilterBar";
import StatusBadge from "../../components/StatusBadge";
import PriorityBadge from "../../components/PriorityBadge";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AllLeads() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await api.get("/leads/");
      setLeads(res.data);
    } catch (err) {
      console.error("Failed to load leads", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone_number.includes(searchTerm);

    if (!activeFilter) return matchesSearch;

    const isPriorityFilter = activeFilter.includes("Lead");
    const isFollowUpFilter = activeFilter === "Follow-Up Pending";

    if (isFollowUpFilter) {
      return matchesSearch && !!lead.followup_date;
    }
    if (isPriorityFilter) {
      const priority = activeFilter.replace(" Lead", "");
      return matchesSearch && lead.priority === priority;
    }
    return matchesSearch && lead.status === activeFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="text-xl font-semibold text-text-primary mb-6">
            All Leads
          </h1>

          <SearchFilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Customer
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Phone
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Assigned Agent
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Priority
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-text-secondary">
                    Follow-Up
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-text-secondary"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-text-secondary"
                    >
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/admin/lead/${lead.id}`)}
                      className="border-b border-border last:border-0 cursor-pointer hover:bg-background transition-colors"
                    >
                      <td className="px-4 py-3 text-text-primary">
                        {lead.customer_name}
                      </td>
                      <td className="px-4 py-3 text-text-primary">
                        {lead.phone_number}
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {lead.assigned_agent_name || "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="px-4 py-3">
                        <PriorityBadge priority={lead.priority} />
                      </td>
                      <td className="px-4 py-3 text-text-secondary">
                        {lead.followup_date || "—"}
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
  );
}
