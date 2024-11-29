"use client";

import { useState } from "react";

// Types
import type { WalletAddFundsOptions } from "../types";

// Imports
import AddFund from "./add-fund";
import OnlineFunding from "./online-funding";
import WalletModalPreset from "../wallet-modal-preset";
import AddFundsModalOptions from "./add-funds-modal-options";

const AddFundsModal = () => {
  const [activeStep, setActiveStep] =
    useState<WalletAddFundsOptions>("options");

  const flow: Record<
    WalletAddFundsOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Select payment method",
      content: <AddFundsModalOptions changeStep={setActiveStep} />,
    },
    "bank transfer": {
      heading: "Add Funds",
      content: <AddFund />,
    },
    "online funding": {
      heading: "Online Funding",
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

export default AddFundsModal;
