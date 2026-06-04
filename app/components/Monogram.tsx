interface MonogramProps {
  size?: "sm" | "md" | "lg" | "4xl";
  className?: string;
}

export default function Monogram({ size = "lg", className = "" }: MonogramProps) {
  const width = size === "sm" ? "w-[88px]" : size === "md" ? "w-[100px]" : size === "lg" ? "w-[104px]" : "w-[164px]";
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
