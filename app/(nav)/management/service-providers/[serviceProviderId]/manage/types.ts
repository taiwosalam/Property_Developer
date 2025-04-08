interface CompanyDetails {
  name: string;
  email: string;
  phone_number: string;
  address: string;
}

interface BankDetails {
  bank_name: string;
  account_number: string;
  account_name: string;
}

export interface ServiceProviderData {
  user_tag: "web" | "mobile";
  avatar?: string;
  picture?: string;
  id: number | string;
  full_name: string;
  email: string;
  service_rendered: string;
  personal_number: string;
  address: string;
  state: string;
  local_government: string;
  company_details: CompanyDetails;
  bank_details: BankDetails;
  notes: {
    last_updated: string;
    write_up: string;
  };
}

export interface ServiceProviderPageDetails {
  data: {
    id: number;
    user_id: number | null;
    company_id: number;
    name: string;
    email: string;
    phone: string;
    company_name: string;
    company_phone: string;
    service_render: string;
    address: string;
    state: string;
    local_government: string;
    avatar: string;
    bank_name: string;
    account_name: string | null;
    account_number: string | null;
    note: string | null;
  };
}

export interface ServiceProviderPage {
  user: {
    user_id: number | null;
  };
  provider: {
    id: number;
    avatar: string;
    full_name: string;
    email: string;
    user_tag: string;
    wallet_id: string;
    phone: string;
  };
  company: {
    name: string;
    phone: string;
    about: string;
    service_rendered: string;
    avatar: string;
    address: string;
    state: string;
    local_government: string;
  };
  bank: {
    name: string | null;
    account_name: string | null;
    account_number: string | null;
  };
}

export interface ServiceProviderDetailsResponse {
  status: "success";
  data: {
    account_name: string | null;
    account_number: string | null;
    address: string;
    avatar: string;
    bank_name: string | null;
    company_name: string;
    company_phone: string;
    company_email: string;
    company_address: string;
    email: string;
    id: number;
    local_government: string;
    name: string;
    note: string;
    updated_at: string;
    phone: string;
    service_render: string;
    state: string;
    user_id: number;
    wallet_id: string;
    agent: string;
  };
}

