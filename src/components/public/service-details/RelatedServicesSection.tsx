import { Link } from "react-router";

import PublicIcon from "../PublicIcon";
import PublicSvgIcon from "../PublicSvgIcon";
import type { PublicRelatedService } from "../../../types/publicServiceDetails";

interface RelatedServicesSectionProps {
  services: PublicRelatedService[];
}

function RelatedServicesSection({
  services,
}: RelatedServicesSectionProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#f7f9fc]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Related Services
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#101a33] sm:text-4xl">
            Explore other business services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            Discover more services to start, manage and keep your
            business compliant.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => (
            <Link
              key={service.id}
              to={`/service/${service.slug}`}
              className="group flex min-h-[260px] flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)]"
            >
              <span
                className={[
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  index % 4 === 0
                    ? "bg-blue-50 text-blue-700"
                    : index % 4 === 1
                      ? "bg-emerald-50 text-emerald-700"
                      : index % 4 === 2
                        ? "bg-violet-50 text-violet-700"
                        : "bg-amber-50 text-amber-700",
                ].join(" ")}
              >
                <PublicIcon name={service.iconName} />
              </span>

              <p className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
                {service.categoryName}
              </p>
              <h3 className="mt-2 text-lg font-bold text-slate-900 transition group-hover:text-blue-700">
                {service.name}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                {service.shortDescription}
              </p>

              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-blue-700">
                View Details
                <PublicSvgIcon
                  name="ArrowRight"
                  className="h-4 w-4 transition group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RelatedServicesSection;
