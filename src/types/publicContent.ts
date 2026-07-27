export interface PublicCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  displayOrder: number;
}

export interface PublicService {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  shortDescription: string;
  iconName?: string;
  displayOrder: number;
}

export interface PublicSettings {
  quotationWhatsAppNumber: string;
}

export interface PublicNavigationData {
  categories: PublicCategory[];
  services: PublicService[];
  settings: PublicSettings;
}
