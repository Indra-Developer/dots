import {
  collection,
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryConstraint,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
  AdminDashboardData,
  DashboardContentSource,
  DashboardContentUpdate,
  DashboardDateValue,
  DashboardEnquiry,
} from "../../types/dashboard";
import { db } from "../firebase/firebase";

interface ContentSourceConfig {
  collectionName: string;
  source: DashboardContentSource;
  fallbackTitle: string;
  fallbackDescription: string;
}

async function getCount(
  collectionName: string,
  constraints: QueryConstraint[] = [],
): Promise<number> {
  const collectionQuery = query(
    collection(db, collectionName),
    ...constraints,
  );

  const snapshot = await getCountFromServer(collectionQuery);
  return snapshot.data().count;
}

/**
 * Firestore returns untyped DocumentData at runtime.
 * This helper adds the document ID and performs the conversion in one place.
 */
function mapDocument<T>(
  documentSnapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return {
    ...documentSnapshot.data(),
    id: documentSnapshot.id,
  } as unknown as T;
}

async function getRecentEnquiries(
  maximumResults: number,
): Promise<DashboardEnquiry[]> {
  const enquiriesQuery = query(
    collection(db, "enquiries"),
    orderBy("createdAt", "desc"),
    limit(maximumResults),
  );

  const snapshot = await getDocs(enquiriesQuery);

  return snapshot.docs.map((documentSnapshot) =>
    mapDocument<DashboardEnquiry>(documentSnapshot),
  );
}

function getTimestampMilliseconds(
  value: DashboardDateValue,
): number {
  if (!value) {
    return 0;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }

  const parsedDate = new Date(value as string | number);
  return Number.isNaN(parsedDate.getTime())
    ? 0
    : parsedDate.getTime();
}

async function getRecentContentFromSource(
  config: ContentSourceConfig,
): Promise<DashboardContentUpdate[]> {
  const sourceQuery = query(
    collection(db, config.collectionName),
    orderBy("updatedAt", "desc"),
    limit(3),
  );

  const snapshot = await getDocs(sourceQuery);

  return snapshot.docs.map((documentSnapshot) => {
    const data = documentSnapshot.data();

    const itemName = String(
      data.title ||
        data.name ||
        data.serviceName ||
        data.categoryName ||
        "",
    ).trim();

    return {
      id: `${config.source}-${documentSnapshot.id}`,
      title: itemName
        ? `${itemName} updated`
        : config.fallbackTitle,
      description:
        String(
          data.updateDescription ||
            data.description ||
            "",
        ).trim() || config.fallbackDescription,
      source: config.source,
      createdAt:
        (data.updatedAt as DashboardDateValue) ||
        (data.createdAt as DashboardDateValue) ||
        null,
    };
  });
}

async function getRecentContentUpdates(): Promise<
  DashboardContentUpdate[]
> {
  const sourceConfigs: ContentSourceConfig[] = [
    {
      collectionName: "banners",
      source: "banner",
      fallbackTitle: "Home banner updated",
      fallbackDescription:
        "Banner content was changed.",
    },
    {
      collectionName: "introductionVideos",
      source: "video",
      fallbackTitle: "Home video updated",
      fallbackDescription:
        "Introduction video content was changed.",
    },
    {
      collectionName: "services",
      source: "service",
      fallbackTitle: "Service updated",
      fallbackDescription:
        "Service content was changed.",
    },
    {
      collectionName: "categories",
      source: "category",
      fallbackTitle: "Category updated",
      fallbackDescription:
        "Navigation category was changed.",
    },
  ];

  const results = await Promise.allSettled(
    sourceConfigs.map((config) =>
      getRecentContentFromSource(config),
    ),
  );

  const updates = results.flatMap((result) =>
    result.status === "fulfilled"
      ? result.value
      : [],
  );

  return updates
    .sort(
      (first, second) =>
        getTimestampMilliseconds(second.createdAt) -
        getTimestampMilliseconds(first.createdAt),
    )
    .slice(0, 5);
}

function readSettledResult<T>(
  result: PromiseSettledResult<T>,
  fallbackValue: T,
  label: string,
  warnings: string[],
): T {
  if (result.status === "fulfilled") {
    return result.value;
  }

  console.error(
    `${label} could not be loaded:`,
    result.reason,
  );

  warnings.push(label);
  return fallbackValue;
}

export async function loadAdminDashboard(): Promise<AdminDashboardData> {
  const results = await Promise.allSettled([
    getCount("categories", [
      where("active", "==", true),
    ]),
    getCount("services", [
      where("active", "==", true),
    ]),
    getCount("introductionVideos", [
      where("active", "==", true),
    ]),
    getCount("enquiries", [
      where("status", "==", "new"),
    ]),
    getRecentEnquiries(5),
    getRecentContentUpdates(),
  ] as const);

  const warnings: string[] = [];

  return {
    counts: {
      activeCategories: readSettledResult(
        results[0],
        0,
        "Active categories",
        warnings,
      ),
      activeServices: readSettledResult(
        results[1],
        0,
        "Active services",
        warnings,
      ),
      homeVideos: readSettledResult(
        results[2],
        0,
        "Home videos",
        warnings,
      ),
      newEnquiries: readSettledResult(
        results[3],
        0,
        "New enquiries",
        warnings,
      ),
    },
    recentEnquiries: readSettledResult(
      results[4],
      [],
      "Recent enquiries",
      warnings,
    ),
    recentContentUpdates: readSettledResult(
      results[5],
      [],
      "Recent content updates",
      warnings,
    ),
    warnings,
  };
}
