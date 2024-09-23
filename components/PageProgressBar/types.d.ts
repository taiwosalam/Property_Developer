// Types
import type { Color } from "@/types/global";

export interface PageProgressBarProps {
  /**
   * The breakpoints for the progress bar.
   * Note: Do not include 0 or 100, as these values are automatically added by the component.
   * If no breakpoints are provided, the progress bar will default to just 0 and 100.
   * @type number[]
   */
  breakpoints?: number[];
  percentage: number;
  className?: string;
}

export interface PageProgressBarBreakpointProps {
  width: number;
  height?: number;
  percentage: number;
  complete?: boolean;
  activeColor: Color;
  disabledColor: Color;
}
