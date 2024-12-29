"use client";

import { useState } from "react";

// Types
import type { WalletSendFundsOptions } from "../types";

// Imports
import SendFunds from "./send-funds";
import WalletModalPreset from "../wallet-modal-preset";
import SendFundRecipient from "./send-fund-beneficiary";
import type { Beneficiary } from "@/store/wallet-store";

const emptyBeneficiary: Omit<Beneficiary, "id"> = {
  name: "",
  picture: "",
  wallet_id: "",
};

const SendFundsModal = () => {
  const [activeStep, setActiveStep] =
    useState<WalletSendFundsOptions>("send funds menu");
  const [recipient, setRecipient] = useState(emptyBeneficiary);

  const flow: Record<WalletSendFundsOptions, { content: React.ReactNode }> = {
    "send funds menu": {
      content: (
        <SendFunds changeStep={setActiveStep} setRecipient={setRecipient} />
      ),
    },
    recipient: {
      content: (
        <SendFundRecipient
          name={recipient.name}
          picture={recipient.picture}
          wallet_id={recipient.wallet_id}
          badge_color={recipient.badge_color}
        />
      ),
    },
  };

  return (
    <WalletModalPreset
       title="Send Funds"
      back={
        activeStep !== "send funds menu"
          ? () => {
              setRecipient(emptyBeneficiary);
              setActiveStep("send funds menu");
            }
          : undefined
      }
    >
      {flow[activeStep].content}
    </WalletModalPreset>
  );
};

export default SendFundsModal;
