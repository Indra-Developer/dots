import { LoaderCircle, Trash2, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  open: boolean;
  title: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function DeleteConfirmationModal({
  open,
  title,
  deleting,
  onCancel,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/45 p-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Trash2 className="h-6 w-6" />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close delete confirmation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Delete this item?
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          <span className="font-semibold text-slate-800">{title}</span> will be
          permanently removed from Firebase and related uploaded files will also
          be deleted.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="min-h-11 rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-600 px-5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {deleting ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteConfirmationModal;
