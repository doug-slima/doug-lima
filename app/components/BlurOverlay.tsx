interface Props {
  className?: string;
  height?: number;
  solidUntil?: string;
}

export default function BlurOverlay({
  className = "absolute top-0 left-0 right-0",
  height = 185,
  solidUntil = "65%",
}: Props) {
  return (
    <div
      className={`${className} z-10 pointer-events-none`}
      style={{
        height: `${height}px`,
        background: `linear-gradient(to bottom, #F9F9F2 0%, #F9F9F2 ${solidUntil}, rgba(249,249,242,0) 100%)`,
      }}
    />
  );
}
