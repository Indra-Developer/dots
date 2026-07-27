import type { User } from "firebase/auth";
import type { Timestamp } from "firebase/firestore";

export interface AdminProfile {
  uid: string;
  email: string | null;
  role: "admin";
  active: true;
  createdAt?: Timestamp;
  [key: string]: unknown;
}

export interface LoginAdminInput {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AdminAuthContextValue {
  adminUser: User | null;
  adminProfile: AdminProfile | null;
  authLoading: boolean;
  loginAdmin: (input: LoginAdminInput) => Promise<AdminProfile>;
  logoutAdmin: () => Promise<void>;
  sendAdminPasswordReset: (email: string) => Promise<void>;
}

export interface AdminCodedError extends Error {
  code: string;
}
