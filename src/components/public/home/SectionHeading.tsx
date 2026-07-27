interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  centred?: boolean;
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centred = true,
}: SectionHeadingProps) {
  return (
    <header
      className={[
        "max-w-3xl",
        centred ? "mx-auto text-center" : "text-left",
      ].join(" ")}
    >
      {eyebrow && (
        <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-blue-600 sm:text-sm">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-[#101a33] sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
          {description}
        </p>
      )}
    </header>
  );
}

export default SectionHeading;
