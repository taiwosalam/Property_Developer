// Types
import type { BadgeIconColors } from "../BadgeIcon/badge-icon";
import type { SettingsServiceOwners, TenantOccupantTier } from "./types";

export const settings_link_tabs = [
  "profile",
  "management",
  "subscription",
  "services",
  "security",
  "enrollment",
  "appearance",
  "others",
] as const;

export const manager_settings_link_tabs = [
  "profile",
  "security",
  "others",
] as const;

export const accountant_settings_link_tabs = [
  "profile",
  "security",
  "others",
] as const;

export const website_color_schemes = [
  "#2563EB",
  "#0033C4",
  "#0FA7E2",
  "#377FC1",
  "#005623",
  "#01BA4C",
  "#2DD4BF",
  "#53B07D",
  "#6CE908",
  "#E15B0F",
  "#C1373F",
  "#FFBB53",
  "#C18A37",
  "#CE9EA1",
  "#FC63FF",  
  "#9B00FAAB",
  "#8C62FF",
  "#000000",
] as const;

export const tenant_occupant_tiers = [
  "tier 1",
  "tier 2",
  "tier 3",
  "tier 4",
  "tier 5",
] as const;

export const tenant_occupant_level_types: Record<
  TenantOccupantTier,
  {
    color: BadgeIconColors;
    desc: string;
  }
> = {
  "tier 1": {
    color: "red",
    desc: "These are the tenants/occupants who have verified their email and phone numbers, indicating they have valid contact information for both email and phone communication. Selecting this option indicates your preference for or desire to have occupant/Tenants with name and valid contact information only.",
  },
  "tier 2": {
    color: "yellow",
    desc: "These are the type of Tenant/Occupant who possess valid and verified contact information, along with a traceable address that has been verified.By selecting this option, you express your preference for occupants/tenants with verified names, valid contact information, and verified traceable addresses only.",
  },
  "tier 3": {
    color: "blue",
    desc: "These are the types of tenants who have completed KYC by validating their names to match their government-issued ID cards and capturing their real faces to resemble the photo on the valid card. Choosing Tier 3 implies that tenant/occupant have a valid name, verified contact information, a verified address with a government utility bill, and have authenticated themselves with a government-issued ID card.",
  },
  "tier 4": {
    color: "green",
    desc: "These tiers represent tenant/occupant who have undergone all levels of verification and have full knowledge of the app's usage. They are familiar with the platform's usage, or they have recently rented an apartment using the app.",
  },
  "tier 5": {
    color: "black",
    desc: "Tenant/Occupant at this level are uncommon; they are individuals who are already familiar with every terms and conditions of the app. They have verified and validated their profiles as required in all specifications and have been using the app for more than a year. They may be influencers or service providers with proper recommendations.Selecting this tier category implies that you want all your applicants to be at this level, but it is not recommended.",
  },
};

export const services_sections: Record<string, SettingsServiceOwners> = {
  "Estate Surveyor & Valuer": "Property Managers",
  "Land Surveyor": "Registered Surveyor, Technician Surveyor",
  "Quantity Surveyor": "Analyst",
  Architect: "Appraiser",
  "Town Planner": "Developer",
  "Civil Engineer": "Contractor, Builder",
  Realtor: "Real Estate Agents, Broker, Investors",
  "Legal Practitioner":
    "Law Firm, Barristers, Arbitrators, Solicitors, Attorneys, Advocates, Lawyer",
  Hospitality: "Hotel, Short Stay, Aparment, Holiday Home",
};

export const settings_payment_switcher = [
  {
    title: "Per Annum",
    price: 2000,
  },
  {
    title: "2 years",
    price: 4000,
  },
  {
    title: "3 years",
    price: 6000,
  },
  {
    title: "4 years",
    price: 8000,
  },
];
