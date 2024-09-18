import { property_listing_data } from "./data";

export type PropertyListingCardData = keyof typeof property_listing_data;

export interface PropertyListingCardProps {
  data: Partial<Record<PropertyListingCardData, string>>;
}
