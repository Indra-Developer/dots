import { ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

import type { DashboardTone } from "../../../types/dashboard";

export interface DashboardQuickActionProps {
  title: string;
  description: string;
  icon: LucideIcon;
  tone: DashboardTone;
  to: string;
}

const toneClasses: Record<DashboardTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

function DashboardQuickAction({
  title,
  description,
  icon: Icon,
  tone,
  to,
}: DashboardQuickActionProps) {
  return (
    <Link
      to={to}
      className="group flex min-h-[96px] items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneClasses[tone]}`}
      >
        <Icon
          className="h-6 w-6 transition-transform group-hover:scale-105"
          strokeWidth={1.8}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[#1e293b]">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 xl:hidden" />
    </Link>
  );
}

export default DashboardQuickAction;

