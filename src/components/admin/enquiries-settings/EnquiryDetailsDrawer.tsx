import {
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Package,
  Phone,
  Save,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

import type {
  AdminEnquiry,
  EnquiryStatus,
} from "../../../types/enquiriesSettings";
import EnquiryStatusBadge from "./EnquiryStatusBadge";

interface EnquiryDetailsDrawerProps {
  open: boolean;
  enquiry: AdminEnquiry | null;
  updating: boolean;
  whatsappLink: string;
  onClose: () => void;
  onSaveStatus: (status: EnquiryStatus) => void;
}

const statusOptions: Array<{
  value: EnquiryStatus;
  label: string;
}> = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

function formatDateTime(value: AdminEnquiry["createdAt"]): string {
  if (!value) {
    return "—";
  }

  const date =
    value instanceof Date
      ? value
      : typeof value === "object" && "toDate" in value
        ? value.toDate()
        : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface DetailRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function EnquiryDetailsDrawer({
  open,
  enquiry,
  updating,
  whatsappLink,
  onClose,
  onSaveStatus,
}: EnquiryDetailsDrawerProps) {
  const [status, setStatus] = useState<EnquiryStatus>("new");

  useEffect(() => {
    setStatus(enquiry?.status || "new");
  }, [enquiry]);

  if (!open || !enquiry) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Close enquiry details"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/40"
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[520px] flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                Enquiry Details
              </h2>
              <EnquiryStatusBadge status={enquiry.status} />
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Reference: {enquiry.reference}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close drawer"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <DetailRow icon={Building2} label="Customer" value={enquiry.customerName} />
            <DetailRow icon={Phone} label="Phone" value={enquiry.phone} />
            <DetailRow icon={Mail} label="Email" value={enquiry.email} />
            <DetailRow icon={MapPin} label="City" value={enquiry.city} />
            <DetailRow icon={BriefcaseBusiness} label="Business Type" value={enquiry.businessType} />
            <DetailRow icon={CalendarDays} label="Submitted" value={formatDateTime(enquiry.createdAt)} />
            <DetailRow icon={BriefcaseBusiness} label="Service" value={enquiry.serviceName} />
            <DetailRow icon={Package} label="Package" value={enquiry.packageName} />
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <MessageSquareText className="h-4 w-4 text-slate-500" />
              Customer Message
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {enquiry.message || "No additional message was provided."}
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-slate-200 p-4">
            <label className="block text-sm font-bold text-slate-900">
              Update Status
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as EnquiryStatus)}
              className="mt-3 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onSaveStatus(status)}
              disabled={updating || status === enquiry.status}
              className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {updating ? "Updating..." : "Save Status"}
            </button>
          </div>
        </div>

        <footer className="grid gap-3 border-t border-slate-200 p-5 sm:grid-cols-2">
          <a
            href={`tel:${enquiry.phone}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Phone className="h-4 w-4" />
            Call Customer
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            <MessageCircle className="h-4 w-4" />
            Open WhatsApp
          </a>
        </footer>
      </aside>
    </div>
  );
}

export default EnquiryDetailsDrawer;
