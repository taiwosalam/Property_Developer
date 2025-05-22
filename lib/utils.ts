import { BadgeIconColors, tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

 export const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
    if (!tier || tier === 0) return undefined;
    return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
  };
