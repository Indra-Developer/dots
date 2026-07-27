import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
  PublicAboutContent,
  PublicBanner,
  PublicCustomerStory,
  PublicFaq,
  PublicHomeData,
  PublicIntroductionVideo,
  PublicQuickService,
  PublicReview,
} from "../../types/publicHome";
import { db } from "../firebase/firebase";

function mapDocument<T>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as unknown as T;
}

function sortByOrder<T extends { displayOrder?: number }>(
  items: T[],
): T[] {
  return [...items].sort(
    (first, second) =>
      Number(first.displayOrder || 0) -
      Number(second.displayOrder || 0),
  );
}

async function getActiveCollection<T>(
  collectionName: string,
): Promise<T[]> {
  const snapshot = await getDocs(
    query(
      collection(db, collectionName),
      where("active", "==", true),
    ),
  );

  return sortByOrder(
    snapshot.docs.map((documentSnapshot) =>
      mapDocument<T & { displayOrder?: number }>(documentSnapshot),
    ),
  ) as T[];
}

function isBannerCurrentlyVisible(banner: PublicBanner): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (banner.startDate) {
    const startDate = new Date(`${banner.startDate}T00:00:00`);

    if (!Number.isNaN(startDate.getTime()) && startDate > today) {
      return false;
    }
  }

  if (banner.expiryDate) {
    const expiryDate = new Date(`${banner.expiryDate}T23:59:59`);

    if (!Number.isNaN(expiryDate.getTime()) && expiryDate < today) {
      return false;
    }
  }

  return true;
}

function readSettled<T>(
  result: PromiseSettledResult<T>,
  fallbackValue: T,
  warningLabel: string,
  warnings: string[],
): T {
  if (result.status === "fulfilled") {
    return result.value;
  }

  console.error(`${warningLabel} could not be loaded:`, result.reason);
  warnings.push(warningLabel);
  return fallbackValue;
}

export async function getPublicHomeData(): Promise<PublicHomeData> {
  const results = await Promise.allSettled([
    getActiveCollection<PublicBanner>("banners"),
    getActiveCollection<PublicQuickService>("quickServices"),
    getActiveCollection<PublicAboutContent>("aboutContent"),
    getActiveCollection<PublicIntroductionVideo>("introductionVideos"),
    getActiveCollection<PublicCustomerStory>("customerStories"),
    getActiveCollection<PublicReview>("reviews"),
    getActiveCollection<PublicFaq>("faqs"),
  ] as const);

  const warnings: string[] = [];

  const banners = readSettled(
    results[0],
    [],
    "Banners",
    warnings,
  ).filter(isBannerCurrentlyVisible);

  const quickServices = readSettled(
    results[1],
    [],
    "Quick Services",
    warnings,
  );

  const aboutItems = readSettled(
    results[2],
    [],
    "About content",
    warnings,
  );

  const introductionVideos = readSettled(
    results[3],
    [],
    "Introduction video",
    warnings,
  );

  return {
    banners,
    quickServices,
    about: aboutItems[0] || null,
    introductionVideo: introductionVideos[0] || null,
    customerStories: readSettled(
      results[4],
      [],
      "Customer stories",
      warnings,
    ),
    reviews: readSettled(
      results[5],
      [],
      "Reviews",
      warnings,
    ),
    faqs: readSettled(
      results[6],
      [],
      "FAQs",
      warnings,
    ),
    warnings,
  };
}
