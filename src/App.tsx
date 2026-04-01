import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { AuthGuard } from './routes/AuthGuard';
import { RoleGuard } from './routes/RoleGuard';
import { DashboardRouter } from './routes/DashboardRouter';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { LeadsPage } from './pages/LeadsPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { QuotesPage } from './pages/QuotesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { CommissionsPage } from './pages/CommissionsPage';
import { BDsPage } from './pages/BDsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TrainingPage } from './pages/TrainingPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes */}
          <Route
            element={
              <AuthGuard>
                <AppLayout />
              </AuthGuard>
            }
          >
            <Route path="/dashboard" element={<DashboardRouter />} />

            {/* Admin + BD routes */}
            <Route
              path="/leads"
              element={
                <RoleGuard allowedRoles={['admin', 'bd']}>
                  <LeadsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/meetings"
              element={
                <RoleGuard allowedRoles={['admin', 'bd']}>
                  <MeetingsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/quotes"
              element={
                <RoleGuard allowedRoles={['admin', 'bd']}>
                  <QuotesPage />
                </RoleGuard>
              }
            />
            <Route
              path="/payments"
              element={
                <RoleGuard allowedRoles={['admin', 'bd']}>
                  <PaymentsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/commissions"
              element={
                <RoleGuard allowedRoles={['admin', 'bd']}>
                  <CommissionsPage />
                </RoleGuard>
              }
            />

            {/* Admin only */}
            <Route
              path="/bds"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <BDsPage />
                </RoleGuard>
              }
            />
            <Route
              path="/audit"
              element={
                <RoleGuard allowedRoles={['admin']}>
                  <AuditLogPage />
                </RoleGuard>
              }
            />

            {/* Admin + Client routes */}
            <Route
              path="/projects"
              element={
                <RoleGuard allowedRoles={['admin', 'client']}>
                  <ProjectsPage />
                </RoleGuard>
              }
            />

            {/* BD only */}
            <Route
              path="/training"
              element={
                <RoleGuard allowedRoles={['bd']}>
                  <TrainingPage />
                </RoleGuard>
              }
            />

            {/* All roles */}
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
