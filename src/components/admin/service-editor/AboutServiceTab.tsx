import { Plus, Trash2 } from "lucide-react";

import {
  createServiceEditorId,
  serviceIconOptions,
} from "../../../constants/serviceEditor";
import type {
  ServiceAboutContent,
  ServiceBenefit,
  ServiceEditorErrors,
} from "../../../types/serviceEditor";

interface AboutServiceTabProps {
  about: ServiceAboutContent;
  errors: ServiceEditorErrors;
  onChange: (about: ServiceAboutContent) => void;
}

const textareaClass =
  "w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
const inputClass =
  "h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function AboutServiceTab({
  about,
  errors,
  onChange,
}: AboutServiceTabProps) {
  function updateField(
    field: keyof Omit<ServiceAboutContent, "benefits">,
    value: string,
  ): void {
    onChange({
      ...about,
      [field]: value,
    });
  }

  function addBenefit(): void {
    const nextBenefit: ServiceBenefit = {
      id: createServiceEditorId("benefit"),
      title: "",
      description: "",
      iconName: "BadgeCheck",
    };

    onChange({
      ...about,
      benefits: [...about.benefits, nextBenefit],
    });
  }

  function updateBenefit<K extends keyof ServiceBenefit>(
    benefitId: string,
    field: K,
    value: ServiceBenefit[K],
  ): void {
    onChange({
      ...about,
      benefits: about.benefits.map((benefit) =>
        benefit.id === benefitId
          ? { ...benefit, [field]: value }
          : benefit,
      ),
    });
  }

  function removeBenefit(benefitId: string): void {
    onChange({
      ...about,
      benefits: about.benefits.filter(
        (benefit) => benefit.id !== benefitId,
      ),
    });
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">
          About This Service
        </h2>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          Write clear, informative content that can be reused on the public
          Service Details Page.
        </p>

        <div className="mt-6 grid gap-5 xl:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              What is this service? <span className="text-red-500">*</span>
            </span>
            <textarea
              value={about.whatIsService}
              onChange={(event) =>
                updateField("whatIsService", event.target.value)
              }
              rows={6}
              className={textareaClass}
              placeholder="Explain the service in simple language, including its purpose and result."
            />
            {errors.whatIsService && (
              <p className="mt-1.5 text-xs text-red-600">
                {errors.whatIsService}
              </p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Who needs it?
            </span>
            <textarea
              value={about.whoNeedsIt}
              onChange={(event) =>
                updateField("whoNeedsIt", event.target.value)
              }
              rows={6}
              className={textareaClass}
              placeholder="Describe the business owners, professionals or organisations that need this service."
            />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Main Benefits</h2>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Add concise benefits with simple line icons.
            </p>
          </div>

          <button
            type="button"
            onClick={addBenefit}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Benefit
          </button>
        </div>

        {about.benefits.length === 0 ? (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No benefits added. Add the first benefit to explain the value of this
            service.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 xl:grid-cols-2">
            {about.benefits.map((benefit, index) => (
              <article
                key={benefit.id}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-slate-800">
                    Benefit {index + 1}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeBenefit(benefit.id)}
                    className="rounded-lg border border-red-200 p-2 text-red-500 transition hover:bg-red-50"
                    aria-label={`Remove benefit ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_180px]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Heading
                    </span>
                    <input
                      value={benefit.title}
                      onChange={(event) =>
                        updateBenefit(
                          benefit.id,
                          "title",
                          event.target.value,
                        )
                      }
                      className={inputClass}
                      placeholder="Transparent quotation"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-600">
                      Icon
                    </span>
                    <select
                      value={benefit.iconName}
                      onChange={(event) =>
                        updateBenefit(
                          benefit.id,
                          "iconName",
                          event.target.value,
                        )
                      }
                      className={inputClass}
                    >
                      {serviceIconOptions.map((option) => (
                        <option key={option.name} value={option.name}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-semibold text-slate-600">
                    One-line explanation
                  </span>
                  <textarea
                    value={benefit.description}
                    onChange={(event) =>
                      updateBenefit(
                        benefit.id,
                        "description",
                        event.target.value,
                      )
                    }
                    rows={3}
                    className={textareaClass}
                    placeholder="Explain this benefit clearly in one sentence."
                  />
                </label>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">
          Eligibility and Ongoing Information
        </h2>

        <div className="mt-5 grid gap-5 xl:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Eligibility
            </span>
            <textarea
              value={about.eligibility}
              onChange={(event) =>
                updateField("eligibility", event.target.value)
              }
              rows={5}
              className={textareaClass}
              placeholder="State the eligibility requirements."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Validity or Renewal
            </span>
            <textarea
              value={about.validityRenewal}
              onChange={(event) =>
                updateField("validityRenewal", event.target.value)
              }
              rows={5}
              className={textareaClass}
              placeholder="Explain validity, expiry and renewal requirements."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Compliance After Registration
            </span>
            <textarea
              value={about.complianceAfterRegistration}
              onChange={(event) =>
                updateField(
                  "complianceAfterRegistration",
                  event.target.value,
                )
              }
              rows={5}
              className={textareaClass}
              placeholder="Explain the filings, records or recurring compliance required later."
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Important Information
            </span>
            <textarea
              value={about.importantInformation}
              onChange={(event) =>
                updateField("importantInformation", event.target.value)
              }
              rows={5}
              className={textareaClass}
              placeholder="Add fees, limitations, exceptions or other important notes."
            />
          </label>
        </div>
      </section>
    </div>
  );
}

export default AboutServiceTab;
