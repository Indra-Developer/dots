import {
  BriefcaseBusiness,
  Calculator,
  Landmark,
  ReceiptText,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  CategoryFormState,
  ServiceFormState,
} from "../types/navigationServices";

export interface CategoryIconOption {
  value: string;
  label: string;
  icon: LucideIcon;
}

export const categoryIconOptions: CategoryIconOption[] = [
  {
    value: "BriefcaseBusiness",
    label: "Business",
    icon: BriefcaseBusiness,
  },
  {
    value: "ShieldCheck",
    label: "Compliance",
    icon: ShieldCheck,
  },
  {
    value: "Calculator",
    label: "Accounting",
    icon: Calculator,
  },
  {
    value: "ReceiptText",
    label: "Taxation",
    icon: ReceiptText,
  },
  {
    value: "UsersRound",
    label: "Business Support",
    icon: UsersRound,
  },
  {
    value: "Landmark",
    label: "Government Services",
    icon: Landmark,
  },
  {
    value: "Star",
    label: "Other Services",
    icon: Star,
  },
];

export function getCategoryIcon(
  iconName: string,
): LucideIcon {
  return (
    categoryIconOptions.find(
      (option) => option.value === iconName,
    )?.icon || BriefcaseBusiness
  );
}

export function slugifyNavigationValue(
  value: string,
): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createEmptyCategoryForm(
  displayOrder = 1,
): CategoryFormState {
  return {
    name: "",
    slug: "",
    iconName: "BriefcaseBusiness",
    displayOrder,
    active: true,
  };
}

export function createEmptyServiceForm(
  categoryId = "",
  displayOrder = 1,
): ServiceFormState {
  return {
    name: "",
    slug: "",
    categoryId,
    shortDescription: "",
    displayOrder,
    active: true,
    status: "draft",
  };
}
