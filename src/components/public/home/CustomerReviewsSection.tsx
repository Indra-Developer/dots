import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { PublicReview } from "../../../types/publicHome";
import PublicSvgIcon from "../PublicSvgIcon";
import SectionHeading from "./SectionHeading";

interface CustomerReviewsSectionProps {
  reviews: PublicReview[];
}

const fallbackReviews: PublicReview[] = [
  {
    id: "review-1",
    reviewerName: "Ramesh Kumar",
    businessName: "RK Business Solutions",
    rating: 5,
    reviewText:
      "The team explained every document clearly and kept me updated throughout the registration process.",
    serviceUsed: "GST Registration",
  },
  {
    id: "review-2",
    reviewerName: "Priya Sharma",
    businessName: "Priya Boutique",
    rating: 5,
    reviewText:
      "Professional support, a clear quotation and quick responses whenever I had a question.",
    serviceUsed: "Company Registration",
  },
  {
    id: "review-3",
    reviewerName: "Vikram Singh",
    businessName: "VS Manufacturing",
    rating: 5,
    reviewText:
      "The document checklist made the complete process simple and easy to follow.",
    serviceUsed: "MSME Registration",
  },
  {
    id: "review-4",
    reviewerName: "Anjali Verma",
    businessName: "Anjali Consulting",
    rating: 4,
    reviewText:
      "Monthly accounts are now organised and the reports are explained in simple terms.",
    serviceUsed: "Bookkeeping",
  },
];

function getItemsPerPage(): number {
  if (window.innerWidth >= 1024) {
    return 3;
  }

  if (window.innerWidth >= 640) {
    return 2;
  }

  return 1;
}

function CustomerReviewsSection({
  reviews,
}: CustomerReviewsSectionProps) {
  const visibleReviews = reviews.length > 0 ? reviews : fallbackReviews;
  const [activePage, setActivePage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage);
  const [paused, setPaused] = useState(false);

  const pageCount = Math.max(
    1,
    Math.ceil(visibleReviews.length / itemsPerPage),
  );

  const currentReviews = useMemo(() => {
    const startIndex = activePage * itemsPerPage;
    return visibleReviews.slice(startIndex, startIndex + itemsPerPage);
  }, [activePage, itemsPerPage, visibleReviews]);

  useEffect(() => {
    function handleResize(): void {
      setItemsPerPage(getItemsPerPage());
      setActivePage(0);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (paused || pageCount <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActivePage((currentPage) =>
        (currentPage + 1) % pageCount,
      );
    }, 6000);

    return () => window.clearInterval(timer);
  }, [pageCount, paused]);

  useEffect(() => {
    if (activePage >= pageCount) {
      setActivePage(0);
    }
  }, [activePage, pageCount]);

  return (
    <section
      id="reviews"
      className="scroll-mt-24 bg-[#f7f9fc] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
    >
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading title="What Our Customers Say" />

        <div className="mt-10 grid gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {currentReviews.map((review) => {
            const firstLetter =
              review.reviewerName.trim().charAt(0).toUpperCase() || "D";

            return (
              <article
                key={review.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_18px_40px_rgba(37,99,235,0.10)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-blue-100 text-lg font-black text-blue-700">
                      {firstLetter}
                    </span>
                    <div>
                      <h3 className="font-bold text-[#101a33]">
                        {review.reviewerName}
                      </h3>
                      {review.businessName && (
                        <p className="mt-0.5 text-xs text-slate-500">
                          {review.businessName}
                        </p>
                      )}
                    </div>
                  </div>

                  <span className="text-4xl font-black leading-none text-blue-100">
                    “
                  </span>
                </div>

                <div className="mt-5 flex gap-1" aria-label={`${review.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      className={
                        index < Math.round(review.rating)
                          ? "text-amber-400"
                          : "text-slate-200"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="mt-4 min-h-[96px] text-sm leading-7 text-slate-600">
                  {review.reviewText}
                </p>

                {review.serviceUsed && (
                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-blue-600">
                      {review.serviceUsed}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {pageCount > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => {
                setPaused(true);
                setActivePage(
                  (currentPage) =>
                    (currentPage - 1 + pageCount) % pageCount,
                );
              }}
              aria-label="Previous reviews"
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:text-blue-600"
            >
              <PublicSvgIcon name="ArrowLeft" className="h-4 w-4" />
            </button>

            {Array.from({ length: pageCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setPaused(true);
                  setActivePage(index);
                }}
                aria-label={`Show review page ${index + 1}`}
                className={[
                  "h-2.5 rounded-full transition-all",
                  activePage === index
                    ? "w-8 bg-blue-600"
                    : "w-2.5 bg-slate-300 hover:bg-blue-300",
                ].join(" ")}
              />
            ))}

            <button
              type="button"
              onClick={() => {
                setPaused(true);
                setActivePage(
                  (currentPage) => (currentPage + 1) % pageCount,
                );
              }}
              aria-label="Next reviews"
              className="ml-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#101a33] text-white transition hover:bg-blue-700"
            >
              <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default CustomerReviewsSection;
