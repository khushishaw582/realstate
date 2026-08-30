const priorityStyles = {
  Hot: 'bg-hot/10 text-hot border-hot/30',
  Warm: 'bg-warm/10 text-warm border-warm/30',
  Cold: 'bg-cold/10 text-cold border-cold/30',
}

export default function PriorityBadge({ priority }) {
  if (!priority) return null

  const style = priorityStyles[priority] || 'bg-gray-100 text-gray-600 border-gray-200'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {priority} Lead
    </span>
  )
}