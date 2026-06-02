/*
 * MosaicBackground — DO NOT MODIFY positioning or sizing without design sign-off.
 *
 * All styles are intentionally inline to prevent Tailwind CSS bundle regeneration
 * from breaking this component. The image content lives on the right side of the
 * PNG, so right:0 is required on all breakpoints.
 *
 * Animation keyframes are defined in globals.css (@keyframes mosaic-scroll).
 */

const CONTAINER_WIDTH = 1272;

const containerStyle: React.CSSProperties = {
  position: "absolute",
  right: 0,
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
    <div style={containerStyle}>
      <div style={scrollerStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SRC} alt="" aria-hidden="true" style={imgStyle} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SRC} alt="" aria-hidden="true" style={imgStyle} />
      </div>
    </div>
  );
}
