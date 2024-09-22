export type LandlordPageData = {
  avatar: string;
  picture: string;
  name: string;
  email: string;
  phone_number: string;
  user_tag: string;
  id: number;
  contact_address: {
    address: string;
    city: string | null;
    state: string;
    local_govt: string;
  };
  guarantor: {
    name: string | null;
    relationship: string | null;
    email: string | null;
    phone_number: string | null;
    address: string | null;
    note: string | null;
  };
  bank_details: {
    bank_name: string | null;
    account_name: string | null;
    account_number: string | null;
    wallet_id: string | null;
  };
  attachment: string | null;
  properties_managed: {
    id: number;
    property_name: string;
    address: string;
    property_tag: string;
    units: number;
    rental_value: number;
    annual_returns: number | null;
    account_officer: string;
    image: string | null;
  }[];
};
