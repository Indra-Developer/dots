import { AlertTriangle, LoaderCircle, X } from "lucide-react";

import type { DeleteNavigationTarget } from "../../../types/navigationServices";

interface DeleteNavigationItemModalProps {
  target: DeleteNavigationTarget | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteNavigationItemModal({
  target,
  deleting,
  onClose,
  onConfirm,
}: DeleteNavigationItemModalProps) {
  if (!target) {
    return null;
  }

  const categoryHasServices =
    target.type === "category" &&
    Number(target.serviceCount || 0) > 0;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-navigation-title"
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-6 w-6" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            aria-label="Close delete confirmation"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2
          id="delete-navigation-title"
          className="mt-5 text-xl font-bold text-slate-900"
        >
          Delete {target.type === "category" ? "category" : "service"}?
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          You are about to delete{" "}
          <span className="font-semibold text-slate-900">
            {target.name}
          </span>
          . This action cannot be undone.
        </p>

        {categoryHasServices && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
            This category still contains {target.serviceCount} service
            {target.serviceCount === 1 ? "" : "s"}. Move or delete those
            services before deleting the category.
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting || categoryHasServices}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting && (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            )}
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteNavigationItemModal;
