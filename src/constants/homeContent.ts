import type {
  HomeContentFormState,
  HomeContentTab,
  HomeContentTabDefinition,
  HomeContentItem,
} from "../types/homeContent";

export const homeContentTabs: HomeContentTabDefinition[] = [
  {
    id: "banners",
    label: "Banners",
    collectionName: "banners",
    singularLabel: "Banner",
    addButtonLabel: "Add New Banner",
  },
  {
    id: "quick-services",
    label: "Quick Services",
    collectionName: "quickServices",
    singularLabel: "Quick Service",
    addButtonLabel: "Add Quick Service",
  },
  {
    id: "about",
    label: "About",
    collectionName: "aboutContent",
    singularLabel: "About Content",
    addButtonLabel: "Add About Content",
  },
  {
    id: "introduction-video",
    label: "Introduction Video",
    collectionName: "introductionVideos",
    singularLabel: "Introduction Video",
    addButtonLabel: "Add Introduction Video",
  },
  {
    id: "customer-stories",
    label: "Customer Stories",
    collectionName: "customerStories",
    singularLabel: "Customer Story",
    addButtonLabel: "Add Customer Story",
  },
  {
    id: "reviews",
    label: "Reviews",
    collectionName: "reviews",
    singularLabel: "Review",
    addButtonLabel: "Add Review",
  },
  {
    id: "faqs",
    label: "FAQs",
    collectionName: "faqs",
    singularLabel: "FAQ",
    addButtonLabel: "Add FAQ",
  },
];

export function getHomeContentTabDefinition(
  tab: HomeContentTab,
): HomeContentTabDefinition {
  const definition = homeContentTabs.find((item) => item.id === tab);

  if (!definition) {
    throw new Error(`Unknown home content tab: ${tab}`);
  }

  return definition;
}

export function createEmptyHomeContentForm(): HomeContentFormState {
  return {
    title: "",
    label: "ABOUT US",
    heading: "",
    description: "",
    shortDescription: "",
    paragraphOne: "",
    paragraphTwo: "",
    question: "",
    answer: "",
    reviewerName: "",
    businessName: "",
    videoTitle: "",
    reviewText: "",
    serviceUsed: "",
    serviceId: "",
    serviceSlug: "",
    serviceName: "",
    customLink: "",
    buttonLabel: "Learn More",
    buttonLink: "",
    iconName: "FileText",
    duration: "",
    rating: 5,
    displayOrder: 1,
    active: true,
    startDate: "",
    expiryDate: "",
    desktopImageFile: null,
    mobileImageFile: null,
    imageFile: null,
    posterFile: null,
    videoFile: null,
    desktopImageUrl: "",
    desktopImagePath: "",
    mobileImageUrl: "",
    mobileImagePath: "",
    imageUrl: "",
    imagePath: "",
    posterUrl: "",
    posterPath: "",
    videoUrl: "",
    videoPath: "",
  };
}

export function createHomeContentFormFromItem(
  item: HomeContentItem,
): HomeContentFormState {
  return {
    ...createEmptyHomeContentForm(),
    title: item.title || "",
    label: item.label || "ABOUT US",
    heading: item.heading || "",
    description: item.description || "",
    shortDescription: item.shortDescription || "",
    paragraphOne: item.paragraphOne || "",
    paragraphTwo: item.paragraphTwo || "",
    question: item.question || "",
    answer: item.answer || "",
    reviewerName: item.reviewerName || "",
    businessName: item.businessName || "",
    videoTitle: item.videoTitle || "",
    reviewText: item.reviewText || "",
    serviceUsed: item.serviceUsed || "",
    serviceId: item.serviceId || "",
    serviceSlug: item.serviceSlug || "",
    serviceName: item.serviceName || "",
    customLink: item.customLink || "",
    buttonLabel: item.buttonLabel || "Learn More",
    buttonLink: item.buttonLink || "",
    iconName: item.iconName || "FileText",
    duration: item.duration || "",
    rating: item.rating || 5,
    displayOrder: item.displayOrder || 1,
    active: item.active !== false,
    startDate: item.startDate || "",
    expiryDate: item.expiryDate || "",
    desktopImageUrl: item.desktopImageUrl || "",
    desktopImagePath: item.desktopImagePath || "",
    mobileImageUrl: item.mobileImageUrl || "",
    mobileImagePath: item.mobileImagePath || "",
    imageUrl: item.imageUrl || "",
    imagePath: item.imagePath || "",
    posterUrl: item.posterUrl || "",
    posterPath: item.posterPath || "",
    videoUrl: item.videoUrl || "",
    videoPath: item.videoPath || "",
  };
}
