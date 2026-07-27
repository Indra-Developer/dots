import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AboutCompanySection from "../../components/public/home/AboutCompanySection";
import ContactSection from "../../components/public/home/ContactSection";
import CustomerReviewsSection from "../../components/public/home/CustomerReviewsSection";
import CustomerStoriesSection from "../../components/public/home/CustomerStoriesSection";
import FaqSection from "../../components/public/home/FaqSection";
import HeroBannerSlider from "../../components/public/home/HeroBannerSlider";
import HowItWorksSection from "../../components/public/home/HowItWorksSection";
import IntroductionVideoSection from "../../components/public/home/IntroductionVideoSection";
import QuickServicesSection from "../../components/public/home/QuickServicesSection";
import WhyChooseUsSection from "../../components/public/home/WhyChooseUsSection";
import PublicSvgIcon from "../../components/public/PublicSvgIcon";
import { getPublicHomeData } from "../../services/public/homePageService";
import type { PublicHomeData } from "../../types/publicHome";

const initialHomeData: PublicHomeData = {
  banners: [],
  quickServices: [],
  about: null,
  introductionVideo: null,
  customerStories: [],
  reviews: [],
  faqs: [],
  warnings: [],
};

function HomePage() {
  const [homeData, setHomeData] = useState<PublicHomeData>(initialHomeData);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadHomePage = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setLoadError("");

      const data = await getPublicHomeData();
      setHomeData(data);

      if (data.warnings.length > 0) {
        console.warn(
          "Some public Home Page content could not be loaded:",
          data.warnings,
        );
      }
    } catch (error: unknown) {
      console.error("Public Home Page loading failed:", error);
      setLoadError(
        "Some website content could not be loaded. Please refresh the page.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHomePage();
  }, [loadHomePage]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 lg:px-8">
          <div className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-100 sm:aspect-[16/7] lg:aspect-[3/1]" />
        </div>

        <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto h-9 w-64 animate-pulse rounded-lg bg-slate-100" />
          <div className="mx-auto mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-slate-100" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="overflow-hidden bg-white">
      {loadError && (
        <div className="mx-auto mt-4 flex max-w-[1320px] flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => void loadHomePage()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-amber-200 bg-white px-4 font-bold transition hover:bg-amber-100"
          >
            <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
            Retry
          </button>
        </div>
      )}

      <HeroBannerSlider banners={homeData.banners} />
      <QuickServicesSection services={homeData.quickServices} />
      <AboutCompanySection content={homeData.about} />
      <IntroductionVideoSection video={homeData.introductionVideo} />
      <HowItWorksSection />
      <WhyChooseUsSection />
      <CustomerStoriesSection stories={homeData.customerStories} />
      <CustomerReviewsSection reviews={homeData.reviews} />
      <FaqSection faqs={homeData.faqs} />
      <ContactSection />
    </main>
  );
}

export default HomePage;
