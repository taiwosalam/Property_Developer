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
  documents: Document[];
  notes: {
    last_updated: string;
    write_up: string;
  };
}

export interface Document {
  id: number;
  name: string;
  link: string;
  date: string;
  thumbnail?: string;
  document_type: string;
}
