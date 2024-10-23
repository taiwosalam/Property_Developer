import React from "react";

// Types
import type { FundingCardProps } from "../types";

// Images
import Zenith from "@/public/wallet/zenith.png";
import Paystack from "@/public/wallet/paystack.png";
import Sterling from "@/public/wallet/sterling.svg";
import Flutterwave from "@/public/wallet/flutterwave.jpeg";

// Imports
import { empty } from "@/app/config";
import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import clsx from "clsx";

const FundingCard: React.FC<FundingCardProps> = ({
  cta,
  desc,
  type,
  title,
  notRounded,
}) => {
  return (
    <div
      className="p-4 flex items-center justify-between rounded-2xl bg-neutral-2 dark:bg-darkText-primary"
      style={{ boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.02)" }}
    >
      <div className="flex items-center gap-2">
        <Picture
          src={
            type === "paystack"
              ? Paystack
              : type === "flutterwave"
              ? Flutterwave
              : type === "sterling"
              ? Sterling
              : type === "bank transfer"
              ? Zenith
              : empty
          }
          alt="flutterwave"
          width={82}
          height={62}
          className={clsx({
            "rounded-2xl": !notRounded,
          })}
        />
        <div
          className={`custom-flex-col text-general-low dark:text-darkText-2 ${secondaryFont.className}`}
        >
          <p className="text-sm font-medium">{title || type}</p>
          <p className="text-xs font-normal">
            {desc || "Fund Your wallet Instantly"}
          </p>
        </div>
      </div>
      {cta ? (
        <p
          className={`text-general-low dark:text-darkText-2 text-[10px] font-normal ${secondaryFont.className}`}
        >
          {cta}
        </p>
      ) : (
        <Button size="xs_medium" className="py-1 px-2">
          proceed
        </Button>
      )}
    </div>
  );
};

export default FundingCard;
