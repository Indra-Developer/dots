import {
  ExternalLink,
  LoaderCircle,
  X,
} from "lucide-react";

import {
  categoryIconOptions,
} from "../../../constants/navigationServices";
import type {
  CategoryFormState,
  NavigationCategory,
  NavigationDrawerMode,
  ServiceFormState,
} from "../../../types/navigationServices";

interface NavigationItemDrawerProps {
  open: boolean;
  mode: NavigationDrawerMode;
  editing: boolean;
  categoryForm: CategoryFormState;
  serviceForm: ServiceFormState;
  categories: NavigationCategory[];
  errors: Record<string, string>;
  saving: boolean;
  onClose: () => void;
  onCategoryFieldChange: <K extends keyof CategoryFormState>(
    field: K,
    value: CategoryFormState[K],
  ) => void;
  onServiceFieldChange: <K extends keyof ServiceFormState>(
    field: K,
    value: ServiceFormState[K],
  ) => void;
  onSubmit: () => void;
  onOpenFullEditor: () => void;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-xs text-red-500">{message}</p>;
}

function NavigationItemDrawer({
  open,
  mode,
  editing,
  categoryForm,
  serviceForm,
  categories,
  errors,
  saving,
  onClose,
  onCategoryFieldChange,
  onServiceFieldChange,
  onSubmit,
  onOpenFullEditor,
}: NavigationItemDrawerProps) {
  if (!open) {
    return null;
  }

  const isCategory = mode === "category";
  const title = editing
    ? `Edit ${isCategory ? "Category" : "Service"}`
    : `Add ${isCategory ? "Category" : "Service"}`;

  return (
    <>
      <button
        type="button"
        aria-label="Close form drawer"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/35"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="navigation-drawer-title"
        className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-[470px] flex-col border-l border-slate-200 bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-5 sm:px-6">
          <div>
            <h2
              id="navigation-drawer-title"
              className="text-xl font-bold text-slate-900"
            >
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {isCategory
                ? "Manage a website navigation category."
                : "Add the basic service information. Detailed content is managed in Service Editor."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close drawer"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-6">
          {isCategory ? (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="category-name"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={categoryForm.name}
                  onChange={(event) =>
                    onCategoryFieldChange("name", event.target.value)
                  }
                  placeholder="Example: Registrations"
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <FieldError message={errors.name} />
              </div>

              <div>
                <label
                  htmlFor="category-slug"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-slug"
                  type="text"
                  value={categoryForm.slug}
                  onChange={(event) =>
                    onCategoryFieldChange("slug", event.target.value)
                  }
                  placeholder="registrations"
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Used internally for clean navigation references.
                </p>
                <FieldError message={errors.slug} />
              </div>

              <div>
                <label
                  htmlFor="category-icon"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Icon
                </label>
                <select
                  id="category-icon"
                  value={categoryForm.iconName}
                  onChange={(event) =>
                    onCategoryFieldChange("iconName", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  {categoryIconOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="category-order"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Display Order <span className="text-red-500">*</span>
                </label>
                <input
                  id="category-order"
                  type="number"
                  min={1}
                  value={categoryForm.displayOrder}
                  onChange={(event) =>
                    onCategoryFieldChange(
                      "displayOrder",
                      Number(event.target.value),
                    )
                  }
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <FieldError message={errors.displayOrder} />
              </div>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Active Category
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Inactive categories are hidden from the public navigation.
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={categoryForm.active}
                  onChange={(event) =>
                    onCategoryFieldChange("active", event.target.checked)
                  }
                  className="h-5 w-5 accent-blue-600"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="service-category"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="service-category"
                  value={serviceForm.categoryId}
                  onChange={(event) =>
                    onServiceFieldChange("categoryId", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.categoryId} />
              </div>

              <div>
                <label
                  htmlFor="service-name"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Service Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="service-name"
                  type="text"
                  value={serviceForm.name}
                  onChange={(event) =>
                    onServiceFieldChange("name", event.target.value)
                  }
                  placeholder="Example: GST Registration"
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <FieldError message={errors.name} />
              </div>

              <div>
                <label
                  htmlFor="service-slug"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="service-slug"
                  type="text"
                  value={serviceForm.slug}
                  onChange={(event) =>
                    onServiceFieldChange("slug", event.target.value)
                  }
                  placeholder="gst-registration"
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Public URL: /service/{serviceForm.slug || "service-slug"}
                </p>
                <FieldError message={errors.slug} />
              </div>

              <div>
                <label
                  htmlFor="service-description"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Short Description
                </label>
                <textarea
                  id="service-description"
                  rows={4}
                  value={serviceForm.shortDescription}
                  onChange={(event) =>
                    onServiceFieldChange(
                      "shortDescription",
                      event.target.value,
                    )
                  }
                  placeholder="A short explanation shown in service lists."
                  className="mt-2 w-full resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="service-order"
                  className="block text-sm font-semibold text-slate-800"
                >
                  Display Order <span className="text-red-500">*</span>
                </label>
                <input
                  id="service-order"
                  type="number"
                  min={1}
                  value={serviceForm.displayOrder}
                  onChange={(event) =>
                    onServiceFieldChange(
                      "displayOrder",
                      Number(event.target.value),
                    )
                  }
                  className="mt-2 h-12 w-full rounded-lg border border-slate-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
                <FieldError message={errors.displayOrder} />
              </div>

              <label className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                <span>
                  <span className="block text-sm font-semibold text-slate-800">
                    Active Service
                  </span>
                  <span className="mt-1 block text-xs text-slate-500">
                    Publishing is handled separately inside Service Editor.
                  </span>
                </span>

                <input
                  type="checkbox"
                  checked={serviceForm.active}
                  onChange={(event) =>
                    onServiceFieldChange("active", event.target.checked)
                  }
                  className="h-5 w-5 accent-blue-600"
                />
              </label>

              {editing && (
                <button
                  type="button"
                  onClick={onOpenFullEditor}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                >
                  Open Full Service Editor
                  <ExternalLink className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <footer className="flex flex-col-reverse gap-3 border-t border-slate-200 px-5 py-5 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}
            {saving
              ? "Saving..."
              : `Save ${isCategory ? "Category" : "Service"}`}
          </button>
        </footer>
      </aside>
    </>
  );
}

export default NavigationItemDrawer;
