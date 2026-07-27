import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

import type { DashboardTone } from "../../../types/dashboard";

export interface DashboardStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  tone: DashboardTone;
  linkLabel: string;
  to: string;
}

const toneClasses: Record<DashboardTone, string> = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

function DashboardStatCard({
  title,
  value,
  icon: Icon,
  tone,
  linkLabel,
  to,
}: DashboardStatCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}
        >
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-[#1e293b]">{value}</p>
        </div>
      </div>

      <Link
        to={to}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#1266f1] transition hover:text-blue-700"
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

export default DashboardStatCard;
