export function parseCurrencyToNumber(
  value: string | null | undefined
): number | null {
  if (!value || typeof value !== "string") return null;
  const cleaned = value.replace(/[^\d.]/g, "");

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

import api, { handleAxiosError } from "@/services/api";

export const BuySponsor = async (data: FormData) => {
  try {
    const res = await api.post("/sponsor/buy", data);
    if (res.status === 200 || res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// /sponsor/unit
export const sponsorUnit = async (data: FormData) => {
  try {
    const res = await api.post("/sponsor/unit", data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
