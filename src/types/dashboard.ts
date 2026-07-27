import type { Timestamp } from "firebase/firestore";

export type DashboardTone = "blue" | "green" | "purple" | "orange";

export type DashboardDateValue =
  | Timestamp
  | Date
  | string
  | number
  | null
  | undefined;

export interface DashboardCounts {
  activeCategories: number;
  activeServices: number;
  homeVideos: number;
  newEnquiries: number;
}

export interface DashboardEnquiry {
  id: string;
  reference?: string;
  customer?: string;
  customerName?: string;
  name?: string;
  service?: string;
  serviceName?: string;
  phone?: string;
  mobile?: string;
  status?: string;
  createdAt?: DashboardDateValue;
  submittedAt?: DashboardDateValue;
  [key: string]: unknown;
}

export type DashboardContentSource =
  | "banner"
  | "video"
  | "service"
  | "category";

export interface DashboardContentUpdate {
  id: string;
  title: string;
  description: string;
  source: DashboardContentSource;
  createdAt?: DashboardDateValue;
}

export interface AdminDashboardData {
  counts: DashboardCounts;
  recentEnquiries: DashboardEnquiry[];
  recentContentUpdates: DashboardContentUpdate[];
  warnings: string[];
}
