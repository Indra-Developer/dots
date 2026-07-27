import {
  FileText,
  GripVertical,
  Image as ImageIcon,
  Pencil,
  Star,
  Trash2,
  Video,
} from "lucide-react";

import type {
  HomeContentItem,
  HomeContentTab,
} from "../../../types/homeContent";

interface HomeContentTableProps {
  tab: HomeContentTab;
  items: HomeContentItem[];
  loading: boolean;
  togglingId: string;
  onEdit: (item: HomeContentItem) => void;
  onDelete: (item: HomeContentItem) => void;
  onToggleActive: (item: HomeContentItem) => void;
}

function getPrimaryTitle(tab: HomeContentTab, item: HomeContentItem): string {
  switch (tab) {
    case "about":
      return item.heading || "About content";
    case "customer-stories":
      return item.businessName || item.videoTitle || "Customer story";
    case "reviews":
      return item.reviewerName || "Customer review";
    case "faqs":
      return item.question || "Frequently asked question";
    default:
      return item.title || item.name || item.serviceName || "Untitled item";
  }
}

function getSecondaryText(tab: HomeContentTab, item: HomeContentItem): string {
  switch (tab) {
    case "banners":
      return item.serviceName || item.customLink || "No link selected";
    case "quick-services":
      return item.shortDescription || item.serviceName || "—";
    case "about":
      return item.paragraphOne || "—";
    case "introduction-video":
      return item.duration ? `Duration: ${item.duration}` : item.description || "—";
    case "customer-stories":
      return item.videoTitle || item.description || "—";
    case "reviews":
      return item.businessName || item.serviceUsed || "—";
    case "faqs":
      return item.answer || "—";
  }
}

function getThumbnailUrl(item: HomeContentItem): string {
  return (
    item.desktopImageUrl ||
    item.imageUrl ||
    item.posterUrl ||
    item.mobileImageUrl ||
    ""
  );
}

function getThumbnailIcon(tab: HomeContentTab) {
  if (tab === "introduction-video" || tab === "customer-stories") {
    return Video;
  }

  if (tab === "reviews") {
    return Star;
  }

  if (tab === "faqs" || tab === "quick-services") {
    return FileText;
  }

  return ImageIcon;
}

function ActiveToggle({
  active,
  busy,
  onClick,
}: {
  active: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      aria-label={active ? "Deactivate item" : "Activate item"}
      className={[
        "relative h-6 w-11 rounded-full transition",
        active ? "bg-emerald-500" : "bg-slate-300",
        busy ? "cursor-wait opacity-60" : "",
      ].join(" ")}
    >
      <span
        className={[
          "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all",
          active ? "left-6" : "left-1",
        ].join(" ")}
      />
    </button>
  );
}

function HomeContentTable({
  tab,
  items,
  loading,
  togglingId,
  onEdit,
  onDelete,
  onToggleActive,
}: HomeContentTableProps) {
  if (loading) {
    return (
      <div className="p-10 text-center text-sm text-slate-500">
        Loading content...
      </div>
    );
  }

  if (items.length === 0) {
    const EmptyIcon = getThumbnailIcon(tab);

    return (
      <div className="p-10 text-center">
        <EmptyIcon className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 font-semibold text-slate-700">No content added yet</p>
        <p className="mt-1 text-sm text-slate-500">
          Use the Add New button to create the first item in this section.
        </p>
      </div>
    );
  }

  const ThumbnailIcon = getThumbnailIcon(tab);

  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="border-y border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="w-14 px-4 py-3">#</th>
              <th className="px-4 py-3">Preview</th>
              <th className="px-4 py-3">Title / Details</th>
              <th className="w-32 px-4 py-3">Order</th>
              <th className="w-32 px-4 py-3">Status</th>
              <th className="w-32 px-4 py-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {items.map((item, index) => {
              const thumbnailUrl = getThumbnailUrl(item);

              return (
                <tr key={item.id} className="transition hover:bg-slate-50">
                  <td className="px-4 py-4 text-slate-500">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-slate-300" />
                      {index + 1}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex h-16 w-24 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ThumbnailIcon className="h-6 w-6 text-slate-300" />
                      )}
                    </div>
                  </td>

                  <td className="max-w-[360px] px-4 py-4">
                    <p className="font-semibold text-slate-800">
                      {getPrimaryTitle(tab, item)}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                      {getSecondaryText(tab, item)}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <span className="inline-flex min-w-10 justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 font-medium text-slate-700">
                      {item.displayOrder || index + 1}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      <span
                        className={[
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          item.active !== false
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600",
                        ].join(" ")}
                      >
                        {item.active !== false ? "Active" : "Inactive"}
                      </span>
                      <div>
                        <ActiveToggle
                          active={item.active !== false}
                          busy={togglingId === item.id}
                          onClick={() => onToggleActive(item)}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-blue-200 p-2 text-blue-600 transition hover:bg-blue-50"
                        aria-label="Edit item"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 lg:hidden">
        {items.map((item, index) => {
          const thumbnailUrl = getThumbnailUrl(item);

          return (
            <article key={item.id} className="p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-20 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ThumbnailIcon className="h-7 w-7 text-slate-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {getPrimaryTitle(tab, item)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {getSecondaryText(tab, item)}
                      </p>
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      #{item.displayOrder || index + 1}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <ActiveToggle
                      active={item.active !== false}
                      busy={togglingId === item.id}
                      onClick={() => onToggleActive(item)}
                    />

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                        className="rounded-lg border border-blue-200 p-2 text-blue-600 transition hover:bg-blue-50"
                        aria-label="Edit item"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(item)}
                        className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50"
                        aria-label="Delete item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}

export default HomeContentTable;
