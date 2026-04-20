import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Sidebar from './components/Sidebar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './context/AuthContext'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Timeline = lazy(() => import('./pages/Timeline'))
const AddEntry = lazy(() => import('./pages/AddEntry'))
const EditEntry = lazy(() => import('./pages/EditEntry'))
const EntryDetail = lazy(() => import('./pages/EntryDetail'))
const Revision = lazy(() => import('./pages/Revision'))
const FocusTimer = lazy(() => import('./pages/FocusTimer'))

function Spinner() {
  return <div className="spinner-container"><div className="spinner" /></div>
}

function MainLayout({ children }) {
  const { currentUser } = useAuth()
  if (!currentUser) return <>{children}</>
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout>
        <Suspense fallback={<Spinner />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/timeline" element={<ProtectedRoute><Timeline /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddEntry /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditEntry /></ProtectedRoute>} />
            <Route path="/entry/:id" element={<ProtectedRoute><EntryDetail /></ProtectedRoute>} />
            <Route path="/revision" element={<ProtectedRoute><Revision /></ProtectedRoute>} />
            <Route path="/focus" element={<ProtectedRoute><FocusTimer /></ProtectedRoute>} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </MainLayout>
    </AuthProvider>
  )
}
