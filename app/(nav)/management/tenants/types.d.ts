import type { AttachedDocumentCard } from "@/components/Management/landlord-tenant-info-components";
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
  phone_number: string | null;
  address: string | null;
  relationship: string | null;
}

interface Others {
  occupation: string | null;
  type: string | null;
  family_type: string | null;
  note: string | null;
}

interface BankDetails {
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  wallet_id: string | null;
}

interface AttachedDocument extends AttachedDocumentCard {
  document_type: string;
}

export interface TenantData {
  id: string | number;
  avatar: string;
  picture: string;
  first_name: string;
  last_name: string;
  email: string;
  user_tag: "web" | "mobile";
  phone_number: string;
  gender: string;
  birthdate: string;
  religion: string | null;
  marital_status: string | null;
  contact_address: ContactAddress;
  next_of_kin: NextOfKin;
  guarantor1: Guarantor;
  guarantor2: Guarantor;
  others: Others;
  bank_details: BankDetails;
  notes: {
    last_updated: string;
    write_up: string;
  };
  documents: AttachedDocument[];
}
