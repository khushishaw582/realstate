import { Search } from 'lucide-react'

const filterOptions = [
  'Interested',
  'Not Interested',
  'No Answer',
  'Hot Lead',
  'Warm Lead',
  'Cold Lead',
  'Follow-Up Pending',
]

export default function SearchFilterBar({
  searchTerm,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) {
  return (
    <div className="card p-4 mb-4 space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name or phone number"
          className="input-field pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onFilterChange('')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
            activeFilter === ''
              ? 'bg-accent text-white border-accent'
              : 'bg-surface text-text-secondary border-border hover:bg-background'
          }`}
        >
          All
        </button>
        {filterOptions.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
              activeFilter === filter
                ? 'bg-accent text-white border-accent'
                : 'bg-surface text-text-secondary border-border hover:bg-background'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  )
}