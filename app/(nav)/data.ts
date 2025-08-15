import api, { handleAxiosError } from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { getLocalStorage } from "@/utils/local-storage";
import dayjs from "dayjs";

interface UserResponse {
  data: {
    details: {
      role: [string];
      email: string;
      email_verification: boolean;
    };
  };
}

export const getUserStatus = async () => {
  try {
    const { data } = await api.get<UserResponse>("/user");
    const { role, email_verification, email } = data.data.details;
    useAuthStore.getState().setAuthState("role", role[0]);
    useAuthStore.getState().setAuthState("email", email);
    if (!email_verification) {
      useAuthStore.getState().setAuthState("emailVerified", false);
      return "redirect to verify email";
    }
    if (role[0] === "user") {
      return "redirect to setup";
    }
  } catch (error) {}
};

export const getParsedAdditionalDetails = () => {
  const additionalDetails = getLocalStorage("additional_details");
  if (!additionalDetails) return {};

  if (typeof additionalDetails === "string") {
    try {
      return JSON.parse(additionalDetails);
    } catch (e) {
      console.error("Failed to parse additional_details:", e, {
        additionalDetails,
      });
      return {};
    }
  } else if (typeof additionalDetails === "object") {
    return additionalDetails; // Already an object, no need to parse
  }
  return {};
};

type BillingDuration = "perMonth" | "perYear" | "lifetime";

export function calculateAmountAndValidTillFromPricing(
  pricing: {
    perMonth: string;
    perYear: string;
    lifetime: string;
  },
  selectedDuration: BillingDuration,
  quantity: number,
  startDate: string
): { amountToPay: number; validTill: string } {
  const priceMap = {
    perMonth: parseFloat(pricing.perMonth),
    perYear: parseFloat(pricing.perYear),
    lifetime: parseFloat(pricing.lifetime),
  };

  const unitPrice = priceMap[selectedDuration] || 0;
  const amountToPay =
    selectedDuration === "lifetime" ? unitPrice : unitPrice * quantity;

  let validTill = "Lifetime";

  if (selectedDuration !== "lifetime") {
    const dayjsUnit = selectedDuration === "perMonth" ? "month" : "year";
    const parsedStart = dayjs(startDate, "DD/MM/YYYY");

    if (!parsedStart.isValid()) {
      return { amountToPay, validTill: "Invalid Start Date" };
    }

    validTill = parsedStart.add(quantity, dayjsUnit).format("DD/MM/YYYY");
  }

  return { amountToPay, validTill };
}

export const renewSubscription = async (payload: any) => {
  try {
    const res = await api.post("/property-manager-subscription/renew", payload);
    if (res.status === 200) {
      return true;
    }
  } catch (e) {
    handleAxiosError(e, "Failed to renew subscription");
    return false;
  }
};
