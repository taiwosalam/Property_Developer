// Imports
import { BadgeIconColors } from "../BadgeIcon/badge-icon";
import {
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


