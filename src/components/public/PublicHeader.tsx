import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Link,
  useLocation,
} from "react-router";

import dotsLogo from "../../assets/images/dots-logo.png";
import type {
  PublicCategory,
  PublicService,
} from "../../types/publicContent";
import PublicIcon from "./PublicIcon";
import PublicSearchDialog from "./PublicSearchDialog";
import PublicSvgIcon from "./PublicSvgIcon";

interface PublicHeaderProps {
  categories: PublicCategory[];
  services: PublicService[];
  quotationWhatsAppNumber: string;
  loading: boolean;
}

function createWhatsAppLink(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  const internationalNumber =
    digits.length === 10 ? `91${digits}` : digits;

  const message = encodeURIComponent(
    "Hello DOTS, I would like to get a quotation for a business service.",
  );

  return `https://wa.me/${internationalNumber}?text=${message}`;
}

function PublicHeader({
  categories,
  services,
  quotationWhatsAppNumber,
  loading,
}: PublicHeaderProps) {
  const location = useLocation();
  const navigationRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const [openCategoryId, setOpenCategoryId] = useState<string | null>(
    null,
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoryId, setMobileCategoryId] = useState<
    string | null
  >(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLeftIndicator, setShowLeftIndicator] = useState(false);
  const [showRightIndicator, setShowRightIndicator] = useState(false);

  const servicesByCategory = useMemo(() => {
    const groupedServices = new Map<string, PublicService[]>();

    categories.forEach((category) => {
      groupedServices.set(
        category.id,
        services.filter(
          (service) => service.categoryId === category.id,
        ),
      );
    });

    return groupedServices;
  }, [categories, services]);

  const openCategory = categories.find(
    (category) => category.id === openCategoryId,
  );

  const openCategoryServices = openCategory
    ? servicesByCategory.get(openCategory.id) || []
    : [];

  function clearCloseTimer(): void {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }

  function scheduleCategoryClose(): void {
    clearCloseTimer();

    closeTimerRef.current = window.setTimeout(() => {
      setOpenCategoryId(null);
    }, 300);
  }

  function updateScrollIndicators(): void {
    const navigationElement = navigationRef.current;

    if (!navigationElement) {
      setShowLeftIndicator(false);
      setShowRightIndicator(false);
      return;
    }

    const maximumScroll =
      navigationElement.scrollWidth -
      navigationElement.clientWidth;

    setShowLeftIndicator(navigationElement.scrollLeft > 8);
    setShowRightIndicator(
      maximumScroll - navigationElement.scrollLeft > 8,
    );
  }

  function scrollNavigation(direction: -1 | 1): void {
    navigationRef.current?.scrollBy({
      left: direction * 280,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    updateScrollIndicators();

    const handleResize = (): void => updateScrollIndicators();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [categories.length]);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setOpenCategoryId(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const shouldLockScroll = mobileOpen || searchOpen;
    const previousOverflow = document.body.style.overflow;

    if (shouldLockScroll) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, searchOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setSearchOpen(false);
        setOpenCategoryId(null);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [],
  );

  const quoteLink = createWhatsAppLink(
    quotationWhatsAppNumber,
  );

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl"
        onMouseLeave={scheduleCategoryClose}
        onMouseEnter={clearCloseTimer}
      >
        <div className="mx-auto flex h-[72px] max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:h-[82px] lg:px-8">
          <Link
            to="/"
            aria-label="DOTS Home"
            className="flex shrink-0 items-center"
          >
            <img
              src={dotsLogo}
              alt="DOTS"
              className="h-14 w-14 object-contain lg:h-16 lg:w-16"
            />
          </Link>

          <div className="relative hidden min-w-0 flex-1 lg:block">
            {showLeftIndicator && (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-white via-white/90 to-transparent" />
                <button
                  type="button"
                  onClick={() => scrollNavigation(-1)}
                  aria-label="Scroll categories left"
                  className="absolute left-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                >
                  <PublicSvgIcon name="ArrowLeft" className="h-4 w-4" />
                </button>
              </>
            )}

            <div
              ref={navigationRef}
              onScroll={updateScrollIndicators}
              className="no-scrollbar flex items-center gap-1 overflow-x-auto px-2"
            >
              {loading && categories.length === 0 ? (
                <>
                  {[1, 2, 3, 4, 5].map((item) => (
                    <span
                      key={item}
                      className="h-9 w-28 shrink-0 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </>
              ) : (
                categories.map((category) => {
                  const isOpen =
                    openCategoryId === category.id;
                  const serviceCount =
                    servicesByCategory.get(category.id)?.length || 0;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onMouseEnter={() => {
                        clearCloseTimer();
                        setOpenCategoryId(category.id);
                      }}
                      onFocus={() => setOpenCategoryId(category.id)}
                      aria-expanded={isOpen}
                      className={[
                        "group flex h-11 shrink-0 items-center gap-2 rounded-xl px-3.5",
                        "whitespace-nowrap text-sm font-semibold transition",
                        isOpen
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-slate-50 hover:text-blue-700",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "transition",
                          isOpen
                            ? "text-blue-600"
                            : "text-slate-400 group-hover:text-blue-600",
                        ].join(" ")}
                      >
                        <PublicIcon
                          name={category.iconName}
                          className="h-[18px] w-[18px]"
                        />
                      </span>

                      <span>{category.name}</span>

                      {serviceCount > 0 && (
                        <PublicSvgIcon
                          name="ChevronDown"
                          className={[
                            "h-4 w-4 transition-transform",
                            isOpen ? "rotate-180" : "",
                          ].join(" ")}
                        />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {showRightIndicator && (
              <>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-white via-white/90 to-transparent" />
                <button
                  type="button"
                  onClick={() => scrollNavigation(1)}
                  aria-label="Scroll categories right"
                  className="absolute right-1 top-1/2 z-20 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600"
                >
                  <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search services"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              <PublicSvgIcon name="Search" className="h-5 w-5" />
            </button>

            <a
              href={quoteLink}
              target="_blank"
              rel="noreferrer"
              className="hidden h-11 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(16,26,51,0.18)] transition hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-[0_14px_28px_rgba(37,99,235,0.24)] sm:inline-flex"
            >
              <PublicSvgIcon name="MessageCircle" className="h-[18px] w-[18px]" />
              Get a Quote
            </a>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#101a33] text-white transition hover:bg-blue-700 lg:hidden"
            >
              <PublicSvgIcon name="Menu" className="h-6 w-6" />
            </button>
          </div>
        </div>

        {openCategory &&
          openCategoryServices.length > 0 && (
            <div
              className="absolute inset-x-0 top-full hidden max-h-[calc(100vh-82px)] overflow-hidden border-b border-slate-200 bg-white shadow-[0_24px_55px_rgba(15,23,42,0.13)] lg:block"
              onMouseEnter={clearCloseTimer}
              onMouseLeave={scheduleCategoryClose}
            >
              <div className="mx-auto flex max-h-[calc(100vh-82px)] max-w-[1480px] flex-col px-8 py-4">
                <div className="mb-3 flex shrink-0 items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <PublicIcon
                      name={openCategory.iconName}
                      className="h-[17px] w-[17px]"
                    />
                  </span>
                  <p className="text-[17px] font-bold leading-6 text-slate-900">
                    {openCategory.name}
                  </p>
                </div>

                <div className="public-dropdown-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-2 [scrollbar-gutter:stable]">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 xl:grid-cols-4">
                    {openCategoryServices.map((service) => (
                      <Link
                        key={service.id}
                        to={`/service/${service.slug}`}
                        onMouseEnter={clearCloseTimer}
                        className="group flex min-h-11 items-center gap-2.5 rounded-lg px-2.5 py-2 transition hover:bg-blue-50/70 focus:bg-blue-50/70"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm">
                          <PublicIcon
                            name={service.iconName}
                            className="h-4 w-4"
                          />
                        </span>

                        <span className="min-w-0 flex-1 text-[13px] font-semibold leading-[18px] text-slate-800 transition group-hover:text-blue-700">
                          {service.name}
                        </span>

                        <PublicSvgIcon
                          name="ArrowRight"
                          className="h-3.5 w-3.5 shrink-0 text-blue-200 transition group-hover:translate-x-0.5 group-hover:text-blue-500"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 right-0 flex w-full max-w-[410px] flex-col bg-white shadow-2xl">
            <header className="flex h-[76px] items-center justify-between border-b border-slate-200 px-5">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3"
              >
                <img
                  src={dotsLogo}
                  alt="DOTS"
                  className="h-14 w-14 object-contain"
                />
                <span className="text-xl font-bold tracking-wide text-[#102348]">
                  DOTS
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100"
              >
                <PublicSvgIcon name="X" className="h-5 w-5" />
              </button>
            </header>

            <div className="border-b border-slate-200 p-4">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-left text-sm text-slate-500"
              >
                <PublicSvgIcon name="Search" className="h-5 w-5 text-blue-600" />
                Search all services
              </button>
            </div>

            <nav className="no-scrollbar flex-1 overflow-y-auto px-4 py-3">
              {categories.map((category) => {
                const isOpen =
                  mobileCategoryId === category.id;
                const categoryServices =
                  servicesByCategory.get(category.id) || [];

                return (
                  <div
                    key={category.id}
                    className="border-b border-slate-100 py-1"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setMobileCategoryId(
                          isOpen ? null : category.id,
                        )
                      }
                      className="flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left transition hover:bg-slate-50"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <PublicIcon name={category.iconName} />
                      </span>

                      <span className="min-w-0 flex-1 font-semibold text-slate-800">
                        {category.name}
                      </span>

                      <PublicSvgIcon
                        name="ChevronDown"
                        className={[
                          "h-5 w-5 text-slate-400 transition-transform",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>

                    {isOpen && (
                      <div className="mb-2 ml-[52px] grid gap-1">
                        {categoryServices.length === 0 ? (
                          <p className="px-3 py-3 text-sm text-slate-400">
                            No published services yet.
                          </p>
                        ) : (
                          categoryServices.map((service) => (
                            <Link
                              key={service.id}
                              to={`/service/${service.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
                            >
                              <span>{service.name}</span>
                              <PublicSvgIcon name="ArrowRight" className="h-4 w-4 shrink-0" />
                            </Link>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 bg-slate-50 p-4">
              <a
                href={quoteLink}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#101a33] font-bold text-white shadow-lg transition hover:bg-blue-700"
              >
                <PublicSvgIcon name="MessageCircle" className="h-5 w-5" />
                Get a Quote
              </a>
            </div>
          </aside>
        </div>
      )}

      <PublicSearchDialog
        open={searchOpen}
        services={services}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}

export default PublicHeader;
