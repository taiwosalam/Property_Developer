interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
  phone_number?: string;
  gender?: string;
  picture: string;
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
  staff_type?: "account_officer" | "regular_staff";
}
