"use client";

import React, { useState } from "react";

// Types
import type { WalletWithdrawFundsOptions } from "../types";

// Imports
import InputPin from "./input-pin";
import Withdrawal from "./withdrawal";
import WalletModalPreset from "../wallet-modal-preset";

const WithdrawFundsModal = () => {
  const [activeStep, setActiveStep] =
    useState<WalletWithdrawFundsOptions>("withdrawal");

  const flow: Record<
    WalletWithdrawFundsOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    withdrawal: {
      heading: "Withdrawal",
      content: <Withdrawal changeStep={setActiveStep} />,
    },
    "input pin": {
      heading: "Input Pin",
      content: <InputPin />,
    },
  };

  return (
    <WalletModalPreset
      title={flow[activeStep].heading}
      back={
        activeStep !== "withdrawal"
          ? () => {
              setActiveStep("withdrawal");
            }
          : undefined
      }
    >
      {flow[activeStep].content}
    </WalletModalPreset>
  );
};

export default WithdrawFundsModal;
