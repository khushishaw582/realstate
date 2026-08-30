import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import CallButton from './CallButton'

export default function LeadCard({ lead }) {
  const navigate = useNavigate()

  return (
    <div className="card p-4 flex items-center justify-between gap-4">
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => navigate(`/agent/lead/${lead.id}`)}
      >
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-text-primary truncate">
            {lead.customer_name}
          </h3>
          <PriorityBadge priority={lead.priority} />
        </div>

        <p className="text-sm text-text-secondary mb-2">{lead.phone_number}</p>

        <div className="flex items-center gap-3">
          <StatusBadge status={lead.status} />
          {lead.followup_date && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <Calendar size={12} />
              {lead.followup_date}
            </span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <CallButton phoneNumber={lead.phone_number} />
      </div>
    </div>
  )
}