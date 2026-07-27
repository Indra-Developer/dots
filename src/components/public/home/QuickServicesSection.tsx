import { Link } from "react-router";

import type { PublicQuickService } from "../../../types/publicHome";
import PublicIcon from "../PublicIcon";
import PublicSvgIcon from "../PublicSvgIcon";
import SectionHeading from "./SectionHeading";

interface QuickServicesSectionProps {
  services: PublicQuickService[];
}

const fallbackServices: PublicQuickService[] = [
  {
    id: "company-registration",
    title: "Company Registration",
    shortDescription:
      "Start your company with clear registration and document support.",
    serviceSlug: "company-registration",
    iconName: "Building2",
    displayOrder: 1,
  },
  {
    id: "gst-registration",
    title: "GST Registration",
    shortDescription:
      "Get your GST registration completed with professional guidance.",
    serviceSlug: "gst-registration",
    iconName: "ReceiptText",
    displayOrder: 2,
  },
  {
    id: "msme-registration",
    title: "MSME Registration",
    shortDescription:
      "Register your business as an MSME and access eligible benefits.",
    serviceSlug: "msme-registration",
    iconName: "Store",
    displayOrder: 3,
  },
  {
    id: "income-tax-filing",
    title: "Income Tax Filing",
    shortDescription:
      "File your returns accurately with simple document assistance.",
    serviceSlug: "income-tax-filing",
    iconName: "Calculator",
    displayOrder: 4,
  },
  {
    id: "roc-compliance",
    title: "ROC Compliance",
    shortDescription:
      "Manage annual filings and company compliance requirements.",
    serviceSlug: "roc-compliance",
    iconName: "Landmark",
    displayOrder: 5,
  },
  {
    id: "trademark-registration",
    title: "Trademark Registration",
    shortDescription:
      "Protect your business name, logo and brand identity.",
    serviceSlug: "trademark-registration",
    iconName: "ShieldCheck",
    displayOrder: 6,
  },
  {
    id: "monthly-bookkeeping",
    title: "Monthly Bookkeeping",
    shortDescription:
      "Keep your accounts organised with dependable monthly support.",
    serviceSlug: "monthly-bookkeeping",
    iconName: "BookOpenCheck",
    displayOrder: 7,
  },
  {
    id: "pf-esi",
    title: "PF & ESI",
    shortDescription:
      "Get registration and recurring employee-compliance assistance.",
    serviceSlug: "pf-esi",
    iconName: "UsersRound",
    displayOrder: 8,
  },
];

function QuickServicesSection({
  services,
}: QuickServicesSectionProps) {
  const visibleServices =
    services.length > 0 ? services.slice(0, 8) : fallbackServices;

  return (
    <section id="quick-services" className="scroll-mt-24 bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          title="Quick Services"
          description="Choose a service to view its requirements, process and pricing."
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {visibleServices.map((service, index) => {
            const destination = service.serviceSlug
              ? `/service/${service.serviceSlug}`
              : "/#contact";

            const accentClasses = [
              "bg-blue-50 text-blue-600",
              "bg-emerald-50 text-emerald-600",
              "bg-violet-50 text-violet-600",
              "bg-amber-50 text-amber-600",
            ];

            return (
              <Link
                key={service.id}
                to={destination}
                className="group flex min-h-[220px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_38px_rgba(37,99,235,0.10)]"
              >
                <span
                  className={[
                    "flex h-12 w-12 items-center justify-center rounded-xl transition duration-300 group-hover:scale-105",
                    accentClasses[index % accentClasses.length],
                  ].join(" ")}
                >
                  <PublicIcon
                    name={service.iconName}
                    className="h-6 w-6"
                  />
                </span>

                <h3 className="mt-5 text-lg font-bold text-[#101a33]">
                  {service.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
                  {service.shortDescription}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600">
                  View Details
                  <PublicSvgIcon
                    name="ArrowRight"
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default QuickServicesSection;
