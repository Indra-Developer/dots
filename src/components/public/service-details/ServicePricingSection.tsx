import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PublicIcon from "../PublicIcon";
import PublicSvgIcon from "../PublicSvgIcon";
import type {
  ServicePricingPackage,
  ServicePricingTab,
} from "../../../types/serviceEditor";

interface ServicePricingSectionProps {
  pricingTabs: ServicePricingTab[];
  selectedPackageId: string;
  onPackageSelect: (
    pricingPackage: ServicePricingPackage,
    pricingTab: ServicePricingTab,
  ) => void;
}

function formatPrice(
  pricingPackage: ServicePricingPackage,
  pricingTab: ServicePricingTab,
): string {
  const price = pricingPackage.price.trim();

  if (pricingTab.type === "custom" || !price) {
    return "Custom Quote";
  }

  const numericPrice = Number(price.replace(/[^0-9.]/g, ""));

  if (!Number.isNaN(numericPrice) && numericPrice >= 0) {
    return `₹${numericPrice.toLocaleString("en-IN")}`;
  }

  return price;
}

function ServicePricingSection({
  pricingTabs,
  selectedPackageId,
  onPackageSelect,
}: ServicePricingSectionProps) {
  const validTabs = useMemo(
    () => pricingTabs.filter((tab) => tab.packages.length > 0),
    [pricingTabs],
  );
  const [activeTabId, setActiveTabId] = useState(
    validTabs[0]?.id || "",
  );

  useEffect(() => {
    if (
      activeTabId &&
      validTabs.some((tab) => tab.id === activeTabId)
    ) {
      return;
    }

    setActiveTabId(validTabs[0]?.id || "");
  }, [activeTabId, validTabs]);

  if (validTabs.length === 0) {
    return null;
  }

  const activeTab =
    validTabs.find((tab) => tab.id === activeTabId) || validTabs[0];

  function changePricingTab(nextTab: ServicePricingTab): void {
    setActiveTabId(nextTab.id);

    const preferredPackage =
      nextTab.packages.find((item) => item.recommended) ||
      nextTab.packages[0];

    if (preferredPackage) {
      onPackageSelect(preferredPackage, nextTab);
    }
  }

  function selectPackage(
    pricingPackage: ServicePricingPackage,
  ): void {
    onPackageSelect(pricingPackage, activeTab);
    document
      .getElementById("quotation")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="pricing" className="bg-[#f7f9fc]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#101a33] sm:text-4xl">
            Choose the package that fits your needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Final pricing may change based on document readiness,
            government charges and additional requirements.
          </p>
        </div>

        {validTabs.length > 1 && (
          <div className="mt-9 flex justify-center">
            <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              {validTabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => changePricingTab(tab)}
                  className={[
                    "h-10 shrink-0 rounded-lg px-5 text-sm font-bold transition",
                    activeTab.id === tab.id
                      ? "bg-[#101a33] text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          {activeTab.packages.map((pricingPackage) => {
            const selected = selectedPackageId === pricingPackage.id;

            return (
              <article
                key={pricingPackage.id}
                className={[
                  "relative flex h-full flex-col rounded-2xl border bg-white p-6 transition",
                  pricingPackage.recommended
                    ? "border-blue-500 shadow-[0_18px_45px_rgba(37,99,235,0.14)]"
                    : selected
                      ? "border-slate-500 shadow-[0_16px_36px_rgba(15,23,42,0.10)]"
                      : "border-slate-200 shadow-sm hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]",
                ].join(" ")}
              >
                {pricingPackage.recommended && (
                  <span className="absolute right-5 top-0 -translate-y-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                    Recommended
                  </span>
                )}

                <h3 className="text-xl font-bold text-slate-900">
                  {pricingPackage.name}
                </h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
                  {pricingPackage.description}
                </p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-3xl font-bold tracking-[-0.03em] text-[#101a33]">
                    {formatPrice(pricingPackage, activeTab)}
                  </span>
                  {pricingPackage.priceSuffix && (
                    <span className="pb-1 text-sm text-slate-500">
                      {pricingPackage.priceSuffix}
                    </span>
                  )}
                </div>

                {pricingPackage.feeNote && (
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {pricingPackage.feeNote}
                  </p>
                )}

                <ul className="mt-7 grid flex-1 gap-3">
                  {pricingPackage.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                        <PublicIcon
                          name="BadgeCheck"
                          className="h-3.5 w-3.5"
                        />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => selectPackage(pricingPackage)}
                  className={[
                    "mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition",
                    pricingPackage.recommended || selected
                      ? "bg-[#101a33] text-white shadow-lg hover:bg-blue-700"
                      : "border border-slate-300 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
                  ].join(" ")}
                >
                  Get Quotation
                  <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicePricingSection;
