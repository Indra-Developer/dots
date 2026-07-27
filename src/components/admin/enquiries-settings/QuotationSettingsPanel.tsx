import { CheckCircle2, LoaderCircle, Save } from "lucide-react";

interface QuotationSettingsPanelProps {
  number: string;
  error: string;
  success: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  compact?: boolean;
}

function QuotationSettingsPanel({
  number,
  error,
  success,
  saving,
  onChange,
  onSave,
  compact = false,
}: QuotationSettingsPanelProps) {
  return (
    <section
      className={[
        "rounded-xl border border-slate-200 bg-white shadow-sm",
        compact ? "h-fit" : "mx-auto w-full max-w-2xl",
      ].join(" ")}
    >
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-bold text-slate-900">Settings</h2>
        <div className="mt-3 h-0.5 w-16 bg-blue-600" />
      </div>

      <div className="p-5">
        <h3 className="text-sm font-bold text-slate-900">
          Quotation WhatsApp Number
        </h3>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Set the default WhatsApp number used for enquiry quotations.
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block text-xs font-semibold text-slate-700">
            WhatsApp Number <span className="text-red-500">*</span>
          </span>
          <input
            inputMode="numeric"
            value={number}
            onChange={(event) => onChange(event.target.value)}
            placeholder="6304963771"
            className={[
              "h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition",
              "focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
              error ? "border-red-300" : "border-slate-300",
            ].join(" ")}
          />
        </label>

        {error ? (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        ) : (
          <p className="mt-2 text-xs leading-5 text-slate-500">
            This number is used by the website quotation and WhatsApp actions.
          </p>
        )}

        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" />
            {success}
          </div>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving}
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Number"}
        </button>
      </div>
    </section>
  );
}

export default QuotationSettingsPanel;
