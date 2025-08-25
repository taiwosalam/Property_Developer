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
