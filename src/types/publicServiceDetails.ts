import type {
  ServiceAboutContent,
  ServiceDocumentGroup,
  ServicePricingPackage,
  ServicePricingTab,
  ServiceProcessStep,
} from "./serviceEditor";

export interface PublicRelatedService {
  id: string;
  name: string;
  slug: string;
  categoryName: string;
  shortDescription: string;
  iconName: string;
  startingPrice: string;
}

export interface PublicServiceDetails {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  iconName: string;
  shortDescription: string;
  startingPrice: string;
  duration: string;
  about: ServiceAboutContent;
  documentGroups: ServiceDocumentGroup[];
  processSteps: ServiceProcessStep[];
  pricingTabs: ServicePricingTab[];
  relatedServiceIds: string[];
  relatedServices: PublicRelatedService[];
}

export interface PublicServicePageData {
  service: PublicServiceDetails;
  quotationWhatsAppNumber: string;
}

export interface QuotationFormValues {
  name: string;
  phone: string;
  email: string;
  city: string;
  businessType: string;
  message: string;
}

export interface QuotationSubmission {
  values: QuotationFormValues;
  service: PublicServiceDetails;
  selectedPackage: ServicePricingPackage | null;
  pricingTab: ServicePricingTab | null;
}

export interface QuotationSubmissionResult {
  enquiryId: string;
  reference: string;
}
