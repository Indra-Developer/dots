import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import { getCategoryIcon } from "../../../constants/navigationServices";
import type { NavigationCategory } from "../../../types/navigationServices";

interface NavigationCategoryPanelProps {
  categories: NavigationCategory[];
  selectedCategoryId: string;
  serviceCounts: Record<string, number>;
  togglingId: string;
  reordering: boolean;
  draggedId: string;
  onAdd: () => void;
  onSelect: (categoryId: string) => void;
  onEdit: (category: NavigationCategory) => void;
  onDelete: (category: NavigationCategory) => void;
  onToggle: (category: NavigationCategory, active: boolean) => void;
  onDragStart: (categoryId: string) => void;
  onDrop: (categoryId: string) => void;
  onDragEnd: () => void;
  onMove: (categoryId: string, direction: -1 | 1) => void;
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

function NavigationCategoryPanel({
  categories,
  selectedCategoryId,
  serviceCounts,
  togglingId,
  reordering,
  draggedId,
  onAdd,
  onSelect,
  onEdit,
  onDelete,
  onToggle,
  onDragStart,
  onDrop,
  onDragEnd,
  onMove,
}: NavigationCategoryPanelProps) {
  return (
    <section className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <header className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[17px] font-bold text-slate-900">
            Navigation Categories
          </h2>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            Create and manage main navigation categories.
          </p>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </header>

      {categories.length === 0 ? (
        <div className="flex min-h-[330px] flex-col items-center justify-center px-8 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Plus className="h-6 w-6" />
          </div>
          <p className="mt-4 font-semibold text-slate-800">
            No categories created
          </p>
          <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
            Add the first category to start organising services in the public header.
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="min-w-0 overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[54px_minmax(140px,1fr)_60px_74px_72px_84px] items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-500">
              <span className="text-center">#</span>
              <span>Category Name</span>
              <span className="text-center">Services</span>
              <span className="text-center">Order</span>
              <span className="text-center">Status</span>
              <span className="text-center">Actions</span>
            </div>

            <div className="divide-y divide-slate-100">
              {categories.map((category, index) => {
                const Icon = getCategoryIcon(category.iconName);
                const selected = category.id === selectedCategoryId;
                const isDragging = draggedId === category.id;

                return (
                  <div
                    key={category.id}
                    draggable={!reordering}
                    onDragStart={() => onDragStart(category.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => onDrop(category.id)}
                    onDragEnd={onDragEnd}
                    className={[
                      "grid grid-cols-[54px_minmax(140px,1fr)_60px_74px_72px_84px]",
                      "items-center gap-2 px-4 py-3 transition-colors",
                      selected
                        ? "bg-[#eef5ff]"
                        : "bg-white hover:bg-slate-50/80",
                      isDragging ? "opacity-45" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-center gap-1 text-slate-400">
                      <button
                        type="button"
                        aria-label={`Drag ${category.name}`}
                        className="cursor-grab rounded p-1 transition hover:bg-white hover:text-slate-600 active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4" />
                      </button>
                      <span className="w-5 text-center text-xs font-medium text-slate-600">
                        {index + 1}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onSelect(category.id)}
                      className="flex min-w-0 items-center gap-3 rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm ring-1 ring-slate-200">
                        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      </span>
                      <span className="truncate text-sm font-semibold text-slate-800">
                        {category.name}
                      </span>
                    </button>

                    <span className="text-center text-sm font-medium text-slate-600">
                      {serviceCounts[category.id] || 0}
                    </span>

                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => onMove(category.id, -1)}
                        disabled={index === 0 || reordering}
                        aria-label={`Move ${category.name} up`}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="flex h-8 min-w-8 items-center justify-center rounded-md border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-700">
                        {category.displayOrder}
                      </span>
                      <button
                        type="button"
                        onClick={() => onMove(category.id, 1)}
                        disabled={index === categories.length - 1 || reordering}
                        aria-label={`Move ${category.name} down`}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-white hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-25"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex justify-center">
                      <ToggleSwitch
                        checked={category.active}
                        disabled={togglingId === category.id}
                        label={`Set ${category.name} active`}
                        onChange={(active) => onToggle(category, active)}
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(category)}
                        aria-label={`Edit ${category.name}`}
                        title="Edit category"
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue-200 bg-white text-blue-600 transition hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(category)}
                        aria-label={`Delete ${category.name}`}
                        title="Delete category"
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
      )}

      <footer className="mt-auto flex items-center gap-2 border-t border-slate-200 px-5 py-4 text-xs text-slate-500">
        <GripVertical className="h-4 w-4 shrink-0" />
        <span>Drag categories or use the arrow buttons to change display order.</span>
      </footer>
    </section>
  );
}

export default NavigationCategoryPanel;
