import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { ROLE_ROUTES } from '@/utils/routes'
import { useAppStore } from '@/store/appStore'
import type { Role } from '@/types/domain'

interface ProtectedRouteProps extends PropsWithChildren {
  roles: Role[]
}

export function ProtectedRoute({ roles, children }: ProtectedRouteProps) {
  const auth = useAppStore((state) => state.auth)
  const location = useLocation()

  if (!auth) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (!roles.includes(auth.user.role)) {
    return <Navigate to={ROLE_ROUTES[auth.user.role]} replace />
  }

  return <>{children}</>
}
