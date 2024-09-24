import { CSSProperties } from "react";

export interface AutoResizingGridProps {
  gap?: number;
  minWidth?: number;
  children: React.ReactNode;
  containerClassName?: string;
}

export interface AutoResizingGridTypeProps {
  class: string;
  styles: CSSProperties;
}
