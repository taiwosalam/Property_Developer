// Types
import type { Color } from "@/types/global";

export interface FlowProgressProps {
  steps: number;
  activeStep: number;
  className?: string;
  children: React.ReactNode;
}

export interface FlowProgressBarProps {
  bg_color?: Color;
  bar_color?: Color;
  complete?: boolean;
}
// extends React.HTMLAttributes<HTMLDivElement> {}
