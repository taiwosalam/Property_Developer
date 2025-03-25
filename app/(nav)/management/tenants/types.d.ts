import type { AttachedDocumentCard } from "@/components/Management/landlord-tenant-info-components";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

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
}
