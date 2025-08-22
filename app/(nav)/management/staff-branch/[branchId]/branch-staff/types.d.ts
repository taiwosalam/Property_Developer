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
  isOnline?: boolean;
  badge_color?: BadgeIconColors;
}

export interface BranchStaffPageState {
  total_pages: number;
  current_page: number;
  branch_name: string;
  branch_address: string;
  staffs: Staff[];
}

export interface BranchStaffRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  position?: string; // "account_officer" | "staff" | "manager";
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
      tier: 1 | 2 | 3 | 4 | 5;
      title: string | null;
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
}
