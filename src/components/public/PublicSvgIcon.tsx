import type { SVGProps } from "react";

export type PublicSvgIconName =
  | "ArrowLeft"
  | "ArrowRight"
  | "BadgeCheck"
  | "BookOpenCheck"
  | "BriefcaseBusiness"
  | "Building2"
  | "Calculator"
  | "ChevronDown"
  | "CircleDollarSign"
  | "FileCheck2"
  | "Headphones"
  | "Instagram"
  | "Landmark"
  | "LayoutDashboard"
  | "Linkedin"
  | "Menu"
  | "MessageCircle"
  | "ReceiptText"
  | "Scale"
  | "Search"
  | "ShieldCheck"
  | "Sparkles"
  | "Store"
  | "UsersRound"
  | "WhatsApp"
  | "X"
  | "Youtube";

interface PublicSvgIconProps
  extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: PublicSvgIconName | string;
  strokeWidth?: number;
}

const brandIconNames = new Set([
  "Instagram",
  "Linkedin",
  "WhatsApp",
  "Youtube",
]);

function PublicSvgIcon({
  name,
  strokeWidth = 1.8,
  className = "h-5 w-5",
  ...svgProps
}: PublicSvgIconProps) {
  const isBrandIcon = brandIconNames.has(name);

  const commonProps = {
    className,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
    focusable: false,
    ...svgProps,
  };

  if (isBrandIcon) {
    return (
      <svg {...commonProps} fill="currentColor">
        {name === "Instagram" && (
          <>
            <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Z" />
            <path d="M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
            <circle cx="17.4" cy="6.6" r="1.2" />
          </>
        )}

        {name === "Linkedin" && (
          <>
            <rect x="3" y="9" width="4" height="12" rx="1" />
            <circle cx="5" cy="5" r="2" />
            <path d="M10 9h3.8v1.7c1-1.4 2.5-2.1 4.2-2.1 3.2 0 4 2.1 4 5.6V21h-4v-6c0-1.7-.1-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21h-4V9Z" />
          </>
        )}

        {name === "Youtube" && (
          <path d="M23.2 7.2a3.1 3.1 0 0 0-2.2-2.2C19.1 4.5 15.6 4.4 12 4.4s-7.1.1-9 .6A3.1 3.1 0 0 0 .8 7.2C.3 9.1.2 11.3.2 12s.1 2.9.6 4.8A3.1 3.1 0 0 0 3 19c1.9.5 5.4.6 9 .6s7.1-.1 9-.6a3.1 3.1 0 0 0 2.2-2.2c.5-1.9.6-4.1.6-4.8s-.1-2.9-.6-4.8ZM9.7 15.9V8.1l6.7 3.9-6.7 3.9Z" />
        )}

        {name === "WhatsApp" && (
          <path d="M12.1 2a9.8 9.8 0 0 0-8.4 14.9L2 22l5.2-1.6A9.9 9.9 0 1 0 12.1 2Zm0 17.8a7.8 7.8 0 0 1-4-1.1l-.3-.2-3.1 1 1-3-.2-.3a7.9 7.9 0 1 1 6.6 3.6Zm4.3-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.7.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.3-.2-.5-.3Z" />
        )}
      </svg>
    );
  }

  return (
    <svg
      {...commonProps}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "ArrowLeft" && (
        <>
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </>
      )}

      {name === "ArrowRight" && (
        <>
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </>
      )}

      {name === "ChevronDown" && <path d="m6 9 6 6 6-6" />}

      {name === "Menu" && (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}

      {name === "X" && (
        <>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </>
      )}

      {name === "Search" && (
        <>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </>
      )}

      {name === "MessageCircle" && (
        <>
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.2 9.2 0 0 1-3.8-.9L3 21l1.8-4.7A8.8 8.8 0 1 1 21 11.5Z" />
          <path d="M8.5 10.5h7" />
          <path d="M8.5 14h4.5" />
        </>
      )}

      {name === "LayoutDashboard" && (
        <>
          <rect x="3" y="3" width="7" height="8" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" />
          <rect x="3" y="15" width="7" height="6" rx="1.5" />
        </>
      )}

      {name === "Sparkles" && (
        <>
          <path d="m12 3 1.2 3.3L16.5 7.5l-3.3 1.2L12 12l-1.2-3.3-3.3-1.2 3.3-1.2L12 3Z" />
          <path d="m18.5 13 .7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" />
          <path d="m5.5 14 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
        </>
      )}

      {name === "Building2" && (
        <>
          <path d="M4 21V5l8-3v19" />
          <path d="M12 8h8v13" />
          <path d="M7 8h2" />
          <path d="M7 12h2" />
          <path d="M7 16h2" />
          <path d="M15 12h2" />
          <path d="M15 16h2" />
          <path d="M2 21h20" />
        </>
      )}

      {name === "Calculator" && (
        <>
          <rect x="5" y="2" width="14" height="20" rx="2" />
          <path d="M8 6h8v4H8z" />
          <path d="M8 14h.01" />
          <path d="M12 14h.01" />
          <path d="M16 14h.01" />
          <path d="M8 18h.01" />
          <path d="M12 18h.01" />
          <path d="M16 18h.01" />
        </>
      )}

      {name === "Store" && (
        <>
          <path d="M3 9 5 3h14l2 6" />
          <path d="M5 13v8h14v-8" />
          <path d="M9 21v-6h6v6" />
          <path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" />
        </>
      )}

      {name === "Landmark" && (
        <>
          <path d="m3 10 9-6 9 6" />
          <path d="M5 10v8" />
          <path d="M9 10v8" />
          <path d="M15 10v8" />
          <path d="M19 10v8" />
          <path d="M3 18h18" />
          <path d="M2 22h20" />
        </>
      )}

      {name === "ShieldCheck" && (
        <>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
          <path d="m9 12 2 2 4-4" />
        </>
      )}

      {name === "ReceiptText" && (
        <>
          <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2Z" />
          <path d="M9 7h6" />
          <path d="M9 11h6" />
          <path d="M9 15h4" />
        </>
      )}

      {name === "BookOpenCheck" && (
        <>
          <path d="M2 5a4 4 0 0 1 4-2h5v16H6a4 4 0 0 0-4 2V5Z" />
          <path d="M22 5a4 4 0 0 0-4-2h-5v16h5a4 4 0 0 1 4 2V5Z" />
          <path d="m15 11 1.5 1.5L20 9" />
        </>
      )}

      {name === "UsersRound" && (
        <>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 19a6 6 0 0 1 12 0" />
          <circle cx="17" cy="8" r="2.5" />
          <path d="M15 14.5a5 5 0 0 1 6 4.5" />
        </>
      )}

      {name === "BriefcaseBusiness" && (
        <>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
          <path d="M10 12v2h4v-2" />
        </>
      )}

      {name === "FileCheck2" && (
        <>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
          <path d="M14 2v6h6" />
          <path d="m9 15 2 2 4-4" />
        </>
      )}

      {name === "BadgeCheck" && (
        <>
          <path d="M12 2 15 4l3-.2.2 3L20 10l-2 3 .2 3-3 .2L12 18l-3-1.8-3-.2.2-3L4 10l2-3-.2-3 3-.2L12 2Z" />
          <path d="m9 10 2 2 4-4" />
        </>
      )}

      {name === "CircleDollarSign" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M16 8.5c-.8-.8-2-1.2-3.5-1.2-2 0-3.5 1-3.5 2.5 0 3.7 7 1.6 7 5 0 1.4-1.4 2.5-3.5 2.5-1.6 0-3-.5-4-1.4" />
          <path d="M12 5.5v13" />
        </>
      )}

      {name === "Headphones" && (
        <>
          <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
          <path d="M18 19h1a2 2 0 0 0 2-2v-3h-3v5Z" />
          <path d="M6 19H5a2 2 0 0 1-2-2v-3h3v5Z" />
          <path d="M18 19a6 6 0 0 1-6 3" />
        </>
      )}

      {name === "Scale" && (
        <>
          <path d="M12 3v18" />
          <path d="M5 7h14" />
          <path d="m5 7-3 6h6L5 7Z" />
          <path d="m19 7-3 6h6l-3-6Z" />
          <path d="M8 21h8" />
        </>
      )}

      {![
        "ArrowLeft",
        "ArrowRight",
        "BadgeCheck",
        "BookOpenCheck",
        "BriefcaseBusiness",
        "Building2",
        "Calculator",
        "ChevronDown",
        "CircleDollarSign",
        "FileCheck2",
        "Headphones",
        "Landmark",
        "LayoutDashboard",
        "Menu",
        "MessageCircle",
        "ReceiptText",
        "Scale",
        "Search",
        "ShieldCheck",
        "Sparkles",
        "Store",
        "UsersRound",
        "X",
      ].includes(name) && (
        <>
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <path d="M3 12h18" />
        </>
      )}
    </svg>
  );
}

export default PublicSvgIcon;
