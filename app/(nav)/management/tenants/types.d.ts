import type { AttachedDocumentCard } from "@/components/Management/landlord-tenant-info-components";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { UnitItemProps } from "@/components/Management/Properties/unit-item";
import { Currency } from "@/utils/number-formatter";
import { messageUserDataTypes } from "../landlord/types";

interface ContactAddress {
  address: string;
  city: string | null;
  state: string;
  local_govt: string | null;
}

interface NextOfKin {
  name: string | null;
  email: string | null;
  address: string | null;
  phone: string | null;
  relationship: string | null;
}

interface Guarantor {
  name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  relationship: string | null;
}

interface Others {
  occupation: string | null;
  employment_type?: string | null;
  family_type: string | null;
  tenant_type: string | null;
}

interface BankDetails {
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  wallet_id?: string | null;
}

interface AttachedDocument extends AttachedDocumentCard {
  document_type: string;
  id: string;
}

export interface CurrentRent {
  id: number;
  unit_id: number;
  currency: Currency;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string;
  unit_preference: string;
  rent_amount: string;
  service_charge: string | null;
  caution_deposit: string | null;
  due_date: string;
  tenant_name: string;
  property_type: "rental" | "facility";
  unit_status: "vacant" | "occupied" | "active" | "expired" | "relocate";
  rent_type: string;
  property_name: string;
  property_description: string;
  property_category: string;
  unit_image: { path: string }[];
}

export interface PreviousRent {
  id: number;
  unit_id: number;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string;
  currency: Currency;
  unit_preference: string;
  rent_amount: string;
  service_charge?: string | null;
  caution_deposit?: string | null;
  due_date: string;
  tenant_name: string;
  property_type: "rental" | "facility";
  unit_status: "vacant" | "occupied" | "active" | "expired" | "relocate";
  rent_type: string;
  property_name: string;
  property_description: string;
  property_category: string;
  unit_image: { path: string }[];
}

export interface Statement {
  id: number;
  payment_date?: string | null;
  amount_paid: string;
  details: string;
  start_date: string;
  end_date: string;
  currency: Currency;
  unit_name?: string;
}

export interface TenantData {
  id: string;
  picture: string;
  // first_name: string;
  // last_name: string;
  name: string;
  email: string;
  user_id: string;
  user_tag: "web" | "mobile";
  badge_color?: BadgeIconColors;
  phone_number: string;
  tenant_type: string;
  gender: string;
  birthdate: string;
  religion: string | null;
  marital_status: string | null;
  is_flagged?: boolean;
  flag?: {
    is_flagged: 1 | 0;
    flagged_by: number | string;
    reason: string;
  };
  contact_address: ContactAddress;
  next_of_kin: NextOfKin;
  guarantor_1?: Guarantor;
  guarantor_2?: Guarantor;
  others: Others;
  bank_details: BankDetails;
  notes: {
    last_updated: string;
    write_up: string;
  };
  documents: AttachedDocument[];
  current_rent?: UnitItemProps[];
  previous_rent?: UnitItemProps[];
  statement?: Statement[];
  note?: boolean;
  messageUserData?: messageUserDataTypes;
}
