import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { BranchDependentData } from "./types";
import { IndividualTenantAPIResponse } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import { TenantApiResponse } from "@/components/tasks/vehicles-record/types";

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

// Fetch tenants for a given property
export const getTenants = async (propertyId: string) => {
  try {
    const res = await api.get<TenantApiResponse>(
      `/report/tenants?property_id=${propertyId}`
    );
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch tenants");
  } catch (err) {
    handleAxiosError(err);
    throw err; // Re-throw to allow component to handle
  }
};

// Fetch individual tenant by ID
export const getTenantById = async (tenantId: string) => {
  try {
    const res = await api.get<IndividualTenantAPIResponse>(
      `tenant/${tenantId}`
    );
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch tenant");
  } catch (err) {
    handleAxiosError(err);
    throw err;
  }
};

// Fetch user by identifier (mobile user)
export const getUsers = async (identifier: string) => {
  try {
    const res = await api.get(`/get-users?identifier=${identifier}`);
    if (res.status === 200) {
      return res.data;
    }
    throw new Error("Failed to fetch user");
  } catch (err) {
    handleAxiosError(err);
    throw err;
  }
};
