// Types
import type { Color } from "@/types/global";
import { CSSProperties } from "react";

export interface FlowProgressProps {
  steps: number;
  activeStep: number;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  inputClassName?: string;
  requiredFields?: string[];
  onInputChange?: (updateProgress: () => void) => void;
}

export interface FlowProgressBarProps {
  bg_color?: Color;
  bar_color?: Color;
  complete?: boolean;
}
// extends React.HTMLAttributes<HTMLDivElement> {}
