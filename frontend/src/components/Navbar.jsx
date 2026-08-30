import { useNavigate } from 'react-router-dom'
import { LogOut, Building2, Menu } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useSidebar } from '../contexts/SidebarContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { toggle } = useSidebar()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-30">
      <div className="px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="lg:hidden p-1.5 -ml-1.5 text-text-secondary hover:text-text-primary"
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Building2 size={20} className="text-accent" />
            <span className="font-semibold text-text-primary hidden sm:inline">
              Real Estate CRM
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-text-primary">{user?.name}</p>
            <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-md hover:bg-background text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
            title="Logout"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}