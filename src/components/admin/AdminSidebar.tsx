import { LoaderCircle, X } from "lucide-react";
import { NavLink } from "react-router";
import type { NavLinkRenderProps } from "react-router";

import dotsLogo from "../../assets/images/dots-logo.png";
import {
  adminLogoutItem,
  adminNavigationItems,
} from "../../constants/adminNavigation";

interface AdminSidebarProps {
  isMobileOpen: boolean;
  closeMobileSidebar: () => void;
  onLogout: () => Promise<void>;
  loggingOut: boolean;
}

function AdminSidebar({
  isMobileOpen,
  closeMobileSidebar,
  onLogout,
  loggingOut,
}: AdminSidebarProps) {
  const LogoutIcon = adminLogoutItem.icon;

  function navigationClass({ isActive }: NavLinkRenderProps): string {
    return [
      "flex min-h-12 items-center gap-3 rounded-lg px-4 py-3",
      "text-sm font-medium transition-colors",
      isActive
        ? "bg-[#edf4ff] text-[#1266f1]"
        : "text-[#455066] hover:bg-slate-50 hover:text-slate-950",
    ].join(" ");
  }

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col",
          "border-r border-slate-200 bg-white",
          "transition-transform duration-300 ease-out",
          "lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        <div className="flex min-h-[92px] items-center justify-between border-b border-slate-100 px-5">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src={dotsLogo}
              alt="DOTS"
              className="h-16 w-16 shrink-0 object-contain"
            />

            <div className="min-w-0">
              <p className="truncate text-xl font-bold tracking-wide text-[#0b2557]">
                DOTS
              </p>
              <p className="truncate text-[9px] font-semibold tracking-[0.18em] text-slate-500">
                BUSINESS SERVICES
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1.5">
            {adminNavigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileSidebar}
                  className={navigationClass}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.8} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-slate-200 p-3">
          <button
            type="button"
            onClick={() => void onLogout()}
            disabled={loggingOut}
            className="flex min-h-12 w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loggingOut ? (
              <LoaderCircle className="h-5 w-5 animate-spin" />
            ) : (
              <LogoutIcon className="h-5 w-5" strokeWidth={1.8} />
            )}

            <span>{loggingOut ? "Signing Out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
