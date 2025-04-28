// "use client";

// import { useEffect, useState } from "react";

// // Types
// import type { WalletSendFundsOptions } from "../types";

// // Imports
// import SendFunds from "./send-funds";
// import WalletModalPreset from "../wallet-modal-preset";
// import SendFundRecipient from "./send-fund-beneficiary";
// import { useWalletStore, type Beneficiary } from "@/store/wallet-store";
// import useFetch from "@/hooks/useFetch";
// import { WalletDataResponse } from "@/app/(nav)/wallet/data";

// const emptyBeneficiary: Omit<Beneficiary, "id"> = {
//   name: "",
//   picture: "",
//   wallet_id: "",
// };

// const SendFundsModal = () => {
//   const [activeStep, setActiveStep] =
//     useState<WalletSendFundsOptions>("send funds menu");
//   const [recipient, setRecipient] = useState(emptyBeneficiary);

//   const flow: Record<WalletSendFundsOptions, { content: React.ReactNode }> = {
//     "send funds menu": {
//       content: (
//         <SendFunds
//           changeStep={setActiveStep}
//           setRecipient={setRecipient}
//         />
//       ),
//     },
//     recipient: {
//       content: (
//         <SendFundRecipient
//           name={recipient.name}
//           picture={recipient.picture}
//           wallet_id={recipient.wallet_id}
//           badge_color={recipient.badge_color}
//         />
//       ),
//     },
//   };

//   return (
//     <WalletModalPreset
//        title="Send Funds"
//       back={
//         activeStep !== "send funds menu"
//           ? () => {
//               setRecipient(emptyBeneficiary);
//               setActiveStep("send funds menu");
//             }
//           : undefined
//       }
//     >
//       {flow[activeStep].content}
//     </WalletModalPreset>
//   );
// };

// export default SendFundsModal;





"use client";

import { useState } from "react";

// Types
import type { WalletSendFundsOptions } from "../types";

// Imports
import SendFunds from "./send-funds";
import WalletModalPreset from "../wallet-modal-preset";
import SendFundRecipient from "./send-fund-beneficiary";
import PaymentIframe from "../paymentIframe";
import { useWalletStore, type Beneficiary } from "@/store/wallet-store";
import { useModal } from "@/components/Modal/modal";

const emptyBeneficiary: Omit<Beneficiary, "id"> = {
  name: "",
  picture: "",
  wallet_id: "",
};

const SendFundsModal = () => {
  const { setIsOpen } = useModal();
  const [activeStep, setActiveStep] =
    useState<WalletSendFundsOptions>("send funds menu");
  const [recipient, setRecipient] = useState(emptyBeneficiary);

  // Payment state
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  const handlePaymentInitiated = (url: string, ref: string) => {
    setPaymentUrl(url);
    setReference(ref);
    setActiveStep("payment");
  };

  const handlePaymentConfirmed = () => {
    setIsOpen(false); // Close modal after payment confirmation
  };

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
          noBackBtn
        />
      ),
    },
    payment: {
      content: (
        <PaymentIframe
          paymentUrl={paymentUrl}
          reference={reference}
          onPaymentConfirmed={handlePaymentConfirmed}
          onClose={() => setIsOpen(false)}
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