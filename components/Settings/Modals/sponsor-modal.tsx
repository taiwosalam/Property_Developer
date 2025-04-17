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

const SponsorModal = ({ count }: { count: number }) => {
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const amount = count * 100;
  const [reqLoading, setReqLoading] = React.useState(false);
  const { setIsOpen } = useModal();
  const { isMobile } = useWindowWidth();

  const handleProceed = async () => {
    const payload = {
      amount: amount,
      company_id: companyId,
      value: count,
    };
    try {
      setReqLoading(true);
      const res = await BuySponsor(objectToFormData(payload));
      if (res) {
        toast.success("Sponsor bought successfully!");
        window.dispatchEvent(new Event("refetchRentSponsors"));
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to buy sponsor!");
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
          <p>
            By confirming, you authorize this charge and acknowledge that the
            amount will be deducted from your wallet balance.
          </p>

          <p>Do you wish to proceed?</p>
        </div>

        <div className="flex items-center justify-end w-full gap-4 mt-2">
          <Button
            type="button"
            size="base_medium"
            className="px-8 py-2"
            variant="default"
            onClick={handleProceed}
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
