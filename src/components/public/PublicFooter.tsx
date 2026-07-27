import { Link } from "react-router";

import dotsLogo from "../../assets/images/dots-logo.png";
import type { PublicService } from "../../types/publicContent";
import PublicSvgIcon from "./PublicSvgIcon";
import type { PublicSvgIconName } from "./PublicSvgIcon";

interface PublicFooterProps {
  services: PublicService[];
  quotationWhatsAppNumber: string;
}

interface FooterLink {
  label: string;
  to: string;
}

const companyLinks: FooterLink[] = [
  { label: "About Us", to: "/#about" },
  { label: "Customer Stories", to: "/#stories" },
  { label: "Contact", to: "/#contact" },
  { label: "FAQs", to: "/#faqs" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms and Conditions", to: "/terms-and-conditions" },
  { label: "Refund Policy", to: "/refund-policy" },
  { label: "Disclaimer", to: "/disclaimer" },
];

function createWhatsAppLink(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  const internationalNumber =
    digits.length === 10 ? `91${digits}` : digits;

  return `https://wa.me/${internationalNumber}`;
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-slate-900">
        {title}
      </h3>
      <div className="mt-5 grid gap-3">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="w-fit text-sm text-slate-500 transition hover:translate-x-0.5 hover:text-blue-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileFooterGroup({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <details className="group border-b border-slate-200">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-bold text-slate-900">
        {title}
        <span className="text-xl font-normal text-slate-400 transition group-open:rotate-45">
          +
        </span>
      </summary>

      <div className="grid gap-3 pb-5">
        {links.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="text-sm text-slate-500 transition hover:text-blue-700"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </details>
  );
}

function PublicFooter({
  services,
  quotationWhatsAppNumber,
}: PublicFooterProps) {
  const currentYear = new Date().getFullYear();
  const popularServices: FooterLink[] = services
    .slice(0, 4)
    .map((service) => ({
      label: service.name,
      to: `/service/${service.slug}`,
    }));

  const quoteLink = createWhatsAppLink(
    quotationWhatsAppNumber,
  );

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-[1480px] px-5 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.8fr_0.7fr_0.7fr] lg:gap-14">
          <section>
            <div className="flex items-center gap-4">
              <img
                src={dotsLogo}
                alt="DOTS"
                className="h-20 w-20 object-contain"
              />

              <div>
                <p className="text-2xl font-bold tracking-wide text-[#102348]">
                  DOTS
                </p>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500">
                  BUSINESS SERVICES
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
              Your trusted partner for business registrations,
              accounting, taxation and compliance. We make every
              process clear, organised and easy to understand.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {(
                [
                  {
                    label: "LinkedIn",
                    iconName: "Linkedin",
                    href: "#",
                  },
                  {
                    label: "Instagram",
                    iconName: "Instagram",
                    href: "#",
                  },
                  {
                    label: "YouTube",
                    iconName: "Youtube",
                    href: "#",
                  },
                  {
                    label: "WhatsApp",
                    iconName: "WhatsApp",
                    href: quoteLink,
                  },
                ] satisfies Array<{
                  label: string;
                  iconName: PublicSvgIconName;
                  href: string;
                }>
              ).map(({ label, iconName, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href === "#" ? undefined : "_blank"}
                  rel={href === "#" ? undefined : "noreferrer"}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                >
                  <PublicSvgIcon
                    name={iconName}
                    className="h-[18px] w-[18px]"
                  />
                </a>
              ))}
            </div>
          </section>

          <div className="hidden md:block">
            <FooterLinks
              title="Popular Services"
              links={popularServices}
            />
          </div>

          <div className="hidden md:block">
            <FooterLinks title="Company" links={companyLinks} />
          </div>

          <div className="hidden md:block">
            <FooterLinks title="Legal" links={legalLinks} />
          </div>

          <div className="md:hidden">
            <MobileFooterGroup
              title="Popular Services"
              links={popularServices}
            />
            <MobileFooterGroup
              title="Company"
              links={companyLinks}
            />
            <MobileFooterGroup
              title="Legal"
              links={legalLinks}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50/70">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-5 py-5 text-xs leading-5 text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© {currentYear} DOTS. All rights reserved. Developed By Indra</p>
          <p className="max-w-2xl md:text-right">
            DOTS is a professional business-services intermediary
            and is not a government department or law firm.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default PublicFooter;
