import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

export default function Timeline({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-sm text-text-secondary text-center py-6">
        No activity yet.
      </p>
    )
  }

  return (
    <div className="space-y-0">
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-2.5 h-2.5 rounded-full bg-accent mt-1.5" />
            {index !== activities.length - 1 && (
              <div className="w-px flex-1 bg-border" />
            )}
          </div>

          <div className="pb-6 flex-1">
            <p className="text-xs text-text-secondary mb-1">
              {activity.created_at} · {activity.agent_name}
            </p>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <StatusBadge status={activity.status} />
              <PriorityBadge priority={activity.priority} />
            </div>
            {activity.notes && (
              <p className="text-sm text-text-primary mt-1">{activity.notes}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}