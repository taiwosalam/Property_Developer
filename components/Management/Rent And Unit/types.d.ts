import { StaticImageData } from "next/image";

export interface PropertyDetailsProps {
  rent: number;
  cautionDeposit: number;
  serviceCharge: number;
}

export interface ActionButtonProps {
  label: string;
  color: string;
  route: string;
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

export interface Occupant {
  name: string;
  email: string;
  avatar: string;
  gender: string;
  birthday: string;
  religion: string;
  phone: string;
  maritalStatus: string;
  address: string;
  city: string;
  state: string;
  lg: string;
}

export interface FeeDetail {
  name: string;
  amount: number;
}

export interface OccupantProfileProps {
  occupant: Occupant;
  title?: string;
  title1?: string;
  title2?: string;
  feeDetails: FeeDetail[];
  onEdit: () => void;
}
