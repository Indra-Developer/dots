import type { Timestamp } from "firebase/firestore";

export type EnquiryStatus =
  | "new"
  | "contacted"
  | "in_progress"
  | "completed"
  | "cancelled";

export type EnquiriesSettingsTab = "enquiries" | "settings";

export type EnquiryDateValue =
  | Timestamp
  | Date
  | string
  | number
  | null
  | undefined;

export interface AdminEnquiry {
  id: string;
  reference: string;
  customerName: string;
  phone: string;
  email: string;
  city: string;
  businessType: string;
  serviceId: string;
  serviceName: string;
  packageName: string;
  message: string;
  status: EnquiryStatus;
  createdAt?: EnquiryDateValue;
  updatedAt?: EnquiryDateValue;
}

export interface EnquiryServiceOption {
  id: string;
  name: string;
}

export interface EnquiriesSettingsBootstrap {
  enquiries: AdminEnquiry[];
  services: EnquiryServiceOption[];
  quotationWhatsAppNumber: string;
}

export interface EnquiryFilters {
  search: string;
  date: string;
  service: string;
  status: "all" | EnquiryStatus;
}
