import { CSSProperties } from "react";
import clsx from "clsx";
import {
  BlueIncomingIcon,
  RedOutgoingIcon,
  GreenIncomingIcon,
  YellowCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "./icons";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";
import { getDigitCount } from "@/app/(nav)/accounting/expenses/data";

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
  trendColor?: TrendColor;
  title: string;
  balance: number | string;
  className?: string;
  forBranch?: boolean;
  timeRangeLabel?: string;
  otherCurrency?: string;
  noSymbol?: boolean;
}

const AccountStatsCard: React.FC<AccountStatsCardProps> = ({
  variant,
  percentage,
  trendDirection,
  trendColor,
  title,
  balance,
  className,
  forBranch,
  timeRangeLabel,
  otherCurrency,
  noSymbol,
}) => {
  // Determine font size based on digit count
  const digitCount = getDigitCount(balance);
  const fontSizeClass = clsx({
    "text-md md:text-[24px] xl:text-[28px]": digitCount < 10, // Default for < 8 digits
    "text-base md:text-[20px] xl:text-[24px]": digitCount >= 10 && digitCount <= 12, // 8–9 digits
    "text-sm md:text-[16px] xl:text-[20px]": digitCount >= 13, // 10+ digits
  });

  const getVariantStyles = (): VariantStyle => {
    switch (variant) {
      case "blueIncoming":
        return {
          backgroundColor: "rgba(0, 51, 196, 0.2)",
          icon: <BlueIncomingIcon size={forBranch ? 22 : 30} />,
        };
      case "greenIncoming":
        return {
          backgroundColor: "#E6FAEE",
          icon: <GreenIncomingIcon size={forBranch ? 30 : 40} />,
        };
      case "redOutgoing":
        return {
          backgroundColor: "#FDE9EA",
          icon: <RedOutgoingIcon size={forBranch ? 30 : 40} />,
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
      className={clsx(
        "space-y-7 relative",
        {
          "px-4 py-5 bg-[#FAFAFA] dark:bg-darkText-primary rounded-lg":
            forBranch,
          "p-6 bg-white dark:bg-darkText-primary rounded-[14px]": !forBranch,
        },
        className
      )}
      style={{
        boxShadow: forBranch ? "none" : "6px 6px 54px 0px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div className="w-full flex justify-between gap-4">
        <div className="space-y-2">
          <p className="font-normal md:font-medium text-sm md:text-base text-text-tertiary dark:text-darkText-1 whitespace-nowrap">
            {title}
          </p>
          {/* <p className="font-bold text-[24px] xl:text-[28px] text-[#202224] dark:text-white">
            {`${currencySymbols.naira}${formatNumber(balance)}`}
          </p> */}
          <p
            className={clsx(
              "font-bold text-[#202224] dark:text-white",
              fontSizeClass // Apply dynamic font size
            )}
          >
            {noSymbol
              ? balance
              : typeof balance === "string"
              ? `${currencySymbols.naira}${balance}`
              : `${currencySymbols.naira}${formatNumber(balance)}`}
          </p>
          <p className="text-black font-semibold text-md">
            {otherCurrency ?? ""}
          </p>
        </div>
        <div
          className={clsx("absolute flex items-center justify-center", {
            "w-[40px] h-[40px] rounded-full right-4 top-5": forBranch,
            "w-[45px] h-[45px] lg:w-[60px] lg:h-[60px] rounded-[14px] lg:rounded-[23px] right-6 top-6":
              !forBranch,
          })}
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
            trendDirection === "up"
              ? "text-status-success-2"
              : "text-status-error-2"
          }
        >
          {trendDirection === "up" ? <TrendingUpIcon /> : <TrendingDownIcon />}
        </span>
        <p className="text-text-label font-normal text-sm md:text-base">
          <span
            className={
              trendDirection === "up"
                ? "text-status-success-2"
                : "text-status-error-2"
            }
          >
            {percentage}%
          </span>{" "}
          {trendDirection === "up" ? "Up" : "Down"} from{" "}
          {timeRangeLabel || "Last month"}{" "}
        </p>
      </div>
    </div>
  );
};

export default AccountStatsCard;
