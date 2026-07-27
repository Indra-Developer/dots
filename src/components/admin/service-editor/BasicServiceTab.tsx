import { IndianRupee } from "lucide-react";

import {
  resolveServiceIcon,
  serviceIconOptions,
} from "../../../constants/serviceEditor";
import type { ServiceEditorErrors, ServiceEditorForm } from "../../../types/serviceEditor";
import type { NavigationCategory } from "../../../types/navigationServices";

interface BasicServiceTabProps {
  form: ServiceEditorForm;
  categories: NavigationCategory[];
  errors: ServiceEditorErrors;
  onChange: <K extends keyof ServiceEditorForm>(
    field: K,
    value: ServiceEditorForm[K],
  ) => void;
}

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function ErrorText({ message }: { message?: string }) {
  return message ? (
    <p className="mt-1.5 text-xs text-red-600">{message}</p>
  ) : null;
}

function BasicServiceTab({
  form,
  categories,
  errors,
  onChange,
}: BasicServiceTabProps) {
  const SelectedIcon = resolveServiceIcon(form.iconName);

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Enter the main information displayed in navigation and at the top of
          the public service page.
        </p>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Service Name <span className="text-red-500">*</span>
          </span>
          <input
            value={form.name}
            onChange={(event) => onChange("name", event.target.value)}
            className={inputClass}
            placeholder="GST Registration"
          />
          <ErrorText message={errors.name} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Slug <span className="text-red-500">*</span>
          </span>
          <input
            value={form.slug}
            onChange={(event) => onChange("slug", event.target.value)}
            className={inputClass}
            placeholder="gst-registration"
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Public URL: /service/{form.slug || "service-slug"}
          </p>
          <ErrorText message={errors.slug} />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Category <span className="text-red-500">*</span>
          </span>
          <select
            value={form.categoryId}
            onChange={(event) => onChange("categoryId", event.target.value)}
            className={inputClass}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <ErrorText message={errors.categoryId} />
        </label>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <div>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Service Icon
          </span>
          <div className="flex gap-3">
            <div className="flex h-[86px] w-[86px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-blue-50 text-blue-600">
              <SelectedIcon className="h-10 w-10" strokeWidth={1.7} />
            </div>
            <label className="min-w-0 flex-1">
              <span className="sr-only">Choose service icon</span>
              <select
                value={form.iconName}
                onChange={(event) => onChange("iconName", event.target.value)}
                className={inputClass}
              >
                {serviceIconOptions.map((option) => (
                  <option key={option.name} value={option.name}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                Simple monochrome line icons are used throughout the website.
              </p>
            </label>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Short Description <span className="text-red-500">*</span>
          </span>
          <textarea
            value={form.shortDescription}
            onChange={(event) =>
              onChange("shortDescription", event.target.value)
            }
            rows={4}
            maxLength={180}
            className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Explain the service clearly in one or two short sentences."
          />
          <div className="mt-1.5 flex justify-between gap-3 text-xs">
            <ErrorText message={errors.shortDescription} />
            <span className="ml-auto text-slate-400">
              {form.shortDescription.length}/180
            </span>
          </div>
        </label>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Starting Price
          </span>
          <div className="flex h-11 items-center rounded-lg border border-slate-300 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <span className="flex h-full w-11 items-center justify-center border-r border-slate-200 text-slate-500">
              <IndianRupee className="h-4 w-4" />
            </span>
            <input
              value={form.startingPrice}
              onChange={(event) =>
                onChange("startingPrice", event.target.value)
              }
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
              placeholder="999"
              inputMode="decimal"
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            Leave empty for price on request.
          </p>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Expected Duration
          </span>
          <input
            value={form.duration}
            onChange={(event) => onChange("duration", event.target.value)}
            className={inputClass}
            placeholder="3–5 Working Days"
          />
        </label>

        <div>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Active Status
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={form.active}
            onClick={() => onChange("active", !form.active)}
            className="flex h-11 w-full items-center justify-between rounded-lg border border-slate-300 bg-white px-3"
          >
            <span className="text-sm text-slate-700">
              {form.active ? "Active" : "Inactive"}
            </span>
            <span
              className={[
                "relative h-6 w-11 rounded-full transition",
                form.active ? "bg-blue-600" : "bg-slate-300",
              ].join(" ")}
            >
              <span
                className={[
                  "absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform",
                  form.active ? "translate-x-[22px]" : "translate-x-[3px]",
                ].join(" ")}
              />
            </span>
          </button>
          <p className="mt-1.5 text-xs text-slate-400">
            Inactive services are hidden from the public website.
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-700">
        Detailed About, document, process, pricing and related-service content
        is managed in the next tabs.
      </div>
    </section>
  );
}

export default BasicServiceTab;
