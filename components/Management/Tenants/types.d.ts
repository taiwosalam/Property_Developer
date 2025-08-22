// Types
import type { TenantData } from "@/app/(nav)/management/tenants/types";

export type AddTenantModalOptions =
  | "options"
  | "add-tenant"
  | "add-multiple-users"
  | "invite-single-user"
  | "invite-multiple-users"
  | "add-user-with-email";

export interface AddTenantOptionsProps {
  showForm: React.Dispatch<React.SetStateAction<AddTenantModalOptions>>;
}

export interface TenantEditContextProps {
  data: TenantData | null;
}
