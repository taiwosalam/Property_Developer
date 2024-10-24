 "use client";

import React, { useState } from "react";
import type { FundingCardProps, WalletBankTransferCardProps } from "../types";
import type { WalletAddFundsOptions as WalletAddFundsOptionsType } from "../types";
  // Types
import type { WalletAddFundsOptions, WalletModalDefaultProps } from "../types";

// Imports
import WalletOnlineFundingCard from "../wallet-online-funding-card";

  // Images
  import Zenith from "@/public/wallet/zenith.png";
  import Paystack from "@/public/wallet/paystack.png";
  import Sterling from "@/public/wallet/sterling.svg";
  import Flutterwave from "@/public/wallet/flutterwave.jpeg";

// Imports
import WalletModalPreset from "../wallet-modal-preset";
// import AddFundsModalOptions from "./add-funds-modal-options";
import Picture from "@/components/Picture/picture";
import clsx from "clsx";
import { secondaryFont } from "@/utils/fonts";
import Button from "@/components/Form/Button/button";
import { empty } from "@/app/config";
import AddFund from "./add-fund";
import { WalletFundsCardsHeading } from "../wallet-components";

const PaymentMethod = () => {
  const [activeStep, setActiveStep] =
    useState<WalletAddFundsOptionsType>("options");

  const flow: Record<
    WalletAddFundsOptionsType,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Select Payment Method",
      content: <AddFundsModalOptions changeStep={setActiveStep} />,
    },
    "online funding": {
      heading: "Online Funding",
      content: <AddFund />,
    },
    "bank transfer": {
      heading: "Bank Transfer",
      content: <OnlineFunding />,
    },
  };

  return (
    <WalletModalPreset
      title={flow[activeStep].heading}
      back={
        activeStep !== "options"
          ? () => {
              setActiveStep("options");
            }
          : undefined
      }
    >
      {flow[activeStep].content}
    </WalletModalPreset>
  );
};

export default PaymentMethod;


const AddFundsModalOptions: React.FC<
  WalletModalDefaultProps<WalletAddFundsOptions>
> = ({ changeStep }) => {
  const handleBankTransfer = () => {
    changeStep("bank transfer");
  };

  const handleOnlineFunding = () => {
    changeStep("online funding");
  };

  return (
    <div className="custom-flex-col gap-4">
        <div className="w-full flex items-center justify-center flex-col">
            <h3>Legal Procedure Fee</h3>
            <p className="not-italic leading-[30px] font-bold text-brand-9 text-[20px] font-medium"> ₦ 2,000.00  </p>
        </div>
      <WalletBankTransferCard proceed={handleBankTransfer} />
      <WalletOnlineFundingCard proceed={handleOnlineFunding} />
    </div>
  );
};




const WalletBankTransferCard: React.FC<WalletBankTransferCardProps> = ({
  proceed,
  cantInteract,
}) => {
  return (
    <div
      className={clsx(
        "p-[18px] rounded-2xl overflow-hidden bg-neutral-2 dark:bg-darkText-primary dark:border dark:border-[#3C3D37] custom-flex-col gap-2",
        {
          "pointer-events-none opacity-50": cantInteract,
        }
      )}
    >
      <WalletFundsCardsHeading
        title="bank transfer"
        desc="Click the confirm button once you made the transfer to complete your transaction"
      />
      <div className="flex justify-between text-text-disabled text-sm font-medium">
        <div className="custom-flex-col gap-[2px]">
          <p className="dark:text-white">Wema Bank</p>
          <p className="text-text-quaternary dark:text-darkText-1">
          Our Property Nigeria Limited
          </p>
        </div>
        <div className="custom-flex-col gap-[2px]">
          <p className="dark:text-white">Account Number</p>
          <p className="text-brand-primary">1211265949</p>
        </div>
        {proceed && (
          <div className="flex items-end">
            <Button onClick={proceed} size="xs_medium" className="py-1 px-2">
              proceed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};


const OnlineFunding = () => {
    return (
      <div className="custom-flex-col gap-5">
        <FundingCard type="paystack" />
        <FundingCard type="flutterwave" />
        <FundingCard type="bank transfer" />
      </div>
    );
};

  
 export const FundingCard: React.FC<FundingCardProps> = ({
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