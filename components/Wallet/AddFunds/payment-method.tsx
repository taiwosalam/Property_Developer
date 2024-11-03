"use client";

import React, { useState } from "react";
import type {
  FundingCardProps,
  WalletBankTransferCardProps,
  WalletModalPresetProps,
  WalletOnlineFundingCardProps,
} from "../types";
import type { WalletAddFundsOptions as WalletAddFundsOptionsType } from "../types";
// Types
import type { WalletAddFundsOptions, WalletModalDefaultProps } from "../types";

// Images
import Zenith from "@/public/wallet/zenith.png";
import Paystack from "@/public/wallet/paystack.png";
import Sterling from "@/public/wallet/sterling.svg";
import Flutterwave from "@/public/wallet/flutterwave.jpeg";

// Imports
import { XIcon } from "@/public/icons/icons";
import { ArrowLeft } from "lucide-react";
import Picture from "@/components/Picture/picture";
import clsx from "clsx";
import { secondaryFont } from "@/utils/fonts";
import Button from "@/components/Form/Button/button";
import { empty } from "@/app/config";
import AddFund from "./add-fund";
import { WalletFundsCardsHeading } from "../wallet-components";
import { WalletLegalProcedureIcon } from "@/public/icons/icons";

const PaymentMethod = ({
  title,
  price,
  counter,
}: {
  title: string;
  price: number;
  counter?: boolean;
}) => {
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
      content: (
        <AddFundsModalOptions
          changeStep={setActiveStep}
          title={title}
          price={price}
        />
      ),
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
  WalletModalDefaultProps<WalletAddFundsOptions> & {
    title: string;
    price: number;
    counter?: boolean;
  }
> = ({ changeStep, title, price, counter }) => {
  const handleBankTransfer = () => {
    changeStep("bank transfer");
  };

  const handleOnlineFunding = () => {
    changeStep("online funding");
  };

  return (
    <div className="custom-flex-col gap-4">
      <div className="w-full flex items-center justify-center flex-col">
        <h3>{title}</h3>
        <p className="not-italic leading-[30px] font-bold text-brand-9 text-[20px]">
          {" "}
          ₦ {price}.00{" "}
          {counter && (
            <span className="text-text-quaternary dark:text-darkText-1 text-[16px]">
              {counter}
            </span>
          )}
        </p>
      </div>
      <WalletBankTransferCard proceed={handleBankTransfer} />
      <WalletFunding proceed={handleOnlineFunding} />
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

const WalletFunding: React.FC<WalletOnlineFundingCardProps> = ({ proceed }) => {
  return (
    <div className="p-[18px] rounded-2xl overflow-hidden bg-neutral-2 dark:bg-darkText-primary dark:border dark:border-[#3C3D37] custom-flex-col gap-2">
      <div className="w-full flex gap-2">
        <WalletLegalProcedureIcon />
        <div className="flex flex-col">
          <h3>Legal Procedure Fee</h3>
          <p className="text-[12px] font-medium tracking-[0px]">
            {" "}
            Wallet Balance: ₦ 50,000 (Sufficient funds){" "}
          </p>
        </div>
      </div>
      <div className="custom-flex-col gap-6">
        <div className="flex justify-end">
          <Button onClick={proceed} size="xs_medium" className="py-1 px-2">
            proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

const WalletModalPreset: React.FC<WalletModalPresetProps> = ({
  back,
  title,
  style,
  children,
}) => {
  return (
    <div
      // Please dont change the styles
      className="w-[600px] max-w-[100%] max-h-[85%] bg-white dark:bg-darkText-primary rounded-lg overflow-auto custom-round-scrollbar"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        ...style,
      }}
    >
      <div className="custom-flex-col py-4 px-6 bg-brand-1 dark:bg-[#3C3D37] sticky top-0 z-[2]">
        <div className="flex items-center justify-between">
          {back ? (
            <button
              onClick={back}
              className="w-6 h-6 flex items-center justify-center"
            >
              <ArrowLeft size={18} color="currentColor" />
            </button>
          ) : (
            <div></div>
          )}
          <button type="button">
            <XIcon size="30" />
          </button>
        </div>
        <p className="text-text-secondary dark:text-white text-base font-medium text-center capitalize">
          {title}
        </p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};
