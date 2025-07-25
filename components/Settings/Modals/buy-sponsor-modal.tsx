import Button from "@/components/Form/Button/button";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import ModalPreset from "@/components/Modal/modal-preset";
import { formatNumber } from "@/utils/number-formatter";
import React, { useState } from "react";
import { CounterButton } from "../SettingsEnrollment/settings-enrollment-components";
import { useModal } from "@/components/Modal/modal";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { BuySponsor } from "@/components/Listing/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { useWalletStore } from "@/store/wallet-store";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";

const BuySponsorModal = () => {
  const UNIT_SPONSOR_COST = 2000;
  const [count, setCount] = React.useState(1);
  const balance = useWalletStore((s) => s.balance);
  const companyId = usePersonalInfoStore((state) => state.company_id) || "";
  const { setIsOpen } = useModal();
  const [reqLoading, setReqLoading] = useState(false);
  const AVAILABLE_COMPANY_BALANCE = parseFloat(balance.my_balance);
  const [step, setStep] = useState<"confirm" | "add-funds">("confirm");
  const handleIncrement = () => {
    setCount((prevCount) => (prevCount < 12 ? prevCount + 1 : prevCount));
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

  const amount = count * UNIT_SPONSOR_COST;

  const handleProceed = async () => {
    if (AVAILABLE_COMPANY_BALANCE < amount) {
      toast.warning("Insufficient balance to buy sponsor!");
      setStep("add-funds");
      return;
    }
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
        window.dispatchEvent(new Event("refetchRentUnit"));
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to buy sponsor!");
    } finally {
      setReqLoading(false);
    }
  };
  //   /sponsor/unit
  return (
    <>
      {step === "confirm" ? (
        <LandlordTenantModalPreset
          heading="Confirmation Required"
          style={{ width: "40%" }}
        >
          <div>
            <p>
              Sponsor your property listing on the mobile app to appear first,
              attract clients faster, and increase visibility to potential
              tenants and occupants.
            </p>
            <div className="flex gap-4 items-end my-4">
              <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium">
                Sponsor Cost{" "}
                <span className="text-xs font-normal">
                  (₦{UNIT_SPONSOR_COST}/per unit)
                </span>
              </p>
              <div className="flex justify-between max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
                />
                <div className="btn flex flex-col items-end justify-end">
                  <CounterButton
                    onClick={handleIncrement}
                    icon="/icons/plus.svg"
                    alt="plus"
                  />
                  <CounterButton
                    onClick={handleDecrement}
                    icon="/icons/minus.svg"
                    alt="minus"
                  />
                </div>
              </div>
            </div>
            <div className="custom-flex-col items-center justify-center gap-4">
              <p className="text-md">
                Proceeding will debit your wallet{" "}
                <strong className="text-brand-9">
                  {" "}
                  ₦{formatNumber(amount)}{" "}
                </strong>
                to activate the selected sponsored unit.
              </p>
              <p>Please confirm to continue.</p>
            </div>

            <div className="flex items-center justify-end w-full gap-4 mt-2">
              <Button
                onClick={handleProceed}
                size="base_medium"
                className="px-8 py-2"
                variant="default"
                disabled={reqLoading}
              >
                {reqLoading ? "Please wait..." : "Proceed"}
              </Button>
              <Button
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
      ) : (
        <>
          <AddFundsModal />
        </>
      )}
    </>
  );
};

export default BuySponsorModal;
