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
  icon?:string;
}

export interface SettingsOthersCheckBoxProps {
  title: string; 
  desc: string;  
}

export interface SettingsThemeTypes{
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