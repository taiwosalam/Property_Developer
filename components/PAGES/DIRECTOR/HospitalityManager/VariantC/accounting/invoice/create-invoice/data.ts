import api, { handleAxiosError } from "@/services/api";

export interface PropertyTenant {
  id: number;
  name: string;
  email: string;
  phone: string;
  username: string | null;
  picture: string;
}

export interface PropertyTenantResponse {
  status: string;
  statusCode: number;
  data: PropertyTenant[];
}

export interface PropertyTenantsApiResponse {
  status: "success" | "error"; 
  tenants: Tenant[];
  message: string;
}

export interface Tenant {
  id: number;
  name: string;
  email: string;
  phone: {
    profile_phone: string;
    user_phone: string;
  };
  picture: string;
  title: string | null;
  user_id: number;
  profile_id: number;
  branch_id: number | null;
  company_id: number;
  is_active: boolean;
  flags: TenantFlag[];
  is_flagged: boolean;
}

export interface TenantFlag {
  is_flagged: boolean;
  reason: string | null;
  flagged_by: string;
}

export const createInvoice = async (data: any) => {
  try {
    const res = await api.post("/invoice", data);
    if (res.status === 201) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err, "Failed to create invoice");
    return false;
  }
};

export const parseFormattedNumber = (
  value: string | number | null | undefined
): number | null => {
  // Handle null, undefined, or non-string/number inputs
  if (value == null || value === "") return null;
  // Convert to string if it's a number
  const strValue = typeof value === "number" ? value.toString() : value;
  // Remove all non-numeric characters (e.g., commas, spaces, currency symbols)
  const cleanedValue = strValue.replace(/[^0-9.-]/g, "");

  // Parse to number
  const parsedValue = parseFloat(cleanedValue);

  // Return null for invalid numbers (e.g., NaN or empty after cleaning)
  return isNaN(parsedValue) ? null : parsedValue;
};

export const getPropertyTenants = async (id: number) => {
  try {
    const res = await api.get(`all-tenant/${id}`);
    if (res.status === 200) {
      return res.data;
    }
  } catch (err) {
    handleAxiosError(err);
  }
};
