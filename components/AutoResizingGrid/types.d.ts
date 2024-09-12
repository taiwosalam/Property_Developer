import { CSSProperties } from "react";

export interface AutoResizingGridProps {
  gap?: number;
  minWidth?: number;
  children: React.ReactNode;
}

export interface AutoResizingGridTypeProps {
  class: string;
  styles: CSSProperties;
}
