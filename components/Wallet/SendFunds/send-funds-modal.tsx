"use client";

import { useState } from "react";

// Types
import type { WalletSendFundsOptions } from "../types";

// Imports
import SendFunds from "./send-funds";
import WalletModalPreset from "../wallet-modal-preset";
import SendFundBeneficiary from "./send-fund-beneficiary";
import type { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import type { Beneficiary } from "@/store/wallet-store";

const emptyBeneficiary: Beneficiary = {
  name: "",
  picture: "",
  wallet_id: "",
};

const SendFundsModal = () => {
  const [activeStep, setActiveStep] =
    useState<WalletSendFundsOptions>("send funds");
  const [recipient, setRecipient] = useState(emptyBeneficiary);

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
          badge_color={recipient.badge_color}
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
