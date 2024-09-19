import { property_listing_data, property_listing_types } from "./data";

export type PropertyListingCardData = keyof typeof property_listing_data;

export type PropertyListingType = (typeof property_listing_types)[number];

export interface PropertyListingCardProps {
  data: Partial<Record<PropertyListingCardData, string>>;
}

export interface PropertyListingLabelIDProps {
  id: string;
  type: "rental property" | "gated property";
}

export interface PropertyListingTitleDescProps {
  desc: string;
  title: string;
}

export interface PropertyListingRedProps {
  children: React.ReactNode;
}
