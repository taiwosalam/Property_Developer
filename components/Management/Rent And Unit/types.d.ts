import { StaticImageData } from "next/image";

export interface PropertyDetailsProps {
  rent: number;
  cautionDeposit: number;
  serviceCharge: number;
}

export interface ActionButtonProps {
  label: string;
  color: string;
}

interface PropertyImageSliderProps {
  images: StaticImageData[] | string[];
  showOverlay?: boolean;
}
export interface UnitDetails {
  //   id: string;
  title: string;
  location: string;
  categories: string;
  unitNumber: string;
  unitPreference: string;
  unitType: string;
  unitSubType: string;
  state: string;
  localGovernment: string;
  accountOfficer: string;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  newTenantPrice: number;
  renewalTenantPrice: number;
  images: string[];
}
