const statusStyles = {
  Interested: 'bg-green-50 text-green-700 border-green-200',
  'Not Interested': 'bg-gray-100 text-gray-600 border-gray-200',
  'No Answer': 'bg-orange-50 text-orange-700 border-orange-200',
  'Call Back Later': 'bg-blue-50 text-blue-700 border-blue-200',
  'Wrong Number': 'bg-red-50 text-red-700 border-red-200',
}

export default function StatusBadge({ status }) {
  if (!status) return null

  const style = statusStyles[status] || 'bg-gray-100 text-gray-600 border-gray-200'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      {status}
    </span>
  )
}