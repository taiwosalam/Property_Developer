interface Staff {
  id: string;
  name: string;
  email: string;
  position: string;
  phone_number?: string;
  gender?: string;
  picture: string | null;
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
      title: string | null;
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
