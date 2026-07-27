import type { Timestamp } from "firebase/firestore";

export type NavigationDateValue =
  | Timestamp
  | Date
  | string
  | null
  | undefined;

export type ServicePublicationStatus = "draft" | "published";

export interface NavigationCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  displayOrder: number;
  active: boolean;
  createdAt?: NavigationDateValue;
  updatedAt?: NavigationDateValue;
}

export interface NavigationService {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  displayOrder: number;
  active: boolean;
  status: ServicePublicationStatus;
  createdAt?: NavigationDateValue;
  updatedAt?: NavigationDateValue;
}

export interface NavigationManagerData {
  categories: NavigationCategory[];
  services: NavigationService[];
}

export interface CategoryFormState {
  name: string;
  slug: string;
  iconName: string;
  displayOrder: number;
  active: boolean;
}

export interface ServiceFormState {
  name: string;
  slug: string;
  categoryId: string;
  shortDescription: string;
  displayOrder: number;
  active: boolean;
  status: ServicePublicationStatus;
}

export type NavigationDrawerMode = "category" | "service";

export interface DeleteNavigationTarget {
  type: NavigationDrawerMode;
  id: string;
  name: string;
  serviceCount?: number;
}
