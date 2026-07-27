import type { Timestamp } from "firebase/firestore";
import type {
  NavigationCategory,
  NavigationService,
  ServicePublicationStatus,
} from "./navigationServices";

export type ServiceEditorDateValue =
  | Timestamp
  | Date
  | string
  | null
  | undefined;

export type ServiceEditorTabId =
  | "basic"
  | "about"
  | "documents-process"
  | "pricing"
  | "related-services";

export type PricingType =
  | "one-time"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "custom";

export interface ServiceBenefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface ServiceAboutContent {
  whatIsService: string;
  whoNeedsIt: string;
  benefits: ServiceBenefit[];
  eligibility: string;
  validityRenewal: string;
  complianceAfterRegistration: string;
  importantInformation: string;
}

export interface ServiceDocumentGroup {
  id: string;
  title: string;
  iconName: string;
  items: string[];
}

export interface ServiceProcessStep {
  id: string;
  heading: string;
  description: string;
  iconName: string;
}

export interface ServicePricingPackage {
  id: string;
  name: string;
  description: string;
  price: string;
  priceSuffix: string;
  feeNote: string;
  features: string[];
  recommended: boolean;
}

export interface ServicePricingTab {
  id: string;
  label: string;
  type: PricingType;
  packages: ServicePricingPackage[];
}

export interface ServiceEditorForm {
  id: string;
  name: string;
  serviceName: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  iconName: string;
  shortDescription: string;
  startingPrice: string;
  duration: string;
  displayOrder: number;
  active: boolean;
  status: ServicePublicationStatus;
  about: ServiceAboutContent;
  documentGroups: ServiceDocumentGroup[];
  processSteps: ServiceProcessStep[];
  pricingTabs: ServicePricingTab[];
  relatedServiceIds: string[];
  createdAt?: ServiceEditorDateValue;
  updatedAt?: ServiceEditorDateValue;
}

export interface ServiceEditorBootstrap {
  categories: NavigationCategory[];
  services: NavigationService[];
  form: ServiceEditorForm | null;
}

export type ServiceEditorErrors = Record<string, string>;
