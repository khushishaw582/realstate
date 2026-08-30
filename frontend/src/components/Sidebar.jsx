import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  UserPlus,
  ListChecks,
  Users,
} from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useSidebar } from '../contexts/SidebarContext'

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/upload', label: 'Upload Leads', icon: Upload },
  { to: '/admin/assign', label: 'Assign Leads', icon: UserPlus },
  { to: '/admin/leads', label: 'All Leads', icon: Users },
]

const agentLinks = [
  { to: '/agent/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/agent/leads', label: 'My Leads', icon: ListChecks },
]

export default function Sidebar() {
  const { isAdmin } = useAuth()
  const { isOpen, close } = useSidebar()
  const links = isAdmin ? adminLinks : agentLinks

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed lg:static top-0 left-0 h-full lg:h-[calc(100vh-4rem)]
          w-56 bg-surface border-r border-border z-50
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <nav className="p-3 space-y-1 mt-16 lg:mt-0">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={close}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-secondary hover:bg-background hover:text-text-primary'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}