import {
  BadgeIconColors,
  tierColorMap,
} from "@/components/BadgeIcon/badge-icon";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
  if (!tier || tier === 0) return undefined;
  return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
};

export function formatToNaira(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined) {
    return "₦0"; // Or any other default value you prefer for null/undefined
  }

  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(amountNumber)) {
    return "Invalid Amount";
  }

  if (amountNumber === 0) {
    return "₦0";
  }

  const formattedAmount = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0, // Remove decimal part
    maximumFractionDigits: 0, // Remove decimal part
  }).format(Math.floor(amountNumber)); // Use Math.floor to truncate

  return formattedAmount;
}
