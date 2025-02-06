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



interface BankDetails {
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
}

interface Others {
  occupation: string | null;
  job_type: string | null;
  family_type: string | null;
}

interface NextOfKin {
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  relationship: string | null;
}

interface Note {
  id: number | null;
  note: string | null;
  last_updated_at: string | null;
}

interface TenantData {
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string;
  gender: string;
  tenant_type: string;
  state: string;
  local_government: string;
  city: string;
  address: string;
  picture: string;
  agent: string;
  profile_id: number;
  branch_id: number;
  company_id: number;
  bank_details: BankDetails;
  Others: Others;
  next_of_kin: NextOfKin;
  note: Note;
  documents: any[]; // You can replace 'any' with a specific type if needed
  units: any[]; // Replace 'any' with a specific type if needed
  created_at: string;
  updated_at: string;
}

interface TenantResponse {
  status: string;
  statusCode: number;
  data: TenantData;
  message: string;
}
