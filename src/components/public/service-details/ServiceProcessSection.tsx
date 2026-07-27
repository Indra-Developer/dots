import PublicIcon from "../PublicIcon";
import type { ServiceProcessStep } from "../../../types/serviceEditor";

interface ServiceProcessSectionProps {
  processSteps: ServiceProcessStep[];
}

function ServiceProcessSection({
  processSteps,
}: ServiceProcessSectionProps) {
  if (processSteps.length === 0) {
    return null;
  }

  return (
    <section id="process" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">
            Service Process
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-[#101a33] sm:text-4xl">
            A clear process from start to completion
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            We guide you at every stage and keep you informed about the
            current progress.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute bottom-7 left-6 top-7 hidden w-px bg-slate-200 sm:block lg:left-1/2" />

          <div className="grid gap-5">
            {processSteps.map((step, index) => {
              const isLeft = index % 2 === 0;

              return (
                <article
                  key={step.id}
                  className={[
                    "relative grid items-center gap-5 sm:pl-16 lg:grid-cols-2 lg:pl-0",
                    isLeft ? "" : "lg:[&>div:first-child]:order-2",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]",
                      isLeft ? "lg:mr-10" : "lg:ml-10",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <PublicIcon name={step.iconName} />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">
                          Step {index + 1}
                        </p>
                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          {step.heading}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="hidden lg:block" />

                  <span className="absolute left-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border-4 border-white bg-[#101a33] text-sm font-bold text-white shadow-lg sm:flex lg:left-1/2 lg:-translate-x-1/2">
                    {index + 1}
                  </span>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceProcessSection;
