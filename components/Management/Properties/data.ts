// Types
import type { StaffData } from "./types";

// Imports
import { toast } from "sonner";

export const unit_card_data_props = {
  unit_details: "",
  "unit no/name": "",
  unit_description: "",
  rent: "",
  caution_deposit: "",
  service_charge: "",
};

export const getAllStaffsByBranch = async (
  branchId: string,
  accessToken: string | null
): Promise<StaffData[]> => {
  let result: StaffData[] = [];

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/staffs?branch_id=${branchId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      toast.error(data.message ?? "An unexpected error occurred");
      return result;
    }

    result = data.data;
  } catch (error) {
    console.error("Error fetching staffs:", error);
    toast.error("Failed to fetch staffs. Please try again.");
  }

  return result;
};
