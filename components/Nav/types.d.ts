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
  onClick?: () => void;
  isDropdown?: boolean;
  isOpen?: boolean;
  isCollapsed?: boolean;
}

export interface NavDropdownProps extends NavButtonProps {
  onContentClick?: () => void;
  content: { label: string; href: string }[];
  onToggle: () => void;
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
  icon: React.ReactNode;
}

export type CreateNewItemsProps = {
  type: SVGType;
  label: string;
  content: { label: string }[];
}[];

export interface NavCreateNewColumnProps {
  data: CreateNewItemsProps;
}

export interface NavSearchTabProps {
  count: number;
  active?: boolean;
  children: React.ReactNode;
}

export interface SideNavProps {
  closeSideNav?: () => void;
  isCollapsed?: boolean;
}
