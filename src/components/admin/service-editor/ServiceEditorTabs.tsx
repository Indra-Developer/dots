import { serviceEditorTabs } from "../../../constants/serviceEditor";
import type { ServiceEditorTabId } from "../../../types/serviceEditor";

interface ServiceEditorTabsProps {
  activeTab: ServiceEditorTabId;
  onChange: (tab: ServiceEditorTabId) => void;
  errorTabs?: ServiceEditorTabId[];
}

function ServiceEditorTabs({
  activeTab,
  onChange,
  errorTabs = [],
}: ServiceEditorTabsProps) {
  return (
    <div className="overflow-x-auto border-b border-slate-200 bg-white">
      <div className="flex min-w-max px-3 sm:px-5">
        {serviceEditorTabs.map((tab) => {
          const active = activeTab === tab.id;
          const hasError = errorTabs.includes(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={[
                "relative flex min-h-14 items-center gap-2.5 px-4 text-sm font-medium transition",
                active
                  ? "text-[#1266f1]"
                  : "text-slate-500 hover:text-slate-800",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                  active
                    ? "border-[#1266f1] bg-[#1266f1] text-white"
                    : hasError
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-slate-300 bg-white text-slate-600",
                ].join(" ")}
              >
                {tab.number}
              </span>

              <span>{tab.label}</span>

              {active && (
                <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#1266f1]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceEditorTabs;
