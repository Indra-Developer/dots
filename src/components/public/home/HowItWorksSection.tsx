import PublicSvgIcon from "../PublicSvgIcon";
import SectionHeading from "./SectionHeading";

const steps = [
  {
    number: "01",
    icon: "Search",
    title: "Choose a Service",
    description:
      "Select the registration, tax or accounting service you need.",
  },
  {
    number: "02",
    icon: "Building2",
    title: "Share Basic Details",
    description:
      "Provide your business type and contact information.",
  },
  {
    number: "03",
    icon: "FileCheck2",
    title: "Receive Checklist and Quote",
    description:
      "Receive the required documents and starting charges.",
  },
  {
    number: "04",
    icon: "BadgeCheck",
    title: "Complete the Service",
    description:
      "Receive progress updates and final completion details.",
  },
];

function HowItWorksSection() {
  return (
    <section className="bg-[#f7f9fc] px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading title="A simple process from enquiry to completion" />

        <div className="relative mt-12 grid gap-5 lg:grid-cols-4">
          <div className="absolute left-[12%] right-[12%] top-12 hidden h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent lg:block" />

          {steps.map((step, index) => (
            <article
              key={step.number}
              className="group relative rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_38px_rgba(37,99,235,0.10)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={[
                    "relative z-10 flex h-12 w-12 items-center justify-center rounded-xl",
                    index % 2 === 0
                      ? "bg-blue-50 text-blue-600"
                      : "bg-slate-100 text-slate-700",
                  ].join(" ")}
                >
                  <PublicSvgIcon name={step.icon} className="h-6 w-6" />
                </span>

                <span className="text-4xl font-black tracking-[-0.08em] text-slate-100 transition group-hover:text-blue-100">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-bold text-[#101a33]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-500">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
