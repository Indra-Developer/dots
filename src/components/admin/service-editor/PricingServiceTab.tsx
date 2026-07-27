import {
  ArrowDown,
  ArrowUp,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

import {
  createEmptyPricingPackage,
  createEmptyPricingTab,
  pricingTypeOptions,
} from "../../../constants/serviceEditor";
import type {
  ServicePricingPackage,
  ServicePricingTab,
} from "../../../types/serviceEditor";

interface PricingServiceTabProps {
  pricingTabs: ServicePricingTab[];
  onChange: (tabs: ServicePricingTab[]) => void;
}

const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const textareaClass =
  "w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function moveItem<T>(items: T[], index: number, direction: -1 | 1): T[] {
  const targetIndex = index + direction;

  if (targetIndex < 0 || targetIndex >= items.length) {
    return items;
  }

  const nextItems = [...items];
  [nextItems[index], nextItems[targetIndex]] = [
    nextItems[targetIndex],
    nextItems[index],
  ];
  return nextItems;
}

function PricingServiceTab({
  pricingTabs,
  onChange,
}: PricingServiceTabProps) {
  function updateTab<K extends keyof ServicePricingTab>(
    tabId: string,
    field: K,
    value: ServicePricingTab[K],
  ): void {
    onChange(
      pricingTabs.map((tab) =>
        tab.id === tabId ? { ...tab, [field]: value } : tab,
      ),
    );
  }

  function updatePackage<K extends keyof ServicePricingPackage>(
    tabId: string,
    packageId: string,
    field: K,
    value: ServicePricingPackage[K],
  ): void {
    onChange(
      pricingTabs.map((tab) => {
        if (tab.id !== tabId) {
          return tab;
        }

        return {
          ...tab,
          packages: tab.packages.map((pricingPackage) => {
            if (pricingPackage.id !== packageId) {
              return pricingPackage;
            }

            if (field === "recommended" && value === true) {
              return { ...pricingPackage, recommended: true };
            }

            return { ...pricingPackage, [field]: value };
          }).map((pricingPackage) =>
            field === "recommended" && value === true
              ? {
                  ...pricingPackage,
                  recommended: pricingPackage.id === packageId,
                }
              : pricingPackage,
          ),
        };
      }),
    );
  }

  function addFeature(tabId: string, packageId: string): void {
    onChange(
      pricingTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              packages: tab.packages.map((pricingPackage) =>
                pricingPackage.id === packageId
                  ? {
                      ...pricingPackage,
                      features: [...pricingPackage.features, ""],
                    }
                  : pricingPackage,
              ),
            }
          : tab,
      ),
    );
  }

  function updateFeature(
    tabId: string,
    packageId: string,
    featureIndex: number,
    value: string,
  ): void {
    onChange(
      pricingTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              packages: tab.packages.map((pricingPackage) =>
                pricingPackage.id === packageId
                  ? {
                      ...pricingPackage,
                      features: pricingPackage.features.map(
                        (feature, index) =>
                          index === featureIndex ? value : feature,
                      ),
                    }
                  : pricingPackage,
              ),
            }
          : tab,
      ),
    );
  }

  function removeFeature(
    tabId: string,
    packageId: string,
    featureIndex: number,
  ): void {
    onChange(
      pricingTabs.map((tab) =>
        tab.id === tabId
          ? {
              ...tab,
              packages: tab.packages.map((pricingPackage) =>
                pricingPackage.id === packageId
                  ? {
                      ...pricingPackage,
                      features: pricingPackage.features.filter(
                        (_, index) => index !== featureIndex,
                      ),
                    }
                  : pricingPackage,
              ),
            }
          : tab,
      ),
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Dynamic Pricing</h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Create pricing tabs and equal-height packages for one-time,
            recurring or custom services.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onChange([
              ...pricingTabs,
              createEmptyPricingTab(pricingTabs.length + 1),
            ])
          }
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Pricing Tab
        </button>
      </div>

      {pricingTabs.length === 0 ? (
        <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
          No pricing added. Add a pricing tab such as One-time, Monthly or
          Yearly.
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          {pricingTabs.map((tab, tabIndex) => (
            <article
              key={tab.id}
              className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 sm:p-5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Tab Label
                    </span>
                    <input
                      value={tab.label}
                      onChange={(event) =>
                        updateTab(tab.id, "label", event.target.value)
                      }
                      className={inputClass}
                      placeholder="Monthly"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Pricing Type
                    </span>
                    <select
                      value={tab.type}
                      onChange={(event) =>
                        updateTab(
                          tab.id,
                          "type",
                          event.target.value as ServicePricingTab["type"],
                        )
                      }
                      className={inputClass}
                    >
                      {pricingTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onChange(moveItem(pricingTabs, tabIndex, -1))}
                    disabled={tabIndex === 0}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 disabled:opacity-25"
                    aria-label={`Move ${tab.label} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(moveItem(pricingTabs, tabIndex, 1))}
                    disabled={tabIndex === pricingTabs.length - 1}
                    className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 disabled:opacity-25"
                    aria-label={`Move ${tab.label} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onChange(pricingTabs.filter((item) => item.id !== tab.id))
                    }
                    className="rounded-lg border border-red-200 bg-white p-2 text-red-500 transition hover:bg-red-50"
                    aria-label={`Delete ${tab.label}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    Packages
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Add Basic, Standard, Complete or any custom packages.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateTab(tab.id, "packages", [
                      ...tab.packages,
                      createEmptyPricingPackage(tab.packages.length + 1),
                    ])
                  }
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-600 transition hover:bg-blue-50"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Package
                </button>
              </div>

              {tab.packages.length === 0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-7 text-center text-sm text-slate-500">
                  No packages in this pricing tab.
                </div>
              ) : (
                <div className="mt-4 grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
                  {tab.packages.map((pricingPackage, packageIndex) => (
                    <section
                      key={pricingPackage.id}
                      className={[
                        "flex min-w-0 flex-col rounded-xl border bg-white p-4",
                        pricingPackage.recommended
                          ? "border-blue-500 ring-2 ring-blue-100"
                          : "border-slate-200",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-bold text-slate-800">
                          Package {packageIndex + 1}
                        </p>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              updatePackage(
                                tab.id,
                                pricingPackage.id,
                                "recommended",
                                !pricingPackage.recommended,
                              )
                            }
                            className={[
                              "rounded-lg border p-2 transition",
                              pricingPackage.recommended
                                ? "border-blue-200 bg-blue-50 text-blue-600"
                                : "border-slate-200 text-slate-400 hover:bg-slate-50",
                            ].join(" ")}
                            aria-label="Toggle recommended package"
                            title="Recommended package"
                          >
                            <Star
                              className="h-4 w-4"
                              fill={
                                pricingPackage.recommended
                                  ? "currentColor"
                                  : "none"
                              }
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              updateTab(
                                tab.id,
                                "packages",
                                tab.packages.filter(
                                  (item) => item.id !== pricingPackage.id,
                                ),
                              )
                            }
                            className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                            aria-label={`Delete ${pricingPackage.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 space-y-4">
                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold text-slate-600">
                            Package Name
                          </span>
                          <input
                            value={pricingPackage.name}
                            onChange={(event) =>
                              updatePackage(
                                tab.id,
                                pricingPackage.id,
                                "name",
                                event.target.value,
                              )
                            }
                            className={inputClass}
                            placeholder="Standard"
                          />
                        </label>

                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold text-slate-600">
                            Short Description
                          </span>
                          <textarea
                            value={pricingPackage.description}
                            onChange={(event) =>
                              updatePackage(
                                tab.id,
                                pricingPackage.id,
                                "description",
                                event.target.value,
                              )
                            }
                            rows={3}
                            className={textareaClass}
                            placeholder="Perfect for growing businesses."
                          />
                        </label>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold text-slate-600">
                              Price
                            </span>
                            <input
                              value={pricingPackage.price}
                              onChange={(event) =>
                                updatePackage(
                                  tab.id,
                                  pricingPackage.id,
                                  "price",
                                  event.target.value,
                                )
                              }
                              className={inputClass}
                              placeholder="1499"
                              inputMode="decimal"
                            />
                          </label>

                          <label className="block">
                            <span className="mb-2 block text-xs font-semibold text-slate-600">
                              Price Suffix
                            </span>
                            <input
                              value={pricingPackage.priceSuffix}
                              onChange={(event) =>
                                updatePackage(
                                  tab.id,
                                  pricingPackage.id,
                                  "priceSuffix",
                                  event.target.value,
                                )
                              }
                              className={inputClass}
                              placeholder="/month"
                            />
                          </label>
                        </div>

                        <label className="block">
                          <span className="mb-2 block text-xs font-semibold text-slate-600">
                            GST / Government-fee Note
                          </span>
                          <textarea
                            value={pricingPackage.feeNote}
                            onChange={(event) =>
                              updatePackage(
                                tab.id,
                                pricingPackage.id,
                                "feeNote",
                                event.target.value,
                              )
                            }
                            rows={2}
                            className={textareaClass}
                            placeholder="Government fees are extra as applicable."
                          />
                        </label>
                      </div>

                      <div className="mt-5 border-t border-slate-200 pt-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-bold text-slate-700">
                            Included Features
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              addFeature(tab.id, pricingPackage.id)
                            }
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add Feature
                          </button>
                        </div>

                        <div className="mt-3 space-y-2">
                          {pricingPackage.features.length === 0 && (
                            <p className="text-xs text-slate-400">
                              No features added.
                            </p>
                          )}
                          {pricingPackage.features.map(
                            (feature, featureIndex) => (
                              <div
                                key={`${pricingPackage.id}-${featureIndex}`}
                                className="flex gap-2"
                              >
                                <input
                                  value={feature}
                                  onChange={(event) =>
                                    updateFeature(
                                      tab.id,
                                      pricingPackage.id,
                                      featureIndex,
                                      event.target.value,
                                    )
                                  }
                                  className={inputClass}
                                  placeholder="Document preparation"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeFeature(
                                      tab.id,
                                      pricingPackage.id,
                                      featureIndex,
                                    )
                                  }
                                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-red-200 text-red-500 transition hover:bg-red-50"
                                  aria-label="Remove feature"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default PricingServiceTab;
