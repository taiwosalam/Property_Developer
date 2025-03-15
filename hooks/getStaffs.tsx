"use client";
import useFetch from "@/hooks/useFetch";

interface Staff {
  id: number;
  name: string;
  title: string;
  estate_title: string;
  staff_role: string;
  email: string;
  phone: string;
  username: string | null;
  picture: string;
  user_id: number;
  branch_id: number;
  company_id: number;
  created_at: string;
  updated_at: string;
}

interface StaffApiResponse {
  status: string;
  statusCode: number;
  data: {
    staff: Staff[];
  };
  total_data_count: number;
  message: string;
}

function useStaffRoles() {
  const { data, loading, error, refetch } = useFetch<StaffApiResponse>("/staffs");

  const getStaffByRole = (role: string) => {
    return data?.data.staff.filter((staff) => staff.staff_role.toLowerCase() === role.toLowerCase()) || [];
  };

  return {
    getManagers: () => getStaffByRole("manager"),
    getStaffs: () => getStaffByRole("staff"),
    getAccountOfficers: () => getStaffByRole("account officer"),
    loading,
    error,
    refetch,
  };
}

export default useStaffRoles;
