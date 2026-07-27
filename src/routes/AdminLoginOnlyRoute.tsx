import type { PropsWithChildren, ReactElement } from "react";
import { Navigate } from "react-router";

import FullPageLoader from "../components/common/FullPageLoader";
import useAdminAuth from "../hooks/useAdminAuth";

function AdminLoginOnlyRoute({ children }: PropsWithChildren): ReactElement | null {
  const { adminUser, adminProfile, authLoading } = useAdminAuth();

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (adminUser && adminProfile) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children ? <>{children}</> : null;
}

export default AdminLoginOnlyRoute;
