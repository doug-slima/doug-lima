export type TimelineLine = {
  text: string;
  style: "light" | "bold" | "serif";
};

export type TimelineEntry = {
  year: string;
  lines: TimelineLine[];
  logo: {
    src: string;
    alt: string;
  };
};

export default function TimelineBlock({ year, lines, logo }: TimelineEntry) {
  return (
    <div className="flex flex-row items-center">
      <span className="font-geist font-semibold text-[24px] text-text-default flex-shrink-0">
        {year}
      </span>

      <div className="ml-[24px] flex-shrink-0 w-fit flex flex-col">
        {lines.map((line, i) => {
          const cls =
            line.style === "bold"
              ? "font-geist font-semibold text-[24px] text-text-default"
              : line.style === "serif"
              ? "font-fenix text-[24px] text-text-default"
              : "font-geist font-light text-[24px] text-text-default";
          return (
            <span key={i} className={cls}>
              {line.text}
            </span>
          );
        })}
      </div>

      <div className="flex-1" />

      <div className="w-[220px] flex-shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo.src} alt={logo.alt} className="w-full object-contain" />
      </div>
    </div>
  );
}
