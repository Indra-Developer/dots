import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
  PublicCategory,
  PublicNavigationData,
  PublicService,
  PublicSettings,
} from "../../types/publicContent";
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

function normalizePhoneNumber(value: unknown): string {
  const digits = String(value || "").replace(/\D/g, "");

  return digits || DEFAULT_WHATSAPP_NUMBER;
}

async function getPublicCategories(): Promise<PublicCategory[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "categories"),
      where("active", "==", true),
    ),
  );

  return sortByDisplayOrder(
    snapshot.docs.map((documentSnapshot) =>
      mapDocument<PublicCategory>(documentSnapshot),
    ),
  );
}

async function getPublicServices(): Promise<PublicService[]> {
  const snapshot = await getDocs(
    query(
      collection(db, "services"),
      where("active", "==", true),
      where("status", "==", "published"),
    ),
  );

  return sortByDisplayOrder(
    snapshot.docs.map((documentSnapshot) =>
      mapDocument<PublicService>(documentSnapshot),
    ),
  );
}

async function getPublicSettings(): Promise<PublicSettings> {
  const snapshot = await getDoc(doc(db, "settings", "public"));

  return {
    quotationWhatsAppNumber: normalizePhoneNumber(
      snapshot.data()?.quotationWhatsAppNumber,
    ),
  };
}

export async function getPublicNavigationData(): Promise<PublicNavigationData> {
  const [categories, services, settings] = await Promise.all([
    getPublicCategories(),
    getPublicServices(),
    getPublicSettings(),
  ]);

  return {
    categories,
    services,
    settings,
  };
}
