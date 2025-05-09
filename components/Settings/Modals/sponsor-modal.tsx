"use client";

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

interface ISponsorModalProps {
  count: number;
  cost?: number;
  onSubmit?: () => Promise<boolean | undefined>;
  message?: boolean;
}
const SPONSOR_COST = 2000;
const SponsorModal = ({
  count,
  cost,
  onSubmit,
  message,
}: ISponsorModalProps) => {
  const amount = count * (cost ?? SPONSOR_COST);
  const [reqLoading, setReqLoading] = React.useState(false);
  const { setIsOpen } = useModal();
  const { isMobile } = useWindowWidth();

  const handleSubmit = async () => {
    try {
      setReqLoading(true);
      if (onSubmit) {
        const res = await onSubmit();
        if (res) {
          setIsOpen(false);
        }
      }
    } catch (error) {
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <LandlordTenantModalPreset
      heading="Confirmation Required"
      style={{ width: isMobile ? "80%" : "40%" }}
    >
      <div>
        <div className="custom-flex-col items-center justify-center gap-4">
          <p className="text-md">
            You are about to proceed with a transaction that will debit your
            wallet with{" "}
            <strong className="text-brand-9">₦{formatNumber(amount)}.</strong>
          </p>
          {message ? (
            <p>
              Selecting this plan will activate access to its features for your
              company. Please note that once selected, you cannot downgrade your
              account. <br /> <br /> Subscriptions are billed similarly to rent.
              If your plan expires before payment is made, all users in your
              company will lose access to all features. However, your data will
              be securely stored and maintained until you renew your
              subscription. <br /> <br /> Access will only be restored after all
              outstanding subscription payments have been fully settled.
            </p>
          ) : (
            <p>
              By confirming, you authorize this charge and acknowledge that the
              amount will be deducted from your wallet balance.
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
            {reqLoading ? "Please wait..." : "Proceed"}
          </Button>
          <Button
            type="button"
            size="base_medium"
            className="px-8 py-2"
            variant="light_red"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default SponsorModal;
