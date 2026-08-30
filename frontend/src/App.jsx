import Landing from './pages/Landing'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { SidebarProvider } from './contexts/SidebarContext'
import ProtectedRoute from './auth/ProtectedRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/AdminDashboard'
import LeadUpload from './pages/admin/LeadUpload'
import LeadAssign from './pages/admin/LeadAssign'
import AllLeads from './pages/admin/AllLeads'
import AdminLeadDetail from './pages/admin/AdminLeadDetail'
import AgentDashboard from './pages/agent/AgentDashboard'
import LeadDetail from './pages/agent/LeadDetail'
import MyLeads from './pages/agent/MyLeads'

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LeadUpload />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assign"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <LeadAssign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/leads"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AllLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/lead/:id"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLeadDetail />
              </ProtectedRoute>
            }
          />

          {/* Agent routes */}
          <Route
            path="/agent/dashboard"
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AgentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/leads"
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <MyLeads />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/lead/:id"
            element={
              <ProtectedRoute allowedRoles={['agent']}>
                <LeadDetail />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App