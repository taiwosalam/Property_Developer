interface ContactAddress {
  address: string;
  city: string | null;
  state: string;
  local_govt: string;
}

interface Guarantor {
  name: string | null;
  relationship: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  note: string | null;
}

interface BankDetails {
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  wallet_id: string | null;
}

interface PropertyManaged {
  id: number;
  property_name: string;
  address: string;
  property_tag: string;
  units: number;
  rental_value: number;
  annual_returns: number | null;
  account_officer: string;
  image: string | null;
}

export type LandlordPageData = {
  avatar: string;
  picture: string;
  name: string;
  email: string;
  phone_number: string;
  user_tag: "web" | "mobile";
  id: number | string;
  contact_address: ContactAddress;
  guarantor: Guarantor;
  bank_details: BankDetails;
  attachment: string | null;
  properties_managed: PropertyManaged[];
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
