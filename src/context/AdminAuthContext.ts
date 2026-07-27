import { createContext } from "react";

import type { AdminAuthContextValue } from "../types/admin";

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export default AdminAuthContext;
