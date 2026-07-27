import {
  useEffect,
  useState,
} from "react";
import {
  Outlet,
  useLocation,
} from "react-router";

import PublicFooter from "../components/public/PublicFooter";
import PublicHeader from "../components/public/PublicHeader";
import { getPublicNavigationData } from "../services/public/publicContentService";
import type {
  PublicCategory,
  PublicService,
} from "../types/publicContent";

const DEFAULT_WHATSAPP_NUMBER = "6304963771";

function PublicLayout() {
  const location = useLocation();
  const [categories, setCategories] = useState<PublicCategory[]>([]);
  const [services, setServices] = useState<PublicService[]>([]);
  const [quotationWhatsAppNumber, setQuotationWhatsAppNumber] =
    useState(DEFAULT_WHATSAPP_NUMBER);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPublicNavigation(): Promise<void> {
      try {
        setLoading(true);
        setLoadError("");

        const data = await getPublicNavigationData();

        if (!mounted) {
          return;
        }

        setCategories(data.categories);
        setServices(data.services);
        setQuotationWhatsAppNumber(
          data.settings.quotationWhatsAppNumber,
        );
      } catch (error: unknown) {
        console.error("Public navigation loading failed:", error);

        if (mounted) {
          setLoadError(
            "Some website navigation is temporarily unavailable.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadPublicNavigation();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const targetId = location.hash.replace("#", "");

    if (!targetId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const timer = window.setTimeout(() => {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [location.hash, location.pathname]);

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <PublicHeader
        categories={categories}
        services={services}
        quotationWhatsAppNumber={quotationWhatsAppNumber}
        loading={loading}
      />

      {loadError && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-center text-xs font-medium text-amber-800">
          {loadError}
        </div>
      )}

      <Outlet />

      <PublicFooter
        services={services}
        quotationWhatsAppNumber={quotationWhatsAppNumber}
      />
    </div>
  );
}

export default PublicLayout;
