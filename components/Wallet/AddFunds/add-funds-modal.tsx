"use client";

import { useState } from "react";
import SendFundRecipient from "../SendFunds/send-fund-beneficiary";
import WalletBankTransferCard from "../wallet-bank-transfer-card";
import WalletModalPreset from "../wallet-modal-preset";
import WalletOnlineFundingCard from "../wallet-online-funding-card";
import PaymentIframe from "../paymentIframe";
import useBranchStore from "@/store/branch-store";
import { useWalletStore } from "@/store/wallet-store";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { WalletSendFundsOptions } from "../types";
import { useModal } from "@/components/Modal/modal";
import PaymentMethod from "./payment-method";
import { useDrawerStore } from "@/store/drawerStore";
import { useRole } from "@/hooks/roleContext";

const AddFundsModal = ({
  branch,
  doc,
  page,
}: {
  branch?: boolean;
  doc?: boolean;
  page?: "manager" | "account";
}) => {
  const { branch: branch_details } = useBranchStore();
  const { sub_wallet } = useWalletStore();
  const { setIsOpen } = useModal();
  const { role } = useRole();
  const { setSelectedLegalOption, selectedLegalOption } = useDrawerStore();
  const company_name = usePersonalInfoStore((state) => state.company_name);

  const [activeStep, setActiveStep] =
    useState<WalletSendFundsOptions>("send funds menu");
  // State to hold payment details
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [reference, setReference] = useState<string>("");

  const handlePaymentInitiated = (url: string, ref: string) => {
    setPaymentUrl(url);
    setReference(ref);
    setActiveStep("payment");
  };

  const handlePaymentConfirmed = () => {
    // Once payment is confirmed, you may reset to the menu or show a success message.
    // setActiveStep("send funds menu");
    setIsOpen(false);
    window.dispatchEvent(new Event("fetch-profile"));
    window.dispatchEvent(new Event("refetch-wallet"));
    window.dispatchEvent(new Event("refetch-branch-data"));
    window.dispatchEvent(new Event("refetchRentUnit"));
  };

  // If the active step is "payment", render PaymentIframe only.
  if (activeStep === "payment" && paymentUrl && reference) {
    return (
      <PaymentIframe
        paymentUrl={paymentUrl}
        reference={reference}
        onPaymentConfirmed={handlePaymentConfirmed}
        onClose={() => setIsOpen(false)}
        page={page}
      />
    );
  }

  // Otherwise, render the WalletModalPreset with your funding options.
  return (
    <WalletModalPreset
      title={branch ? "Add Funds" : "Select payment method"}
      back={
        activeStep !== "send funds menu"
          ? () => setActiveStep("send funds menu")
          : undefined
      }
    >
      <div className="custom-flex-col gap-4">
        {branch ? (
          <SendFundRecipient
            name={`${company_name} / ${branch_details?.branch_name}`}
            picture={branch_details?.branch_picture || ""}
            wallet_id={`${sub_wallet.wallet_id}`}
            badge_color="green"
            branch
          />
        ) : (
          <div className="custom-flex-col gap-4">
            {doc && (
              <PaymentMethod
                title={selectedLegalOption?.title ?? ""}
                price={selectedLegalOption?.amount ?? 0}
              />
            )}
            {role === "director" && <WalletBankTransferCard />}
            <WalletOnlineFundingCard
              onPaymentInitiated={handlePaymentInitiated}
              page={page}
            />
          </div>
        )}
      </div>
    </WalletModalPreset>
  );
};

export default AddFundsModal;
