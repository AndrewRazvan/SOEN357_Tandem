import { Navigate } from 'react-router';
import { Dashboard } from './Dashboard';

export function IndexGate() {
  // First-time users must complete onboarding before seeing the dashboard.
  if (!localStorage.getItem('tandem_welcomed')) {
    return <Navigate to="/welcome" replace />;
  }
  return <Dashboard />;
}
