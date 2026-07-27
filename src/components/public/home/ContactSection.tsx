import PublicSvgIcon from "../PublicSvgIcon";
import SectionHeading from "./SectionHeading";

const quotationNumber = "6304963771";
const phoneLink = `tel:+91${quotationNumber}`;
const whatsAppLink = `https://wa.me/91${quotationNumber}`;

const contactItems = [
  {
    icon: "Headphones",
    label: "Administration",
    value: `+91 ${quotationNumber}`,
    href: phoneLink,
  },
  {
    icon: "LayoutDashboard",
    label: "Digital Team",
    value: `+91 ${quotationNumber}`,
    href: phoneLink,
  },
  {
    icon: "UsersRound",
    label: "Relationship Managers",
    value: `+91 ${quotationNumber}`,
    href: phoneLink,
  },
  {
    icon: "BadgeCheck",
    label: "Office Timings",
    value: "Monday–Saturday, 9:30 AM–6:30 PM",
  },
  {
    icon: "WhatsApp",
    label: "WhatsApp Numbers",
    value: `+91 ${quotationNumber}`,
    href: whatsAppLink,
  },
  {
    icon: "Landmark",
    label: "Office Address",
    value: "Sri Krishna Nagar Road, Madhurawada, Visakhapatnam",
  },
];

function ContactSection() {
  const mapQuery = encodeURIComponent(
    "Sri Krishna Nagar Road, Madhurawada, Visakhapatnam",
  );

  return (
    <section
      id="contact"
      className="scroll-mt-24 bg-[#f7f9fc] px-5 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-[1320px]">
        <SectionHeading
          title="Contact Our Team"
          description="Speak with the DOTS team for registrations, accounting, tax and compliance assistance."
        />

        <div className="mt-10 grid gap-6 lg:mt-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactItems.map((item, index) => {
              const content = (
                <>
                  <span
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      index % 3 === 0
                        ? "bg-blue-50 text-blue-600"
                        : index % 3 === 1
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-violet-50 text-violet-600",
                    ].join(" ")}
                  >
                    <PublicSvgIcon name={item.icon} className="h-5 w-5" />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold uppercase tracking-[0.12em] text-slate-400">
                      {item.label}
                    </span>
                    <span className="mt-1.5 block text-sm font-semibold leading-6 text-slate-700">
                      {item.value}
                    </span>
                  </span>
                </>
              );

              const classes =
                "group flex min-h-[112px] items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_34px_rgba(37,99,235,0.08)]";

              return item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                  className={classes}
                >
                  {content}
                </a>
              ) : (
                <article key={item.label} className={classes}>
                  {content}
                </article>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.09)]">
            <iframe
              title="DOTS office location"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="aspect-[4/3] w-full border-0 sm:aspect-[16/10] lg:h-full lg:min-h-[470px]"
            />

            <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-[#101a33]">DOTS Office</p>
                <p className="mt-1 text-xs text-slate-500">
                  Madhurawada, Visakhapatnam
                </p>
              </div>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#101a33] px-5 text-sm font-bold text-white transition hover:bg-blue-700"
              >
                Open in Google Maps
                <PublicSvgIcon name="ArrowRight" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
