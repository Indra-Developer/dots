import { useMemo, useState } from "react";
import { Link } from "react-router";

import type { PublicService } from "../../types/publicContent";
import PublicIcon from "./PublicIcon";
import PublicSvgIcon from "./PublicSvgIcon";

interface PublicSearchDialogProps {
  open: boolean;
  services: PublicService[];
  onClose: () => void;
}

function PublicSearchDialog({
  open,
  services,
  onClose,
}: PublicSearchDialogProps) {
  const [searchText, setSearchText] = useState("");

  const filteredServices = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();

    if (!normalizedSearch) {
      return services.slice(0, 8);
    }

    return services
      .filter((service) =>
        [
          service.name,
          service.categoryName,
          service.shortDescription,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch),
      )
      .slice(0, 12);
  }, [searchText, services]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center bg-slate-950/45 px-4 pt-[8vh] backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Search DOTS services"
    >
      <button
        type="button"
        aria-label="Close service search"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <section className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.24)]">
        <header className="flex items-center gap-3 border-b border-slate-200 p-4 sm:p-5">
          <PublicSvgIcon name="Search" className="h-5 w-5 shrink-0 text-blue-600" />

          <input
            autoFocus
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search registrations, tax, accounting..."
            className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <PublicSvgIcon name="X" className="h-5 w-5" />
          </button>
        </header>

        <div className="max-h-[62vh] overflow-y-auto p-3 sm:p-4">
          {filteredServices.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <PublicSvgIcon name="Search" className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-4 font-semibold text-slate-800">
                No matching service found
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Try another service name or category.
              </p>
            </div>
          ) : (
            <div className="grid gap-2">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  to={`/service/${service.slug}`}
                  onClick={onClose}
                  className="group flex items-center gap-4 rounded-xl border border-transparent px-4 py-3 transition hover:border-blue-100 hover:bg-blue-50/60"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <PublicIcon name={service.iconName} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-slate-900">
                      {service.name}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-slate-500">
                      {service.categoryName}
                    </span>
                  </span>

                  <PublicSvgIcon name="ArrowRight" className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default PublicSearchDialog;
