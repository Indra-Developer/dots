import {
  BriefcaseBusiness,
  CirclePlus,
  FilePlus2,
  FolderKanban,
  House,
  Image,
  Inbox,
  LayoutGrid,
  Mail,
  RefreshCw,
  Video,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";

import DashboardQuickAction from "../../components/admin/dashboard/DashboardQuickAction";
import type { DashboardQuickActionProps } from "../../components/admin/dashboard/DashboardQuickAction";
import DashboardStatCard from "../../components/admin/dashboard/DashboardStatCard";
import type { DashboardStatCardProps } from "../../components/admin/dashboard/DashboardStatCard";
import { loadAdminDashboard } from "../../services/admin/dashboardService";
import type {
  AdminDashboardData,
  DashboardContentSource,
  DashboardDateValue,
} from "../../types/dashboard";

const initialDashboardData: AdminDashboardData = {
  counts: {
    activeCategories: 0,
    activeServices: 0,
    homeVideos: 0,
    newEnquiries: 0,
  },
  recentEnquiries: [],
  recentContentUpdates: [],
  warnings: [],
};

const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  "in progress": "bg-purple-50 text-purple-700",
  completed: "bg-emerald-50 text-emerald-700",
  closed: "bg-slate-100 text-slate-700",
  cancelled: "bg-red-50 text-red-700",
};

const contentSourceStyles: Record<
  DashboardContentSource,
  { icon: LucideIcon; className: string }
> = {
  banner: { icon: Image, className: "bg-blue-50 text-blue-600" },
  video: { icon: Video, className: "bg-emerald-50 text-emerald-600" },
  service: {
    icon: FolderKanban,
    className: "bg-purple-50 text-purple-600",
  },
  category: {
    icon: LayoutGrid,
    className: "bg-orange-50 text-orange-600",
  },
};

function normalizeStatus(status: unknown): string {
  return String(status || "new")
    .replaceAll("_", " ")
    .trim()
    .toLowerCase();
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function toDate(value: DashboardDateValue): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === "object" && "toDate" in value) {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: DashboardDateValue): string {
  const date = toDate(value);

  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: DashboardDateValue): string {
  const date = toDate(value);

  if (!date) {
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

function EnquiryStatus({ status }: { status: unknown }) {
  const normalizedStatus = normalizeStatus(status);
  const className =
    statusStyles[normalizedStatus] || "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {titleCase(normalizedStatus)}
    </span>
  );
}

function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadDashboard = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setLoadError("");
      setDashboardData(await loadAdminDashboard());
    } catch (error: unknown) {
      console.error("Dashboard loading failed:", error);
      setLoadError("Dashboard data could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const statCards: DashboardStatCardProps[] = [
    {
      title: "Active Categories",
      value: dashboardData.counts.activeCategories,
      icon: LayoutGrid,
      tone: "blue",
      linkLabel: "View all categories",
      to: "/admin/navigation-services",
    },
    {
      title: "Active Services",
      value: dashboardData.counts.activeServices,
      icon: BriefcaseBusiness,
      tone: "green",
      linkLabel: "View all services",
      to: "/admin/navigation-services",
    },
    {
      title: "Home Videos",
      value: dashboardData.counts.homeVideos,
      icon: Video,
      tone: "purple",
      linkLabel: "View all videos",
      to: "/admin/home-content?tab=introduction-video",
    },
    {
      title: "New Enquiries",
      value: dashboardData.counts.newEnquiries,
      icon: Mail,
      tone: "orange",
      linkLabel: "View all enquiries",
      to: "/admin/enquiries-settings",
    },
  ];

  const quickActions: DashboardQuickActionProps[] = [
    {
      title: "Manage Home",
      description: "Edit home content, banners and sections",
      icon: House,
      tone: "blue",
      to: "/admin/home-content",
    },
    {
      title: "Add Category",
      description: "Create and manage service categories",
      icon: CirclePlus,
      tone: "green",
      to: "/admin/navigation-services?action=add-category",
    },
    {
      title: "Add Service",
      description: "Add a new service or sub-service",
      icon: FilePlus2,
      tone: "purple",
      to: "/admin/navigation-services?action=add-service",
    },
    {
      title: "View Enquiries",
      description: "View and manage customer enquiries",
      icon: Inbox,
      tone: "orange",
      to: "/admin/enquiries-settings",
    },
  ];

  return (
    <section className="p-4 sm:p-6 lg:p-7">
      {loadError && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => void loadDashboard()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 font-semibold transition hover:bg-red-100"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {!loadError && dashboardData.warnings.length > 0 && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Some Firebase dashboard values are unavailable. Available sections are
          still shown normally.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <DashboardStatCard
            key={card.title}
            {...card}
            value={loading ? "—" : card.value}
          />
        ))}
      </div>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-[#1e293b]">Quick Actions</h2>
        </div>

        <div className="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
          {quickActions.map((action) => (
            <DashboardQuickAction key={action.title} {...action} />
          ))}
        </div>
      </section>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-[#1e293b]">
              Recent Enquiries
            </h2>
            <Link
              to="/admin/enquiries-settings"
              className="text-sm font-semibold text-[#1266f1] hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading recent enquiries...
            </div>
          ) : dashboardData.recentEnquiries.length === 0 ? (
            <div className="p-8 text-center">
              <Inbox className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No enquiries yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                New quotation enquiries will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3">Customer</th>
                      <th className="px-5 py-3">Service</th>
                      <th className="px-5 py-3">Mobile</th>
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {dashboardData.recentEnquiries.map((enquiry) => (
                      <tr key={enquiry.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-medium text-slate-800">
                          {enquiry.customer ||
                            enquiry.customerName ||
                            enquiry.name ||
                            "—"}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {enquiry.service || enquiry.serviceName || "—"}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {enquiry.phone || enquiry.mobile || "—"}
                        </td>
                        <td className="px-5 py-3 text-slate-600">
                          {formatDate(enquiry.createdAt || enquiry.submittedAt)}
                        </td>
                        <td className="px-5 py-3">
                          <EnquiryStatus status={enquiry.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-slate-100 md:hidden">
                {dashboardData.recentEnquiries.map((enquiry) => (
                  <article key={enquiry.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {enquiry.customer ||
                            enquiry.customerName ||
                            enquiry.name ||
                            "—"}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {enquiry.service || enquiry.serviceName || "—"}
                        </p>
                      </div>
                      <EnquiryStatus status={enquiry.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                      <span>{enquiry.phone || enquiry.mobile || "—"}</span>
                      <span>
                        {formatDate(enquiry.createdAt || enquiry.submittedAt)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="text-lg font-bold text-[#1e293b]">
              Recent Content Updates
            </h2>
            <Link
              to="/admin/home-content"
              className="text-sm font-semibold text-[#1266f1] hover:text-blue-700"
            >
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Loading content updates...
            </div>
          ) : dashboardData.recentContentUpdates.length === 0 ? (
            <div className="p-8 text-center">
              <Image className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 font-semibold text-slate-700">
                No content updates yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Content changes will appear here after Admin updates begin.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {dashboardData.recentContentUpdates.map((update) => {
                const sourceStyle = contentSourceStyles[update.source];
                const UpdateIcon = sourceStyle.icon;

                return (
                  <article
                    key={update.id}
                    className="flex items-start gap-4 px-5 py-4 transition hover:bg-slate-50"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${sourceStyle.className}`}
                    >
                      <UpdateIcon className="h-5 w-5" strokeWidth={1.8} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800">
                        {update.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {update.description}
                      </p>
                    </div>

                    <time className="hidden shrink-0 text-xs text-slate-400 sm:block">
                      {formatDateTime(update.createdAt)}
                    </time>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <footer className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 DOTS Business Services. All rights reserved.</p>
        <p>Version 1.0.0</p>
      </footer>
    </section>
  );
}

export default AdminDashboardPage;
