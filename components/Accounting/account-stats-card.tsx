import { CSSProperties } from "react";
import {
  BlueIncomingIcon,
  RedOutgoingIcon,
  GreenIncomingIcon,
  YellowCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "./icons";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";

type TrendDirection = "up" | "down";
type TrendColor = "red" | "green";

type StatCardVariant =
  | "blueIncoming"
  | "greenIncoming"
  | "yellowCard"
  | "redOutgoing";

interface VariantStyle {
  backgroundColor: CSSProperties["backgroundColor"];
  icon: React.ReactNode;
}
interface AccountStatsCardProps {
  variant: StatCardVariant;
  percentage: number;
  trendDirection: TrendDirection;
  trendColor: TrendColor;
  title: string;
  balance: number;
}

const AccountStatsCard: React.FC<AccountStatsCardProps> = ({
  variant,
  percentage,
  trendDirection,
  trendColor,
  title,
  balance,
}) => {
  const getVariantStyles = (): VariantStyle => {
    switch (variant) {
      case "blueIncoming":
        return {
          backgroundColor: "rgba(0, 51, 196, 0.2)",
          icon: <BlueIncomingIcon />,
        };
      case "greenIncoming":
        return {
          backgroundColor: "#E6FAEE",
          icon: <GreenIncomingIcon />,
        };
      case "redOutgoing":
        return {
          backgroundColor: "#FDE9EA",
          icon: <RedOutgoingIcon />,
        };

      case "yellowCard":
        return {
          backgroundColor: "#FFF8EE",
          icon: <YellowCardIcon />,
        };
      default:
        return {
          backgroundColor: "rgba(0, 51, 196, 0.2)",
          icon: <BlueIncomingIcon />,
        };
    }
  };
  const variantStyle = getVariantStyles();
  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-[14px] p-6 space-y-7"
      style={{
        boxShadow: "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="w-full flex justify-between gap-4">
        <div className="space-y-2">
          <p className="font-medium text-[16px] text-text-tertiary dark:text-darkText-1 whitespace-nowrap">
            {title}
          </p>
          <p className="font-bold text-[24px] xl:text-[28px] text-[#202224] dark:text-white">
            {`${currencySymbols.NAIRA}${formatNumber(balance)}`}
          </p>
        </div>
        <div
          className="w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-[14px] lg:rounded-[23px] flex items-center justify-center"
          style={{
            backgroundColor: variantStyle.backgroundColor,
          }}
        >
          {variantStyle.icon}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={
            trendColor === "green"
              ? "text-status-success-2"
              : "text-status-error-2"
          }
        >
          {trendDirection === "up" ? <TrendingUpIcon /> : <TrendingDownIcon />}
        </span>
        <p className="text-text-label font-normal text-[16px]">
          <span
            className={
              trendColor === "green"
                ? "text-status-success-2"
                : "text-status-error-2"
            }
          >
            {percentage}%
          </span>{" "}
          {trendDirection === "up" ? "Up" : "Down"} from last week
        </p>
      </div>
    </div>
  );
};

export default AccountStatsCard;
