


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

type SupportedCurrency = "naira" | "dollar" | "euro" | "pound";

export function formatToNaira(
  amount: string | number | null | undefined
): string {
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

export function formatCurrency(
  amount: string | number | null | undefined,
  currency: SupportedCurrency = "naira"
): string {
  if (amount === null || amount === undefined) {
    return getCurrencySymbol(currency) + "0";
  }

  const amountNumber = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(amountNumber)) {
    return "Invalid Amount";
  }

  if (amountNumber === 0) {
    return getCurrencySymbol(currency) + "0";
  }

  const options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: getCurrencyCode(currency),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  const locale = getCurrencyLocale(currency);

  return new Intl.NumberFormat(locale, options).format(
    Math.floor(amountNumber)
  );
}

// Helper to get currency code from user-friendly string
function getCurrencyCode(currency: SupportedCurrency): string {
  switch (currency) {
    case "naira":
      return "NGN";
    case "dollar":
      return "USD";
    case "euro":
      return "EUR";
    case "pound":
      return "GBP";
    default:
      return "NGN"; // fallback
  }
}




export function hexToRgba(hex: string, alpha = 1) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("");
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function capitalizeName(name: string): string {
  return name
    .split(" ") // split into words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" "); // join back
}

// Helper to get locale for correct formatting
function getCurrencyLocale(currency: SupportedCurrency): string {
  switch (currency) {
    case "naira":
      return "en-NG";
    case "dollar":
      return "en-US";
    case "euro":
      return "de-DE";
    case "pound":
      return "en-GB";
    default:
      return "en-NG";
  }
}

// Optional helper to get just the symbol (used for zero/null cases)
function getCurrencySymbol(currency: SupportedCurrency): string {
  switch (currency) {
    case "naira":
      return "₦";
    case "dollar":
      return "$";
    case "euro":
      return "€";
    case "pound":
      return "£";
    default:
      return "₦";
  }
}

export function parseCurrencyToNumber(
  value: string | null | undefined
): number {
  if (!value) return 0;

  // Remove anything that's not a digit or dot
  const cleanValue = value.replace(/[^0-9.]/g, "");

  // Handle edge case: multiple dots (e.g., malformed "10.000.50")
  const parts = cleanValue.split(".");
  const normalized =
    parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleanValue;

  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

const nameColors = [
  "text-red-500",
  "text-pink-500",
  "text-yellow-500",
  "text-green-500",
  "text-blue-500",
  "text-purple-500",
  "text-orange-500",
  "text-teal-500",
];

export function getColorClass(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return nameColors[Math.abs(hash) % nameColors.length];
}
