import { BadgeCheckIcon } from "@/public/icons/icons";

// Define the colors
export const badgeIconColors = {
  green: "#01BA4C",
  black: "#050901",
  blue: "#2563EB",
  red: "#E9212E",
  yellow: "#FFBB53",
  gray: "#C1C2C3",
  purple: "#A855F7"
} as const;

export type BadgeIconColors = keyof typeof badgeIconColors;

export const tierColorMap = {
  1: "red",
  2: "yellow",
  3: "blue",
  4: "green",
  5: "black",
  6: "purple",
} as const;


export const staffTierColorMap = {
  1: "gray",
  2: "yellow",
  3: "blue",
  4: "green",
  5: "black",
  6: "purple",
} as const;

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
