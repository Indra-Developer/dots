import PublicIcon from "../PublicIcon";
import PublicSvgIcon from "../PublicSvgIcon";
import type { PublicServiceDetails } from "../../../types/publicServiceDetails";

interface ServiceHeroSectionProps {
  service: PublicServiceDetails;
}

function formatStartingPrice(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "On Request";
  }

  const numericValue = Number(trimmedValue.replace(/[^0-9.]/g, ""));

  if (!Number.isNaN(numericValue) && numericValue > 0) {
    return `₹${numericValue.toLocaleString("en-IN")}`;
  }

  return trimmedValue;
}

function ServiceHeroSection({
  service,
}: ServiceHeroSectionProps) {
  function scrollToQuotation(): void {
    document
      .getElementById("quotation")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const facts = [
    {
      label: "Starting Price",
      value: formatStartingPrice(service.startingPrice),
      iconName: "CircleDollarSign",
      tone: "bg-blue-50 text-blue-700",
    },
    {
      label: "Expected Duration",
      value: service.duration || "Depends on documents",
      iconName: "FileCheck2",
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "Support Mode",
      value: "Online & Local Support",
      iconName: "Headphones",
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div
        aria-hidden="true"
        className="absolute -left-40 -top-52 h-[480px] w-[480px] rounded-full bg-blue-100/60 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-64 -right-40 h-[520px] w-[520px] rounded-full bg-violet-100/50 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1280px] px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <a href="/" className="transition hover:text-blue-700">
            Home
          </a>
          <PublicSvgIcon
            name="ArrowRight"
            className="h-4 w-4 text-slate-300"
          />
          <span>{service.categoryName}</span>
          <PublicSvgIcon
            name="ArrowRight"
            className="h-4 w-4 text-slate-300"
          />
          <span className="font-semibold text-slate-800">
            {service.name}
          </span>
        </nav>

        <div className="mx-auto mt-10 max-w-4xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-100 bg-white text-blue-600 shadow-[0_14px_35px_rgba(37,99,235,0.14)]">
            <PublicIcon
              name={service.iconName}
              className="h-8 w-8"
            />
          </span>

          <p className="mt-6 text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            {service.categoryName}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-[#101a33] sm:text-5xl lg:text-6xl">
            {service.name}
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-600 sm:text-lg">
            {service.shortDescription ||
              `Get clear professional assistance for ${service.name.toLowerCase()}, including document guidance, application support and regular progress updates.`}
          </p>

          <button
            type="button"
            onClick={scrollToQuotation}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-7 text-sm font-bold text-white shadow-[0_14px_32px_rgba(16,26,51,0.22)] transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            Get Quotation
            <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
          </button>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-3 sm:grid-cols-3">
          {facts.map((fact) => (
            <article
              key={fact.label}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 text-left shadow-sm backdrop-blur"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${fact.tone}`}
              >
                <PublicIcon name={fact.iconName} />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {fact.label}
                </span>
                <span className="mt-1 block font-bold text-slate-900">
                  {fact.value}
                </span>
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceHeroSection;
