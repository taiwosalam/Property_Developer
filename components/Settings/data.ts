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

export const website_color_schemes = [
  "#0033C4",
  "#0FA7E2",
  "#53B07D",
  "#E15B0F",
  "#C1373F",
  "#050901",
  "#8C62FF",
  "#005623",
  "#01BA4C",
  "#2DD4BF",
  "#FFBB53",
  "#CE9EA1",
  "#C18A37",
  "#C1373F",
  "#FC63FF",
  "#92FF3C",
  "#9B00FAAB",
  "#377FC1",
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
    color: "green",
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

export const services: Record<string, { name: string; active?: boolean }[]> = {
  "Property Managers": [
    {
      name: "Estate Agency",
    },
    {
      name: "Feasibility and viability appraisal",
    },
    {
      name: "Real estate development",
    },
    {
      name: "Real estate advisory",
    },
    {
      name: "Title search and verification",
    },
    {
      name: "Project management",
    },
    {
      name: "Property Valuation",
    },
    {
      name: "Property and Facility management",
    },
    {
      name: "Property Marketing",
    },
    {
      name: "Property Management",
    },
    {
      name: "Market Analysis",
    },
    {
      name: "Property Taxation",
    },
    {
      name: "Investment Analysis",
    },
    {
      name: "Market Research",
    },
    {
      name: "Land Acquisition",
    },
    {
      name: "Marketing and Sales",
    },
  ],
  "Registered Surveyor, Technician Surveyor": [
    {
      name: "Land surveying",
    },
    {
      active: true,
      name: "Boundary Surveys",
    },
    {
      name: "Topographic Surveys",
    },
    {
      name: "Construction Staking",
    },
    {
      name: "Geographic Information Systems (GIS)",
    },
    {
      name: "Surveys Title Change",
    },
    {
      name: "Land Acquisition and Disposal",
    },
  ],
  Analyst: [
    {
      name: "Cost Planning",
    },
    {
      name: "Cost Management",
    },
    {
      name: "Development Consultancy",
    },
    {
      name: "Cost estimation",
    },
    {
      name: "Construction Management",
    },
  ],
  Appraiser: [
    {
      name: "Architectural Drawing",
    },
    {
      name: "Property Inspection",
    },
    {
      name: "Landscaping",
    },
    {
      name: "Excavation",
    },
    {
      name: "Architectural Design",
    },
    {
      name: "Site Analysis",
    },
    {
      name: "Project management",
    },
    {
      name: "Planning and Design",
    },
    {
      name: "Project Planning and Management",
    },
    {
      name: "Structural Engineering",
    },
  ],
  Developer: [
    {
      name: "Estate Planning",
    },
    {
      name: "Asset Management",
    },
    {
      name: "Property Appraisal",
    },
    {
      name: "Feasibility Studies",
    },
    {
      name: "Contract Administration",
    },
    {
      name: "Procurement Advice",
    },
    {
      name: "Risk Management",
    },
    {
      name: "Environmental Planning",
    },
    {
      name: "Urban Planning",
    },
    {
      name: "Site Planning and Design",
    },
    {
      name: "Construction Management",
    },
  ],
  "Contractor, Builder": [
    {
      name: "General Contracting",
    },
    {
      name: "Building Construction",
    },
    {
      name: "Renovation and Remodeling",
    },
    {
      name: "Carpentry",
    },
    {
      name: "Plumbing",
    },
    {
      name: "Electrical Work",
    },
    {
      name: "Painting and Finishing ",
    },
    {
      name: "Value Engineering",
    },
    {
      name: "Renovation and Remodeling",
    },
    {
      name: "Environmental Engineering",
    },
    {
      name: "Geo-technical Engineering",
    },
  ],
  "Real Estate Agents, Broker, Investors": [
    {
      name: "Transaction Management",
    },
    {
      name: "Advisory Services",
    },
    {
      name: "Properties Representation",
    },
    {
      name: "Real Estate Transaction",
    },
    {
      name: "Financial Planning",
    },
    {
      name: "Investment Management",
    },
    {
      name: "Brokerage Services",
    },
    {
      name: "Wealth Management",
    },
    {
      name: "Retirement Planning",
    },
    {
      name: "Tax Planning and Preparation",
    },
    {
      name: "Risk Management",
    },
    {
      name: "Alternative Investments",
    },
    {
      name: "Education and Research",
    },
    {
      name: "Stock & Bond Trading",
    },
    {
      name: "Mutual Fund Trading",
    },
    {
      name: "Futures & Margin Trading",
    },
    {
      name: "Research and Analysis",
    },
  ],
  "Law Firm, Barristers, Arbitrators, Solicitors, Attorneys, Advocates, Lawyer":
    [
      {
        name: "Legal and Financial Guidance",
      },
      {
        name: "Legal Advice",
      },
      {
        name: "Contract Drafting and Review",
      },
      {
        name: "Litigation and Dispute Resolution",
      },
      {
        name: "Business Law",
      },
      {
        name: "Family Law",
      },
      {
        name: "Criminal Defense",
      },
      {
        name: "Immigration Law",
      },
      {
        name: "Real Estate Law",
      },
      {
        name: "Business and Corporate Law",
      },
      {
        name: "Intellectual Property Law",
      },
      {
        name: "Legal Consultation",
      },
      {
        name: "Contract Drafting and Review",
      },
      {
        name: "Litigation and Dispute Resolution",
      },
      {
        name: "Dispute Resolution",
      },
      {
        name: "Property Investigation",
      },
    ],
  "Hotel, Short Stay, Aparment, Holiday Home": [
    {
      name: "Reservation",
    },
    {
      name: "Front-desk Operation",
    },
    {
      name: "Channel Management Revenue",
    },
    {
      name: "Management Housekeeping",
    },
    {
      name: "Night Audit",
    },
    {
      name: "Exhibition Management",
    },
    {
      name: "Event Management",
    },
    {
      name: "Stock Control Manangement",
    },
    {
      name: "Stock Accounting",
    },
    {
      name: "Hunman Resources Management",
    },
    {
      name: "Sales Services ",
    },
    {
      name: "Resturant Management",
    },
    {
      name: "Accomodation Management",
    },
    {
      name: "House Keeper",
    },
    {
      name: "Facilities Management",
    },
  ],
} as const;
