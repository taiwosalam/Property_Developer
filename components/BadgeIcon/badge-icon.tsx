import { BadgeCheckIcon } from "@/public/icons/icons";
import React from "react";

// Define the colors
export const badgeIconColors = {
  green: "#01BA4C",
  black: "#050901",
  blue: "#2563EB",
  red: "#E9212E",
  yellow: "#FFBB53",
} as const;

export type BadgeIconColors = keyof typeof badgeIconColors;

interface BadgeIconProps {
  color: BadgeIconColors;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ color }) => {
  return (
    <span style={{ color: badgeIconColors[color], marginLeft: "8px" }}>
      <BadgeCheckIcon />
    </span>
  );
};

export default BadgeIcon;
