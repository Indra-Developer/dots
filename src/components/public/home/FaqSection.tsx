import { useState } from "react";

import type { PublicFaq } from "../../../types/publicHome";
import PublicSvgIcon from "../PublicSvgIcon";
import SectionHeading from "./SectionHeading";

interface FaqSectionProps {
  faqs: PublicFaq[];
}

const fallbackFaqs: PublicFaq[] = [
  {
    id: "documents",
    question: "What documents are required?",
    answer:
      "Documents depend on the selected service and your business type. We provide a clear checklist after understanding your requirement.",
  },
  {
    id: "online",
    question: "Can the complete process be handled online?",
    answer:
      "Yes. Most registrations, taxation and compliance services can be completed online through digital documents and regular phone or WhatsApp updates.",
  },
  {
    id: "fees",
    question: "Are government fees included in the displayed price?",
    answer:
      "Government charges may be separate. Your final quotation will clearly explain professional fees, GST and applicable government costs.",
  },
  {
    id: "duration",
    question: "How long does registration normally take?",
    answer:
      "The expected duration depends on the service, document readiness and government processing. We provide an estimate before starting.",
  },
  {
    id: "accounting",
    question: "Do you provide monthly accounting support?",
    answer:
      "Yes. DOTS supports monthly bookkeeping, accounting reports, GST assistance, payroll and recurring compliance based on the selected package.",
  },
  {
    id: "accountant",
    question: "Can I speak directly with an accountant?",
    answer:
      "Yes. You can request a consultation with our accounting or compliance team to understand the process, documents, time and charges.",
  },
];

function FaqSection({ faqs }: FaqSectionProps) {
  const visibleFaqs = faqs.length > 0 ? faqs : fallbackFaqs;
  const [openId, setOpenId] = useState<string | null>(
    visibleFaqs[0]?.id || null,
  );

  return (
    <section
      id="faqs"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading title="Frequently Asked Questions" />

        <div className="mt-10 border-y border-slate-200 sm:mt-12">
          {visibleFaqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <article
                key={faq.id}
                className="border-b border-slate-200 last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex min-h-[74px] w-full items-center gap-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="min-w-0 flex-1 text-base font-bold text-[#101a33] sm:text-lg">
                    {faq.question}
                  </span>
                  <span
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition",
                      isOpen
                        ? "rotate-180 border-blue-200 bg-blue-50 text-blue-600"
                        : "border-slate-200 bg-white text-slate-500",
                    ].join(" ")}
                  >
                    <PublicSvgIcon
                      name="ChevronDown"
                      className="h-4 w-4"
                    />
                  </span>
                </button>

                <div
                  className={[
                    "grid transition-all duration-300 ease-out",
                    isOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-3xl pb-6 pr-12 text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
