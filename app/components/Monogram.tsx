interface MonogramProps {
  size?: "sm" | "md" | "lg" | "4xl";
  /** When set, overrides the size-based width — supports responsive classes e.g. "w-[164px] md:w-[205px]" */
  widthClass?: string;
  className?: string;
}

export default function Monogram({ size = "lg", widthClass, className = "" }: MonogramProps) {
  const width = widthClass ?? (size === "sm" ? "w-[88px]" : size === "md" ? "w-[100px]" : size === "lg" ? "w-[104px]" : "w-[164px]");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/home/dl-monogram.svg"
      alt=""
      aria-hidden="true"
      className={`${width} ${className}`}
    />
  );
}
