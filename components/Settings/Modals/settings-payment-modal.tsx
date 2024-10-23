"use client";

import React, { useState } from "react";

// Types
import type {
  SettingsPaymentOptions,
  SettingsPaymentModalProps,
} from "../types";

// Imports
import SettingsPaymentOnline from "./settings-payment-online";
import SettingsAnnumSwitcher from "../settings-annum-switcher";
import SettingsPaymentTransfer from "./settings-payment-transfer";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import SettingsPaymentOptionsComponent from "./settings-payment-options";

const SettingsPaymentModal: React.FC<SettingsPaymentModalProps> = ({
  desc,
  annum,
  title,
  headings,
  hideTitleOnProceed,
  limitTransferFields,
}) => {
  const [activeStep, setActiveStep] =
    useState<SettingsPaymentOptions>("options");

  const flow: Record<
    SettingsPaymentOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: headings?.options || "Select payment method",
      content: <SettingsPaymentOptionsComponent changeStep={setActiveStep} />,
    },
    "bank transfer": {
      heading: headings?.["bank transfer"] || "Make Payment with Transfer",
      content: <SettingsPaymentTransfer limitFields={limitTransferFields} />,
    },
    "online funding": {
      heading: headings?.["online funding"] || "Online Payment",
      content: <SettingsPaymentOnline />,
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
      <div className="custom-flex-col gap-5">
        {hideTitleOnProceed && activeStep !== "options" ? null : (
          <div className="flex justify-center">
            <div className="flex flex-col items-center gap-2">
              {desc && (
                <p className="text-text-disabled text-sm font-normal text-center">
                  {desc}
                </p>
              )}
              {title && (
                <p className="text-[#010A23] dark:text-white text-base font-medium capitalize">
                  {title}
                </p>
              )}
              <SettingsAnnumSwitcher data={annum} />
            </div>
          </div>
        )}
        {flow[activeStep].content}
      </div>
    </WalletModalPreset>
  );
};

export default SettingsPaymentModal;
