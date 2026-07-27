import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import type {
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import type {
  CategoryFormState,
  NavigationCategory,
  NavigationManagerData,
  NavigationService,
  ServiceFormState,
} from "../../types/navigationServices";
import { db } from "../firebase/firebase";

function mapDocument<T>(
  documentSnapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return {
    ...documentSnapshot.data(),
    id: documentSnapshot.id,
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

export async function getNavigationManagerData(): Promise<NavigationManagerData> {
  const [categorySnapshot, serviceSnapshot] = await Promise.all([
    getDocs(
      query(
        collection(db, "categories"),
        orderBy("displayOrder", "asc"),
      ),
    ),
    getDocs(
      query(
        collection(db, "services"),
        orderBy("displayOrder", "asc"),
      ),
    ),
  ]);

  const categoryItems: NavigationCategory[] =
    categorySnapshot.docs.map((snapshot) =>
      mapDocument<NavigationCategory>(snapshot),
    );

  const serviceItems: NavigationService[] =
    serviceSnapshot.docs.map((snapshot) =>
      mapDocument<NavigationService>(snapshot),
    );

  const categories =
    sortByDisplayOrder<NavigationCategory>(
      categoryItems,
    );

  const services =
    sortByDisplayOrder<NavigationService>(
      serviceItems,
    );

  return {
    categories,
    services,
  };
}

export async function saveNavigationCategory(
  form: CategoryFormState,
  categoryId?: string,
): Promise<string> {
  const categoryReference = categoryId
    ? doc(db, "categories", categoryId)
    : doc(collection(db, "categories"));

  let previousName = "";

  if (categoryId) {
    const categorySnapshot = await getDoc(
      categoryReference,
    );

    previousName = String(
      categorySnapshot.data()?.name || "",
    );
  }

  await setDoc(
    categoryReference,
    {
      name: form.name.trim(),
      slug: form.slug.trim(),
      iconName: form.iconName,
      displayOrder: form.displayOrder,
      active: form.active,
      updatedAt: serverTimestamp(),
      ...(categoryId ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );

  if (
    categoryId &&
    previousName &&
    previousName !== form.name.trim()
  ) {
    const serviceSnapshot = await getDocs(
      query(
        collection(db, "services"),
        where("categoryId", "==", categoryId),
      ),
    );

    if (!serviceSnapshot.empty) {
      const batch = writeBatch(db);

      serviceSnapshot.docs.forEach((serviceDocument) => {
        batch.update(serviceDocument.ref, {
          categoryName: form.name.trim(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
    }
  }

  return categoryReference.id;
}

export async function saveNavigationService(
  form: ServiceFormState,
  categories: NavigationCategory[],
  serviceId?: string,
): Promise<string> {
  const category = categories.find(
    (item) => item.id === form.categoryId,
  );

  if (!category) {
    throw new Error("The selected category no longer exists.");
  }

  const serviceReference = serviceId
    ? doc(db, "services", serviceId)
    : doc(collection(db, "services"));

  await setDoc(
    serviceReference,
    {
      name: form.name.trim(),
      serviceName: form.name.trim(),
      slug: form.slug.trim(),
      categoryId: category.id,
      categoryName: category.name,
      shortDescription: form.shortDescription.trim(),
      displayOrder: form.displayOrder,
      active: form.active,
      status: form.status,
      updatedAt: serverTimestamp(),
      ...(serviceId ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );

  return serviceReference.id;
}

export async function updateNavigationCategoryActive(
  categoryId: string,
  active: boolean,
): Promise<void> {
  await updateDoc(doc(db, "categories", categoryId), {
    active,
    updatedAt: serverTimestamp(),
  });
}

export async function updateNavigationServiceActive(
  serviceId: string,
  active: boolean,
): Promise<void> {
  await updateDoc(doc(db, "services", serviceId), {
    active,
    updatedAt: serverTimestamp(),
  });
}

export async function updateNavigationCategoryOrder(
  categories: NavigationCategory[],
): Promise<void> {
  const batch = writeBatch(db);

  categories.forEach((category, index) => {
    batch.update(doc(db, "categories", category.id), {
      displayOrder: index + 1,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

export async function updateNavigationServiceOrder(
  services: NavigationService[],
): Promise<void> {
  const batch = writeBatch(db);

  services.forEach((service, index) => {
    batch.update(doc(db, "services", service.id), {
      displayOrder: index + 1,
      updatedAt: serverTimestamp(),
    });
  });

  await batch.commit();
}

export async function deleteNavigationCategory(
  categoryId: string,
): Promise<void> {
  await deleteDoc(doc(db, "categories", categoryId));
}

export async function deleteNavigationService(
  serviceId: string,
): Promise<void> {
  await deleteDoc(doc(db, "services", serviceId));
}
