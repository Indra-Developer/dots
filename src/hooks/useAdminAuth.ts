import { useContext } from "react";

import AdminAuthContext from "../context/AdminAuthContext";
import type { AdminAuthContextValue } from "../types/admin";

function useAdminAuth(): AdminAuthContextValue {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  }

  return context;
}

export default useAdminAuth;
