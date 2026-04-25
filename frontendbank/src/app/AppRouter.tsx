import { lazy, Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useLocation, useRoutes } from 'react-router-dom'
import { LoadingScreen } from '@/components/common/LoadingScreen'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

const LandingPage = lazy(async () => {
  const module = await import('@/pages/LandingPage')
  return { default: module.LandingPage }
})

const SupportPage = lazy(async () => {
  const module = await import('@/pages/SupportPage')
  return { default: module.SupportPage }
})

const PrivacyPolicyPage = lazy(async () => {
  const module = await import('@/pages/PrivacyPolicyPage')
  return { default: module.PrivacyPolicyPage }
})

const TermsPage = lazy(async () => {
  const module = await import('@/pages/TermsPage')
  return { default: module.TermsPage }
})

const LoginPage = lazy(async () => {
  const module = await import('@/pages/auth/LoginPage')
  return { default: module.LoginPage }
})

const RegisterPage = lazy(async () => {
  const module = await import('@/pages/auth/RegisterPage')
  return { default: module.RegisterPage }
})

const ProfilePage = lazy(async () => {
  const module = await import('@/pages/ProfilePage')
  return { default: module.ProfilePage }
})

const ClientDashboardPage = lazy(async () => {
  const module = await import('@/pages/client/ClientDashboardPage')
  return { default: module.ClientDashboardPage }
})

const ScorePage = lazy(async () => {
  const module = await import('@/pages/client/ScorePage')
  return { default: module.ScorePage }
})

const ApplyPage = lazy(async () => {
  const module = await import('@/pages/client/ApplyPage')
  return { default: module.ApplyPage }
})

const LoansPage = lazy(async () => {
  const module = await import('@/pages/client/LoansPage')
  return { default: module.LoansPage }
})

const ForumPage = lazy(async () => {
  const module = await import('@/pages/client/ForumPage')
  return { default: module.ForumPage }
})

const SettingsPage = lazy(async () => {
  const module = await import('@/pages/client/SettingsPage')
  return { default: module.SettingsPage }
})

const ModeratorDashboardPage = lazy(async () => {
  const module = await import('@/pages/moderator/ModeratorDashboardPage')
  return { default: module.ModeratorDashboardPage }
})

const ModeratorApplicationsPage = lazy(async () => {
  const module = await import('@/pages/moderator/ModeratorApplicationsPage')
  return { default: module.ModeratorApplicationsPage }
})

const ModeratorClientsPage = lazy(async () => {
  const module = await import('@/pages/moderator/ModeratorClientsPage')
  return { default: module.ModeratorClientsPage }
})

const AdminItDashboardPage = lazy(async () => {
  const module = await import('@/pages/admin/it/AdminItDashboardPage')
  return { default: module.AdminItDashboardPage }
})

const AdminItUsersPage = lazy(async () => {
  const module = await import('@/pages/admin/it/AdminItUsersPage')
  return { default: module.AdminItUsersPage }
})

const AdminItFormulasPage = lazy(async () => {
  const module = await import('@/pages/admin/it/AdminItFormulasPage')
  return { default: module.AdminItFormulasPage }
})

const BatchTestPage = lazy(async () => {
  const module = await import('@/pages/admin/it/BatchTestPage')
  return { default: module.BatchTestPage }
})

const AdminItLogsPage = lazy(async () => {
  const module = await import('@/pages/admin/it/AdminItLogsPage')
  return { default: module.AdminItLogsPage }
})

const AdminBankDashboardPage = lazy(async () => {
  const module = await import('@/pages/admin/bank/AdminBankDashboardPage')
  return { default: module.AdminBankDashboardPage }
})

const AdminBankFormulasPage = lazy(async () => {
  const module = await import('@/pages/admin/bank/AdminBankFormulasPage')
  return { default: module.AdminBankFormulasPage }
})

const AdminBankAnalyticsPage = lazy(async () => {
  const module = await import('@/pages/admin/bank/AdminBankAnalyticsPage')
  return { default: module.AdminBankAnalyticsPage }
})

export function AppRouter() {
  const location = useLocation()
  const element = useRoutes([
    { path: '/', element: <LandingPage /> },
    { path: '/support', element: <SupportPage /> },
    { path: '/privacy-policy', element: <PrivacyPolicyPage /> },
    { path: '/terms', element: <TermsPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    {
      path: '/profile',
      element: (
        <ProtectedRoute roles={['client', 'moderator', 'admin_it', 'admin_bank']}>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/client',
      element: (
        <ProtectedRoute roles={['client']}>
          <ClientDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/client/score',
      element: (
        <ProtectedRoute roles={['client']}>
          <ScorePage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/client/apply',
      element: (
        <ProtectedRoute roles={['client']}>
          <ApplyPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/client/loans',
      element: (
        <ProtectedRoute roles={['client']}>
          <LoansPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/client/forum',
      element: (
        <ProtectedRoute roles={['client']}>
          <ForumPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/client/settings',
      element: (
        <ProtectedRoute roles={['client']}>
          <SettingsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/moderator',
      element: (
        <ProtectedRoute roles={['moderator']}>
          <ModeratorDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/moderator/applications',
      element: (
        <ProtectedRoute roles={['moderator']}>
          <ModeratorApplicationsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/moderator/clients',
      element: (
        <ProtectedRoute roles={['moderator']}>
          <ModeratorClientsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/it',
      element: (
        <ProtectedRoute roles={['admin_it']}>
          <AdminItDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/it/users',
      element: (
        <ProtectedRoute roles={['admin_it']}>
          <AdminItUsersPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/it/formulas',
      element: (
        <ProtectedRoute roles={['admin_it']}>
          <AdminItFormulasPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/it/batch-test',
      element: (
        <ProtectedRoute roles={['admin_it']}>
          <BatchTestPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/it/logs',
      element: (
        <ProtectedRoute roles={['admin_it']}>
          <AdminItLogsPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/bank',
      element: (
        <ProtectedRoute roles={['admin_bank']}>
          <AdminBankDashboardPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/bank/formulas',
      element: (
        <ProtectedRoute roles={['admin_bank']}>
          <AdminBankFormulasPage />
        </ProtectedRoute>
      ),
    },
    {
      path: '/admin/bank/analytics',
      element: (
        <ProtectedRoute roles={['admin_bank']}>
          <AdminBankAnalyticsPage />
        </ProtectedRoute>
      ),
    },
    { path: '*', element: <Navigate to="/" replace /> },
  ])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -18 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.div
          className="route-curtain"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
        <Suspense fallback={<LoadingScreen />}>{element}</Suspense>
      </motion.div>
    </AnimatePresence>
  )
}
