import { UserCardProps } from "@/components/Management/landlord-and-tenant-card";

export type AddClientModalOptions =
  | "options"
  | "add-client"
  | "add-multiple-users"
  | "invite-single-user"
  | "invite-multiple-users"
  | "add-user-with-email";

export interface AddClientOptionsProps {
  showForm: React.Dispatch<React.SetStateAction<AddClientModalOptions>>;
}

export interface ClientPageData {
  total_pages: number;
  current_page: number;
  total_clients: number;
  new_clients_this_month: number;
  mobile_clients: number;
  new_mobile_clients_this_month: number;
  web_clients: number;
  new_web_clients_this_month: number;
  clients: UserCardProps[];
}

export interface ClientRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  states?: string;
  start_date?: string;
  end_date?: string;
  agent?: string;
  branch_ids?: string;
}

export interface IndividualClientData {
  id: string;
  name: string;
  title: string;
  email: string;
  phone_number: string;
  picture_url: string;
  user_tag: "mobile" | "web";
  badge_color?: "red" | "yellow" | "blue" | "green" | "black" | "purple" | "gray";
  note: string;
  gender: string;
  birthday: string;
  religion: string;
  marital_status: string;
  employment: string;
  employment_type: string;
  family_type: string;
  owner_type: string;
  contact_address: {
    address: string;
    city: string;
    state: string;
    local_govt: string;
  };
  bank_details: {
    bank_name: string;
    account_name: string;
    account_number: string;
    wallet_id: string;
  };
  next_of_kin: {
    name: string;
    address: string;
    phone: string;
    relationship: string;
  };
  others: {
    employment: string;
    employment_type: string;
    family_type: string;
  };
  notes: {
    write_up: string;
    last_updated: string;
  };
  properties_managed: any[];
  previous_properties: any[];
  statement: any[];
  documents: any[];
  user_id: string;
  messageUserData: {
    id: number;
    name: string;
    position: string;
    imageUrl: string;
    branch_id: number;
  };
}
