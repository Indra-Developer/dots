import PublicSvgIcon from "./PublicSvgIcon";

interface PublicIconProps {
  name?: string;
  className?: string;
}

function PublicIcon({
  name,
  className = "h-5 w-5",
}: PublicIconProps) {
  return (
    <PublicSvgIcon
      name={name || "BriefcaseBusiness"}
      className={className}
      strokeWidth={1.8}
    />
  );
}

export default PublicIcon;
