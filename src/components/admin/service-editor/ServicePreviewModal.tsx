import { CheckCircle2, X } from "lucide-react";

import { resolveServiceIcon } from "../../../constants/serviceEditor";
import type { ServiceEditorForm } from "../../../types/serviceEditor";

interface ServicePreviewModalProps {
  open: boolean;
  form: ServiceEditorForm;
  onClose: () => void;
}

function ServicePreviewModal({
  open,
  form,
  onClose,
}: ServicePreviewModalProps) {
  if (!open) {
    return null;
  }

  const Icon = resolveServiceIcon(form.iconName);
  const firstPricingTab = form.pricingTabs[0];

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-4">
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0"
      />

      <section className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Service Preview</h2>
            <p className="mt-1 text-xs text-slate-500">
              Preview only. Nothing is published until you confirm.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="p-5 sm:p-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Icon className="h-8 w-8" strokeWidth={1.7} />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              {form.categoryName || "Service"}
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">
              {form.name || "Service Name"}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {form.shortDescription || "No short description has been added."}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm">
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">
                {form.startingPrice
                  ? `Starting ₹${form.startingPrice}`
                  : "Price on request"}
              </span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">
                {form.duration || "Duration not specified"}
              </span>
              <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-semibold text-slate-700">
                Online support
              </span>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900">
                About this service
              </h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                {form.about.whatIsService || "About content has not been added."}
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-5">
              <h3 className="text-lg font-bold text-slate-900">Main benefits</h3>
              {form.about.benefits.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">
                  No benefits have been added.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {form.about.benefits.map((benefit) => (
                    <div key={benefit.id} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-semibold text-slate-800">
                          {benefit.title || "Benefit"}
                        </p>
                        {benefit.description && (
                          <p className="mt-1 text-sm leading-6 text-slate-500">
                            {benefit.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">
              Required documents
            </h3>
            {form.documentGroups.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No document groups have been added.
              </p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {form.documentGroups.map((group) => (
                  <div key={group.id} className="rounded-lg bg-slate-50 p-4">
                    <p className="font-semibold text-slate-800">
                      {group.title}
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                      {group.items.filter(Boolean).map((item) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-emerald-600">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Service process</h3>
            {form.processSteps.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No process steps have been added.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {form.processSteps.map((step, index) => (
                  <div key={step.id} className="rounded-lg bg-slate-50 p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="mt-3 font-semibold text-slate-800">
                      {step.heading}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 p-5">
            <h3 className="text-lg font-bold text-slate-900">Pricing</h3>
            {!firstPricingTab || firstPricingTab.packages.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">
                No pricing packages have been added.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {firstPricingTab.packages.map((pricingPackage) => (
                  <article
                    key={pricingPackage.id}
                    className={[
                      "rounded-xl border p-5",
                      pricingPackage.recommended
                        ? "border-blue-500"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    <p className="font-bold text-slate-900">
                      {pricingPackage.name}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      {pricingPackage.description}
                    </p>
                    <p className="mt-5 text-2xl font-bold text-slate-950">
                      {pricingPackage.price
                        ? `₹${pricingPackage.price}`
                        : "Custom"}
                      {pricingPackage.priceSuffix && (
                        <span className="ml-1 text-sm font-medium text-slate-500">
                          {pricingPackage.priceSuffix}
                        </span>
                      )}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ServicePreviewModal;
