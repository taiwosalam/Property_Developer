import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { BranchDependentData } from "./types";

export const getTenant = async (id: string) => {
  try {
    const res = await api.get(`/tenant/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    handleAxiosError(err);
  }
};

export const getBranchInventories = async (id: string) => {
  try {
    const res = await api.get(`/inventories/select/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (error) {
    handleAxiosError(error);
  }
};

export const fetchBranchDependentData = async (
  branchId: string
): Promise<BranchDependentData> => {
  const initialState: BranchDependentData = {
    inventory: { data: null, loading: true, error: null },
    staff: { data: null, loading: true, error: null },
    accountOfficer: { data: null, loading: true, error: null },
  };

  try {
    const [inventoryRes, staffRes, accountOfficerRes] = await Promise.all([
      api.get(`/inventories/select/${branchId}`),
      api.get(`branch/${branchId}/staff`),
      api.get(`branch/${branchId}/account_officer`),
    ]);

    return {
      inventory: {
        data: inventoryRes.status === 200 ? inventoryRes.data : null,
        loading: false,
        error: inventoryRes.status !== 200 ? "Failed to fetch inventory" : null,
      },
      staff: {
        data: staffRes.status === 200 ? staffRes.data : null,
        loading: false,
        error: staffRes.status !== 200 ? "Failed to fetch staff" : null,
      },
      accountOfficer: {
        data: accountOfficerRes.status === 200 ? accountOfficerRes.data : null,
        loading: false,
        error:
          accountOfficerRes.status !== 200
            ? "Failed to fetch account officers"
            : null,
      },
    };
  } catch (error) {
    handleAxiosError(error);
    const errorMessage = "An unknown error occurred";
    return {
      inventory: { data: null, loading: false, error: errorMessage },
      staff: { data: null, loading: false, error: errorMessage },
      accountOfficer: { data: null, loading: false, error: errorMessage },
    };
  }
};
