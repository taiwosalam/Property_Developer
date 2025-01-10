import type { notificationCardProps } from "@/components/dashboard/types";
interface Stats {
  total: number;
  new_this_month: number;
}

export interface SingleBranchPageData {
  branch_name: string;
  address: string;
  properties: Stats;
  landlords: Stats;
  tenants: Stats;
  vacant_units: Stats;
  expired: Stats;
  invoices: Stats;
  inquiries: Stats;
  complaints: Stats;
  listings: Stats;
  staffs: notificationCardProps["notifications"];
  hasManager: boolean;
}

export interface EditBranchFormData {
  id: string;
  isActive: 1 | 0;
  branch_name: string;
  state: string;
  local_government: string;
  city: string;
  address: string;
  wallet: "yes" | "no";
  description: string;
  picture: string | null;
}

export type SingleBranchResponseType = {
  data: {
    branch: {
      id: string;
      branch_name: string;
      is_active: 1 | 0;
      state: string;
      local_government: string;
      city: string;
      branch_address: string;
      picture: string | null;
      // branch_wallet: string; //to be added later
      branch_desc: string;
      landlords_count: number;
      current_month_landlords_count: number;
      tenants_count: number;
      current_month_tenants_count: number;
      properties_count: number;
      current_month_properties_count: number;
      units_count: number;
      complaints_count: number;
      current_month_complaints_count: number;
      staffs_count: number; // do d monthly/this month stuff
      properties_count: number; // do d monthly/this month stuff
      staffs: {
        id: string;
        picture: string;
        // user_id: string;
        is_active: 1 | 0;
        title: string | null;
        // estate_title: string | null;
        staff_role: "manager" | "staff" | "account officer";
        name: string;
      }[];
    };
    manager: {
      id: string;
      is_active: 1 | 0;
      title: string | null;
      estate_title: string | null;
      staff_role: "manager" | "staff" | "account officer";
    }[];
  };
};
