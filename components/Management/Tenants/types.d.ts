// Types
import type { TenantData } from "@/app/(nav)/management/tenants/types";

export type AddTenantModalOptions =
  | "options"
  | "add-tenant"
  | "add-multiple-users"
  | "invite-single-user"
  | "invite-multiple-users"
  | "add-user-with-id";

export interface AddTenantOptionsProps {
  showForm: React.Dispatch<React.SetStateAction<AddTenantModalOptions>>;
}

export interface TenantProps {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  user_tag: "web" | "mobile";
  phone_number: string;
  picture?: string;
  avatar?: string;
  picture_url: string;
  service?: string
}

export interface TenantEditContextProps {
  data: TenantData | null;
}
