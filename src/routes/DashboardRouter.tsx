import { useAuth } from '../contexts/AuthContext';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { BDDashboard } from '../pages/bd/BDDashboard';
import { ClientDashboard } from '../pages/client/ClientDashboard';

export function DashboardRouter() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'bd':
      return <BDDashboard />;
    case 'client':
      return <ClientDashboard />;
    default:
      return <AdminDashboard />;
  }
}
