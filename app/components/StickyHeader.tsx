import Header from "./Header";

export default function StickyHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40">
      <div className="pointer-events-auto px-10 pb-2" style={{ background: "linear-gradient(to bottom, #F9F9F2 85%, rgba(249,249,242,0) 100%)" }}>
        <Header />
      </div>
    </div>
  );
}
