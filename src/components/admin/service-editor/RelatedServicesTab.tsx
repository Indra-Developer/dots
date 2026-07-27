import {
  ArrowDown,
  ArrowUp,
  Check,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { NavigationService } from "../../../types/navigationServices";

interface RelatedServicesTabProps {
  currentServiceId: string;
  services: NavigationService[];
  selectedIds: string[];
  onChange: (serviceIds: string[]) => void;
}

function moveItem(
  items: string[],
  index: number,
  direction: -1 | 1,
): string[] {
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

function RelatedServicesTab({
  currentServiceId,
  services,
  selectedIds,
  onChange,
}: RelatedServicesTabProps) {
  const [search, setSearch] = useState("");

  const availableServices = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return services
      .filter((service) => service.id !== currentServiceId)
      .filter((service) => {
        if (!normalizedSearch) {
          return true;
        }

        return [
          service.name,
          service.categoryName,
          service.slug,
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(normalizedSearch),
        );
      });
  }, [currentServiceId, search, services]);

  const serviceMap = useMemo(
    () => new Map(services.map((service) => [service.id, service])),
    [services],
  );

  function toggleService(serviceId: string): void {
    if (selectedIds.includes(serviceId)) {
      onChange(selectedIds.filter((id) => id !== serviceId));
      return;
    }

    onChange([...selectedIds, serviceId]);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Select Related Services
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            These services appear below the current public Service Details Page.
          </p>
        </div>

        <label className="relative mt-5 block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="Search services by name, category or slug"
          />
        </label>

        {availableServices.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500">
            No matching services are available.
          </div>
        ) : (
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {availableServices.map((service) => {
              const selected = selectedIds.includes(service.id);

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => toggleService(service.id)}
                  className={[
                    "flex min-h-[92px] items-start gap-3 rounded-xl border p-4 text-left transition",
                    selected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                      selected
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 bg-white text-transparent",
                    ].join(" ")}
                  >
                    <Check className="h-4 w-4" />
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-800">
                      {service.name}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {service.categoryName || "Uncategorised"}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-400">
                      /service/{service.slug}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Selected Order
          </h2>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            The public section displays the first four related services in this
            order.
          </p>
        </div>

        {selectedIds.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No related services selected.
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {selectedIds.map((serviceId, index) => {
              const service = serviceMap.get(serviceId);

              if (!service) {
                return null;
              }

              return (
                <article
                  key={serviceId}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {service.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {service.categoryName}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        onChange(moveItem(selectedIds, index, -1))
                      }
                      disabled={index === 0}
                      className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 disabled:opacity-25"
                      aria-label={`Move ${service.name} up`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChange(moveItem(selectedIds, index, 1))
                      }
                      disabled={index === selectedIds.length - 1}
                      className="rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 disabled:opacity-25"
                      aria-label={`Move ${service.name} down`}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        onChange(
                          selectedIds.filter((id) => id !== serviceId),
                        )
                      }
                      className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50"
                      aria-label={`Remove ${service.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

export default RelatedServicesTab;
