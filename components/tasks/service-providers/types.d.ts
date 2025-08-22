export interface ServiceProviderProps {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  user_tag: "web" | "mobile";
  phone_number: string;
  picture?: string;
  avatar?: string;
  picture_url: string;
  service: string;
}

export type AddServiceProviderModalOptions =
  | "options"
  | "add-service-provider"
  | "invite-service-provider"
  // | "add-with-id"
  | "add-with-email";

export interface AddServiceProviderOptionsProps {
  showForm: React.Dispatch<
    React.SetStateAction<AddServiceProviderModalOptions>
  >;
}

type ServiceProviderResponse = {
  status: "success" | "error"; // Assuming status can also be "error"
  data: ServiceProvider;
};

type ServiceProvider = {
  id: number;
  user_id: number | null;
  company_id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  company_email: string | null;
  company_phone: string;
  company_address: string;
  service_render: string;
  address: string;
  state: string;
  local_government: string;
  avatar: string | null;
  bank_name: string;
  account_name: string;
  account_number: string;
  note: string;
};

export type TBankListResponse = {
  success: boolean;
  data: BankList[]
} 

export type BankList = {
  bank_name: string;
  bank_code: string
}

