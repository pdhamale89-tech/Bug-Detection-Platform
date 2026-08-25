import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { Toaster } from '@/components/ui/Toaster'
import { LandingPage } from '@/features/landing/LandingPage'
import { NotFoundPage } from '@/features/landing/NotFoundPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { SignupPage } from '@/features/auth/SignupPage'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { ProjectsPage } from '@/features/projects/ProjectsPage'
import { CreateProjectPage } from '@/features/projects/CreateProjectPage'
import { ProjectDetailPage } from '@/features/projects/ProjectDetailPage'
import { TestRunsPage } from '@/features/test-runs/TestRunsPage'
import { TestRunDetailPage } from '@/features/test-runs/TestRunDetailPage'
import { TestExecutionPage } from '@/features/test-runs/TestExecutionPage'
import { BugsPage } from '@/features/bugs/BugsPage'
import { BugDetailPage } from '@/features/bugs/BugDetailPage'
import { ReportsPage } from '@/features/reports/ReportsPage'
import { SettingsPage } from '@/features/settings/SettingsPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/new" element={<CreateProjectPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />
            <Route path="/projects/:id/test" element={<TestExecutionPage />} />
            <Route path="/test-runs" element={<TestRunsPage />} />
            <Route path="/test-runs/:id" element={<TestRunDetailPage />} />
            <Route path="/bugs" element={<BugsPage />} />
            <Route path="/bugs/:id" element={<BugDetailPage />} />
            <Route path="/reports/:id" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  )
}
