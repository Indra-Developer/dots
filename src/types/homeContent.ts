import type { Timestamp } from "firebase/firestore";

export type HomeContentTab =
  | "banners"
  | "quick-services"
  | "about"
  | "introduction-video"
  | "customer-stories"
  | "reviews"
  | "faqs";

export interface HomeContentTabDefinition {
  id: HomeContentTab;
  label: string;
  collectionName: string;
  singularLabel: string;
  addButtonLabel: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  slug: string;
  categoryName?: string;
}

export type HomeContentDateValue =
  | Timestamp
  | Date
  | string
  | null
  | undefined;

export interface HomeContentItem {
  id: string;
  title?: string;
  name?: string;
  label?: string;
  heading?: string;
  question?: string;
  reviewerName?: string;
  businessName?: string;
  videoTitle?: string;
  description?: string;
  shortDescription?: string;
  paragraphOne?: string;
  paragraphTwo?: string;
  answer?: string;
  reviewText?: string;
  serviceUsed?: string;
  serviceId?: string;
  serviceSlug?: string;
  serviceName?: string;
  customLink?: string;
  buttonLabel?: string;
  buttonLink?: string;
  iconName?: string;
  duration?: string;
  rating?: number;
  displayOrder?: number;
  active?: boolean;
  startDate?: string;
  expiryDate?: string;
  desktopImageUrl?: string;
  desktopImagePath?: string;
  mobileImageUrl?: string;
  mobileImagePath?: string;
  imageUrl?: string;
  imagePath?: string;
  posterUrl?: string;
  posterPath?: string;
  videoUrl?: string;
  videoPath?: string;
  createdAt?: HomeContentDateValue;
  updatedAt?: HomeContentDateValue;
}

export interface HomeContentFormState {
  title: string;
  label: string;
  heading: string;
  description: string;
  shortDescription: string;
  paragraphOne: string;
  paragraphTwo: string;
  question: string;
  answer: string;
  reviewerName: string;
  businessName: string;
  videoTitle: string;
  reviewText: string;
  serviceUsed: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  customLink: string;
  buttonLabel: string;
  buttonLink: string;
  iconName: string;
  duration: string;
  rating: number;
  displayOrder: number;
  active: boolean;
  startDate: string;
  expiryDate: string;
  desktopImageFile: File | null;
  mobileImageFile: File | null;
  imageFile: File | null;
  posterFile: File | null;
  videoFile: File | null;
  desktopImageUrl: string;
  desktopImagePath: string;
  mobileImageUrl: string;
  mobileImagePath: string;
  imageUrl: string;
  imagePath: string;
  posterUrl: string;
  posterPath: string;
  videoUrl: string;
  videoPath: string;
}

export interface UploadProgressState {
  label: string;
  percentage: number;
}
