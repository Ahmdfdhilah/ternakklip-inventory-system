import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Unauthorized, DashboardPage, SettingsUsersPage, ProductsPage } from '@/pages';
import LoginPage from '@/pages/login/LoginPage';
import Layout from '@/components/layouts/Layout';
import { useSession } from '@/context/SessionContext';

const ProtectedRoute = () => {
  const { session } = useSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

const AdminRoute = () => {
  const { userData } = useSession();
  const isAdmin =
    userData?.role === 'admin' ||
    userData?.role === 'super_admin' ||
    userData?.role === 'superadmin';

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/inventory" element={<ProductsPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/settings" element={<Navigate to="/settings/users" replace />} />
          <Route path="/settings/users" element={<SettingsUsersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
