"use client";

import { parseFormattedNumber } from "@/app/(nav)/accounting/invoice/create-invoice/data";
import Button from "@/components/Form/Button/button";
import { BuySponsor } from "@/components/Listing/data";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import { useModal } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import useWindowWidth from "@/hooks/useWindowWidth";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { formatNumber } from "@/utils/number-formatter";
import React from "react";
import { toast } from "sonner";
import InsufficientBalance from "./insufficient-balance";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";

interface ISponsorModalProps {
  cost: number;
  onSubmit?: () => void;
  setParentStep: (step: number) => void;
  loading: boolean;
    message?: boolean;
}

const RenewSubConfirmModal = ({
  cost,
  onSubmit,
  setParentStep,
  loading,
  message,
}: ISponsorModalProps) => {
  const company_wallet = usePersonalInfoStore((state) => state.company_wallet);
  const COMPANY_WALLET_BALANCE = company_wallet?.wallet_balance ?? 0;
  const [step, setStep] = React.useState(1);
  const [reqLoading, setReqLoading] = React.useState(false);
  const { setIsOpen } = useModal();
  const { isMobile } = useWindowWidth();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    if (COMPANY_WALLET_BALANCE < cost) {
      setStep(2); // Move to InsufficientBalance step
      return;
    }
    if (onSubmit) {
      await onSubmit();
    }
  };

  const getContent = () => {
    switch (step) {
      case 1:
        return (
          <LandlordTenantModalPreset
            heading="Confirmation Required"
            back={{ handleBack: () => setParentStep(2) }}
            style={{ width: isMobile ? "80%" : "50%" }}
            customClose={() => setParentStep(2)}
          >
            <div className="custom-flex-col items-center justify-center gap-4">
              <p className="text-md">
                You are about to proceed with a transaction that will debit your
                wallet with{" "}
                <strong className="text-brand-9">
                  ₦{formatNumber(cost?.toString() || "0")}.
                </strong>
              </p>
              {message ? (
                <p>
                  Selecting this plan will activate access to its features for
                  your company. Please note that once selected, you cannot
                  downgrade your account. <br /> <br /> Subscriptions are billed
                  similarly to rent. If your plan expires before payment is
                  made, all users in your company will lose access to all
                  features. However, your data will be securely stored and
                  maintained until you renew your subscription. <br /> <br />
                </p>
              ) : (
                <p>
                  By confirming, you authorize this charge and acknowledge that
                  the amount will be deducted from your wallet balance.
                </p>
              )}

              <p>Do you wish to proceed?</p>
            </div>

            <div className="flex items-center justify-end w-full gap-4 mt-2">
              <Button
                type="button"
                size="base_medium"
                className="px-8 py-2"
                variant="default"
                onClick={handleSubmit}
              >
                {loading ? "Please wait..." : "Proceed"}
              </Button>
              <Button
                type="button"
                size="base_medium"
                className="px-8 py-2"
                variant="light_red"
                onClick={() => setParentStep(2)}
              >
                Cancel
              </Button>
            </div>
          </LandlordTenantModalPreset>
        );
      case 2:
        return (
          <InsufficientBalance
            onNext={handleNext}
            onClose={handleClose}
            message="Sorry, your current balance is not enough to proceed with this transaction."
          />
        );
      case 3:
        return (
          <>
            <AddFundsModal />
          </>
        );
      default:
        return null;
    }
  };

  return <>{getContent()}</>;
};

export default RenewSubConfirmModal;
