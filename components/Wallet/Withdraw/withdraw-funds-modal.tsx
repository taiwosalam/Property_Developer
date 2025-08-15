"use client";

import React, { useState } from "react";

// Types
import type { WalletWithdrawFundsOptions } from "../types";

// Imports
import InputPin from "./input-pin";
import Withdrawal from "./withdrawal";
import WalletModalPreset from "../wallet-modal-preset";

const WithdrawFundsModal = ({ branch }: { branch?: boolean}) => {
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
      content: <Withdrawal changeStep={setActiveStep} branch={branch} />,
    },
    "input pin": {
      heading: "Input Pin",
      content: <InputPin branch={branch} />,
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
