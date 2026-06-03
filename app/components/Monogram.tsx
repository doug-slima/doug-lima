interface MonogramProps {
  size?: "sm" | "lg";
  className?: string;
}

export default function Monogram({ size = "lg", className = "" }: MonogramProps) {
  const width = size === "sm" ? "w-[88px]" : "w-[104px]";
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
