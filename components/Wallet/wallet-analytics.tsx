import React from "react";

// Types
import { WalletAnalyticsProps } from "./types";

// Images
import TrendingUpIcon from "@/public/icons/trending-up.svg";
import TrendingDownIcon from "@/public/icons/trending-down.svg";
import EqualArrow from "@/public/icons/equal-arrow.svg";

// Imports
import Picture from "../Picture/picture";
import { secondaryFont } from "@/utils/fonts";
import clsx from "clsx";
import { capitalize } from "@/utils/capitalize";
import { empty } from "@/app/config";

const WalletAnalytics: React.FC<WalletAnalyticsProps> = ({
  title,
  className,
  amount = 0,
  trend = { from: "none", type: "none", percent: 0 },
}) => {
  const { from, type, percent } = trend;

  return (
    <div
      className={clsx(
        "py-[18px] px-5 rounded-lg overflow-hidden custom-flex-col gap-6 flex-1",
        {
          "bg-brand-1": title === "funds",
          "bg-status-error-1": title === "debit",
          "bg-status-success-1": title === "credit",
        },
        className
      )}
    >
      <div className="custom-flex-col gap-2">
        <p className="text-text-primary text-base font-normal capitalize">
          Total {title}
        </p>
        <p
          className={`text-[#202224] text-2xl font-bold ${secondaryFont.className}`}
        >
          {new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          })
            .format(amount)
            .split(".")
            .shift()}
        </p>
      </div>
      <div className="flex gap-2">
        <Picture
          src={
            type === "up"
              ? TrendingUpIcon
              : type === "down"
              ? TrendingDownIcon
              : type === "equal"
              ? EqualArrow
              : empty
          }
          alt={`trending ${type}`}
          size={24}
        />
        <p className="text-text-label text-base font-normal">
          <span
            className={clsx({
              "text-status-success-2": type === "up",
              "text-status-error-2": type === "down",
            })}
          >
            {percent}%
          </span>{" "}
          {capitalize({ input: type })} from {from}
        </p>
      </div>
    </div>
  );
};

export default WalletAnalytics;
