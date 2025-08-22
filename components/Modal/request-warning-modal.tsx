"use client";

import { useGlobalStore } from "@/store/general-store";
import { Modal, ModalContent } from "./modal";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { WarningStep1, WarningStep2 } from "./warning-modal-step";
import useStep from "@/hooks/useStep";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import SponsorModal from "../Settings/Modals/sponsor-modal";
import { PropertyManagerSubsTransformedPlan } from "@/app/(nav)/settings/subscription/types";
import { parseFormattedNumber } from "@/app/(nav)/accounting/invoice/create-invoice/data";
import {
  activatePlan,
  extendPropertyManagerPlan,
  upgradePropertyManagerPlan,
} from "@/app/(nav)/settings/subscription/data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { cleanPricingValue } from "@/utils/cleanPrice";

const RequestWarningModal = () => {
  const { warningModal, setWarningModal, selectedSubPlan } = useGlobalStore((state) => ({
    warningModal: state.warningModal,
    setWarningModal: state.setWarningModal,
    selectedSubPlan: state.selectedSubPlan,
  }));
  const { company_id } = usePersonalInfoStore();
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();

  const { isOpen, message } = warningModal;

  // Initialize useStep with 3 steps
  const { activeStep, changeStep, setActiveStep } = useStep(3);
  // State to store selected plan data
  const [selectedPlan, setSelectedPlan] =
    useState<PropertyManagerSubsTransformedPlan | null>(null);

  // Adapt setWarningModal to match Dispatch<SetStateAction<boolean>>
  const setIsOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    const newValue = typeof value === "function" ? value(isOpen) : value;
    setWarningModal(newValue, newValue ? message : "");
    if (!newValue) {
      setActiveStep(1); // Reset step when closing
      setSelectedPlan(null);
    }
  };

  // Reset step to 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
    }
  }, [isOpen, setActiveStep]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelectPlan = useCallback(async () => {
    // setSelectedPlan?.(selectedPlan);
    const thisPlanKeyword = selectedPlan?.planTitle
      ?.split(" ")[0]
      ?.toLowerCase();
    // Determine if it's an upgrade or extension
    const isExtend = currentPlanKeyword === thisPlanKeyword;
    const isUpgrade =
      (currentPlanKeyword === "free" &&
        (thisPlanKeyword === "basic" || thisPlanKeyword === "premium")) ||
      (currentPlanKeyword === "basic" && thisPlanKeyword === "premium");

    const payload = {
      plan_id: selectedPlan?.id || 0,
      payment_method: "wallet",
      quantity: selectedPlan?.quantity ?? 0,
      duration: selectedPlan?.isLifeTimePlan
        ? "lifetime"
        : selectedPlan?.billingType,
      amount: cleanPricingValue(String(selectedPlan?.price ?? 0)),
    };

    if (isExtend) {
      return await extendPropertyManagerPlan(payload);
    } else if (isUpgrade) {
      return await upgradePropertyManagerPlan(payload);
    } else {
      return await activatePlan(payload);
    }
  }, [currentPlanKeyword, setSelectedPlan, changeStep]);

  const renderContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <WarningStep1
            message={message}
            onNext={() => changeStep("next")}
            onClose={handleClose}
            changeStep={changeStep}
          />
        );
      case 2:
        return (
          <LandlordTenantModalPreset
            heading="Property Manager Subscription"
            back={{ handleBack: () => changeStep("prev") }}
            style={{ maxHeight: "80vh", minWidth: "80vw" }}
          >
            <WarningStep2
              onPrevious={() => changeStep("prev")}
              onClose={handleClose}
              changeStep={changeStep}
              setSelectedPlan={setSelectedPlan}
            />
          </LandlordTenantModalPreset>
        );
      case 3:
        return (
          <SponsorModal
            page="subscription"
            count={0}
            cost={parseFormattedNumber(selectedPlan?.price) ?? 0}
            message={true}
            // onSubmit={() => activatePlan(selectedPlan?.id ?? 0)}
            onSubmit={handleSelectPlan}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal state={{ isOpen, setIsOpen }}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  );
};

export default RequestWarningModal;
