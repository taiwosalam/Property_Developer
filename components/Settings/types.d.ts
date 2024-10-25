// Types
import type { FormSteps } from "@/app/(onboarding)/auth/types";

// Imports
import { BadgeIconColors } from "../BadgeIcon/badge-icon";

import {
  settings_link_tabs,
  tenant_occupant_tiers,
  website_color_schemes,
} from "./data";

import { services } from "./services";
import { string } from "zod";
import React from "react";

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

export interface SettingsUpdateButtonProps {
  text?: string;
  remove?: boolean;
  addMore?: boolean;
  type?: "default" | "otp" | "add domain" | "purchase unit" | "feature";
}

export interface DefaultSettingsModalProps {
  changeStep: (step: FormSteps) => void;
}

export type SettingsPaymentOptions =
  | "options"
  | "bank transfer"
  | "online funding";

export interface DefaultSettingsPaymentModalProps {
  changeStep: (step: SettingsPaymentOptions) => void;
}

export interface SettingsAnnumSwitcherProps {
  data?: {
    price: number;
    title: string;
  };
  noButtons?: boolean;
}

export interface SettingsPaymentModalProps {
  desc?: string;
  title?: string;
  annum?: {
    price: number;
    title: string;
  };
  hideTitleOnProceed?: boolean;
  limitTransferFields?: boolean;
  headings?: Partial<Record<SettingsPaymentOptions, string>>;
}

export interface SettingsPaymentTransferProps {
  limitFields?: boolean;
}

interface SettingsOthersProps {
  title: string;
  desc: string;
  icon: string | React.ReactNode;
}

interface SettingsDirectorTypes {
  name: string;
  email: string;
  position?: string;
  phone: string;
  img: string;
  icon?: string | React.ReactNode;
}

interface SettingsOthersCheckBoxProps {
  title: string;
  desc: string;
}
export interface SettingsOthersProps {
  title: string;
  desc: string;
  icon: string | React.ReactNode;
  checked?: boolean;
  groupName?: string;
  selectedGroup?: string | null;
  setSelectedGroup?: (value: string | null) => void;
}

export interface GroupRadioProps {
  checked: boolean;
  groupName: string;
  onClick: () => void;
}

export interface SettingsDirectorTypes {
  name: string;
  email: string;
  position?: string;
  phone: string;
  img: string;
  icon?: string | React.ReactNode;
  desc?: string;
}

export interface SettingsOthersCheckBoxProps {
  title: string;
  desc: string;
  checked?: boolean; 
  value: string;
  onChange: (value: string, checked: boolean) => void;
}

export interface SettingsThemeTypes {
  img: string;
}

export interface CheckboxProps {
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// interface ThemeCardProps {
//   img: string;
//   value: string;
//   onSelect: (value: string) => void; 
// }

export interface CheckboxProps {
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

interface ThemeCardProps {
  img: string;
  value: string;
  isSelected: boolean;
  onSelect: (value: string) => void; 
  className?: string;
  profile?: boolean;
  showMessage?: boolean;
  setShowMessage?: (show: boolean) => void;
  showProfessionalMessage?: boolean;
}


export interface SettingsEnrollmentCardProps {
  planTitle: string;
  desc: string;
  planFor: string;
  price: string;
  discount: string;
  duration: string;
  showFeatures: boolean;
  setShowFeatures: (show: boolean) => void;
  onSelect: () => void;
  features: string[];
  billingType: 'monthly' | 'yearly';
  payMonthly: () => void;
  payYearly: () => void;
  quantity: number;
  incrementQuantity: () => void;
  decrementQuantity: () => void;
  isFree?: boolean;
  onBillingTypeChange: (type: 'monthly' | 'yearly') => void;
  discountText: string;
}


export interface ProfileUploadProps {
  preview: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  inputFileRef: MutableRefObject<HTMLInputElement | null>; // Add this line
  onClick: () => void;
}