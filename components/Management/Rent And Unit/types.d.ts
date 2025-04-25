import { StaticImageData } from "next/image";
import { CheckBoxOptions, RentPeriod } from "./data";
import { Currency } from "@/utils/number-formatter";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

export interface PropertyDetailsProps {
  rent: number;
  cautionDeposit: number;
  serviceCharge: number;
  currency?: Currency;
}

export interface ActionButtonProps {
  label: string;
  // color: string;
  propertyType: "rental" | "facility";
  color: string | ((propertyType: string) => string);
  route?: string;
  modal?: string;
  unit_id?: string;
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
  occupation?: string;
  religion: string;
  phone: string;
  maritalStatus: string;
  address: string;
  city: string;
  tenant_type?: string;
  family_type?: string;
  state: string;
  lg: string;
  nextOfKin?: NextOfKin;
  badgeColor?: BadgeIconColors;
}

export interface FeeDetail {
  name: string;
  amount: number | string | undefined;
}

export interface OccupantProfileProps {
  occupants: { name: string; id: string; picture?: string }[];
  period?: RentPeriod;
  isRental: boolean;
  feeDetails: FeeDetail[];
  total_package: number;
  loading?: boolean;
  id: string;
  currency?: Currency;
  setSelectedTenantId?: (id: string) => void;
  setStart_date?: (date: string) => void;
  setIsPastDate?: ((isPast: boolean) => void) | undefined
  setSelectedCheckboxOptions?: (options: CheckBoxOptions) => void;
  setDueDate?: (date: Dayjs | null) => void;
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

export interface NextOfKin {
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
  marital_status: string;
  religion?: string;
  documents: any[]; // You can replace 'any' with a specific type if needed
  units: any[]; // Replace 'any' with a specific type if needed
  created_at: string;
  updated_at: string;
  user_tier: 1 | 2 | 3 | 4 | 5;
}

interface TenantResponse {
  status: string;
  statusCode: number;
  data: TenantData;
  message: string;
}


interface TenancyRecordProps {
  name: string;
  period: string;
  email: string;
  picture: string;
  phone: string;
  renew_rent: string;
  renew_total_package: string;
  renewalPackage: string;
  // tenant is expected to have rents and pagination info
  tenant: {
    id: number | string;
    rents: Array<{
      id: number | string;
      payment_date: string | null;
      amount_paid: string;
      details: string;
      start_date: string;
      due_date: string;
    }>;
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      total_pages: number;
    };
    // Optionally, documents can be provided here.
    documents?: any[];
  };
  unit_id: number | string;
}
