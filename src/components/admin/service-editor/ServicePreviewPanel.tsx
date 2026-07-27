import {
  CalendarClock,
  ExternalLink,
  Layers3,
  ShieldCheck,
} from "lucide-react";

import { resolveServiceIcon } from "../../../constants/serviceEditor";
import type { ServiceEditorForm } from "../../../types/serviceEditor";

interface ServicePreviewPanelProps {
  form: ServiceEditorForm;
  onOpenPreview: () => void;
}

function ServicePreviewPanel({
  form,
  onOpenPreview,
}: ServicePreviewPanelProps) {
  const Icon = resolveServiceIcon(form.iconName);

  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <h3 className="font-bold text-slate-900">Service Preview</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          This is how the service summary will appear on the website.
        </p>
      </div>

      <div className="mt-5 rounded-xl border border-slate-200 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>

        <h4 className="mt-4 text-xl font-bold text-slate-900">
          {form.name || "Service Name"}
        </h4>

        <span className="mt-3 inline-flex rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {form.startingPrice
            ? `Starting from ₹${form.startingPrice}`
            : "Price on request"}
        </span>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {form.shortDescription ||
            "Add a short description to explain this service."}
        </p>

        <dl className="mt-5 space-y-4 border-t border-slate-200 pt-5 text-sm">
          <div className="flex gap-3">
            <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <div>
              <dt className="font-semibold text-slate-700">Duration</dt>
              <dd className="mt-1 text-slate-500">
                {form.duration || "Not specified"}
              </dd>
            </div>
          </div>

          <div className="flex gap-3">
            <Layers3 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <div>
              <dt className="font-semibold text-slate-700">Category</dt>
              <dd className="mt-1 text-slate-500">
                {form.categoryName || "Not selected"}
              </dd>
            </div>
          </div>

          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <div>
              <dt className="font-semibold text-slate-700">Status</dt>
              <dd className="mt-1">
                <span
                  className={[
                    "inline-flex rounded-md px-2.5 py-1 text-xs font-semibold",
                    form.status === "published"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  {form.status === "published" ? "Published" : "Draft"}
                </span>
              </dd>
            </div>
          </div>
        </dl>

        <button
          type="button"
          onClick={onOpenPreview}
          className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View Full Preview
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}

export default ServicePreviewPanel;
