import type { AttachedDocumentCard } from "@/components/Management/landlord-tenant-info-components";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

interface ContactAddress {
  address: string;
  city: string | null;
  state: string;
  local_govt: string;
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
  relationship: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
}

interface BankDetails {
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  wallet_id?: string | null;
}

interface Others {
  employment: string | null;
  employment_type: string | null;
  family_type: string | null;
}

interface PropertyManaged {
  rental_value: number;
  account_officer: string;
}

interface AttachedDocument extends AttachedDocumentCard {
  document_type: string;
  file?: File;
}

export type LandlordPageData = {
  id: string;
  picture: string;
  // first_name: string;
  // last_name: string;
  name: string;
  email: string;
  gender: string;
  phone_number: string;
  user_tag: "web" | "mobile";
  badge_color?: BadgeIconColors;
  user_id: string;
  owner_type: string;
  marital_status?: string;
  birthday?: string;
  religion?: string;
  contact_address: ContactAddress;
  next_of_kin: NextOfKin;
  bank_details: BankDetails;
  guarantor_1?: Guarantor;
  guarantor_2?: Guarantor;
  notes?: {
    last_updated: string;
    write_up: string;
  };
  others: Others;
  documents: AttachedDocument[];
  properties_managed?: PropertyManaged[];
};

export type LandlordHelpInfo = {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: any[];
  acf: {
    video_link: string;
  };
  doc_category_order: string;
  thumbnail: string | null;
  handbookthumbnail: string | null;
  knowledge_base: any[];
  _links: {
    self: Array<{ href: string }>;
    collection: Array<{ href: string }>;
    about: Array<{ href: string }>;
    up: Array<{
      embeddable: boolean;
      href: string;
    }>;
    "wp:post_type": Array<{ href: string }>;
    curies: Array<{
      name: string;
      href: string;
      templated: boolean;
    }>;
  };
};

export type LandlordHelpInfoList = LandlordHelpInfo[];
