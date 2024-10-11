// Imports
import { BadgeIconColors } from "../BadgeIcon/badge-icon";
import {
  services,
  settings_link_tabs,
  tenant_occupant_tiers,
  website_color_schemes,
} from "./data";

export type SettingsLinkTab = (typeof settings_link_tabs)[number];

export interface SettingsLinkTabProps {
  active?: boolean;
  type: SettingsLinkTab;
}

export interface SettingsSectionProps {
  title: string;
  subTitle?: string;
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
