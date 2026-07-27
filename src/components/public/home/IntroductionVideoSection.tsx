import { useState } from "react";

import type { PublicIntroductionVideo } from "../../../types/publicHome";
import PublicSvgIcon from "../PublicSvgIcon";
import HomeMediaModal from "./HomeMediaModal";
import SectionHeading from "./SectionHeading";

interface IntroductionVideoSectionProps {
  video: PublicIntroductionVideo | null;
}

function IntroductionVideoSection({
  video,
}: IntroductionVideoSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const title = video?.title || "How DOTS supports your business journey";
  const description =
    video?.description ||
    "Learn how our team guides businesses through registrations, accounts and compliance with a simple, organised process.";

  return (
    <section className="bg-white px-5 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          title="Meet the team behind your business support"
          description="Learn how we help businesses complete registrations, accounts and compliance."
        />

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="group mt-10 block w-full text-left lg:mt-12"
        >
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_55px_rgba(15,23,42,0.10)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_28px_65px_rgba(37,99,235,0.14)]">
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">
              {video?.posterUrl ? (
                <img
                  src={video.posterUrl}
                  alt={title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0">
                  <div className="absolute left-[12%] top-[15%] h-[72%] w-[35%] rounded-t-[120px] rounded-b-[30px] bg-[#102348]/95" />
                  <div className="absolute left-[20%] top-[20%] h-24 w-24 rounded-full bg-slate-100 shadow-xl" />
                  <div className="absolute bottom-[12%] right-[9%] grid h-[65%] w-[44%] grid-cols-2 gap-4 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-xl backdrop-blur">
                    {[1, 2, 3, 4].map((item) => (
                      <span
                        key={item}
                        className="rounded-xl bg-gradient-to-br from-blue-100 to-slate-100"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

              <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-[#101a33] shadow-2xl transition group-hover:scale-110 sm:h-20 sm:w-20">
                <span className="ml-1 block h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-current sm:border-y-[12px] sm:border-l-[19px]" />
              </span>

              <span className="absolute bottom-4 right-4 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                {video?.duration || "02:35"}
              </span>
            </div>

            <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h3 className="text-lg font-bold text-[#101a33] sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {description}
                </p>
              </div>

              <span className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-blue-600">
                Watch Introduction
                <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
              </span>
            </div>
          </div>
        </button>
      </div>

      <HomeMediaModal
        open={modalOpen}
        title={title}
        videoUrl={video?.videoUrl}
        posterUrl={video?.posterUrl}
        onClose={() => setModalOpen(false)}
      />
    </section>
  );
}

export default IntroductionVideoSection;
