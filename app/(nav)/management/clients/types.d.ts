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

export interface PropertiesManaged {
  id: string;
  property_name: string;
  images: string[];
  default_image: string;
  address: string;
  total_units: number;
  total_income: number;
  total_returns: number;
  property_type: "rental" | "facility";
  total_unit_pictures: number;
  hasVideo: boolean;
  currency: "naira" | "dollar" | "pound" | undefined;
  mobile_tenants: number;
  web_tenants: number;
  owing_units: number;
  available_units: number;
  viewOnly: boolean;
  isClickable: boolean;
  branch: string;
  last_updated: string;
  accountOfficer: string;
  documents: any[];
};

export interface PreviousProperties {
  id: string;
  property_name: string;
  images: string[];
  default_image: string;
  address: string;
  total_units: number;
  total_income: number;
  total_returns: number;
  property_type: "rental" | "facility";
  total_unit_pictures: number;
  hasVideo: boolean;
  currency: "naira" | "dollar" | "pound" | undefined;
  mobile_tenants: number;
  web_tenants: number;
  owing_units: number;
  available_units: number;
  viewOnly: boolean;
  isClickable: boolean;
  branch: string;
  last_updated: string;
  accountOfficer: string;
  documents: any[];
};

// interface PropertyManaged {
//   images: string[];
//   id: string;
//   name: string;
//   address: string;
//   currency: string;
//   total_income: number;
//   total_returns: number;
//   total_units: number;
//   mobile_tenants: number;
//   web_tenants: number;
//   accountOfficer: string;
//   owing_units: number;
//   available_units: number;
//   isClickable: boolean;
//   viewOnly: boolean;
//   branch: string;
//   property_type: "rental" | "facility";
// }

interface AttachedDocument extends AttachedDocumentCard {
  document_type: string;
  id: string;
}

export type ClientPageData = {
  id: string;
  picture?: string;
  // first_name: string;
  // last_name: string;
  name: string;
  title: string;
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
  note?: boolean;
  others: Others;
  documents: AttachedDocument[];
  properties_managed?: PropertiesManaged[];
  previous_properties?: PreviousProperties[];
  statement?: Array<{
    id: number;
    picture: string;
    name: string;
    payment_id: string;
    details: string;
    credit: string | null;
    debit: string | null;
    date: string;
    badge_color: BadgeIconColors | null;
  }>;
  messageUserData: messageUserDataTypes;
  propertyOptions?: {
    label: string;
    value: string;
  }[]
};

export interface messageUserDataTypes {
  branch_id: number;
  id: number;
  imageUrl: string;
  name: string;
  position: string;
}
export type ClientHelpInfo = {
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

export type ClientHelpInfoList = ClientHelpInfo[];
