import {
  collection,
  deleteDoc,
  doc,
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
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { getHomeContentTabDefinition } from "../../constants/homeContent";
import type {
  HomeContentFormState,
  HomeContentItem,
  HomeContentTab,
  ServiceOption,
  UploadProgressState,
} from "../../types/homeContent";
import { db, storage } from "../firebase/firebase";

interface SaveHomeContentOptions {
  tab: HomeContentTab;
  form: HomeContentFormState;
  itemId?: string;
  onProgress?: (progress: UploadProgressState) => void;
}

function mapDocument<T>(
  snapshot: QueryDocumentSnapshot<DocumentData>,
): T {
  return {
    ...snapshot.data(),
    id: snapshot.id,
  } as unknown as T;
}

function normalizeFileName(fileName: string): string {
  return fileName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-");
}

function buildStoragePath(
  tab: HomeContentTab,
  itemId: string,
  mediaType: "images" | "videos",
  label: string,
  file: File,
): string {
  const safeName = normalizeFileName(file.name);
  return `public/${mediaType}/home/${tab}/${itemId}/${label}-${Date.now()}-${safeName}`;
}

function uploadFile(
  storagePath: string,
  file: File,
  label: string,
  onProgress?: (progress: UploadProgressState) => void,
): Promise<{ url: string; path: string }> {
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(ref(storage, storagePath), file, {
      contentType: file.type,
    });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percentage =
          snapshot.totalBytes === 0
            ? 0
            : Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              );

        onProgress?.({ label, percentage });
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({ url, path: uploadTask.snapshot.ref.fullPath });
        } catch (error: unknown) {
          reject(error);
        }
      },
    );
  });
}

async function removeStoragePath(storagePath?: string): Promise<void> {
  if (!storagePath) {
    return;
  }

  try {
    await deleteObject(ref(storage, storagePath));
  } catch (error: unknown) {
    console.warn(`Storage file could not be removed: ${storagePath}`, error);
  }
}

function cleanText(value: string): string {
  return value.trim();
}

function buildBasePayload(form: HomeContentFormState) {
  return {
    displayOrder: Number(form.displayOrder) || 1,
    active: form.active,
    updatedAt: serverTimestamp(),
  };
}

function buildTabPayload(
  tab: HomeContentTab,
  form: HomeContentFormState,
): Record<string, unknown> {
  const base = buildBasePayload(form);

  switch (tab) {
    case "banners":
      return {
        ...base,
        title: cleanText(form.title),
        serviceId: cleanText(form.serviceId),
        serviceSlug: cleanText(form.serviceSlug),
        serviceName: cleanText(form.serviceName),
        customLink: cleanText(form.customLink),
        startDate: form.startDate,
        expiryDate: form.expiryDate,
        desktopImageUrl: form.desktopImageUrl,
        desktopImagePath: form.desktopImagePath,
        mobileImageUrl: form.mobileImageUrl,
        mobileImagePath: form.mobileImagePath,
      };

    case "quick-services":
      return {
        ...base,
        title: cleanText(form.title),
        shortDescription: cleanText(form.shortDescription),
        serviceId: cleanText(form.serviceId),
        serviceSlug: cleanText(form.serviceSlug),
        serviceName: cleanText(form.serviceName),
        iconName: cleanText(form.iconName),
      };

    case "about":
      return {
        ...base,
        label: cleanText(form.label),
        heading: cleanText(form.heading),
        paragraphOne: cleanText(form.paragraphOne),
        paragraphTwo: cleanText(form.paragraphTwo),
        buttonLabel: cleanText(form.buttonLabel),
        buttonLink: cleanText(form.buttonLink),
        imageUrl: form.imageUrl,
        imagePath: form.imagePath,
      };

    case "introduction-video":
      return {
        ...base,
        title: cleanText(form.title),
        description: cleanText(form.description),
        duration: cleanText(form.duration),
        posterUrl: form.posterUrl,
        posterPath: form.posterPath,
        videoUrl: form.videoUrl,
        videoPath: form.videoPath,
      };

    case "customer-stories":
      return {
        ...base,
        businessName: cleanText(form.businessName),
        videoTitle: cleanText(form.videoTitle),
        description: cleanText(form.description),
        duration: cleanText(form.duration),
        posterUrl: form.posterUrl,
        posterPath: form.posterPath,
        videoUrl: form.videoUrl,
        videoPath: form.videoPath,
      };

    case "reviews":
      return {
        ...base,
        reviewerName: cleanText(form.reviewerName),
        businessName: cleanText(form.businessName),
        rating: Math.min(5, Math.max(1, Number(form.rating) || 5)),
        reviewText: cleanText(form.reviewText),
        serviceUsed: cleanText(form.serviceUsed),
      };

    case "faqs":
      return {
        ...base,
        question: cleanText(form.question),
        answer: cleanText(form.answer),
      };
  }
}

async function uploadFormFiles(
  tab: HomeContentTab,
  itemId: string,
  form: HomeContentFormState,
  onProgress?: (progress: UploadProgressState) => void,
): Promise<HomeContentFormState> {
  const nextForm = { ...form };

  if (form.desktopImageFile) {
    const result = await uploadFile(
      buildStoragePath(
        tab,
        itemId,
        "images",
        "desktop",
        form.desktopImageFile,
      ),
      form.desktopImageFile,
      "Uploading desktop image",
      onProgress,
    );

    await removeStoragePath(form.desktopImagePath);
    nextForm.desktopImageUrl = result.url;
    nextForm.desktopImagePath = result.path;
  }

  if (form.mobileImageFile) {
    const result = await uploadFile(
      buildStoragePath(
        tab,
        itemId,
        "images",
        "mobile",
        form.mobileImageFile,
      ),
      form.mobileImageFile,
      "Uploading mobile image",
      onProgress,
    );

    await removeStoragePath(form.mobileImagePath);
    nextForm.mobileImageUrl = result.url;
    nextForm.mobileImagePath = result.path;
  }

  if (form.imageFile) {
    const result = await uploadFile(
      buildStoragePath(tab, itemId, "images", "image", form.imageFile),
      form.imageFile,
      "Uploading image",
      onProgress,
    );

    await removeStoragePath(form.imagePath);
    nextForm.imageUrl = result.url;
    nextForm.imagePath = result.path;
  }

  if (form.posterFile) {
    const result = await uploadFile(
      buildStoragePath(tab, itemId, "images", "poster", form.posterFile),
      form.posterFile,
      "Uploading poster",
      onProgress,
    );

    await removeStoragePath(form.posterPath);
    nextForm.posterUrl = result.url;
    nextForm.posterPath = result.path;
  }

  if (form.videoFile) {
    const result = await uploadFile(
      buildStoragePath(tab, itemId, "videos", "video", form.videoFile),
      form.videoFile,
      "Uploading video",
      onProgress,
    );

    await removeStoragePath(form.videoPath);
    nextForm.videoUrl = result.url;
    nextForm.videoPath = result.path;
  }

  return nextForm;
}

export async function getHomeContentItems(
  tab: HomeContentTab,
): Promise<HomeContentItem[]> {
  const definition = getHomeContentTabDefinition(tab);
  const contentQuery = query(
    collection(db, definition.collectionName),
    orderBy("displayOrder", "asc"),
  );
  const snapshot = await getDocs(contentQuery);

  return snapshot.docs.map((documentSnapshot) =>
    mapDocument<HomeContentItem>(documentSnapshot),
  );
}

export async function getServiceOptions(): Promise<ServiceOption[]> {
  const snapshot = await getDocs(collection(db, "services"));

  return snapshot.docs
    .map((documentSnapshot) => {
      const data = documentSnapshot.data();

      return {
        id: documentSnapshot.id,
        name: String(data.name || data.serviceName || data.title || "Untitled Service"),
        slug: String(data.slug || ""),
        categoryName: String(data.categoryName || ""),
      };
    })
    .sort((first, second) => first.name.localeCompare(second.name));
}

export async function saveHomeContentItem({
  tab,
  form,
  itemId,
  onProgress,
}: SaveHomeContentOptions): Promise<string> {
  const definition = getHomeContentTabDefinition(tab);
  const documentReference = itemId
    ? doc(db, definition.collectionName, itemId)
    : doc(collection(db, definition.collectionName));

  const uploadedForm = await uploadFormFiles(
    tab,
    documentReference.id,
    form,
    onProgress,
  );

  const payload = buildTabPayload(tab, uploadedForm);

  await setDoc(
    documentReference,
    {
      ...payload,
      ...(itemId ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );

  onProgress?.({ label: "Saved successfully", percentage: 100 });
  return documentReference.id;
}

export async function updateHomeContentActive(
  tab: HomeContentTab,
  itemId: string,
  active: boolean,
): Promise<void> {
  const definition = getHomeContentTabDefinition(tab);

  await updateDoc(doc(db, definition.collectionName, itemId), {
    active,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteHomeContentItem(
  tab: HomeContentTab,
  item: HomeContentItem,
): Promise<void> {
  const definition = getHomeContentTabDefinition(tab);

  await Promise.all([
    removeStoragePath(item.desktopImagePath),
    removeStoragePath(item.mobileImagePath),
    removeStoragePath(item.imagePath),
    removeStoragePath(item.posterPath),
    removeStoragePath(item.videoPath),
  ]);

  await deleteDoc(doc(db, definition.collectionName, item.id));
}
