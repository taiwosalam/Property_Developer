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
