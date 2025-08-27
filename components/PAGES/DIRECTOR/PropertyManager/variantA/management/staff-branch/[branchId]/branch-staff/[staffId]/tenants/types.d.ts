import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

export interface StaffTenant {
  id: string;
  picture_url: string;
  name: string;
  title: string;
  user_tag: "web" | "mobile";
  email: string;
  phone_number: string;
  badge_color: BadgeIconColors;
  note?: string;
  boolean: boolean;
  flagged?: boolean;
}

export interface StaffTenantPagination {
  current_page: number;
  total_page: number;
}

export interface IStaffData {
  name: string;
  role: string;
}

export interface StaffTenantPageData {
  tenants: StaffTenant[];
  pagination: StaffTenantPagination;
  staff: IStaffData;
}
