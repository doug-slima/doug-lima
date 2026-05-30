interface Props {
  className?: string;
}

export default function BlurOverlay({
  className = "absolute top-0 left-0 right-0",
}: Props) {
  return (
    <div
      className={`${className} h-[185px] z-10 pointer-events-none`}
      style={{
        background:
          "linear-gradient(to bottom, #F9F9F2 0%, #F9F9F2 65%, rgba(249,249,242,0) 100%)",
      }}
    />
  );
}
