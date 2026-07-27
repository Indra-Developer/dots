import type { EnquiryStatus } from "../../../types/enquiriesSettings";

interface EnquiryStatusBadgeProps {
  status: EnquiryStatus;
}

const statusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClasses: Record<EnquiryStatus, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  in_progress: "bg-purple-50 text-purple-700",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

function EnquiryStatusBadge({ status }: EnquiryStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-semibold",
        statusClasses[status],
      ].join(" ")}
    >
      {statusLabels[status]}
    </span>
  );
}

export default EnquiryStatusBadge;
