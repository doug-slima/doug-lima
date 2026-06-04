import { type Ref, type CSSProperties } from "react";
import BlurOverlay from "./BlurOverlay";

interface Props {
  ref?: Ref<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  blurHeight?: number;
  blurSolidUntil?: string;
}

export default function ScrollColumn({ ref, className = "", style, children, blurHeight, blurSolidUntil }: Props) {
  return (
    <div ref={ref} className={`overflow-y-auto ${className}`} style={style}>
      <BlurOverlay className="sticky top-0 w-full" height={blurHeight} solidUntil={blurSolidUntil} />
      {children}
    </div>
  );
}
