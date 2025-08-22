import { property_listing_data, property_listing_status } from "./data";

export type PropertyType = "rental" | "gated";

export interface PropertyListingCardDataProps {
  id: string;
  property_name: string;
  total_returns: string;
  total_income: string;
  branch: string;
  address: string;
  last_updated: string;
  // account_officer: string;
  account_manager: string;
  state: string;
  local_government: string;
  total_unit: string;
  video_link?: string;
  images?: string[];
}

// export type PropertyListingCardData = keyof typeof property_listing_data;

export type PropertyListingStatus = keyof typeof property_listing_status;

export interface PropertyListingCardProps {
  propertyType: PropertyType;
  status: PropertyListingStatus;
  data: Partial<Record<PropertyListingCardDataProps>>;
  page?: "manager" | "account";
}

export interface PropertyListingLabelIDProps {
  id: string;
  type: PropertyType;
}

export interface PropertyListingTitleDescProps {
  desc: string;
  title: string;
}

export interface PropertyListingRedProps {
  children: React.ReactNode;
}

export interface PropertyListingStatusItemProps {
  text: string;
  color: string;
}
