import { settings_link_tabs } from "./data";

export type SettingsLinkTab = (typeof settings_link_tabs)[number];

export interface SettingsLinkTabProps {
  active?: boolean;
  type: SettingsLinkTab;
}

export interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}
