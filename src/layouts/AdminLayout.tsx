import { useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopHeader from "../components/admin/AdminTopHeader";
import { adminNavigationItems } from "../constants/adminNavigation";
import useAdminAuth from "../hooks/useAdminAuth";

function getCurrentPageTitle(pathname: string): string {
  const currentItem = adminNavigationItems.find(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
  );

  return currentItem?.label || "Admin Portal";
}

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminProfile, logoutAdmin } = useAdminAuth();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const pageTitle = useMemo(
    () => getCurrentPageTitle(location.pathname),
    [location.pathname],
  );

  async function handleLogout(): Promise<void> {
    try {
      setLoggingOut(true);
      await logoutAdmin();
      navigate("/admin/login", { replace: true });
    } catch (error: unknown) {
      console.error("Admin logout failed:", error);
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <AdminSidebar
        isMobileOpen={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
        onLogout={handleLogout}
        loggingOut={loggingOut}
      />

      <div className="min-h-screen lg:pl-[250px]">
        <AdminTopHeader
          title={pageTitle}
          adminProfile={adminProfile}
          openMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="min-h-[calc(100vh-72px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
