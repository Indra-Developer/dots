import { LoaderCircle, Send, X } from "lucide-react";

interface PublishConfirmationModalProps {
  open: boolean;
  serviceName: string;
  publishing: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function PublishConfirmationModal({
  open,
  serviceName,
  publishing,
  onCancel,
  onConfirm,
}: PublishConfirmationModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/45 p-4">
      <button
        type="button"
        aria-label="Close publish confirmation"
        onClick={onCancel}
        className="absolute inset-0"
      />

      <section className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Send className="h-6 w-6" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={publishing}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <h2 className="mt-5 text-xl font-bold text-slate-900">
          Publish this service?
        </h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          <strong>{serviceName || "This service"}</strong> will become visible
          on the public website when it is active. You can edit or return it to
          draft later.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={publishing}
            className="h-11 rounded-lg border border-slate-300 px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={publishing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
          >
            {publishing ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {publishing ? "Publishing..." : "Publish Service"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default PublishConfirmationModal;
