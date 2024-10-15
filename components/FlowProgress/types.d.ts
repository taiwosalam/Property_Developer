// Types
import type { Color } from "@/types/global";
import { CSSProperties } from "react";

export interface FlowProgressProps {
  steps: number;
  activeStep: number;
  showProgressBar?: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactNode;
  inputClassName?: string;
  requiredFields?: string[];
  onInputChange?: (updateProgress: () => void) => void;
  images?: string[];
  imagesRequired?: boolean;
}

export interface FlowProgressBarProps {
  bg_color?: Color;
  bar_color?: Color;
  complete?: boolean;
}
// extends React.HTMLAttributes<HTMLDivElement> {}
