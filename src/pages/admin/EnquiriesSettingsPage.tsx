import {
  CalendarDays,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import EnquiriesTable from "../../components/admin/enquiries-settings/EnquiriesTable";
import EnquiryDetailsDrawer from "../../components/admin/enquiries-settings/EnquiryDetailsDrawer";
import QuotationSettingsPanel from "../../components/admin/enquiries-settings/QuotationSettingsPanel";
import {
  createWhatsAppLink,
  getEnquiriesSettingsBootstrap,
  saveQuotationWhatsAppNumber,
  updateEnquiryStatus,
} from "../../services/admin/enquiriesSettingsService";
import type {
  AdminEnquiry,
  EnquiriesSettingsTab,
  EnquiryFilters,
  EnquiryServiceOption,
  EnquiryStatus,
} from "../../types/enquiriesSettings";

const PAGE_SIZE = 8;

const initialFilters: EnquiryFilters = {
  search: "",
  date: "",
  service: "all",
  status: "all",
};

function getDateInputValue(value: AdminEnquiry["createdAt"]): string {
  if (!value) {
    return "";
  }

  const date =
    value instanceof Date
      ? value
      : typeof value === "object" && "toDate" in value
        ? value.toDate()
        : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function EnquiriesSettingsPage() {
  const [activeTab, setActiveTab] =
    useState<EnquiriesSettingsTab>("enquiries");
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [services, setServices] = useState<EnquiryServiceOption[]>([]);
  const [filters, setFilters] = useState<EnquiryFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [selectedEnquiry, setSelectedEnquiry] =
    useState<AdminEnquiry | null>(null);

  const [quotationNumber, setQuotationNumber] = useState("6304963771");
  const [savedQuotationNumber, setSavedQuotationNumber] =
    useState("6304963771");
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const loadPage = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setLoadError("");

      const data = await getEnquiriesSettingsBootstrap();
      setEnquiries(data.enquiries);
      setServices(data.services);
      setQuotationNumber(data.quotationWhatsAppNumber);
      setSavedQuotationNumber(data.quotationWhatsAppNumber);
    } catch (error: unknown) {
      console.error("Enquiries & Settings loading failed:", error);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Enquiries and settings could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPage();
  }, [loadPage]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const filteredEnquiries = useMemo(() => {
    const normalizedSearch = filters.search.trim().toLowerCase();
    const selectedServiceName =
      filters.service === "all"
        ? ""
        : services.find((service) => service.id === filters.service)?.name || "";

    return enquiries.filter((enquiry) => {
      const matchesSearch =
        !normalizedSearch ||
        enquiry.reference.toLowerCase().includes(normalizedSearch) ||
        enquiry.customerName.toLowerCase().includes(normalizedSearch) ||
        enquiry.phone.toLowerCase().includes(normalizedSearch);

      const matchesDate =
        !filters.date ||
        getDateInputValue(enquiry.createdAt) === filters.date;

      const matchesService =
        filters.service === "all" ||
        enquiry.serviceId === filters.service ||
        enquiry.serviceName === selectedServiceName;

      const matchesStatus =
        filters.status === "all" || enquiry.status === filters.status;

      return matchesSearch && matchesDate && matchesService && matchesStatus;
    });
  }, [enquiries, filters, services]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEnquiries.length / PAGE_SIZE),
  );

  const visibleEnquiries = useMemo(() => {
    const validPage = Math.min(page, totalPages);
    const startIndex = (validPage - 1) * PAGE_SIZE;
    return filteredEnquiries.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredEnquiries, page, totalPages]);

  function changeFilter<K extends keyof EnquiryFilters>(
    field: K,
    value: EnquiryFilters[K],
  ): void {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [field]: value,
    }));
  }

  function openWhatsApp(enquiry: AdminEnquiry): void {
    const message = [
      `Hello ${enquiry.customerName || "there"},`,
      `This is DOTS regarding your ${enquiry.serviceName || "service"} enquiry.`,
      `Reference: ${enquiry.reference}`,
    ].join("\n");

    window.open(
      createWhatsAppLink(enquiry.phone, message),
      "_blank",
      "noopener,noreferrer",
    );
  }

  async function saveStatus(status: EnquiryStatus): Promise<void> {
    if (!selectedEnquiry) {
      return;
    }

    try {
      setUpdatingStatus(true);
      await updateEnquiryStatus(selectedEnquiry.id, status);

      setEnquiries((currentEnquiries) =>
        currentEnquiries.map((enquiry) =>
          enquiry.id === selectedEnquiry.id
            ? { ...enquiry, status }
            : enquiry,
        ),
      );
      setSelectedEnquiry((currentEnquiry) =>
        currentEnquiry ? { ...currentEnquiry, status } : null,
      );
    } catch (error: unknown) {
      console.error("Enquiry status update failed:", error);
      window.alert(
        error instanceof Error
          ? error.message
          : "The enquiry status could not be updated.",
      );
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function saveSettings(): Promise<void> {
    try {
      setSavingSettings(true);
      setSettingsError("");
      setSettingsSuccess("");

      const savedNumber = await saveQuotationWhatsAppNumber(
        quotationNumber,
      );
      setQuotationNumber(savedNumber);
      setSavedQuotationNumber(savedNumber);
      setSettingsSuccess("Quotation WhatsApp number saved successfully.");
    } catch (error: unknown) {
      setSettingsError(
        error instanceof Error
          ? error.message
          : "The WhatsApp number could not be saved.",
      );
    } finally {
      setSavingSettings(false);
    }
  }

  const selectedWhatsAppLink = selectedEnquiry
    ? createWhatsAppLink(
        selectedEnquiry.phone,
        `Hello ${selectedEnquiry.customerName || "there"}, this is DOTS regarding enquiry ${selectedEnquiry.reference}.`,
      )
    : "#";

  return (
    <section className="p-4 sm:p-6 lg:p-7">
      <div className="mb-5 flex items-center gap-7 border-b border-slate-200">
        {(["enquiries", "settings"] as EnquiriesSettingsTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={[
              "relative pb-3 text-sm font-semibold capitalize transition",
              activeTab === tab
                ? "text-[#1266f1]"
                : "text-slate-500 hover:text-slate-800",
            ].join(" ")}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#1266f1]" />
            )}
          </button>
        ))}
      </div>

      {loadError && (
        <div className="mb-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => void loadPage()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 font-semibold"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      {activeTab === "enquiries" ? (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="px-4 py-4 sm:px-5">
              <h2 className="text-lg font-bold text-slate-900">Enquiries</h2>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_170px_170px_160px_auto]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={filters.search}
                    onChange={(event) => changeFilter("search", event.target.value)}
                    placeholder="Search by name, phone or reference"
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <label className="relative block">
                  <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(event) => changeFilter("date", event.target.value)}
                    className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                  />
                </label>

                <select
                  value={filters.service}
                  onChange={(event) => changeFilter("service", event.target.value)}
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">All Services</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(event) =>
                    changeFilter(
                      "status",
                      event.target.value as EnquiryFilters["status"],
                    )
                  }
                  className="h-11 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="button"
                  onClick={() => setFilters(initialFilters)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </div>

            {loading ? (
              <div className="px-6 py-16 text-center text-sm text-slate-500">
                <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-4">Loading enquiries...</p>
              </div>
            ) : (
              <EnquiriesTable
                enquiries={visibleEnquiries}
                page={Math.min(page, totalPages)}
                totalPages={totalPages}
                totalResults={filteredEnquiries.length}
                pageSize={PAGE_SIZE}
                onPageChange={(nextPage) =>
                  setPage(Math.min(totalPages, Math.max(1, nextPage)))
                }
                onView={setSelectedEnquiry}
                onWhatsApp={openWhatsApp}
              />
            )}
          </section>

          <div className="hidden xl:block">
            <QuotationSettingsPanel
              compact
              number={quotationNumber}
              error={settingsError}
              success={settingsSuccess}
              saving={savingSettings}
              onChange={(value) => {
                setQuotationNumber(value);
                setSettingsError("");
                setSettingsSuccess("");
              }}
              onSave={() => void saveSettings()}
            />
          </div>
        </div>
      ) : (
        <QuotationSettingsPanel
          number={quotationNumber}
          error={settingsError}
          success={settingsSuccess}
          saving={savingSettings}
          onChange={(value) => {
            setQuotationNumber(value);
            setSettingsError("");
            setSettingsSuccess("");
          }}
          onSave={() => void saveSettings()}
        />
      )}

      <EnquiryDetailsDrawer
        open={Boolean(selectedEnquiry)}
        enquiry={selectedEnquiry}
        updating={updatingStatus}
        whatsappLink={selectedWhatsAppLink}
        onClose={() => setSelectedEnquiry(null)}
        onSaveStatus={(status) => void saveStatus(status)}
      />

      {activeTab === "settings" &&
        quotationNumber !== savedQuotationNumber && (
          <p className="mx-auto mt-3 max-w-2xl text-xs text-amber-600">
            You have unsaved settings changes.
          </p>
        )}
    </section>
  );
}

export default EnquiriesSettingsPage;
