import PublicSvgIcon from "../PublicSvgIcon";

const features = [
  {
    icon: "Sparkles",
    title: "Simple process",
    description: "Clear steps without unnecessary complexity.",
  },
  {
    icon: "FileCheck2",
    title: "Clear documentation",
    description: "Easy checklists and practical document guidance.",
  },
  {
    icon: "CircleDollarSign",
    title: "Transparent quotation",
    description: "Professional charges and notes explained clearly.",
  },
  {
    icon: "MessageCircle",
    title: "Regular updates",
    description: "Know the progress of your service at every stage.",
  },
  {
    icon: "Headphones",
    title: "Professional assistance",
    description: "Friendly support from experienced professionals.",
  },
  {
    icon: "ShieldCheck",
    title: "Secure document handling",
    description: "Your business information is handled responsibly.",
  },
];

function WhyChooseUsSection() {
  return (
    <section className="overflow-hidden bg-[#eef2f7] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600 sm:text-sm">
            WHY CHOOSE US
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-[#101a33] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            Clear professional support at every stage
          </h2>
          <p className="mt-5 text-base leading-8 text-slate-600">
            We simplify documentation, explain charges clearly and provide regular updates.
          </p>

          <div className="relative mt-9 aspect-[16/10] overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_24px_65px_rgba(15,23,42,0.12)]">
            <div className="absolute bottom-[10%] left-[7%] right-[7%] h-[13%] rounded-full bg-slate-200/70 blur-xl" />
            <div className="absolute left-[9%] top-[15%] flex h-[58%] w-[31%] items-center justify-center rounded-2xl bg-[#101a33] text-white shadow-xl">
              <PublicSvgIcon name="Calculator" className="h-16 w-16" />
            </div>
            <div className="absolute left-[38%] top-[22%] flex h-[48%] w-[29%] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-blue-600 shadow-lg">
              <PublicSvgIcon name="FileCheck2" className="h-16 w-16" />
            </div>
            <div className="absolute right-[7%] top-[12%] flex h-[62%] w-[27%] items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-lg">
              <PublicSvgIcon name="ShieldCheck" className="h-16 w-16" />
            </div>
            <div className="absolute bottom-[15%] left-[26%] flex h-14 w-[49%] items-end justify-around rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
              {[40, 62, 50, 82, 68].map((height, index) => (
                <span
                  key={`${height}-${index}`}
                  style={{ height: `${height}%` }}
                  className="w-[9%] rounded-t bg-gradient-to-t from-blue-600 to-blue-300"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_38px_rgba(37,99,235,0.10)]"
            >
              <span
                className={[
                  "flex h-11 w-11 items-center justify-center rounded-xl",
                  index % 3 === 0
                    ? "bg-blue-50 text-blue-600"
                    : index % 3 === 1
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-violet-50 text-violet-600",
                ].join(" ")}
              >
                <PublicSvgIcon name={feature.icon} className="h-5 w-5" />
              </span>

              <h3 className="mt-4 font-bold text-[#101a33]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUsSection;
