import { Bell, ChevronDown, Menu } from "lucide-react";

import type { AdminProfile } from "../../types/admin";

interface AdminTopHeaderProps {
  title: string;
  adminProfile: AdminProfile | null;
  openMobileSidebar: () => void;
  notificationCount?: number;
}

function AdminTopHeader({
  title,
  adminProfile,
  openMobileSidebar,
  notificationCount = 0,
}: AdminTopHeaderProps) {
  const adminEmail = adminProfile?.email || "Admin";
  const firstLetter = adminEmail.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={openMobileSidebar}
          aria-label="Open admin menu"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="truncate text-xl font-bold text-[#20283a]">{title}</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" strokeWidth={1.8} />
          {notificationCount > 0 && (
            <span className="absolute right-0 top-0 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1266f1] text-base font-bold text-white">
            {firstLetter}
          </div>

          <div className="hidden min-w-0 text-left sm:block">
            <p className="truncate text-sm font-bold text-[#20283a]">Admin</p>
            <p className="max-w-[190px] truncate text-xs text-slate-500">
              {adminEmail}
            </p>
          </div>

          <ChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
        </div>
      </div>
    </header>
  );
}

export default AdminTopHeader;
