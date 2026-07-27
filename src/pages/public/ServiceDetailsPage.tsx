import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router";

import PublicSvgIcon from "../../components/public/PublicSvgIcon";
import RelatedServicesSection from "../../components/public/service-details/RelatedServicesSection";
import ServiceAboutSection from "../../components/public/service-details/ServiceAboutSection";
import ServiceDocumentsSection from "../../components/public/service-details/ServiceDocumentsSection";
import ServiceHeroSection from "../../components/public/service-details/ServiceHeroSection";
import ServicePricingSection from "../../components/public/service-details/ServicePricingSection";
import ServiceProcessSection from "../../components/public/service-details/ServiceProcessSection";
import ServiceQuotationSection from "../../components/public/service-details/ServiceQuotationSection";
import { getPublicServiceBySlug } from "../../services/public/serviceDetailsService";
import type {
  ServicePricingPackage,
  ServicePricingTab,
} from "../../types/serviceEditor";
import type { PublicServicePageData } from "../../types/publicServiceDetails";

interface ServiceRouteParams {
  slug: string;
}

function ServiceDetailsPage() {
  const { slug = "" } = useParams<keyof ServiceRouteParams>();
  const [pageData, setPageData] = useState<PublicServicePageData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState("");

  const defaultPackageSelection = useMemo(() => {
    if (!pageData) {
      return null;
    }

    const packageOptions = pageData.service.pricingTabs.flatMap(
      (pricingTab) =>
        pricingTab.packages.map((pricingPackage) => ({
          pricingTab,
          pricingPackage,
        })),
    );

    return (
      packageOptions.find(
        ({ pricingPackage }) => pricingPackage.recommended,
      ) || packageOptions[0] || null
    );
  }, [pageData]);

  useEffect(() => {
    let mounted = true;

    async function loadService(): Promise<void> {
      try {
        setLoading(true);
        setLoadError("");
        setNotFound(false);
        setPageData(null);

        const data = await getPublicServiceBySlug(slug);

        if (!mounted) {
          return;
        }

        if (!data) {
          setNotFound(true);
          return;
        }

        setPageData(data);
      } catch (error: unknown) {
        console.error("Public service loading failed:", error);

        if (mounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "The service details could not be loaded.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadService();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    setSelectedPackageId(
      defaultPackageSelection?.pricingPackage.id || "",
    );
  }, [defaultPackageSelection]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  useEffect(() => {
    if (pageData) {
      document.title = `${pageData.service.name} | DOTS`;
    }

    return () => {
      document.title = "DOTS";
    };
  }, [pageData]);

  function selectPackage(
    pricingPackage: ServicePricingPackage,
    _pricingTab: ServicePricingTab,
  ): void {
    setSelectedPackageId(pricingPackage.id);
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-white px-5 py-20">
        <div className="mx-auto max-w-[1180px] animate-pulse">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-slate-100" />
          <div className="mx-auto mt-6 h-4 w-32 rounded bg-slate-100" />
          <div className="mx-auto mt-5 h-12 max-w-xl rounded bg-slate-100" />
          <div className="mx-auto mt-5 h-6 max-w-2xl rounded bg-slate-100" />
          <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 rounded-2xl bg-slate-100"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-red-200 bg-white p-8 text-center shadow-xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <PublicSvgIcon name="X" className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to load this service
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            {loadError}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 h-11 rounded-xl bg-[#101a33] px-6 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  if (notFound || !pageData) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#f7f9fc] px-5 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <PublicSvgIcon name="Search" className="h-6 w-6" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Service not found
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            This service may be inactive, unpublished or no longer
            available.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-6 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Return Home
            <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </section>
      </main>
    );
  }

  const { service, quotationWhatsAppNumber } = pageData;

  return (
    <main>
      <ServiceHeroSection service={service} />
      <ServiceAboutSection service={service} />
      <ServiceDocumentsSection
        documentGroups={service.documentGroups}
      />
      <ServiceProcessSection processSteps={service.processSteps} />
      <ServicePricingSection
        pricingTabs={service.pricingTabs}
        selectedPackageId={selectedPackageId}
        onPackageSelect={selectPackage}
      />
      <ServiceQuotationSection
        service={service}
        quotationWhatsAppNumber={quotationWhatsAppNumber}
        selectedPackageId={selectedPackageId}
        onPackageSelect={selectPackage}
      />
      <RelatedServicesSection services={service.relatedServices} />
    </main>
  );
}

export default ServiceDetailsPage;
