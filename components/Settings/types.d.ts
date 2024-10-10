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

export interface SettingsTitleProps {
  title?: string;
  desc?: string;
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
  icon?:string;
}

interface SettingsOthersCheckBoxProps {
  title: string; 
  desc: string;  
}