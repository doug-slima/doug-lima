import { type Ref, type CSSProperties } from "react";
import BlurOverlay from "./BlurOverlay";

interface Props {
  ref?: Ref<HTMLDivElement>;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
}

export default function ScrollColumn({ ref, className = "", style, children }: Props) {
  return (
    <div ref={ref} className={`overflow-y-auto ${className}`} style={style}>
      <BlurOverlay className="sticky top-0 w-full" />
      {children}
    </div>
  );
}
