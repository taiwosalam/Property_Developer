import { property_listing_data, property_listing_status } from "./data";

export type PropertyType = "rental property" | "gated property";

export type PropertyListingCardData = keyof typeof property_listing_data;

export type PropertyListingStatus = keyof typeof property_listing_status;

export interface PropertyListingCardProps {
  propertyType: PropertyType;
  status: PropertyListingStatus;
  data: Partial<Record<PropertyListingCardData, string>>;
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
