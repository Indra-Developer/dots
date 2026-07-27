import PublicIcon from "../PublicIcon";
import type { ServiceDocumentGroup } from "../../../types/serviceEditor";

interface ServiceDocumentsSectionProps {
  documentGroups: ServiceDocumentGroup[];
}

function ServiceDocumentsSection({
  documentGroups,
}: ServiceDocumentsSectionProps) {
  if (documentGroups.length === 0) {
    return null;
  }

  return (
    <section id="documents" className="bg-[#f7f9fc]">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Required Documents
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#101a33] sm:text-4xl">
            Keep these documents ready
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            The exact requirement may vary after reviewing your business
            type and application details.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {documentGroups.map((group, groupIndex) => (
            <article
              key={group.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-center gap-4">
                <span
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    groupIndex % 4 === 0
                      ? "bg-blue-50 text-blue-700"
                      : groupIndex % 4 === 1
                        ? "bg-emerald-50 text-emerald-700"
                        : groupIndex % 4 === 2
                          ? "bg-violet-50 text-violet-700"
                          : "bg-amber-50 text-amber-700",
                  ].join(" ")}
                >
                  <PublicIcon name={group.iconName} />
                </span>
                <h3 className="text-xl font-bold text-slate-900">
                  {group.title}
                </h3>
              </div>

              <ul className="mt-6 grid gap-3">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <PublicIcon
                        name="BadgeCheck"
                        className="h-3.5 w-3.5"
                      />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServiceDocumentsSection;
