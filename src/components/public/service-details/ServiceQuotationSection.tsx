import {
  useMemo,
  useState,
} from "react";

import PublicIcon from "../PublicIcon";
import PublicSvgIcon from "../PublicSvgIcon";
import {
  createQuotationWhatsAppUrl,
  submitPublicQuotation,
} from "../../../services/public/serviceDetailsService";
import type {
  ServicePricingPackage,
  ServicePricingTab,
} from "../../../types/serviceEditor";
import type {
  PublicServiceDetails,
  QuotationFormValues,
  QuotationSubmission,
} from "../../../types/publicServiceDetails";

interface ServiceQuotationSectionProps {
  service: PublicServiceDetails;
  quotationWhatsAppNumber: string;
  selectedPackageId: string;
  onPackageSelect: (
    pricingPackage: ServicePricingPackage,
    pricingTab: ServicePricingTab,
  ) => void;
}

type QuotationErrors = Partial<
  Record<keyof QuotationFormValues, string>
>;

const initialValues: QuotationFormValues = {
  name: "",
  phone: "",
  email: "",
  city: "",
  businessType: "",
  message: "",
};

function ServiceQuotationSection({
  service,
  quotationWhatsAppNumber,
  selectedPackageId,
  onPackageSelect,
}: ServiceQuotationSectionProps) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<QuotationErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [successReference, setSuccessReference] = useState("");

  const packageOptions = useMemo(
    () =>
      service.pricingTabs.flatMap((pricingTab) =>
        pricingTab.packages.map((pricingPackage) => ({
          pricingTab,
          pricingPackage,
        })),
      ),
    [service.pricingTabs],
  );

  const selectedOption =
    packageOptions.find(
      ({ pricingPackage }) =>
        pricingPackage.id === selectedPackageId,
    ) || packageOptions[0] || null;

  function updateField(
    field: keyof QuotationFormValues,
    value: string,
  ): void {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setRequestError("");
    setSuccessReference("");

    if (errors[field]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
      }));
    }
  }

  function validate(): QuotationErrors {
    const nextErrors: QuotationErrors = {};
    const phoneDigits = values.phone.replace(/\D/g, "");

    if (values.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (
      values.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.city.trim()) {
      nextErrors.city = "Enter your city.";
    }

    if (!values.businessType.trim()) {
      nextErrors.businessType = "Select your business type.";
    }

    return nextErrors;
  }

  function createSubmission(): QuotationSubmission {
    return {
      values,
      service,
      selectedPackage: selectedOption?.pricingPackage || null,
      pricingTab: selectedOption?.pricingTab || null,
    };
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setRequestError("");
    setSuccessReference("");

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const pendingWhatsAppWindow = window.open("", "_blank");

    try {
      setSubmitting(true);

      const submission = createSubmission();
      const result = await submitPublicQuotation(submission);
      const whatsappUrl = createQuotationWhatsAppUrl(
        quotationWhatsAppNumber,
        submission,
        result.reference,
      );

      setSuccessReference(result.reference);

      if (pendingWhatsAppWindow) {
        pendingWhatsAppWindow.location.href = whatsappUrl;
      } else {
        window.location.href = whatsappUrl;
      }
    } catch (error: unknown) {
      pendingWhatsAppWindow?.close();
      console.error("Quotation submission failed:", error);
      setRequestError(
        error instanceof Error
          ? error.message
          : "Your enquiry could not be saved. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleDirectWhatsApp(): void {
    const submission = createSubmission();
    window.open(
      createQuotationWhatsAppUrl(
        quotationWhatsAppNumber,
        submission,
      ),
      "_blank",
      "noopener,noreferrer",
    );
  }

  const inputClass =
    "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

  return (
    <section id="quotation" className="bg-white">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_65px_rgba(15,23,42,0.10)]">
          <div className="grid lg:grid-cols-[0.9fr_1.35fr]">
            <div className="relative overflow-hidden bg-[#101a33] p-7 text-white sm:p-9 lg:p-10">
              <div
                aria-hidden="true"
                className="absolute -left-28 -top-32 h-72 w-72 rounded-full bg-blue-500/25 blur-3xl"
              />
              <div
                aria-hidden="true"
                className="absolute -bottom-36 -right-32 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl"
              />

              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-300">
                  Get Quotation
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  Get a quotation for this service
                </h2>
                <p className="mt-4 leading-7 text-slate-300">
                  Share your basic details. Our team will review your
                  requirement and contact you with the next steps.
                </p>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                      Selected Service
                    </p>
                    <p className="mt-2 font-bold text-white">
                      {service.name}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-300">
                      Selected Package
                    </p>
                    <p className="mt-2 font-bold text-white">
                      {selectedOption?.pricingPackage.name ||
                        "Custom Quotation"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid gap-5">
                  {[
                    {
                      icon: "ShieldCheck",
                      title: "Secure & Confidential",
                      text: "Your information is used only to respond to this enquiry.",
                    },
                    {
                      icon: "Headphones",
                      title: "Professional Assistance",
                      text: "Receive support from our registration and compliance team.",
                    },
                    {
                      icon: "BadgeCheck",
                      title: "Clear Quotation",
                      text: "Understand professional fees and applicable charges clearly.",
                    },
                  ].map((point) => (
                    <div key={point.title} className="flex gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                        <PublicIcon name={point.icon} />
                      </span>
                      <div>
                        <p className="font-bold text-white">
                          {point.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          {point.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-8 lg:p-10"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Name <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={values.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    placeholder="Enter your full name"
                    className={inputClass}
                  />
                  {errors.name && (
                    <span className="mt-1.5 block text-xs text-red-600">
                      {errors.name}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Phone Number <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="tel"
                    value={values.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="Enter mobile number"
                    className={inputClass}
                  />
                  {errors.phone && (
                    <span className="mt-1.5 block text-xs text-red-600">
                      {errors.phone}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Email Address
                  </span>
                  <input
                    type="email"
                    value={values.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="Enter email address"
                    className={inputClass}
                  />
                  {errors.email && (
                    <span className="mt-1.5 block text-xs text-red-600">
                      {errors.email}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    City <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="text"
                    value={values.city}
                    onChange={(event) =>
                      updateField("city", event.target.value)
                    }
                    placeholder="Enter your city"
                    className={inputClass}
                  />
                  {errors.city && (
                    <span className="mt-1.5 block text-xs text-red-600">
                      {errors.city}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Business Type <span className="text-red-500">*</span>
                  </span>
                  <select
                    value={values.businessType}
                    onChange={(event) =>
                      updateField("businessType", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select business type</option>
                    <option value="Individual / Proprietor">
                      Individual / Proprietor
                    </option>
                    <option value="Partnership">Partnership</option>
                    <option value="LLP">LLP</option>
                    <option value="Private Limited Company">
                      Private Limited Company
                    </option>
                    <option value="Trust / Society">
                      Trust / Society
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.businessType && (
                    <span className="mt-1.5 block text-xs text-red-600">
                      {errors.businessType}
                    </span>
                  )}
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-800">
                    Selected Package
                  </span>
                  <select
                    value={selectedOption?.pricingPackage.id || ""}
                    onChange={(event) => {
                      const nextOption = packageOptions.find(
                        ({ pricingPackage }) =>
                          pricingPackage.id === event.target.value,
                      );

                      if (nextOption) {
                        onPackageSelect(
                          nextOption.pricingPackage,
                          nextOption.pricingTab,
                        );
                      }
                    }}
                    disabled={packageOptions.length === 0}
                    className={inputClass}
                  >
                    {packageOptions.length === 0 ? (
                      <option value="">Custom Quotation</option>
                    ) : (
                      packageOptions.map(
                        ({ pricingPackage, pricingTab }) => (
                          <option
                            key={pricingPackage.id}
                            value={pricingPackage.id}
                          >
                            {pricingPackage.name} — {pricingTab.label}
                          </option>
                        ),
                      )
                    )}
                  </select>
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-bold text-slate-800">
                  Message / Additional Requirements
                </span>
                <textarea
                  rows={5}
                  maxLength={500}
                  value={values.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Tell us about your business or any specific requirements..."
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <span className="mt-1 block text-right text-xs text-slate-400">
                  {values.message.length} / 500
                </span>
              </label>

              {requestError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {requestError}
                </div>
              )}

              {successReference && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  Enquiry saved successfully. Reference:{" "}
                  <strong>{successReference}</strong>
                </div>
              )}

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Saving Enquiry..." : "Get Quotation"}
                  {!submitting && (
                    <PublicSvgIcon
                      name="ArrowRight"
                      className="h-4 w-4"
                    />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-white px-5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                >
                  <PublicSvgIcon name="WhatsApp" className="h-5 w-5" />
                  Chat on WhatsApp
                </button>
              </div>

              <p className="mt-5 text-xs leading-5 text-slate-400">
                By submitting, you agree that DOTS may contact you about
                this enquiry. Government fees and third-party charges may
                apply separately.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ServiceQuotationSection;
