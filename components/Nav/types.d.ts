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

export interface NavIconProps {
  alt?: string;
  href?: string;
  src: string | StaticImageData;
}

export type CreateNewItemsProps = {
  type: SVGType;
  label: string;
  content: { label: string }[];
}[];

export interface NavCreateNewColumnProps {
  data: CreateNewItemsProps;
}
