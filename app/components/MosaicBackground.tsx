/*
 * MosaicBackground — DO NOT MODIFY positioning or sizing without design sign-off.
 *
 * Critical styles are intentionally inline to prevent Tailwind CSS bundle
 * regeneration from breaking this component.
 *
 * Responsive positioning is handled by .mosaic-container in globals.css:
 *   mobile  → left: 0  (image anchored to left edge)
 *   desktop → right: 0 (image anchored to right edge, shows tile content)
 *
 * Animation keyframes: globals.css (@keyframes mosaic-scroll).
 */

const CONTAINER_WIDTH = 1272;

const containerStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  height: "100%",
  width: `${CONTAINER_WIDTH}px`,
  overflow: "hidden",
  zIndex: 0,
};

const scrollerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  animation: "mosaic-scroll 240s linear infinite",
};

const imgStyle: React.CSSProperties = {
  width: "100%",
  display: "block",
};

const SRC = "/assets/home/mosaic-home-bg.png";

export default function MosaicBackground() {
  return (
    <div className="mosaic-container" style={containerStyle}>
      <div style={scrollerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SRC} alt="" aria-hidden="true" style={imgStyle} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SRC} alt="" aria-hidden="true" style={imgStyle} />
      </div>
    </div>
  );
}
