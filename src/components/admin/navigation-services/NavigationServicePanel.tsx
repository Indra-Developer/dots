import {
  ArrowDown,
  ArrowUp,
  FileText,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import type {
  NavigationCategory,
  NavigationService,
} from "../../../types/navigationServices";

interface NavigationServicePanelProps {
  category: NavigationCategory | null;
  services: NavigationService[];
  togglingId: string;
  reordering: boolean;
  draggedId: string;
  onAdd: () => void;
  onEdit: (service: NavigationService) => void;
  onOpenEditor: (service: NavigationService) => void;
  onDelete: (service: NavigationService) => void;
  onToggle: (service: NavigationService, active: boolean) => void;
  onDragStart: (serviceId: string) => void;
  onDrop: (serviceId: string) => void;
  onDragEnd: () => void;
  onMove: (serviceId: string, direction: -1 | 1) => void;
}

interface ToggleSwitchProps {
  checked: boolean;
  disabled?: boolean;
  label: string;
  onChange: (nextValue: boolean) => void;
}

function ToggleSwitch({
  checked,
  disabled = false,
  label,
  onChange,
}: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full",
        "transition-colors duration-200 focus:outline-none focus:ring-2",
        "focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-55",
        checked ? "bg-[#1266f1]" : "bg-slate-300",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm",
          "transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-[3px]",
        ].join(" ")}
      />
    </button>
  );
}

function StatusBadge({
  status,
}: {
  status: NavigationService["status"];
}) {
  const published = status === "published";

  return (
    <span
      className={[
        "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
        published
          ? "bg-emerald-50 text-emerald-700"
          : "bg-amber-50 text-amber-700",
      ].join(" ")}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

function NavigationServicePanel({
  category,
  services,
  togglingId,
  reordering,
  draggedId,
  onAdd,
  onEdit,
  onOpenEditor,
  onDelete,
  onToggle,
  onDragStart,
  onDrop,
  onDragEnd,
  onMove,
}: NavigationServicePanelProps) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-slate-900">
            Services in:{" "}
            <span className="text-[#1266f1]">
              {category?.name || "Select a category"}
            </span>
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Manage services under the selected category.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={!category}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </header>

      {!category ? (
        <div className="flex min-h-[330px] flex-col items-center justify-center px-8 py-12 text-center">
          <FileText className="h-12 w-12 text-slate-300" strokeWidth={1.6} />
          <p className="mt-4 font-semibold text-slate-800">Select a category</p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Choose a navigation category to view and manage its services.
          </p>
        </div>
      ) : services.length === 0 ? (
        <div className="flex min-h-[330px] flex-col items-center justify-center px-8 py-12 text-center">
          <FileText className="h-12 w-12 text-slate-300" strokeWidth={1.6} />
          <p className="mt-4 font-semibold text-slate-800">
            No services in {category.name}
          </p>
          <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
            Add the first service for this category. You can complete its content later in Service Editor.
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-5 inline-flex h-11 items-center gap-2 rounded-lg bg-[#1266f1] px-5 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      ) : (
        <>
          <div className="hidden min-w-0 overflow-x-auto md:block">
            <div className="min-w-[700px]">
              <div className="grid grid-cols-[54px_minmax(150px,1.15fr)_minmax(120px,0.9fr)_74px_76px_88px] items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-500">
                <span className="text-center">#</span>
                <span>Service Name</span>
                <span>Slug</span>
                <span className="text-center">Order</span>
                <span className="text-center">Status</span>
                <span className="text-center">Actions</span>
              </div>

              <div className="divide-y divide-slate-100">
                {services.map((service, index) => {
                  const isDragging = draggedId === service.id;

                  return (
                    <div
                      key={service.id}
                      draggable={!reordering}
                      onDragStart={() => onDragStart(service.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => onDrop(service.id)}
                      onDragEnd={onDragEnd}
                      className={[
                        "grid grid-cols-[54px_minmax(150px,1.15fr)_minmax(120px,0.9fr)_74px_76px_88px]",
                        "items-center gap-2 px-4 py-3 transition-colors hover:bg-slate-50/80",
                        isDragging ? "opacity-45" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-center gap-1 text-slate-400">
                        <button
                          type="button"
                          aria-label={`Drag ${service.name}`}
                          className="cursor-grab rounded p-1 transition hover:bg-white hover:text-slate-600 active:cursor-grabbing"
                        >
                          <GripVertical className="h-4 w-4" />
                        </button>
                        <span className="w-5 text-center text-xs font-medium text-slate-600">
                          {index + 1}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex min-w-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onOpenEditor(service)}
                            className="truncate text-left text-sm font-semibold text-slate-800 transition hover:text-blue-600"
                            title="Open full Service Editor"
                          >
                            {service.name}
                          </button>
                          <StatusBadge status={service.status} />
                        </div>
                        {service.shortDescription && (
                          <p className="mt-1 truncate text-xs text-slate-500">
                            {service.shortDescription}
                          </p>
                        )}
                      </div>

                      <span className="truncate text-xs text-slate-500" title={service.slug}>
                        {service.slug}
                      </span>

                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onMove(service.id, -1)}
                          disabled={index === 0 || reordering}
                          aria-label={`Move ${service.name} up`}
                          className="rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <span className="flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700">
                          {service.displayOrder}
                        </span>
                        <button
                          type="button"
                          onClick={() => onMove(service.id, 1)}
                          disabled={index === services.length - 1 || reordering}
                          aria-label={`Move ${service.name} down`}
                          className="rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex justify-center">
                        <ToggleSwitch
                          checked={service.active}
                          disabled={togglingId === service.id}
                          label={`Set ${service.name} active`}
                          onChange={(active) => onToggle(service, active)}
                        />
                      </div>

                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(service)}
                          aria-label={`Edit ${service.name}`}
                          title="Edit service"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 transition hover:bg-blue-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(service)}
                          aria-label={`Delete ${service.name}`}
                          title="Delete service"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-white text-red-500 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {services.map((service, index) => (
              <article key={service.id} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FileText className="h-5 w-5" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onOpenEditor(service)}
                          className="block max-w-full truncate text-left font-semibold text-slate-800 transition hover:text-blue-600"
                          title="Open full Service Editor"
                        >
                          {service.name}
                        </button>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          /service/{service.slug}
                        </p>
                      </div>
                      <StatusBadge status={service.status} />
                    </div>

                    {service.shortDescription && (
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {service.shortDescription}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <ToggleSwitch
                        checked={service.active}
                        disabled={togglingId === service.id}
                        label={`Set ${service.name} active`}
                        onChange={(active) => onToggle(service, active)}
                      />

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onMove(service.id, -1)}
                          disabled={index === 0 || reordering}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-25"
                          aria-label={`Move ${service.name} up`}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onMove(service.id, 1)}
                          disabled={index === services.length - 1 || reordering}
                          className="rounded-lg border border-slate-200 p-2 text-slate-500 disabled:opacity-25"
                          aria-label={`Move ${service.name} down`}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(service)}
                          className="rounded-lg border border-blue-200 p-2 text-blue-600"
                          aria-label={`Edit ${service.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(service)}
                          className="rounded-lg border border-red-200 p-2 text-red-500"
                          aria-label={`Delete ${service.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      <footer className="mt-auto flex items-center gap-2 border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
        <GripVertical className="h-4 w-4 shrink-0" />
        <span>Drag services or use the arrow buttons to change display order.</span>
      </footer>
    </section>
  );
}

export default NavigationServicePanel;
