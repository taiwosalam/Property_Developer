"use client";

import React from "react";
import useStep from "@/hooks/useStep";
import SelectMembersStep from "./SelectMembersStep";
import SuccessStep from "./SuccessStep";
import { CreateGroupProvider } from "@/contexts/createGroup";
import GroupDetailsStep from "./GroupDetailSteps";
import { useModal } from "@/components/Modal/modal";
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import useWindowWidth from "@/hooks/useWindowWidth";

interface CreateGroupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  create?: boolean;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  onClose,
  create,
}) => {
  const { activeStep, changeStep } = useStep(3);
  const { setIsOpen } = useModal();
  const { isMobile } = useWindowWidth();

  const handleCloseModal = () => {
    // changeStep("reset");
    // onClose?.();
    setIsOpen(false);
  };

  return (
    <CreateGroupProvider>
      <LandlordTenantModalPreset
        noPaddingTop
        style={{
          width: isMobile ? "100%" : "35%",
        }}
        back={
          activeStep !== 1
            ? { handleBack: () => changeStep("prev") }
            : undefined
        }
        heading="Create New Group"
      >
        {activeStep === 1 && (
          <SelectMembersStep
            onClose={handleCloseModal}
            onNext={() => changeStep("next")}
            create={create}
          />
        )}
        {activeStep === 2 && (
          <GroupDetailsStep
            onBack={() => changeStep("prev")}
            onClose={handleCloseModal}
          />
        )}
        {activeStep === 3 && <SuccessStep onClose={handleCloseModal} />}
      </LandlordTenantModalPreset>
    </CreateGroupProvider>
  );
};

export default CreateGroupModal;
