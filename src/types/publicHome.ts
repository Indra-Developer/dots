export interface PublicBanner {
  id: string;
  title?: string;
  serviceSlug?: string;
  customLink?: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  startDate?: string;
  expiryDate?: string;
  displayOrder?: number;
}

export interface PublicQuickService {
  id: string;
  title: string;
  shortDescription: string;
  serviceSlug?: string;
  iconName?: string;
  displayOrder?: number;
}

export interface PublicAboutContent {
  id: string;
  label: string;
  heading: string;
  paragraphOne: string;
  paragraphTwo: string;
  buttonLabel: string;
  buttonLink: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface PublicIntroductionVideo {
  id: string;
  title: string;
  description: string;
  duration?: string;
  posterUrl?: string;
  videoUrl?: string;
  displayOrder?: number;
}

export interface PublicCustomerStory {
  id: string;
  businessName: string;
  videoTitle: string;
  description?: string;
  duration?: string;
  posterUrl?: string;
  videoUrl?: string;
  displayOrder?: number;
}

export interface PublicReview {
  id: string;
  reviewerName: string;
  businessName?: string;
  rating: number;
  reviewText: string;
  serviceUsed?: string;
  displayOrder?: number;
}

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  displayOrder?: number;
}

export interface PublicHomeData {
  banners: PublicBanner[];
  quickServices: PublicQuickService[];
  about: PublicAboutContent | null;
  introductionVideo: PublicIntroductionVideo | null;
  customerStories: PublicCustomerStory[];
  reviews: PublicReview[];
  faqs: PublicFaq[];
  warnings: string[];
}
