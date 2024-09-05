// Types
import { StaticImageData } from "next/image";
import type { SVGType } from "../SVG/types";

// Imports
import { CSSProperties } from "react";

export interface NavButtonProps {
  type: SVGType;
  href?: string;
  minimized?: boolean;
  highlight?: boolean;
  minimized_highlight?: boolean;
  style?: CSSProperties;
  children: React.ReactNode;
}

export interface NavDropdownProps extends NavButtonProps {
  content: { label: string; href: string }[];
}

export type NavItemsProps = {
  type: SVGType;
  label: string;
  href?: string;
  content?: { label: string; href: string }[];
}[];
