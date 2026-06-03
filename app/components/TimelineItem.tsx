import { type TimelineEntry } from "./TimelineBlock";

const logoClass = (alt: string): string => {
  if (["ESPM São Paulo", "Olist", "IED São Paulo", "Kyvo", "iFood", "Livework"].includes(alt))
    return "w-[68px] h-auto";
  if (["Klauvi", "Aprender Design", "Hash", "Unifei", "Itaú"].includes(alt))
    return "max-h-[48px] max-w-full object-contain";
  if (alt === "Mercado Livre")
    return "max-h-[40px] max-w-full object-contain";
  return "max-h-[36px] max-w-full object-contain";
};

const lineClass = (style: "light" | "bold" | "serif"): string => {
  if (style === "bold") return "font-geist font-semibold text-[18px] text-text-default";
  if (style === "serif") return "font-fenix text-[18px] text-text-default";
  return "font-geist font-light text-[18px] text-text-default";
};

interface TimelineItemProps {
  entry: TimelineEntry;
}

export default function TimelineItem({ entry }: TimelineItemProps) {
  const isTeacherOrMasters =
    entry.lines[0].text === "Teacher" || entry.lines[0].text === "Master's Degree in";

  return (
    <div
      className="flex flex-row items-center gap-6 py-4 border-b border-[#DEDDCE]"
      style={{ minHeight: "112px" }}
    >
      <div className={`flex gap-6 flex-1 ${isTeacherOrMasters ? "items-center" : "items-start"}`}>
        <span className="font-geist font-medium text-[18px] text-text-default flex-shrink-0 w-[40px]">
          {entry.year}
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          {entry.lines.map((line, i) => (
            <span key={i} className={lineClass(line.style)}>
              {line.text}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 w-[72px] flex items-center justify-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={entry.logo.src} alt={entry.logo.alt} className={logoClass(entry.logo.alt)} />
      </div>
    </div>
  );
}
