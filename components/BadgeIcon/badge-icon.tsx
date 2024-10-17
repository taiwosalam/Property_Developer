import { BadgeCheckIcon } from "@/public/icons/icons";

// Define the colors
export const badgeIconColors = {
  green: "#01BA4C",
  black: "#050901",
  blue: "#2563EB",
  red: "#E9212E",
  yellow: "#FFBB53",
  gray: "#C1C2C3",
} as const;

export type BadgeIconColors = keyof typeof badgeIconColors;

interface BadgeIconProps {
  color: BadgeIconColors;
  noMargin?: boolean;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ color, noMargin }) => {
  return (
    <span
      style={{
        color: badgeIconColors[color],
        marginLeft: noMargin ? undefined : "8px",
      }}
    >
      <BadgeCheckIcon />
    </span>
  );
};

export default BadgeIcon;
