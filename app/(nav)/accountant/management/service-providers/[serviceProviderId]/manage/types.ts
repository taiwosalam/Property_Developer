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

export interface IndividualServiceProvidersAPIResponse {
  data: {
    id: number;
    user_tag: "web" | "mobile",
    user_id: number | null;
    company_id: string;
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
    account_name: string;
    account_number: string;
    note: string;
    note_updated: string;
    notes: {
      last_updated: string;
      write_up: string;
    }
  };
}
