"use client";

import { useState } from "react";

// Types
import type { SettingsPaymentModalProps } from "../types";

import SettingsAnnumSwitcher from "../settings-annum-switcher";

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
  const [activeStep, setActiveStep] = useState<
    "options" | "bank transfer" | "online funding"
  >("options");

  // const flow = {
  //   options: {
  //     heading: headings?.options || "Select payment method",
  //     content: <SettingsPaymentOptionsComponent />,
  //   },
  // };

  return (
    <WalletModalPreset title={"Select payment method"}>
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
        <SettingsPaymentOptionsComponent />
      </div>
    </WalletModalPreset>
  );
};

export default SettingsPaymentModal;
