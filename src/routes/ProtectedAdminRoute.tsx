import type { PropsWithChildren, ReactElement } from "react";
import { Navigate, useLocation } from "react-router";

import FullPageLoader from "../components/common/FullPageLoader";
import useAdminAuth from "../hooks/useAdminAuth";

function ProtectedAdminRoute({ children }: PropsWithChildren): ReactElement | null {
  const { adminUser, adminProfile, authLoading } = useAdminAuth();
  const location = useLocation();

  if (authLoading) {
    return <FullPageLoader />;
  }

  if (!adminUser || !adminProfile) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children ? <>{children}</> : null;
}

export default ProtectedAdminRoute;
