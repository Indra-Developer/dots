import {
  FilePenLine,
  Gauge,
  House,
  Layers3,
  LogOut,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface AdminNavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const adminNavigationItems: AdminNavigationItem[] = [
  { label: "Dashboard", path: "/admin/dashboard", icon: Gauge },
  { label: "Home Content", path: "/admin/home-content", icon: House },
  {
    label: "Navigation & Services",
    path: "/admin/navigation-services",
    icon: Layers3,
  },
  {
    label: "Service Editor",
    path: "/admin/service-editor",
    icon: FilePenLine,
  },
  {
    label: "Enquiries & Settings",
    path: "/admin/enquiries-settings",
    icon: Settings,
  },
];

export const adminLogoutItem: Pick<AdminNavigationItem, "label" | "icon"> = {
  label: "Logout",
  icon: LogOut,
};
