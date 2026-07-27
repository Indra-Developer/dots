import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";

import {
  createEmptyAboutContent,
  createEmptyServiceEditorForm,
} from "../../constants/serviceEditor";
import type {
  ServiceAboutContent,
  ServiceDocumentGroup,
  ServiceEditorBootstrap,
  ServiceEditorForm,
  ServicePricingTab,
  ServiceProcessStep,
} from "../../types/serviceEditor";
import type {
  NavigationCategory,
  NavigationService,
  ServicePublicationStatus,
} from "../../types/navigationServices";
import { db } from "../firebase/firebase";

function mapCollectionDocument<T>(
  id: string,
  data: DocumentData,
): T {
  return {
    ...data,
    id,
  } as unknown as T;
}

function sortByDisplayOrder<
  T extends { displayOrder?: number; name?: string },
>(items: T[]): T[] {
  return [...items].sort((first, second) => {
    const orderDifference =
      Number(first.displayOrder || 0) -
      Number(second.displayOrder || 0);

    if (orderDifference !== 0) {
      return orderDifference;
    }

    return String(first.name || "").localeCompare(
      String(second.name || ""),
    );
  });
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => String(item ?? ""));
}

function normalizeAboutContent(
  value: unknown,
): ServiceAboutContent {
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

function normalizeDocumentGroups(
  value: unknown,
): ServiceDocumentGroup[] {
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
      iconName: String(group.iconName || "FileText"),
      items: normalizeStringArray(group.items),
    };
  });
}

function normalizeProcessSteps(value: unknown): ServiceProcessStep[] {
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
      iconName: String(step.iconName || "ClipboardCheck"),
    };
  });
}

function normalizePricingTabs(value: unknown): ServicePricingTab[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, tabIndex) => {
    const tab =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : {};

    return {
      id: String(tab.id || `pricing-tab-${tabIndex + 1}`),
      label: String(tab.label || `Pricing ${tabIndex + 1}`),
      type:
        tab.type === "monthly" ||
        tab.type === "quarterly" ||
        tab.type === "yearly" ||
        tab.type === "custom"
          ? tab.type
          : "one-time",
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
            };
          })
        : [],
    };
  });
}

function createFormFromService(
  serviceId: string,
  data: DocumentData,
): ServiceEditorForm {
  const emptyForm = createEmptyServiceEditorForm();
  const serviceName = String(data.serviceName || data.name || "");

  return {
    ...emptyForm,
    id: serviceId,
    name: serviceName,
    serviceName,
    slug: String(data.slug || ""),
    categoryId: String(data.categoryId || ""),
    categoryName: String(data.categoryName || ""),
    iconName: String(data.iconName || "BriefcaseBusiness"),
    shortDescription: String(data.shortDescription || ""),
    startingPrice: String(data.startingPrice ?? ""),
    duration: String(data.duration || ""),
    displayOrder: Number(data.displayOrder || 1),
    active: data.active !== false,
    status: data.status === "published" ? "published" : "draft",
    about: normalizeAboutContent(data.about),
    documentGroups: normalizeDocumentGroups(data.documentGroups),
    processSteps: normalizeProcessSteps(data.processSteps),
    pricingTabs: normalizePricingTabs(data.pricingTabs),
    relatedServiceIds: normalizeStringArray(data.relatedServiceIds),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

export async function getServiceEditorBootstrap(
  serviceId?: string,
): Promise<ServiceEditorBootstrap> {
  const [categorySnapshot, serviceSnapshot] = await Promise.all([
    getDocs(collection(db, "categories")),
    getDocs(collection(db, "services")),
  ]);

  const categories = sortByDisplayOrder<NavigationCategory>(
    categorySnapshot.docs.map((snapshot) =>
      mapCollectionDocument<NavigationCategory>(
        snapshot.id,
        snapshot.data(),
      ),
    ),
  );

  const services = sortByDisplayOrder<NavigationService>(
    serviceSnapshot.docs.map((snapshot) =>
      mapCollectionDocument<NavigationService>(
        snapshot.id,
        snapshot.data(),
      ),
    ),
  );

  if (!serviceId) {
    return {
      categories,
      services,
      form: null,
    };
  }

  const serviceDocument = await getDoc(doc(db, "services", serviceId));

  if (!serviceDocument.exists()) {
    throw new Error("The selected service no longer exists.");
  }

  return {
    categories,
    services,
    form: createFormFromService(
      serviceDocument.id,
      serviceDocument.data(),
    ),
  };
}

function cleanFormForStorage(
  form: ServiceEditorForm,
  status: ServicePublicationStatus,
): Omit<ServiceEditorForm, "id" | "createdAt" | "updatedAt"> {
  return {
    name: form.name.trim(),
    serviceName: form.name.trim(),
    slug: form.slug.trim(),
    categoryId: form.categoryId,
    categoryName: form.categoryName.trim(),
    iconName: form.iconName,
    shortDescription: form.shortDescription.trim(),
    startingPrice: form.startingPrice.trim(),
    duration: form.duration.trim(),
    displayOrder: Number(form.displayOrder || 1),
    active: form.active,
    status,
    about: {
      whatIsService: form.about.whatIsService.trim(),
      whoNeedsIt: form.about.whoNeedsIt.trim(),
      benefits: form.about.benefits
        .map((benefit) => ({
          ...benefit,
          title: benefit.title.trim(),
          description: benefit.description.trim(),
        }))
        .filter(
          (benefit) => benefit.title || benefit.description,
        ),
      eligibility: form.about.eligibility.trim(),
      validityRenewal: form.about.validityRenewal.trim(),
      complianceAfterRegistration:
        form.about.complianceAfterRegistration.trim(),
      importantInformation:
        form.about.importantInformation.trim(),
    },
    documentGroups: form.documentGroups
      .map((group) => ({
        ...group,
        title: group.title.trim(),
        items: group.items
          .map((item) => item.trim())
          .filter(Boolean),
      }))
      .filter((group) => group.title || group.items.length > 0),
    processSteps: form.processSteps
      .map((step) => ({
        ...step,
        heading: step.heading.trim(),
        description: step.description.trim(),
      }))
      .filter((step) => step.heading || step.description),
    pricingTabs: form.pricingTabs
      .map((tab) => ({
        ...tab,
        label: tab.label.trim(),
        packages: tab.packages
          .map((pricingPackage) => ({
            ...pricingPackage,
            name: pricingPackage.name.trim(),
            description: pricingPackage.description.trim(),
            price: pricingPackage.price.trim(),
            priceSuffix: pricingPackage.priceSuffix.trim(),
            feeNote: pricingPackage.feeNote.trim(),
            features: pricingPackage.features
              .map((feature) => feature.trim())
              .filter(Boolean),
          }))
          .filter(
            (pricingPackage) =>
              pricingPackage.name ||
              pricingPackage.description ||
              pricingPackage.price,
          ),
      }))
      .filter((tab) => tab.label || tab.packages.length > 0),
    relatedServiceIds: Array.from(
      new Set(
        form.relatedServiceIds.filter(
          (serviceId) => serviceId && serviceId !== form.id,
        ),
      ),
    ),
  };
}

export async function saveServiceEditorForm(
  form: ServiceEditorForm,
  status: ServicePublicationStatus,
): Promise<void> {
  if (!form.id) {
    throw new Error("A service must be selected before saving.");
  }

  await setDoc(
    doc(db, "services", form.id),
    {
      ...cleanFormForStorage(form, status),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
