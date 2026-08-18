import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Alert } from './ui/Alert'
import { LoadingState } from './ui/LoadingState'

export function ProtectedRoute() {
  const { user, loading, error } = useAuth()
  const location = useLocation()

  if (loading) return <main className="auth-state"><LoadingState count={1} label="로그인 상태를 확인하는 중" /></main>
  if (error) return <main className="auth-state"><Alert>{error}</Alert></main>
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return <Outlet />
}
