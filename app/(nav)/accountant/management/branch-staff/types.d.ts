import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
  staff_role?: string;
  phone_number?: string;
  gender?: string;
  picture: string | null;
  badge_color?: BadgeIconColors;
  isOnline?: boolean;
}

export interface BranchStaffPageState {
  total_pages: number;
  current_page: number;
  branch_name: string;
  branch_address: string;
  staffs: Staff[];
  staff_count_by_role: {
    "account officer": number;
    staff: number;
    account_officer: number;
    manager: number;
  };
  total_data_count: number;
}

export interface BranchStaffRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  staff_positiion?: string; // "account_officer" | "staff" | "manager";
}

export interface StaffListResponse {
  data: {
    staff: {
      id: string;
      name: string;
      email: string;
      phone: string;
      picture: string | null;
      staff_role: string;
      title: string | null;
      tier: 1 | 2 | 3 | 4 | 5;
      online_status: string;
    }[];
    branch: {
      id: string;
      name: string;
      address: string;
      // lga
      // city
      // state
    };
    pagination: {
      current_page: number;
      total_pages: number;
    };
  };
  total_data_count: number;
  staff_count_by_role: {
    "account officer": number;
    staff: number;
    account_officer: number;
    manager: number;
  };
  staff_active_count: number;
  staff_inactive_count: number;
}
