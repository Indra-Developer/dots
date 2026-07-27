import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Inbox,
  MessageCircle,
} from "lucide-react";

import type { AdminEnquiry } from "../../../types/enquiriesSettings";
import EnquiryStatusBadge from "./EnquiryStatusBadge";

interface EnquiriesTableProps {
  enquiries: AdminEnquiry[];
  page: number;
  totalPages: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onView: (enquiry: AdminEnquiry) => void;
  onWhatsApp: (enquiry: AdminEnquiry) => void;
}

function formatDate(value: AdminEnquiry["createdAt"]): string {
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
  }).format(date);
}

function EnquiriesTable({
  enquiries,
  page,
  totalPages,
  totalResults,
  pageSize,
  onPageChange,
  onView,
  onWhatsApp,
}: EnquiriesTableProps) {
  if (enquiries.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <Inbox className="mx-auto h-10 w-10 text-slate-300" />
        <h3 className="mt-4 font-bold text-slate-800">No enquiries found</h3>
        <p className="mt-1 text-sm text-slate-500">
          New enquiries or matching search results will appear here.
        </p>
      </div>
    );
  }

  const startResult = (page - 1) * pageSize + 1;
  const endResult = Math.min(page * pageSize, totalResults);

  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[920px] text-left text-xs">
          <thead className="border-y border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-3 py-3 text-center">WhatsApp</th>
              <th className="px-3 py-3 text-center">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.map((enquiry) => (
              <tr key={enquiry.id} className="transition hover:bg-slate-50">
                <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-700">
                  {enquiry.reference}
                </td>
                <td className="px-4 py-3 font-medium text-slate-800">
                  {enquiry.customerName || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {enquiry.phone || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {enquiry.serviceName || "—"}
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {enquiry.packageName || "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                  {formatDate(enquiry.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <EnquiryStatusBadge status={enquiry.status} />
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onWhatsApp(enquiry)}
                    aria-label={`Open WhatsApp for ${enquiry.customerName}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 transition hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </td>
                <td className="px-3 py-3 text-center">
                  <button
                    type="button"
                    onClick={() => onView(enquiry)}
                    aria-label={`View ${enquiry.customerName}`}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 lg:hidden">
        {enquiries.map((enquiry) => (
          <article key={enquiry.id} className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-bold text-slate-900">
                  {enquiry.customerName || "Unnamed customer"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {enquiry.reference}
                </p>
              </div>
              <EnquiryStatusBadge status={enquiry.status} />
            </div>

            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-slate-400">Service</dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {enquiry.serviceName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Phone</dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {enquiry.phone || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Package</dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {enquiry.packageName || "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-400">Date</dt>
                <dd className="mt-1 font-medium text-slate-700">
                  {formatDate(enquiry.createdAt)}
                </dd>
              </div>
            </dl>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onWhatsApp(enquiry)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 text-sm font-semibold text-emerald-700"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => onView(enquiry)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700"
              >
                <Eye className="h-4 w-4" />
                View
              </button>
            </div>
          </article>
        ))}
      </div>

      <footer className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Showing {startResult} to {endResult} of {totalResults} entries
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-[#1266f1] px-3 text-sm font-bold text-white">
            {page}
          </span>
          <span className="text-xs text-slate-500">of {totalPages}</span>

          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </footer>
    </>
  );
}

export default EnquiriesTable;
