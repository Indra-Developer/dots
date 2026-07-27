import {
  useEffect,
  useRef,
  useState,
} from "react";
import { Link } from "react-router";

import type { PublicBanner } from "../../../types/publicHome";
import PublicSvgIcon from "../PublicSvgIcon";

interface HeroBannerSliderProps {
  banners: PublicBanner[];
}

function resolveBannerLink(banner: PublicBanner): string | null {
  if (banner.customLink?.trim()) {
    return banner.customLink.trim();
  }

  if (banner.serviceSlug?.trim()) {
    return `/service/${banner.serviceSlug.trim()}`;
  }

  return null;
}

function HeroBannerSlider({ banners }: HeroBannerSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartRef = useRef<number | null>(null);

  useEffect(() => {
    if (banners.length <= 1 || paused) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        (currentIndex + 1) % banners.length,
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, [banners.length, paused]);

  useEffect(() => {
    if (activeIndex >= banners.length && banners.length > 0) {
      setActiveIndex(0);
    }
  }, [activeIndex, banners.length]);

  function moveSlide(direction: -1 | 1): void {
    if (banners.length === 0) {
      return;
    }

    setActiveIndex((currentIndex) =>
      (currentIndex + direction + banners.length) % banners.length,
    );
  }

  function handleTouchStart(clientX: number): void {
    touchStartRef.current = clientX;
    setPaused(true);
  }

  function handleTouchEnd(clientX: number): void {
    const touchStart = touchStartRef.current;
    touchStartRef.current = null;
    setPaused(false);

    if (touchStart === null) {
      return;
    }

    const difference = clientX - touchStart;

    if (Math.abs(difference) < 50) {
      return;
    }

    moveSlide(difference > 0 ? -1 : 1);
  }

  if (banners.length === 0) {
    return (
      <section className="bg-white px-3 py-3 sm:px-5 lg:px-7">
        <div className="relative mx-auto aspect-[3/1] max-w-[1480px] overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#eef4ff] via-white to-[#f5f7fb] shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:aspect-[3/1]">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full border-[44px] border-blue-100/80" />
          <div className="absolute left-[22%] top-[18%] h-[62%] w-[23%] rotate-[-6deg] rounded-2xl border border-blue-100 bg-white shadow-xl" />
          <div className="absolute left-[39%] top-[27%] h-[50%] w-[19%] rotate-[4deg] rounded-2xl border border-slate-200 bg-slate-50 shadow-lg" />
          <div className="absolute right-[8%] top-[14%] h-[72%] w-[28%] rounded-full border-[28px] border-[#102348]/10" />
          <div className="absolute bottom-[18%] right-[18%] h-16 w-16 rounded-2xl bg-[#102348]/90 shadow-xl" />
          <div className="absolute bottom-[24%] right-[30%] h-12 w-12 rounded-full bg-blue-500/80" />
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white px-3 py-3 sm:px-5 lg:px-7">
      <div
        className="group relative mx-auto max-w-[1480px] overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_18px_50px_rgba(15,23,42,0.09)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={(event) =>
          handleTouchStart(event.touches[0]?.clientX || 0)
        }
        onTouchEnd={(event) =>
          handleTouchEnd(event.changedTouches[0]?.clientX || 0)
        }
      >
        <div className="relative aspect-[4/5] sm:aspect-[16/7] lg:aspect-[3/1]">
          {banners.map((banner, index) => {
            const link = resolveBannerLink(banner);
            const image = (
              <picture className="block h-full w-full">
                {banner.mobileImageUrl && (
                  <source
                    media="(max-width: 639px)"
                    srcSet={banner.mobileImageUrl}
                  />
                )}
                <img
                  src={
                    banner.desktopImageUrl ||
                    banner.mobileImageUrl ||
                    ""
                  }
                  alt={banner.title || "DOTS service banner"}
                  className="h-full w-full object-cover"
                />
              </picture>
            );

            return (
              <div
                key={banner.id}
                aria-hidden={activeIndex !== index}
                className={[
                  "absolute inset-0 transition-all duration-700 ease-out",
                  activeIndex === index
                    ? "z-10 translate-x-0 opacity-100"
                    : "z-0 translate-x-4 opacity-0",
                ].join(" ")}
              >
                {link ? (
                  link.startsWith("http") ? (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="block h-full w-full"
                      tabIndex={activeIndex === index ? 0 : -1}
                    >
                      {image}
                    </a>
                  ) : (
                    <Link
                      to={link}
                      className="block h-full w-full"
                      tabIndex={activeIndex === index ? 0 : -1}
                    >
                      {image}
                    </Link>
                  )
                ) : (
                  image
                )}
              </div>
            );
          })}
        </div>

        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => moveSlide(-1)}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-slate-950/35 text-white opacity-100 shadow-lg backdrop-blur transition hover:bg-slate-950/60 sm:left-5 sm:h-11 sm:w-11 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <PublicSvgIcon name="ArrowLeft" className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => moveSlide(1)}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-slate-950/35 text-white opacity-100 shadow-lg backdrop-blur transition hover:bg-slate-950/60 sm:right-5 sm:h-11 sm:w-11 lg:opacity-0 lg:group-hover:opacity-100"
            >
              <PublicSvgIcon name="ArrowRight" className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-slate-950/35 px-3 py-2 backdrop-blur">
              {banners.map((banner, index) => (
                <button
                  key={banner.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show banner ${index + 1}`}
                  className={[
                    "h-2 rounded-full transition-all",
                    activeIndex === index
                      ? "w-7 bg-white"
                      : "w-2 bg-white/55 hover:bg-white/80",
                  ].join(" ")}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HeroBannerSlider;
