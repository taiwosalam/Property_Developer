import { StaticImageData } from "next/image";

export interface PropertyDetailsProps {
  rent: number;
  cautionDeposit: number;
  serviceCharge: number;
}

export interface ActionButtonProps {
  label: string;
  color: string;
  route?: string;
  modal?: string;
}

interface PropertyImageSliderProps {
  images: { path: string }[];
  showOverlay?: boolean;
  thread?: boolean;
  video_link?: string;
}
export interface UnitDetails {
  data: [
    {
      unit_id: string;
      title: string;
      unit_name: string;
      address: string;
      location: string;
      categories: string;
      unitNumber: string;
      unitPreference: string;
      unitType: string;
      unitSubType: string;
      state: string;
      localGovernment: string;
      accountOfficer: string;
      bedrooms: string;
      bathrooms: string;
      toilets: string;
      newTenantPrice: string;
      newTenantTotalPrice: string;
      renewalTenantPrice: string;
      renewalTenantTotalPrice: string;
      fee_amount: string;
      images: string[];
      fee_period: string;
      renew_fee_period: string;
    }
  ]
}

export interface Occupant {
  id: string;
  name: string;
  email: string;
  userTag: "mobile" | "web";
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
  occupants: { name: string; id: string }[];
  isRental: boolean;
  feeDetails: FeeDetail[];
  total_package: number;
  loading?: boolean;
  id: string;
}
