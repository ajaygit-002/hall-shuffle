import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';

function AdminLayout() {
  const auth = useAuthStore();
  const isAuthenticated = auth.isAuthenticated;
  const user = auth.user;

  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminSidebar />
      <main className="ml-64 min-h-[calc(100vh-4rem)] p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
