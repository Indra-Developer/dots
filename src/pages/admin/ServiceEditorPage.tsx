import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  LoaderCircle,
  Save,
  Send,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useNavigate,
  useParams,
} from "react-router";

import AboutServiceTab from "../../components/admin/service-editor/AboutServiceTab";
import BasicServiceTab from "../../components/admin/service-editor/BasicServiceTab";
import DocumentsProcessTab from "../../components/admin/service-editor/DocumentsProcessTab";
import PricingServiceTab from "../../components/admin/service-editor/PricingServiceTab";
import PublishConfirmationModal from "../../components/admin/service-editor/PublishConfirmationModal";
import RelatedServicesTab from "../../components/admin/service-editor/RelatedServicesTab";
import ServiceEditorTabs from "../../components/admin/service-editor/ServiceEditorTabs";
import ServicePreviewModal from "../../components/admin/service-editor/ServicePreviewModal";
import ServicePreviewPanel from "../../components/admin/service-editor/ServicePreviewPanel";
import {
  createEmptyServiceEditorForm,
  slugifyServiceValue,
} from "../../constants/serviceEditor";
import {
  getServiceEditorBootstrap,
  saveServiceEditorForm,
} from "../../services/admin/serviceEditorService";
import type {
  ServiceAboutContent,
  ServiceEditorErrors,
  ServiceEditorForm,
  ServiceEditorTabId,
} from "../../types/serviceEditor";
import type {
  NavigationCategory,
  NavigationService,
  ServicePublicationStatus,
} from "../../types/navigationServices";

function serializeForm(form: ServiceEditorForm): string {
  return JSON.stringify(form);
}

function validateBasic(
  form: ServiceEditorForm,
  services: NavigationService[],
): ServiceEditorErrors {
  const errors: ServiceEditorErrors = {};

  if (!form.name.trim()) {
    errors.name = "Service name is required.";
  }

  if (!form.slug.trim()) {
    errors.slug = "Slug is required.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug.trim())) {
    errors.slug = "Use lowercase letters, numbers and hyphens only.";
  } else if (
    services.some(
      (service) =>
        service.id !== form.id &&
        service.slug.toLowerCase() === form.slug.trim().toLowerCase(),
    )
  ) {
    errors.slug = "Another service already uses this slug.";
  }

  if (!form.categoryId) {
    errors.categoryId = "Select a category.";
  }

  if (!form.shortDescription.trim()) {
    errors.shortDescription = "Short description is required.";
  }

  return errors;
}

function validateForPublish(
  form: ServiceEditorForm,
  services: NavigationService[],
): ServiceEditorErrors {
  const errors = validateBasic(form, services);

  if (!form.about.whatIsService.trim()) {
    errors.whatIsService = "Add the main About This Service explanation.";
  }

  const hasDocumentItem = form.documentGroups.some((group) =>
    group.items.some((item) => item.trim()),
  );

  if (!hasDocumentItem) {
    errors.documentGroups = "Add at least one required document.";
  }

  const hasProcessStep = form.processSteps.some(
    (step) => step.heading.trim() && step.description.trim(),
  );

  if (!hasProcessStep) {
    errors.processSteps = "Add at least one complete process step.";
  }

  const hasPricingPackage = form.pricingTabs.some((tab) =>
    tab.packages.some(
      (pricingPackage) =>
        pricingPackage.name.trim() &&
        (pricingPackage.price.trim() || tab.type === "custom"),
    ),
  );

  if (!hasPricingPackage) {
    errors.pricingTabs = "Add at least one complete pricing package.";
  }

  return errors;
}

function resolveErrorTabs(
  errors: ServiceEditorErrors,
): ServiceEditorTabId[] {
  const tabs: ServiceEditorTabId[] = [];

  if (
    errors.name ||
    errors.slug ||
    errors.categoryId ||
    errors.shortDescription
  ) {
    tabs.push("basic");
  }

  if (errors.whatIsService) {
    tabs.push("about");
  }

  if (errors.documentGroups || errors.processSteps) {
    tabs.push("documents-process");
  }

  if (errors.pricingTabs) {
    tabs.push("pricing");
  }

  return tabs;
}

function ServiceEditorPage() {
  const { serviceId } = useParams<{ serviceId?: string }>();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const [services, setServices] = useState<NavigationService[]>([]);
  const [form, setForm] = useState<ServiceEditorForm>(
    createEmptyServiceEditorForm(),
  );
  const [originalSnapshot, setOriginalSnapshot] = useState("");
  const [activeTab, setActiveTab] =
    useState<ServiceEditorTabId>("basic");
  const [errors, setErrors] = useState<ServiceEditorErrors>({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const isDirty = useMemo(
    () => Boolean(originalSnapshot) && serializeForm(form) !== originalSnapshot,
    [form, originalSnapshot],
  );

  const errorTabs = useMemo(
    () => resolveErrorTabs(errors),
    [errors],
  );

  const loadEditor = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setLoadError("");
      setErrors({});

      const data = await getServiceEditorBootstrap(serviceId);
      setCategories(data.categories);
      setServices(data.services);

      if (!serviceId && data.services.length > 0) {
        navigate(`/admin/service-editor/${data.services[0].id}`, {
          replace: true,
        });
        return;
      }

      if (data.form) {
        setForm(data.form);
        setOriginalSnapshot(serializeForm(data.form));
      } else {
        const emptyForm = createEmptyServiceEditorForm();
        setForm(emptyForm);
        setOriginalSnapshot(serializeForm(emptyForm));
      }
    } catch (error: unknown) {
      console.error("Service Editor loading failed:", error);
      setLoadError(
        error instanceof Error
          ? error.message
          : "Service Editor data could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }, [navigate, serviceId]);

  useEffect(() => {
    void loadEditor();
  }, [loadEditor]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent): void {
      if (!isDirty) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function clearFieldError(field: string): void {
    if (!errors[field]) {
      return;
    }

    setErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function changeBasicField<K extends keyof ServiceEditorForm>(
    field: K,
    value: ServiceEditorForm[K],
  ): void {
    setNotice("");

    setForm((currentForm) => {
      if (field === "name") {
        const nextName = String(value);
        const generatedCurrentSlug = slugifyServiceValue(currentForm.name);
        const nextSlug =
          !currentForm.slug || currentForm.slug === generatedCurrentSlug
            ? slugifyServiceValue(nextName)
            : currentForm.slug;

        return {
          ...currentForm,
          name: nextName,
          serviceName: nextName,
          slug: nextSlug,
        };
      }

      if (field === "slug") {
        return {
          ...currentForm,
          slug: slugifyServiceValue(String(value)),
        };
      }

      if (field === "categoryId") {
        const category = categories.find(
          (item) => item.id === String(value),
        );

        return {
          ...currentForm,
          categoryId: String(value),
          categoryName: category?.name || "",
        };
      }

      return {
        ...currentForm,
        [field]: value,
      };
    });

    clearFieldError(String(field));
  }

  function changeAbout(about: ServiceAboutContent): void {
    setForm((currentForm) => ({ ...currentForm, about }));
    clearFieldError("whatIsService");
  }

  function requestServiceChange(nextServiceId: string): void {
    if (!nextServiceId || nextServiceId === serviceId) {
      return;
    }

    if (
      isDirty &&
      !window.confirm(
        "You have unsaved changes. Leave this service without saving?",
      )
    ) {
      return;
    }

    navigate(`/admin/service-editor/${nextServiceId}`);
  }

  function showFirstErrorTab(nextErrors: ServiceEditorErrors): void {
    const firstErrorTab = resolveErrorTabs(nextErrors)[0];

    if (firstErrorTab) {
      setActiveTab(firstErrorTab);
    }
  }

  async function persistForm(
    status: ServicePublicationStatus,
  ): Promise<void> {
    const validationErrors =
      status === "published"
        ? validateForPublish(form, services)
        : validateBasic(form, services);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showFirstErrorTab(validationErrors);
      setNotice(
        status === "published"
          ? "Complete the highlighted fields before publishing."
          : "Complete the required Basic fields before saving.",
      );
      return;
    }

    const nextForm: ServiceEditorForm = {
      ...form,
      status,
    };

    try {
      if (status === "published") {
        setPublishing(true);
      } else {
        setSaving(true);
      }

      await saveServiceEditorForm(nextForm, status);
      setForm(nextForm);
      setOriginalSnapshot(serializeForm(nextForm));
      setServices((currentServices) =>
        currentServices.map((service) =>
          service.id === nextForm.id
            ? {
                ...service,
                name: nextForm.name,
                slug: nextForm.slug,
                categoryId: nextForm.categoryId,
                categoryName: nextForm.categoryName,
                shortDescription: nextForm.shortDescription,
                active: nextForm.active,
                status,
              }
            : service,
        ),
      );
      setNotice(
        status === "published"
          ? "Service published successfully."
          : "Draft saved successfully.",
      );
      setPublishModalOpen(false);
    } catch (error: unknown) {
      console.error("Service save failed:", error);
      setNotice(
        error instanceof Error
          ? error.message
          : "The service could not be saved.",
      );
    } finally {
      setSaving(false);
      setPublishing(false);
    }
  }

  function requestPublish(): void {
    const validationErrors = validateForPublish(form, services);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      showFirstErrorTab(validationErrors);
      setNotice("Complete the highlighted fields before publishing.");
      return;
    }

    setPublishModalOpen(true);
  }

  if (loading) {
    return (
      <section className="p-5 sm:p-7 lg:p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          <LoaderCircle className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-4">Loading Service Editor...</p>
        </div>
      </section>
    );
  }

  if (loadError) {
    return (
      <section className="p-5 sm:p-7 lg:p-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-9 w-9 text-red-500" />
          <p className="mt-4 font-semibold text-red-700">{loadError}</p>
          <button
            type="button"
            onClick={() => void loadEditor()}
            className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  if (services.length === 0 || !form.id) {
    return (
      <section className="p-5 sm:p-7 lg:p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <AlertCircle className="mx-auto h-10 w-10 text-slate-300" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            Create a service first
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
            Add a service under Navigation & Services. Then return here to add
            the complete About, document, process, pricing and related-service
            content.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/navigation-services?action=add-service")}
            className="mt-6 rounded-lg bg-[#1266f1] px-5 py-3 text-sm font-semibold text-white"
          >
            Go to Navigation & Services
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-24">
      <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                className="hover:text-blue-600"
              >
                Home
              </button>
              <span>/</span>
              <button
                type="button"
                onClick={() => navigate("/admin/navigation-services")}
                className="hover:text-blue-600"
              >
                Services
              </button>
              <span>/</span>
              <span className="font-semibold text-slate-700">Edit Service</span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold tracking-[-0.02em] text-slate-900 sm:text-[28px]">
                Edit Service
              </h2>
              <span
                className={[
                  "rounded-md px-3 py-1 text-xs font-semibold",
                  form.status === "published"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700",
                ].join(" ")}
              >
                {form.status === "published" ? "Published" : "Draft"}
              </span>
              {isDirty && (
                <span className="rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Unsaved changes
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {form.name}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="block min-w-[240px]">
              <span className="sr-only">Select service</span>
              <select
                value={form.id}
                onChange={(event) => requestServiceChange(event.target.value)}
                className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={() => navigate("/admin/navigation-services")}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Services
            </button>
          </div>
        </div>

        {notice && (
          <div
            className={[
              "mt-5 flex items-center gap-3 rounded-xl border p-4 text-sm",
              Object.keys(errors).length > 0
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-emerald-200 bg-emerald-50 text-emerald-800",
            ].join(" ")}
          >
            {Object.keys(errors).length > 0 ? (
              <AlertCircle className="h-5 w-5 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            )}
            <p>{notice}</p>
          </div>
        )}

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <ServiceEditorTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            errorTabs={errorTabs}
          />

          <div className="bg-[#fbfcfd] p-4 sm:p-5">
            {activeTab === "basic" && (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_310px]">
                <BasicServiceTab
                  form={form}
                  categories={categories}
                  errors={errors}
                  onChange={changeBasicField}
                />
                <ServicePreviewPanel
                  form={form}
                  onOpenPreview={() => setPreviewOpen(true)}
                />
              </div>
            )}

            {activeTab === "about" && (
              <AboutServiceTab
                about={form.about}
                errors={errors}
                onChange={changeAbout}
              />
            )}

            {activeTab === "documents-process" && (
              <DocumentsProcessTab
                documentGroups={form.documentGroups}
                processSteps={form.processSteps}
                onDocumentGroupsChange={(documentGroups) => {
                  setForm((currentForm) => ({
                    ...currentForm,
                    documentGroups,
                  }));
                  clearFieldError("documentGroups");
                }}
                onProcessStepsChange={(processSteps) => {
                  setForm((currentForm) => ({
                    ...currentForm,
                    processSteps,
                  }));
                  clearFieldError("processSteps");
                }}
              />
            )}

            {activeTab === "pricing" && (
              <PricingServiceTab
                pricingTabs={form.pricingTabs}
                onChange={(pricingTabs) => {
                  setForm((currentForm) => ({
                    ...currentForm,
                    pricingTabs,
                  }));
                  clearFieldError("pricingTabs");
                }}
              />
            )}

            {activeTab === "related-services" && (
              <RelatedServicesTab
                currentServiceId={form.id}
                services={services}
                selectedIds={form.relatedServiceIds}
                onChange={(relatedServiceIds) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    relatedServiceIds,
                  }))
                }
              />
            )}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-8px_28px_rgba(15,23,42,0.08)] backdrop-blur lg:left-[250px] sm:px-6 lg:px-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="hidden text-xs text-slate-500 md:block">
            {isDirty
              ? "You have unsaved changes."
              : "All changes are saved."}
          </p>

          <div className="grid gap-2 sm:flex sm:items-center">
            <button
              type="button"
              onClick={() => void persistForm("draft")}
              disabled={saving || publishing || !isDirty}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>

            <button
              type="button"
              onClick={requestPublish}
              disabled={saving || publishing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-6 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              Publish Service
            </button>
          </div>
        </div>
      </div>

      <ServicePreviewModal
        open={previewOpen}
        form={form}
        onClose={() => setPreviewOpen(false)}
      />

      <PublishConfirmationModal
        open={publishModalOpen}
        serviceName={form.name}
        publishing={publishing}
        onCancel={() => {
          if (!publishing) {
            setPublishModalOpen(false);
          }
        }}
        onConfirm={() => void persistForm("published")}
      />
    </section>
  );
}

export default ServiceEditorPage;
