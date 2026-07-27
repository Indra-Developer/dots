import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
  AdminEnquiry,
  EnquiriesSettingsBootstrap,
  EnquiryServiceOption,
  EnquiryStatus,
} from "../../types/enquiriesSettings";
import { db } from "../firebase/firebase";

const DEFAULT_QUOTATION_WHATSAPP_NUMBER = "6304963771";

function textValue(...values: unknown[]): string {
  const value = values.find(
    (item) => typeof item === "string" && item.trim().length > 0,
  );

  return typeof value === "string" ? value.trim() : "";
}

function normalizeStatus(value: unknown): EnquiryStatus {
  const normalized = String(value || "new")
    .trim()
    .toLowerCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");

  if (
    normalized === "contacted" ||
    normalized === "in_progress" ||
    normalized === "completed" ||
    normalized === "cancelled"
  ) {
    return normalized;
  }

  return "new";
}

function mapEnquiry(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): AdminEnquiry {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    reference: textValue(
      data.reference,
      data.quotationReference,
      data.enquiryReference,
      snapshot.id,
    ),
    customerName: textValue(
      data.customerName,
      data.customer,
      data.name,
    ),
    phone: textValue(data.phone, data.mobile, data.phoneNumber),
    email: textValue(data.email, data.emailAddress),
    city: textValue(data.city),
    businessType: textValue(data.businessType),
    serviceId: textValue(data.serviceId),
    serviceName: textValue(
      data.serviceName,
      data.service,
      data.selectedService,
    ),
    packageName: textValue(
      data.packageName,
      data.package,
      data.selectedPackage,
    ),
    message: textValue(
      data.message,
      data.additionalRequirements,
      data.requirements,
    ),
    status: normalizeStatus(data.status),
    createdAt: data.createdAt || data.submittedAt,
    updatedAt: data.updatedAt,
  };
}

function mapServiceOption(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): EnquiryServiceOption {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: textValue(data.name, data.serviceName) || "Unnamed service",
  };
}

async function loadEnquiries(): Promise<AdminEnquiry[]> {
  const enquiriesQuery = query(
    collection(db, "enquiries"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(enquiriesQuery);
  return snapshot.docs.map(mapEnquiry);
}

async function loadServices(): Promise<EnquiryServiceOption[]> {
  const servicesQuery = query(
    collection(db, "services"),
    orderBy("name", "asc"),
  );

  const snapshot = await getDocs(servicesQuery);
  return snapshot.docs.map(mapServiceOption);
}

async function loadQuotationWhatsAppNumber(): Promise<string> {
  const snapshot = await getDoc(doc(db, "settings", "public"));

  if (!snapshot.exists()) {
    return DEFAULT_QUOTATION_WHATSAPP_NUMBER;
  }

  return (
    textValue(snapshot.data().quotationWhatsAppNumber) ||
    DEFAULT_QUOTATION_WHATSAPP_NUMBER
  );
}

export async function getEnquiriesSettingsBootstrap(): Promise<EnquiriesSettingsBootstrap> {
  const [enquiriesResult, servicesResult, settingsResult] =
    await Promise.allSettled([
      loadEnquiries(),
      loadServices(),
      loadQuotationWhatsAppNumber(),
    ] as const);

  if (enquiriesResult.status === "rejected") {
    throw enquiriesResult.reason;
  }

  if (servicesResult.status === "rejected") {
    console.warn("Service filter options could not be loaded:", servicesResult.reason);
  }

  if (settingsResult.status === "rejected") {
    console.warn("Quotation WhatsApp setting could not be loaded:", settingsResult.reason);
  }

  return {
    enquiries: enquiriesResult.value,
    services:
      servicesResult.status === "fulfilled"
        ? servicesResult.value
        : [],
    quotationWhatsAppNumber:
      settingsResult.status === "fulfilled"
        ? settingsResult.value
        : DEFAULT_QUOTATION_WHATSAPP_NUMBER,
  };
}

export async function updateEnquiryStatus(
  enquiryId: string,
  status: EnquiryStatus,
): Promise<void> {
  await updateDoc(doc(db, "enquiries", enquiryId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function saveQuotationWhatsAppNumber(
  number: string,
): Promise<string> {
  const cleanedNumber = number.replace(/\D/g, "");

  if (cleanedNumber.length < 10 || cleanedNumber.length > 15) {
    throw new Error("Enter a valid WhatsApp number with 10 to 15 digits.");
  }

  await setDoc(
    doc(db, "settings", "public"),
    {
      quotationWhatsAppNumber: cleanedNumber,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return cleanedNumber;
}

export function createWhatsAppLink(
  phoneNumber: string,
  message: string,
): string {
  const digits = phoneNumber.replace(/\D/g, "");
  const internationalNumber =
    digits.length === 10 ? `91${digits}` : digits;

  return `https://wa.me/${internationalNumber}?text=${encodeURIComponent(message)}`;
}
