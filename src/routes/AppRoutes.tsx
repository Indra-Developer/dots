import { Navigate, Route, Routes } from "react-router";

import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";
import AdminDashboardPage from "../pages/admin/AdminDashboardPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";
import EnquiriesSettingsPage from "../pages/admin/EnquiriesSettingsPage";
import HomeContentPage from "../pages/admin/HomeContentPage";
import NavigationServicesPage from "../pages/admin/NavigationServicesPage";
import ServiceEditorPage from "../pages/admin/ServiceEditorPage";
import NotFoundPage from "../pages/NotFoundPage";
import HomePage from "../pages/public/HomePage";
import ServiceDetailsPage from "../pages/public/ServiceDetailsPage";
import AdminLoginOnlyRoute from "./AdminLoginOnlyRoute";
import ProtectedAdminRoute from "./ProtectedAdminRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="service/:slug" element={<ServiceDetailsPage />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <AdminLoginOnlyRoute>
            <AdminLoginPage />
          </AdminLoginOnlyRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminLayout />
          </ProtectedAdminRoute>
        }
      >
        <Route
          index
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="home-content" element={<HomeContentPage />} />
        <Route
          path="navigation-services"
          element={<NavigationServicesPage />}
        />
        <Route path="service-editor" element={<ServiceEditorPage />} />
        <Route
          path="service-editor/:serviceId"
          element={<ServiceEditorPage />}
        />
        <Route
          path="enquiries-settings"
          element={<EnquiriesSettingsPage />}
        />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
