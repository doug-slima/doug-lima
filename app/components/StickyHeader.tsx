import Header from "./Header";

export default function StickyHeader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-bg-base px-10 pt-10">
      <Header />
    </div>
  );
}
