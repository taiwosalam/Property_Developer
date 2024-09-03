// Types
import { StaticImageData } from "next/image";
import type { SVGType } from "../SVG/types";

// Imports
import { CSSProperties } from "react";

export interface NavButtonProps {
  type: SVGType;
  children: React.ReactNode;
  style?: CSSProperties;
  minimized?: boolean;
}

export interface NavDropdownProps extends NavButtonProps {
  content: string[];
}
