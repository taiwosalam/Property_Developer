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
  onClick?: (e: React.MouseEvent) => void;
  isDropdown?: boolean;
  isOpen?: boolean;
  isCollapsed?: boolean;
  topNav?: boolean;
  className?: string;
}

export interface NavDropdownProps extends NavButtonProps {
  onContentClick?: () => void;
  content: { label: string; href: string }[];
  onToggle?: () => void;
  className?: string; 
}

export type NavItemsProps = {
  type: SVGType;
  label: string;
  href?: string;
  content?: { label: string; href: string }[];
}[];

export interface NavIconProps {
  alt?: string;
  count?: number;
  href?: string;
  badgeColor?: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export type CreateNewItemsProps = {
  type: SVGType;
  label: string;
  content: (
    | { label: string; link: string; modal?: never; title?: never }
    | { label: string; modal: React.ReactNode; link?: never; title?: never }
  )[];
}[];

export interface NavCreateNewColumnProps {
  data: CreateNewItemsProps;
  handleModalTrigger: (modal: React.ReactNode) => void;
}

export interface NavSearchTabProps {
  count: number;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export interface SideNavProps {
  closeSideNav?: () => void;
  isCollapsed?: boolean;
}

export interface NavModalLayoutProps {
  title: string;
  children: React.ReactNode;
}

export interface NavGlobalSearchItemProps {
  icon: SVGType;
}
