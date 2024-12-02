"use client";

import { useState } from "react";

// Types
import type { WalletSendFundsOptions } from "../types";

// Imports
import SendFunds from "./send-funds";
import WalletModalPreset from "../wallet-modal-preset";
import SendFundBeneficiary from "./send-fund-beneficiary";

const emptyBeneficiary = {
  name: "",
  picture: "",
  wallet_id: "",
};

const SendFundsModal = () => {
  const [activeStep, setActiveStep] =
    useState<WalletSendFundsOptions>("send funds");
  const [recipient, setRecipient] = useState<{
    name: string;
    picture: string;
    wallet_id: string;
  }>(emptyBeneficiary);

  const flow: Record<WalletSendFundsOptions, { content: React.ReactNode }> = {
    "send funds": {
      content: (
        <SendFunds changeStep={setActiveStep} setRecipient={setRecipient} />
      ),
    },
    "send fund to beneficiary": {
      content: (
        <SendFundBeneficiary
          name={recipient.name}
          picture={recipient.picture}
          wallet_id={recipient.wallet_id}
        />
      ),
    },
  };

  return (
    <WalletModalPreset
      title="Send Funds"
      back={
        activeStep !== "send funds"
          ? () => {
              setRecipient(emptyBeneficiary);
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
