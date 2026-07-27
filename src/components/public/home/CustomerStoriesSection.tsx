import {
  useRef,
  useState,
} from "react";

import type { PublicCustomerStory } from "../../../types/publicHome";
import PublicSvgIcon from "../PublicSvgIcon";
import HomeMediaModal from "./HomeMediaModal";
import SectionHeading from "./SectionHeading";

interface CustomerStoriesSectionProps {
  stories: PublicCustomerStory[];
}

const fallbackStories: PublicCustomerStory[] = [
  {
    id: "retail",
    businessName: "Retail Business",
    videoTitle: "A simpler registration journey",
    description: "Business registration and compliance support.",
    duration: "02:34",
  },
  {
    id: "food",
    businessName: "Food Business",
    videoTitle: "Clear support for business growth",
    description: "Tax and registration guidance for a growing business.",
    duration: "02:18",
  },
  {
    id: "manufacturing",
    businessName: "Manufacturing Business",
    videoTitle: "Documents organised without confusion",
    description: "Professional registration and ongoing compliance.",
    duration: "02:46",
  },
  {
    id: "services",
    businessName: "Service Company",
    videoTitle: "More time to focus on customers",
    description: "Regular accounting and compliance assistance.",
    duration: "02:22",
  },
];

function CustomerStoriesSection({
  stories,
}: CustomerStoriesSectionProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [selectedStory, setSelectedStory] =
    useState<PublicCustomerStory | null>(null);
  const visibleStories = stories.length > 0 ? stories : fallbackStories;

  function scrollStories(direction: -1 | 1): void {
    const slider = sliderRef.current;

    if (!slider) {
      return;
    }

    slider.scrollBy({
      left: direction * Math.max(280, slider.clientWidth * 0.75),
      behavior: "smooth",
    });
  }

  return (
    <section
      id="stories"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            title="Customer Stories"
            description="See how business owners simplified their registrations and compliance."
            centred={false}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => scrollStories(-1)}
              aria-label="Previous customer stories"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <PublicSvgIcon name="ArrowLeft" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollStories(1)}
              aria-label="Next customer stories"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101a33] text-white shadow-lg transition hover:bg-blue-700"
            >
              <PublicSvgIcon name="ArrowRight" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5"
        >
          {visibleStories.map((story, index) => (
            <button
              key={story.id}
              type="button"
              onClick={() => setSelectedStory(story)}
              className="group relative aspect-[4/5] w-[84%] shrink-0 snap-start overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 text-left shadow-[0_12px_32px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(15,23,42,0.15)] sm:w-[46%] lg:w-[calc((100%-48px)/4)]"
            >
              {story.posterUrl ? (
                <img
                  src={story.posterUrl}
                  alt={story.businessName}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div
                  className={[
                    "absolute inset-0 bg-gradient-to-br",
                    index % 4 === 0
                      ? "from-blue-100 via-slate-100 to-blue-300"
                      : index % 4 === 1
                        ? "from-amber-100 via-orange-50 to-slate-300"
                        : index % 4 === 2
                          ? "from-violet-100 via-slate-100 to-blue-200"
                          : "from-emerald-100 via-slate-50 to-blue-200",
                  ].join(" ")}
                >
                  <div className="absolute left-1/2 top-[20%] h-[28%] w-[38%] -translate-x-1/2 rounded-full bg-white/80 shadow-xl" />
                  <div className="absolute bottom-[24%] left-1/2 h-[42%] w-[62%] -translate-x-1/2 rounded-t-[70px] rounded-b-2xl bg-[#102348]/80 shadow-xl" />
                  <div className="absolute inset-x-[8%] bottom-[8%] h-[20%] rounded-xl border border-white/50 bg-white/35 backdrop-blur" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />

              <span className="absolute left-1/2 top-[44%] flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#101a33] shadow-xl transition group-hover:scale-110">
                <span className="ml-1 block h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-current" />
              </span>

              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-blue-200">
                    {story.businessName}
                  </p>
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold backdrop-blur">
                    {story.duration || "02:30"}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold leading-6">
                  {story.videoTitle}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      <HomeMediaModal
        open={selectedStory !== null}
        title={selectedStory?.videoTitle || "Customer Story"}
        videoUrl={selectedStory?.videoUrl}
        posterUrl={selectedStory?.posterUrl}
        onClose={() => setSelectedStory(null)}
      />
    </section>
  );
}

export default CustomerStoriesSection;
