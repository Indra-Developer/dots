import PublicIcon from "../PublicIcon";
import type { PublicServiceDetails } from "../../../types/publicServiceDetails";

interface ServiceAboutSectionProps {
  service: PublicServiceDetails;
}

interface ContentSection {
  id: string;
  label: string;
  title: string;
  content: string;
}

function ServiceAboutSection({
  service,
}: ServiceAboutSectionProps) {
  const aboutSections: ContentSection[] = [
    {
      id: "what-is-service",
      label: "Overview",
      title: "What is this service?",
      content: service.about.whatIsService,
    },
    {
      id: "who-needs-it",
      label: "Who Needs It",
      title: "Who needs this service?",
      content: service.about.whoNeedsIt,
    },
    {
      id: "eligibility",
      label: "Eligibility",
      title: "Eligibility",
      content: service.about.eligibility,
    },
    {
      id: "validity-renewal",
      label: "Validity",
      title: "Validity or renewal",
      content: service.about.validityRenewal,
    },
    {
      id: "compliance-after-registration",
      label: "Compliance",
      title: "Compliance after registration",
      content: service.about.complianceAfterRegistration,
    },
    {
      id: "important-information",
      label: "Important",
      title: "Important information",
      content: service.about.importantInformation,
    },
  ].filter((section) => section.content.trim());

  const tableOfContents = [
    ...aboutSections.map((section) => ({
      id: section.id,
      label: section.label,
    })),
    ...(service.about.benefits.length > 0
      ? [{ id: "benefits", label: "Benefits" }]
      : []),
    ...(service.documentGroups.length > 0
      ? [{ id: "documents", label: "Documents" }]
      : []),
    ...(service.processSteps.length > 0
      ? [{ id: "process", label: "Process" }]
      : []),
    ...(service.pricingTabs.length > 0
      ? [{ id: "pricing", label: "Pricing" }]
      : []),
    { id: "quotation", label: "Get Quotation" },
  ];

  return (
    <section id="about-service" className="bg-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:px-8 lg:py-20">
        <aside className="hidden lg:block">
          <div className="sticky top-[108px] rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="px-3 pb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
              On this page
            </p>
            <nav className="grid gap-1">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-700 hover:shadow-sm"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="mb-10">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
              About This Service
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#101a33] sm:text-4xl">
              Clear information before you begin
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-600">
              Understand the purpose, eligibility, benefits and ongoing
              requirements before requesting a quotation.
            </p>
          </div>

          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {aboutSections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="py-8 first:pt-0 last:pb-0"
              >
                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                  {section.title}
                </h3>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-slate-600">
                  {section.content}
                </p>
              </article>
            ))}
          </div>

          {service.about.benefits.length > 0 && (
            <section id="benefits" className="pt-14">
              <h3 className="text-2xl font-bold text-slate-900">
                Main benefits
              </h3>
              <p className="mt-3 text-slate-600">
                Key advantages you can expect from this service.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {service.about.benefits.map((benefit, index) => (
                  <article
                    key={benefit.id}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_16px_38px_rgba(15,23,42,0.08)]"
                  >
                    <span
                      className={[
                        "flex h-11 w-11 items-center justify-center rounded-xl",
                        index % 3 === 0
                          ? "bg-blue-50 text-blue-700"
                          : index % 3 === 1
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-violet-50 text-violet-700",
                      ].join(" ")}
                    >
                      <PublicIcon name={benefit.iconName} />
                    </span>
                    <h4 className="mt-4 font-bold text-slate-900">
                      {benefit.title}
                    </h4>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {benefit.description}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}

export default ServiceAboutSection;
