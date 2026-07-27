import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import {
  createEmptyAboutContent,
} from "../../constants/serviceEditor";
import type {
  ServiceAboutContent,
  ServiceDocumentGroup,
  ServicePricingPackage,
  ServicePricingTab,
  ServiceProcessStep,
} from "../../types/serviceEditor";
import type {
  PublicRelatedService,
  PublicServiceDetails,
  PublicServicePageData,
  QuotationSubmission,
  QuotationSubmissionResult,
} from "../../types/publicServiceDetails";
import { db } from "../firebase/firebase";

const DEFAULT_WHATSAPP_NUMBER = "6304963771";

function mapDocument<T>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as unknown as T;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean);
}

function normalizeAbout(value: unknown): ServiceAboutContent {
  const fallback = createEmptyAboutContent();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const data = value as Record<string, unknown>;

  return {
    whatIsService: String(data.whatIsService || ""),
    whoNeedsIt: String(data.whoNeedsIt || ""),
    benefits: Array.isArray(data.benefits)
      ? data.benefits.map((item, index) => {
          const benefit =
            item && typeof item === "object"
              ? (item as Record<string, unknown>)
              : {};

          return {
            id: String(benefit.id || `benefit-${index + 1}`),
            title: String(benefit.title || ""),
            description: String(benefit.description || ""),
            iconName: String(benefit.iconName || "BadgeCheck"),
          };
        })
      : [],
    eligibility: String(data.eligibility || ""),
    validityRenewal: String(data.validityRenewal || ""),
    complianceAfterRegistration: String(
      data.complianceAfterRegistration || "",
    ),
    importantInformation: String(data.importantInformation || ""),
  };
}

function normalizeDocuments(value: unknown): ServiceDocumentGroup[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => {
    const group =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    return {
      id: String(group.id || `document-group-${index + 1}`),
      title: String(group.title || `Document Group ${index + 1}`),
      iconName: String(group.iconName || "FileCheck2"),
      items: normalizeStringArray(group.items),
    };
  });
}

function normalizeProcess(value: unknown): ServiceProcessStep[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, index) => {
    const step =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    return {
      id: String(step.id || `process-step-${index + 1}`),
      heading: String(step.heading || `Step ${index + 1}`),
      description: String(step.description || ""),
      iconName: String(step.iconName || "BadgeCheck"),
    };
  });
}

function normalizePricing(value: unknown): ServicePricingTab[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, tabIndex) => {
    const tab =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    const type =
      tab.type === "monthly" ||
      tab.type === "quarterly" ||
      tab.type === "yearly" ||
      tab.type === "custom"
        ? tab.type
        : "one-time";

    return {
      id: String(tab.id || `pricing-tab-${tabIndex + 1}`),
      label: String(tab.label || `Pricing ${tabIndex + 1}`),
      type,
      packages: Array.isArray(tab.packages)
        ? tab.packages.map((itemPackage, packageIndex) => {
            const pricingPackage =
              itemPackage && typeof itemPackage === "object"
                ? (itemPackage as Record<string, unknown>)
                : {};

            return {
              id: String(
                pricingPackage.id ||
                  `pricing-package-${tabIndex + 1}-${packageIndex + 1}`,
              ),
              name: String(
                pricingPackage.name || `Package ${packageIndex + 1}`,
              ),
              description: String(pricingPackage.description || ""),
              price: String(pricingPackage.price || ""),
              priceSuffix: String(pricingPackage.priceSuffix || ""),
              feeNote: String(pricingPackage.feeNote || ""),
              features: normalizeStringArray(pricingPackage.features),
              recommended: pricingPackage.recommended === true,
            } satisfies ServicePricingPackage;
          })
        : [],
    } satisfies ServicePricingTab;
  });
}

function normalizePhoneNumber(value: unknown): string {
  const digits = String(value || "").replace(/\D/g, "");
  return digits || DEFAULT_WHATSAPP_NUMBER;
}

function createServiceDetails(
  rawService: Record<string, unknown> & { id: string },
): PublicServiceDetails {
  const name = String(
    rawService.name || rawService.serviceName || "Service",
  );

  return {
    id: rawService.id,
    name,
    slug: String(rawService.slug || ""),
    categoryId: String(rawService.categoryId || ""),
    categoryName: String(rawService.categoryName || "Services"),
    iconName: String(rawService.iconName || "BriefcaseBusiness"),
    shortDescription: String(rawService.shortDescription || ""),
    startingPrice: String(rawService.startingPrice || ""),
    duration: String(rawService.duration || ""),
    about: normalizeAbout(rawService.about),
    documentGroups: normalizeDocuments(rawService.documentGroups),
    processSteps: normalizeProcess(rawService.processSteps),
    pricingTabs: normalizePricing(rawService.pricingTabs),
    relatedServiceIds: normalizeStringArray(
      rawService.relatedServiceIds,
    ),
    relatedServices: [],
  };
}

function toRelatedService(
  service: PublicServiceDetails,
): PublicRelatedService {
  return {
    id: service.id,
    name: service.name,
    slug: service.slug,
    categoryName: service.categoryName,
    shortDescription: service.shortDescription,
    iconName: service.iconName,
    startingPrice: service.startingPrice,
  };
}

export async function getPublicServiceBySlug(
  slug: string,
): Promise<PublicServicePageData | null> {
  const [serviceSnapshot, settingsSnapshot] = await Promise.all([
    getDocs(
      query(
        collection(db, "services"),
        where("active", "==", true),
        where("status", "==", "published"),
      ),
    ),
    getDoc(doc(db, "settings", "public")),
  ]);

  const allServices = serviceSnapshot.docs.map((snapshot) =>
    createServiceDetails(
      mapDocument<Record<string, unknown> & { id: string }>(snapshot),
    ),
  );

  const currentService = allServices.find(
    (service) => service.slug.toLowerCase() === slug.toLowerCase(),
  );

  if (!currentService) {
    return null;
  }

  const explicitlyRelated = currentService.relatedServiceIds
    .map((relatedId) =>
      allServices.find((service) => service.id === relatedId),
    )
    .filter(
      (service): service is PublicServiceDetails => Boolean(service),
    );

  const fallbackRelated = allServices.filter(
    (service) =>
      service.id !== currentService.id &&
      service.categoryId === currentService.categoryId,
  );

  const relatedCandidates = [
    ...explicitlyRelated,
    ...fallbackRelated,
    ...allServices.filter(
      (service) => service.id !== currentService.id,
    ),
  ];

  const uniqueRelated = relatedCandidates.filter(
    (service, index, items) =>
      items.findIndex((item) => item.id === service.id) === index,
  );

  currentService.relatedServices = uniqueRelated
    .slice(0, 4)
    .map(toRelatedService);

  return {
    service: currentService,
    quotationWhatsAppNumber: normalizePhoneNumber(
      settingsSnapshot.data()?.quotationWhatsAppNumber,
    ),
  };
}

function createQuotationReference(): string {
  const date = new Date();
  const datePart = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const randomPart = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `DOTS-${datePart}-${randomPart}`;
}

export async function submitPublicQuotation(
  submission: QuotationSubmission,
): Promise<QuotationSubmissionResult> {
  const reference = createQuotationReference();
  const { values, service, selectedPackage, pricingTab } = submission;

  const enquiryDocument = await addDoc(
    collection(db, "enquiries"),
    {
      reference,
      quotationReference: reference,
      name: values.name.trim(),
      customerName: values.name.trim(),
      phone: values.phone.replace(/\D/g, ""),
      email: values.email.trim(),
      city: values.city.trim(),
      businessType: values.businessType.trim(),
      serviceId: service.id,
      serviceName: service.name,
      serviceSlug: service.slug,
      packageId: selectedPackage?.id || "",
      packageName: selectedPackage?.name || "Custom Quotation",
      pricingType: pricingTab?.type || "custom",
      message: values.message.trim(),
      status: "new",
      source: "public-website",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
  );

  return {
    enquiryId: enquiryDocument.id,
    reference,
  };
}

export function createQuotationWhatsAppUrl(
  phoneNumber: string,
  submission: QuotationSubmission,
  reference?: string,
): string {
  const digits = phoneNumber.replace(/\D/g, "");
  const internationalNumber =
    digits.length === 10 ? `91${digits}` : digits;

  const packageName =
    submission.selectedPackage?.name || "Custom Quotation";

  const messageLines = [
    "Hello DOTS, I would like a quotation.",
    reference ? `Reference: ${reference}` : "",
    `Service: ${submission.service.name}`,
    `Package: ${packageName}`,
    `Name: ${submission.values.name || "Not provided"}`,
    `Phone: ${submission.values.phone || "Not provided"}`,
    `City: ${submission.values.city || "Not provided"}`,
    submission.values.businessType
      ? `Business Type: ${submission.values.businessType}`
      : "",
    submission.values.message
      ? `Requirement: ${submission.values.message}`
      : "",
  ].filter(Boolean);

  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(
    messageLines.join("\n"),
  )}`;
}
