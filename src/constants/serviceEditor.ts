import {
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Calculator,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  FileText,
  Landmark,
  ReceiptText,
  Scale,
  ShieldCheck,
  Store,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  PricingType,
  ServiceAboutContent,
  ServiceDocumentGroup,
  ServiceEditorForm,
  ServiceEditorTabId,
  ServicePricingPackage,
  ServicePricingTab,
  ServiceProcessStep,
} from "../types/serviceEditor";

export interface ServiceEditorTabDefinition {
  id: ServiceEditorTabId;
  label: string;
  number: number;
}

export interface ServiceIconOption {
  name: string;
  label: string;
  icon: LucideIcon;
}

export const serviceEditorTabs: ServiceEditorTabDefinition[] = [
  { id: "basic", label: "Basic", number: 1 },
  { id: "about", label: "About", number: 2 },
  {
    id: "documents-process",
    label: "Documents & Process",
    number: 3,
  },
  { id: "pricing", label: "Pricing", number: 4 },
  {
    id: "related-services",
    label: "Related Services",
    number: 5,
  },
];

export const serviceIconOptions: ServiceIconOption[] = [
  { name: "BriefcaseBusiness", label: "Business", icon: BriefcaseBusiness },
  { name: "Building2", label: "Company", icon: Building2 },
  { name: "ReceiptText", label: "GST / Receipt", icon: ReceiptText },
  { name: "Store", label: "MSME / Store", icon: Store },
  { name: "Calculator", label: "Tax / Calculator", icon: Calculator },
  { name: "Landmark", label: "Compliance", icon: Landmark },
  { name: "ShieldCheck", label: "Trademark / Security", icon: ShieldCheck },
  { name: "BookOpenCheck", label: "Bookkeeping", icon: BookOpenCheck },
  { name: "UsersRound", label: "Payroll / Employees", icon: UsersRound },
  { name: "FileText", label: "Documents", icon: FileText },
  { name: "ClipboardCheck", label: "Checklist", icon: ClipboardCheck },
  { name: "FileCheck2", label: "Certificate", icon: FileCheck2 },
  { name: "Scale", label: "Legal", icon: Scale },
  { name: "BadgeCheck", label: "Approval", icon: BadgeCheck },
  { name: "CalendarClock", label: "Duration", icon: CalendarClock },
  { name: "CheckCircle2", label: "Completed", icon: CheckCircle2 },
];

export const pricingTypeOptions: Array<{
  value: PricingType;
  label: string;
}> = [
  { value: "one-time", label: "One-time" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "custom", label: "Custom" },
];

export function createServiceEditorId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function slugifyServiceValue(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createEmptyAboutContent(): ServiceAboutContent {
  return {
    whatIsService: "",
    whoNeedsIt: "",
    benefits: [],
    eligibility: "",
    validityRenewal: "",
    complianceAfterRegistration: "",
    importantInformation: "",
  };
}

export function createEmptyDocumentGroup(
  position = 1,
): ServiceDocumentGroup {
  return {
    id: createServiceEditorId("document-group"),
    title: `Document Group ${position}`,
    iconName: "FileText",
    items: [""],
  };
}

export function createEmptyProcessStep(
  position = 1,
): ServiceProcessStep {
  return {
    id: createServiceEditorId("process-step"),
    heading: `Step ${position}`,
    description: "",
    iconName: "ClipboardCheck",
  };
}

export function createEmptyPricingPackage(
  position = 1,
): ServicePricingPackage {
  return {
    id: createServiceEditorId("pricing-package"),
    name: position === 1 ? "Basic" : `Package ${position}`,
    description: "",
    price: "",
    priceSuffix: "",
    feeNote: "Price is exclusive of GST and government fees.",
    features: [""],
    recommended: false,
  };
}

export function createEmptyPricingTab(
  position = 1,
): ServicePricingTab {
  return {
    id: createServiceEditorId("pricing-tab"),
    label: position === 1 ? "One-time" : `Pricing ${position}`,
    type: "one-time",
    packages: [createEmptyPricingPackage(1)],
  };
}

export function createEmptyServiceEditorForm(): ServiceEditorForm {
  return {
    id: "",
    name: "",
    serviceName: "",
    slug: "",
    categoryId: "",
    categoryName: "",
    iconName: "BriefcaseBusiness",
    shortDescription: "",
    startingPrice: "",
    duration: "",
    displayOrder: 1,
    active: true,
    status: "draft",
    about: createEmptyAboutContent(),
    documentGroups: [],
    processSteps: [],
    pricingTabs: [],
    relatedServiceIds: [],
  };
}

export function resolveServiceIcon(iconName: string): LucideIcon {
  return (
    serviceIconOptions.find((option) => option.name === iconName)?.icon ||
    BriefcaseBusiness
  );
}
