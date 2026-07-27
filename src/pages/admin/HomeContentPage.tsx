import {
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import DeleteConfirmationModal from "../../components/admin/home-content/DeleteConfirmationModal";
import HomeContentDrawer from "../../components/admin/home-content/HomeContentDrawer";
import HomeContentTable from "../../components/admin/home-content/HomeContentTable";
import {
  createEmptyHomeContentForm,
  createHomeContentFormFromItem,
  getHomeContentTabDefinition,
  homeContentTabs,
} from "../../constants/homeContent";
import {
  deleteHomeContentItem,
  getHomeContentItems,
  getServiceOptions,
  saveHomeContentItem,
  updateHomeContentActive,
} from "../../services/admin/homeContentService";
import type {
  HomeContentFormState,
  HomeContentItem,
  HomeContentTab,
  ServiceOption,
  UploadProgressState,
} from "../../types/homeContent";

const validTabs = new Set<HomeContentTab>(
  homeContentTabs.map((tab) => tab.id),
);

function isHomeContentTab(value: string | null): value is HomeContentTab {
  return Boolean(value && validTabs.has(value as HomeContentTab));
}

function getItemTitle(tab: HomeContentTab, item: HomeContentItem): string {
  switch (tab) {
    case "about":
      return item.heading || "About content";
    case "customer-stories":
      return item.businessName || item.videoTitle || "Customer story";
    case "reviews":
      return item.reviewerName || "Customer review";
    case "faqs":
      return item.question || "FAQ";
    default:
      return item.title || item.name || item.serviceName || "Untitled item";
  }
}

function validateImageFile(
  file: File | null,
  fieldLabel: string,
  maximumMegabytes: number,
): string {
  if (!file) {
    return "";
  }

  if (!file.type.startsWith("image/")) {
    return `${fieldLabel} must be an image file.`;
  }

  if (file.size > maximumMegabytes * 1024 * 1024) {
    return `${fieldLabel} must be smaller than ${maximumMegabytes} MB.`;
  }

  return "";
}

function validateVideoFile(
  file: File | null,
  fieldLabel: string,
  maximumMegabytes: number,
): string {
  if (!file) {
    return "";
  }

  if (!file.type.startsWith("video/")) {
    return `${fieldLabel} must be a video file.`;
  }

  if (file.size > maximumMegabytes * 1024 * 1024) {
    return `${fieldLabel} must be smaller than ${maximumMegabytes} MB.`;
  }

  return "";
}

function validateForm(
  tab: HomeContentTab,
  form: HomeContentFormState,
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!Number.isFinite(form.displayOrder) || form.displayOrder < 1) {
    errors.displayOrder = "Display order must be 1 or greater.";
  }

  switch (tab) {
    case "banners":
      if (!form.title.trim()) {
        errors.title = "Banner title is required.";
      }
      if (!form.desktopImageFile && !form.desktopImageUrl) {
        errors.desktopImageFile = "Desktop banner image is required.";
      }
      if (!form.mobileImageFile && !form.mobileImageUrl) {
        errors.mobileImageFile = "Mobile banner image is required.";
      }
      if (
        form.startDate &&
        form.expiryDate &&
        new Date(form.expiryDate) < new Date(form.startDate)
      ) {
        errors.displayOrder = "Expiry date cannot be earlier than start date.";
      }
      break;

    case "quick-services":
      if (!form.title.trim()) {
        errors.title = "Service title is required.";
      }
      if (!form.shortDescription.trim()) {
        errors.shortDescription = "Short description is required.";
      }
      break;

    case "about":
      if (!form.label.trim()) {
        errors.label = "Small label is required.";
      }
      if (!form.heading.trim()) {
        errors.heading = "Heading is required.";
      }
      if (!form.paragraphOne.trim()) {
        errors.paragraphOne = "First paragraph is required.";
      }
      if (!form.imageFile && !form.imageUrl) {
        errors.imageFile = "About image is required.";
      }
      break;

    case "introduction-video":
      if (!form.title.trim()) {
        errors.title = "Video title is required.";
      }
      if (!form.description.trim()) {
        errors.description = "Description is required.";
      }
      if (!form.duration.trim()) {
        errors.duration = "Duration is required.";
      }
      if (!form.posterFile && !form.posterUrl) {
        errors.posterFile = "Poster image is required.";
      }
      if (!form.videoFile && !form.videoUrl) {
        errors.videoFile = "Video file is required.";
      }
      break;

    case "customer-stories":
      if (!form.businessName.trim()) {
        errors.businessName = "Customer or business name is required.";
      }
      if (!form.videoTitle.trim()) {
        errors.videoTitle = "Video title is required.";
      }
      if (!form.duration.trim()) {
        errors.duration = "Duration is required.";
      }
      if (!form.posterFile && !form.posterUrl) {
        errors.posterFile = "Story poster is required.";
      }
      if (!form.videoFile && !form.videoUrl) {
        errors.videoFile = "Story video is required.";
      }
      break;

    case "reviews":
      if (!form.reviewerName.trim()) {
        errors.reviewerName = "Reviewer name is required.";
      }
      if (!form.reviewText.trim()) {
        errors.reviewText = "Review text is required.";
      }
      break;

    case "faqs":
      if (!form.question.trim()) {
        errors.question = "Question is required.";
      }
      if (!form.answer.trim()) {
        errors.answer = "Answer is required.";
      }
      break;
  }

  const desktopImageError = validateImageFile(
    form.desktopImageFile,
    "Desktop image",
    10,
  );
  const mobileImageError = validateImageFile(
    form.mobileImageFile,
    "Mobile image",
    10,
  );
  const imageError = validateImageFile(form.imageFile, "Image", 10);
  const posterError = validateImageFile(form.posterFile, "Poster image", 10);
  const videoError = validateVideoFile(form.videoFile, "Video", 100);

  if (desktopImageError) {
    errors.desktopImageFile = desktopImageError;
  }
  if (mobileImageError) {
    errors.mobileImageFile = mobileImageError;
  }
  if (imageError) {
    errors.imageFile = imageError;
  }
  if (posterError) {
    errors.posterFile = posterError;
  }
  if (videoError) {
    errors.videoFile = videoError;
  }

  return errors;
}

function HomeContentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const activeTab: HomeContentTab = isHomeContentTab(requestedTab)
    ? requestedTab
    : "banners";

  const [items, setItems] = useState<HomeContentItem[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomeContentItem | null>(null);
  const [form, setForm] = useState<HomeContentFormState>(
    createEmptyHomeContentForm(),
  );
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<UploadProgressState | null>(null);

  const [deleteItem, setDeleteItem] = useState<HomeContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState("");

  const tabDefinition = useMemo(
    () => getHomeContentTabDefinition(activeTab),
    [activeTab],
  );

  const loadContent = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setLoadError("");
      const nextItems = await getHomeContentItems(activeTab);
      setItems(nextItems);
    } catch (error: unknown) {
      console.error("Home content loading failed:", error);
      setLoadError(
        "Content could not be loaded. Check your Firebase connection and permissions.",
      );
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void loadContent();
  }, [loadContent]);

  useEffect(() => {
    async function loadServices(): Promise<void> {
      try {
        const options = await getServiceOptions();
        setServices(options);
      } catch (error: unknown) {
        console.warn("Service options could not be loaded:", error);
      }
    }

    void loadServices();
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setEditingItem(null);
    setFormErrors({});
    setUploadProgress(null);
  }, [activeTab]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timer = window.setTimeout(() => setNotice(""), 3500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  function changeTab(tab: HomeContentTab): void {
    setSearchParams({ tab });
  }

  function openCreateDrawer(): void {
    setEditingItem(null);
    setForm(createEmptyHomeContentForm());
    setFormErrors({});
    setUploadProgress(null);
    setDrawerOpen(true);
  }

  function openEditDrawer(item: HomeContentItem): void {
    setEditingItem(item);
    setForm(createHomeContentFormFromItem(item));
    setFormErrors({});
    setUploadProgress(null);
    setDrawerOpen(true);
  }

  function closeDrawer(): void {
    if (saving) {
      return;
    }

    setDrawerOpen(false);
    setEditingItem(null);
    setFormErrors({});
    setUploadProgress(null);
  }

  function updateForm<K extends keyof HomeContentFormState>(
    field: K,
    value: HomeContentFormState[K],
  ): void {
    setForm((current) => ({ ...current, [field]: value }));

    if (formErrors[String(field)]) {
      setFormErrors((current) => ({ ...current, [String(field)]: "" }));
    }
  }

  async function handleSave(): Promise<void> {
    const errors = validateForm(activeTab, form);
    setFormErrors(errors);

    if (Object.values(errors).some(Boolean)) {
      return;
    }

    try {
      setSaving(true);
      setLoadError("");
      setUploadProgress({ label: "Preparing content", percentage: 0 });

      const wasEditing = Boolean(editingItem);

      await saveHomeContentItem({
        tab: activeTab,
        form,
        itemId: editingItem?.id,
        onProgress: setUploadProgress,
      });

      setDrawerOpen(false);
      setEditingItem(null);
      setFormErrors({});
      setNotice(
        wasEditing
          ? `${tabDefinition.singularLabel} updated successfully.`
          : `${tabDefinition.singularLabel} added successfully.`,
      );
      await loadContent();
    } catch (error: unknown) {
      console.error("Home content saving failed:", error);
      setLoadError(
        "Content could not be saved. Check the file size, Storage rules and Firebase connection.",
      );
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  }

  async function handleToggleActive(item: HomeContentItem): Promise<void> {
    try {
      setTogglingId(item.id);
      await updateHomeContentActive(activeTab, item.id, item.active === false);
      setItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, active: item.active === false }
            : currentItem,
        ),
      );
    } catch (error: unknown) {
      console.error("Status update failed:", error);
      setLoadError("Status could not be updated. Please try again.");
    } finally {
      setTogglingId("");
    }
  }

  async function handleDelete(): Promise<void> {
    if (!deleteItem) {
      return;
    }

    try {
      setDeleting(true);
      await deleteHomeContentItem(activeTab, deleteItem);
      setNotice(`${tabDefinition.singularLabel} deleted successfully.`);
      setDeleteItem(null);
      await loadContent();
    } catch (error: unknown) {
      console.error("Content deletion failed:", error);
      setLoadError("Content could not be deleted. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[#1e293b] sm:text-3xl">
              Home Content Manager
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Manage all content that appears on the DOTS website home page.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateDrawer}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            {tabDefinition.addButtonLabel}
          </button>
        </div>

        {notice && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {notice}
          </div>
        )}

        {loadError && (
          <div className="mt-5 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p>{loadError}</p>
            </div>
            <button
              type="button"
              onClick={() => void loadContent()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 font-semibold transition hover:bg-red-100"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
        )}

        <div className="mt-6 overflow-x-auto border-b border-slate-200">
          <div className="flex min-w-max gap-1">
            {homeContentTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => changeTab(tab.id)}
                className={[
                  "relative min-h-12 px-4 text-sm font-medium transition",
                  activeTab === tab.id
                    ? "text-[#1266f1]"
                    : "text-slate-500 hover:text-slate-900",
                ].join(" ")}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#1266f1]" />
                )}
              </button>
            ))}
          </div>
        </div>

        <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {tabDefinition.label}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Add, edit, order and activate the content shown in this home section.
              </p>
            </div>
            <p className="text-xs font-medium text-slate-400">
              {items.length} item{items.length === 1 ? "" : "s"}
            </p>
          </div>

          <HomeContentTable
            tab={activeTab}
            items={items}
            loading={loading}
            togglingId={togglingId}
            onEdit={openEditDrawer}
            onDelete={setDeleteItem}
            onToggleActive={(item) => void handleToggleActive(item)}
          />
        </section>
      </div>

      <HomeContentDrawer
        open={drawerOpen}
        tab={activeTab}
        editing={Boolean(editingItem)}
        form={form}
        services={services}
        errors={formErrors}
        saving={saving}
        uploadProgress={uploadProgress}
        onClose={closeDrawer}
        onChange={updateForm}
        onSubmit={() => void handleSave()}
      />

      <DeleteConfirmationModal
        open={Boolean(deleteItem)}
        title={deleteItem ? getItemTitle(activeTab, deleteItem) : ""}
        deleting={deleting}
        onCancel={() => {
          if (!deleting) {
            setDeleteItem(null);
          }
        }}
        onConfirm={() => void handleDelete()}
      />
    </section>
  );
}

export default HomeContentPage;
