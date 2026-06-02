import Header from "./Header";

export default function StickyHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 pointer-events-none">
      {/* Solid header bar */}
      <div className="pointer-events-auto bg-bg-base px-10 pb-2">
        <Header />
      </div>
      {/* Gradient fade — matches BlurOverlay */}
      <div
        className="h-[105px]"
        style={{
          background:
            "linear-gradient(to bottom, #F9F9F2 0%, rgba(249,249,242,0) 100%)",
        }}
      />
    </div>
  );
}
