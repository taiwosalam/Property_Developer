"use client";

import React, { useState } from "react";

// Types
import type { WalletSendFundsOptions } from "../types";

// Imports
import SendFunds from "./send-funds";
import WalletModalPreset from "../wallet-modal-preset";
import SendFundBeneficiary from "./send-fund-beneficiary";

const SendFundsModal = () => {
  const [activeStep, setActiveStep] =
    useState<WalletSendFundsOptions>("send funds");

  const flow: Record<WalletSendFundsOptions, { content: React.ReactNode }> = {
    "send funds": {
      content: <SendFunds changeStep={setActiveStep} />,
    },
    "send fund to beneficiary": {
      content: <SendFundBeneficiary />,
    },
  };

  return (
    <WalletModalPreset
      title="Send Funds"
      back={
        activeStep !== "send funds"
          ? () => {
              setActiveStep("send funds");
            }
          : undefined
      }
    >
      {flow[activeStep].content}
    </WalletModalPreset>
  );
};

export default SendFundsModal;
