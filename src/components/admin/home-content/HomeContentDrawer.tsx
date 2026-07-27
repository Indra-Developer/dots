import {
  Check,
  FileImage,
  FileVideo,
  LoaderCircle,
  Upload,
  X,
} from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";

import type {
  HomeContentFormState,
  HomeContentTab,
  ServiceOption,
  UploadProgressState,
} from "../../../types/homeContent";

type FormFieldChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface HomeContentDrawerProps {
  open: boolean;
  tab: HomeContentTab;
  editing: boolean;
  form: HomeContentFormState;
  services: ServiceOption[];
  errors: Record<string, string>;
  saving: boolean;
  uploadProgress: UploadProgressState | null;
  onClose: () => void;
  onChange: <K extends keyof HomeContentFormState>(
    field: K,
    value: HomeContentFormState[K],
  ) => void;
  onSubmit: () => void;
}

interface FieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function Field({
  label,
  required = false,
  error,
  hint,
  children,
}: FieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs text-red-500">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

function inputClass(error?: string): string {
  return [
    "min-h-11 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 outline-none transition",
    "placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100",
    error ? "border-red-300" : "border-slate-300",
  ].join(" ");
}

interface UploadFieldProps {
  label: string;
  accept: string;
  required?: boolean;
  file: File | null;
  existingUrl: string;
  error?: string;
  hint: string;
  video?: boolean;
  onChange: (file: File | null) => void;
}

function UploadField({
  label,
  accept,
  required = false,
  file,
  existingUrl,
  error,
  hint,
  video = false,
  onChange,
}: UploadFieldProps) {
  const Icon = video ? FileVideo : FileImage;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    onChange(event.target.files?.[0] || null);
  }

  return (
    <Field label={label} required={required} error={error} hint={hint}>
      <label
        className={[
          "flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed px-4 py-5 text-center transition",
          error
            ? "border-red-300 bg-red-50/40"
            : "border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/40",
        ].join(" ")}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="sr-only"
        />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
          {file || existingUrl ? (
            <Check className="h-5 w-5" />
          ) : (
            <Upload className="h-5 w-5" />
          )}
        </div>
        <p className="mt-3 text-sm font-semibold text-slate-700">
          {file
            ? file.name
            : existingUrl
              ? "Current file saved — click to replace"
              : `Upload ${label}`}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
          <Icon className="h-4 w-4" />
          <span>{accept}</span>
        </div>
      </label>
    </Field>
  );
}

function HomeContentDrawer({
  open,
  tab,
  editing,
  form,
  services,
  errors,
  saving,
  uploadProgress,
  onClose,
  onChange,
  onSubmit,
}: HomeContentDrawerProps) {
  if (!open) {
    return null;
  }

  const commonOrderAndStatus = (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field
        label="Display Order"
        required
        error={errors.displayOrder}
        hint="Lower numbers appear first."
      >
        <input
          type="number"
          min={1}
          value={form.displayOrder}
          onChange={(event: FormFieldChangeEvent) =>
            onChange("displayOrder", Number(event.target.value))
          }
          className={inputClass(errors.displayOrder)}
        />
      </Field>

      <Field label="Status" required>
        <select
          value={form.active ? "active" : "inactive"}
          onChange={(event: FormFieldChangeEvent) =>
            onChange("active", event.target.value === "active")
          }
          className={inputClass()}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </Field>
    </div>
  );

  function renderServiceSelector(): ReactNode {
    return (
      <Field label="Link Service" hint="Choose the service this item should open.">
        <select
          value={form.serviceId}
          onChange={(event: FormFieldChangeEvent) => {
            const selected = services.find(
              (service) => service.id === event.target.value,
            );
            onChange("serviceId", selected?.id || "");
            onChange("serviceSlug", selected?.slug || "");
            onChange("serviceName", selected?.name || "");
          }}
          className={inputClass()}
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>
      </Field>
    );
  }

  function renderFields(): ReactNode {
    switch (tab) {
      case "banners":
        return (
          <>
            <Field label="Title" required error={errors.title}>
              <input
                value={form.title}
                onChange={(event: FormFieldChangeEvent) => onChange("title", event.target.value)}
                placeholder="Company Registration"
                className={inputClass(errors.title)}
              />
            </Field>

            {renderServiceSelector()}

            <Field
              label="Custom Link"
              hint="Optional. Leave empty to use the selected service link."
            >
              <input
                value={form.customLink}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("customLink", event.target.value)
                }
                placeholder="https://example.com or /service/gst-registration"
                className={inputClass()}
              />
            </Field>

            <UploadField
              label="Desktop Image"
              accept="image/png,image/jpeg,image/webp"
              required
              file={form.desktopImageFile}
              existingUrl={form.desktopImageUrl}
              error={errors.desktopImageFile}
              hint="Recommended ratio: 1920 × 640. Maximum allowed by Storage rules: 10 MB."
              onChange={(file) => onChange("desktopImageFile", file)}
            />

            <UploadField
              label="Mobile Image"
              accept="image/png,image/jpeg,image/webp"
              required
              file={form.mobileImageFile}
              existingUrl={form.mobileImageUrl}
              error={errors.mobileImageFile}
              hint="Recommended ratio: 1080 × 1350. Maximum allowed by Storage rules: 10 MB."
              onChange={(file) => onChange("mobileImageFile", file)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Start Date">
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event: FormFieldChangeEvent) =>
                    onChange("startDate", event.target.value)
                  }
                  className={inputClass()}
                />
              </Field>
              <Field label="Expiry Date">
                <input
                  type="date"
                  value={form.expiryDate}
                  onChange={(event: FormFieldChangeEvent) =>
                    onChange("expiryDate", event.target.value)
                  }
                  className={inputClass()}
                />
              </Field>
            </div>

            {commonOrderAndStatus}
          </>
        );

      case "quick-services":
        return (
          <>
            <Field label="Service Title" required error={errors.title}>
              <input
                value={form.title}
                onChange={(event: FormFieldChangeEvent) => onChange("title", event.target.value)}
                placeholder="GST Registration"
                className={inputClass(errors.title)}
              />
            </Field>
            <Field
              label="Short Description"
              required
              error={errors.shortDescription}
            >
              <textarea
                rows={3}
                value={form.shortDescription}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("shortDescription", event.target.value)
                }
                placeholder="Get your GST registration quickly with expert assistance."
                className={`${inputClass(errors.shortDescription)} py-3`}
              />
            </Field>
            {renderServiceSelector()}
            <Field label="Icon Name" hint="Lucide icon name stored for later rendering.">
              <input
                value={form.iconName}
                onChange={(event: FormFieldChangeEvent) => onChange("iconName", event.target.value)}
                placeholder="FileText"
                className={inputClass()}
              />
            </Field>
            {commonOrderAndStatus}
          </>
        );

      case "about":
        return (
          <>
            <Field label="Small Label" required error={errors.label}>
              <input
                value={form.label}
                onChange={(event: FormFieldChangeEvent) => onChange("label", event.target.value)}
                placeholder="ABOUT US"
                className={inputClass(errors.label)}
              />
            </Field>
            <Field label="Heading" required error={errors.heading}>
              <textarea
                rows={2}
                value={form.heading}
                onChange={(event: FormFieldChangeEvent) => onChange("heading", event.target.value)}
                placeholder="Reliable support for registration, accounting and compliance"
                className={`${inputClass(errors.heading)} py-3`}
              />
            </Field>
            <Field label="First Paragraph" required error={errors.paragraphOne}>
              <textarea
                rows={4}
                value={form.paragraphOne}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("paragraphOne", event.target.value)
                }
                className={`${inputClass(errors.paragraphOne)} py-3`}
              />
            </Field>
            <Field label="Second Paragraph">
              <textarea
                rows={4}
                value={form.paragraphTwo}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("paragraphTwo", event.target.value)
                }
                className={`${inputClass()} py-3`}
              />
            </Field>
            <UploadField
              label="About Image"
              accept="image/png,image/jpeg,image/webp"
              required
              file={form.imageFile}
              existingUrl={form.imageUrl}
              error={errors.imageFile}
              hint="Recommended landscape ratio: 4:3."
              onChange={(file) => onChange("imageFile", file)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Button Label">
                <input
                  value={form.buttonLabel}
                  onChange={(event: FormFieldChangeEvent) =>
                    onChange("buttonLabel", event.target.value)
                  }
                  className={inputClass()}
                />
              </Field>
              <Field label="Button Link">
                <input
                  value={form.buttonLink}
                  onChange={(event: FormFieldChangeEvent) =>
                    onChange("buttonLink", event.target.value)
                  }
                  placeholder="/about"
                  className={inputClass()}
                />
              </Field>
            </div>
            {commonOrderAndStatus}
          </>
        );

      case "introduction-video":
        return (
          <>
            <Field label="Video Title" required error={errors.title}>
              <input
                value={form.title}
                onChange={(event: FormFieldChangeEvent) => onChange("title", event.target.value)}
                placeholder="How DOTS supports your business journey"
                className={inputClass(errors.title)}
              />
            </Field>
            <Field label="Description" required error={errors.description}>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("description", event.target.value)
                }
                className={`${inputClass(errors.description)} py-3`}
              />
            </Field>
            <Field label="Duration" required error={errors.duration}>
              <input
                value={form.duration}
                onChange={(event: FormFieldChangeEvent) => onChange("duration", event.target.value)}
                placeholder="02:35"
                className={inputClass(errors.duration)}
              />
            </Field>
            <UploadField
              label="Poster Image"
              accept="image/png,image/jpeg,image/webp"
              required
              file={form.posterFile}
              existingUrl={form.posterUrl}
              error={errors.posterFile}
              hint="Recommended landscape ratio: 16:9."
              onChange={(file) => onChange("posterFile", file)}
            />
            <UploadField
              label="Video File"
              accept="video/mp4,video/webm"
              required
              video
              file={form.videoFile}
              existingUrl={form.videoUrl}
              error={errors.videoFile}
              hint="MP4 or WebM. Maximum allowed by Storage rules: 100 MB."
              onChange={(file) => onChange("videoFile", file)}
            />
            {commonOrderAndStatus}
          </>
        );

      case "customer-stories":
        return (
          <>
            <Field
              label="Customer / Business Name"
              required
              error={errors.businessName}
            >
              <input
                value={form.businessName}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("businessName", event.target.value)
                }
                placeholder="Green Roots Organics"
                className={inputClass(errors.businessName)}
              />
            </Field>
            <Field label="Video Title" required error={errors.videoTitle}>
              <textarea
                rows={2}
                value={form.videoTitle}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("videoTitle", event.target.value)
                }
                placeholder="From Local Shop to a Legally Registered Brand"
                className={`${inputClass(errors.videoTitle)} py-3`}
              />
            </Field>
            <Field label="Short Description">
              <textarea
                rows={3}
                value={form.description}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("description", event.target.value)
                }
                className={`${inputClass()} py-3`}
              />
            </Field>
            <Field label="Duration" required error={errors.duration}>
              <input
                value={form.duration}
                onChange={(event: FormFieldChangeEvent) => onChange("duration", event.target.value)}
                placeholder="02:34"
                className={inputClass(errors.duration)}
              />
            </Field>
            <UploadField
              label="Story Poster"
              accept="image/png,image/jpeg,image/webp"
              required
              file={form.posterFile}
              existingUrl={form.posterUrl}
              error={errors.posterFile}
              hint="Recommended portrait ratio: 4:5."
              onChange={(file) => onChange("posterFile", file)}
            />
            <UploadField
              label="Story Video"
              accept="video/mp4,video/webm"
              required
              video
              file={form.videoFile}
              existingUrl={form.videoUrl}
              error={errors.videoFile}
              hint="MP4 or WebM. Maximum allowed by Storage rules: 100 MB."
              onChange={(file) => onChange("videoFile", file)}
            />
            {commonOrderAndStatus}
          </>
        );

      case "reviews":
        return (
          <>
            <Field label="Reviewer Name" required error={errors.reviewerName}>
              <input
                value={form.reviewerName}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("reviewerName", event.target.value)
                }
                placeholder="Ramesh Kumar"
                className={inputClass(errors.reviewerName)}
              />
            </Field>
            <Field label="Business Name">
              <input
                value={form.businessName}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("businessName", event.target.value)
                }
                className={inputClass()}
              />
            </Field>
            <Field label="Rating" required>
              <select
                value={form.rating}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("rating", Number(event.target.value))
                }
                className={inputClass()}
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Star{rating === 1 ? "" : "s"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Review" required error={errors.reviewText}>
              <textarea
                rows={5}
                value={form.reviewText}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("reviewText", event.target.value)
                }
                className={`${inputClass(errors.reviewText)} py-3`}
              />
            </Field>
            <Field label="Service Used">
              <input
                value={form.serviceUsed}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("serviceUsed", event.target.value)
                }
                placeholder="GST Registration"
                className={inputClass()}
              />
            </Field>
            {commonOrderAndStatus}
          </>
        );

      case "faqs":
        return (
          <>
            <Field label="Question" required error={errors.question}>
              <textarea
                rows={2}
                value={form.question}
                onChange={(event: FormFieldChangeEvent) =>
                  onChange("question", event.target.value)
                }
                placeholder="What documents are required?"
                className={`${inputClass(errors.question)} py-3`}
              />
            </Field>
            <Field label="Answer" required error={errors.answer}>
              <textarea
                rows={6}
                value={form.answer}
                onChange={(event: FormFieldChangeEvent) => onChange("answer", event.target.value)}
                className={`${inputClass(errors.answer)} py-3`}
              />
            </Field>
            {commonOrderAndStatus}
          </>
        );
    }
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close content drawer"
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/35"
      />

      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[470px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editing ? "Edit Content" : "Add New Content"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Complete the fields and save the content to Firebase.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close drawer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          {renderFields()}
        </div>

        {uploadProgress && (
          <div className="border-t border-slate-200 bg-slate-50 px-5 py-3 sm:px-6">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600">
              <span>{uploadProgress.label}</span>
              <span>{uploadProgress.percentage}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${uploadProgress.percentage}%` }}
              />
            </div>
          </div>
        )}

        <footer className="flex gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="min-h-11 flex-1 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-[#1266f1] px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
            {saving ? "Saving..." : editing ? "Save Changes" : "Save Content"}
          </button>
        </footer>
      </aside>
    </>
  );
}

export default HomeContentDrawer;
