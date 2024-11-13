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
  branchId: string
): Promise<StaffData[] | any> => {
  let result: StaffData[] = [];
};
