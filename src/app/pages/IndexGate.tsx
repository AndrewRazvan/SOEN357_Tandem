import { Navigate } from 'react-router';
import { Dashboard } from './Dashboard';

export function IndexGate() {
  if (!localStorage.getItem('tandem_welcomed')) {
    return <Navigate to="/welcome" replace />;
  }
  return <Dashboard />;
}
