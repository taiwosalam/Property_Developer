// Imports
import { BadgeIconColors } from "../BadgeIcon/badge-icon";

import {
  settings_link_tabs,
  tenant_occupant_tiers,
  website_color_schemes,
} from "./data";

import { services } from "./services";

export type SettingsLinkTab = (typeof settings_link_tabs)[number];

export interface SettingsLinkTabProps {
  active?: boolean;
  type: SettingsLinkTab;
}

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

export interface SettingsTitleProps {
  title?: string;
  desc?: string;
}

export type WebsiteColorScheme = (typeof website_color_schemes)[number];

export interface SettingsColorSchemeProps {
  color: WebsiteColorScheme;
  active?: boolean;
}

export type TenantOccupantTier = (typeof tenant_occupant_tiers)[number];

export interface SettingsTenantOccupantTierProps {
  desc: string;
  color: BadgeIconColors;
  tier: TenantOccupantTier;
}

export interface SettingsServicesTagProps {
  active?: boolean;
  children: React.ReactNode;
}

export type SettingsServiceOwners = keyof typeof services;

export interface SettingsUpdateButtonProps {
  text?: string;
}

interface SettingsOthersProps {
  title: string;
  desc: string;
  icon: string;
}

interface SettingsDirectorTypes {
  name: string;
  email: string;
  position?: string;
  phone: string;
  img: string;
  icon?: string;
}

interface SettingsOthersCheckBoxProps {
  title: string;
  desc: string;
}
export interface SettingsOthersProps {
  title: string;
  desc: string;
  icon: string;
}

export interface SettingsDirectorTypes {
  name: string;
  email: string;
  position?: string;
  phone: string;
  img: string;
  icon?: string;
  desc: string;
}

export interface SettingsOthersCheckBoxProps {
  title: string;
  desc: string;
}

export interface SettingsThemeTypes {
  img: string;
}

export interface CheckboxProps {
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void; // Passes the new checked state
}

interface ThemeCardProps {
  img: string;
  value: string;
  onSelect: (value: string) => void; // Pass the value when selected
}

export interface CheckboxProps {
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void; // Passes the new checked state
}

interface ThemeCardProps {
  img: string;
  value: string;
  onSelect: (value: string) => void; // Pass the value when selected
}
