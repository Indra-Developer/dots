import { Link } from "react-router";

import type { PublicAboutContent } from "../../../types/publicHome";
import PublicSvgIcon from "../PublicSvgIcon";

interface AboutCompanySectionProps {
  content: PublicAboutContent | null;
}

const highlights = [
  {
    icon: "Building2",
    title: "Business registration assistance",
  },
  {
    icon: "Calculator",
    title: "Tax and compliance support",
  },
  {
    icon: "FileCheck2",
    title: "Clear document guidance",
  },
  {
    icon: "Headphones",
    title: "Online and local assistance",
  },
];

function AboutCompanySection({
  content,
}: AboutCompanySectionProps) {
  const label = content?.label || "ABOUT US";
  const heading =
    content?.heading ||
    "Reliable support for registration, accounting and compliance";
  const paragraphOne =
    content?.paragraphOne ||
    "DOTS helps entrepreneurs, professionals and business owners complete registrations, taxation, accounting and compliance processes through clear and practical assistance.";
  const paragraphTwo =
    content?.paragraphTwo ||
    "From starting a new business to managing regular filings and bookkeeping, our team provides clear document guidance and keeps every customer informed throughout the process.";
  const buttonLabel = content?.buttonLabel || "Learn More";
  const buttonLink = content?.buttonLink || "/#contact";

  return (
    <section
      id="about"
      className="scroll-mt-24 bg-[#f7f7f5] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          {content?.imageUrl ? (
            <img
              src={content.imageUrl}
              alt="DOTS accounting consultation"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[0_24px_60px_rgba(15,23,42,0.13)]"
              loading="lazy"
            />
          ) : (
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white via-[#f0f5ff] to-[#eef1f6] shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
              <div className="absolute left-[8%] top-[12%] h-[65%] w-[52%] rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="h-10 w-10 rounded-full bg-blue-100" />
                  <div className="space-y-2">
                    <span className="block h-2.5 w-24 rounded-full bg-slate-200" />
                    <span className="block h-2 w-16 rounded-full bg-slate-100" />
                  </div>
                </div>
                <div className="mt-7 grid gap-3">
                  <span className="h-3 rounded-full bg-slate-100" />
                  <span className="h-3 w-4/5 rounded-full bg-slate-100" />
                  <span className="h-3 w-2/3 rounded-full bg-slate-100" />
                </div>
                <div className="mt-8 flex gap-3">
                  <span className="h-16 flex-1 rounded-xl bg-blue-50" />
                  <span className="h-16 flex-1 rounded-xl bg-emerald-50" />
                </div>
              </div>

              <div className="absolute bottom-[8%] right-[7%] flex h-[52%] w-[43%] items-center justify-center rounded-2xl bg-[#101a33] text-white shadow-2xl">
                <PublicSvgIcon
                  name="Calculator"
                  className="h-20 w-20 opacity-90"
                />
              </div>

              <span className="absolute right-[31%] top-[9%] h-14 w-14 rounded-2xl bg-blue-500/90 shadow-lg" />
              <span className="absolute bottom-[10%] left-[4%] h-10 w-10 rounded-full bg-amber-400/80" />
            </div>
          )}

          <div className="absolute -bottom-5 -right-3 hidden rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-xl sm:block">
            <p className="text-sm font-bold text-[#101a33]">
              Clear. Reliable. Professional.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Support at every stage
            </p>
          </div>
        </div>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600 sm:text-sm">
            {label}
          </p>

          <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-[#101a33] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            {heading}
          </h2>

          <p className="mt-6 text-base leading-8 text-slate-600">
            {paragraphOne}
          </p>
          <p className="mt-4 text-base leading-8 text-slate-600">
            {paragraphTwo}
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {highlights.map((highlight, index) => (
              <div
                key={highlight.title}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span
                  className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    index % 2 === 0
                      ? "bg-blue-50 text-blue-600"
                      : "bg-emerald-50 text-emerald-600",
                  ].join(" ")}
                >
                  <PublicSvgIcon
                    name={highlight.icon}
                    className="h-[18px] w-[18px]"
                  />
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {highlight.title}
                </span>
              </div>
            ))}
          </div>

          <Link
            to={buttonLink}
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-6 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-700"
          >
            {buttonLabel}
            <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default AboutCompanySection;
