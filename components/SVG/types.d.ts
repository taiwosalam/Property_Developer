// Types
import type { Color } from "@/types/global";

// Imports
import { svgs } from "./svgs";

export type SVGType = keyof typeof svgs;

export interface SVGProps {
  type: SVGType;
  color?: Color;
  className?: string;
}
