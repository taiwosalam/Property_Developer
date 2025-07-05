"use client";

import React from "react";
import useStep from "@/hooks/useStep";
import SelectMembersStep from "./SelectMembersStep";
import SuccessStep from "./SuccessStep";
import { CreateGroupProvider } from "@/contexts/createGroup";
import GroupDetailsStep from "./GroupDetailSteps";

interface CreateGroupModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ onClose }) => {
  const { activeStep, changeStep } = useStep(3);

  const handleCloseModal = () => {
    // changeStep("reset");
    onClose?.();
  };

  return (
    <CreateGroupProvider>
      <div className="flex flex-col gap-4 bg-white dark:bg-darkText-primary rounded-xl max-h-[70vh] lg:min-w-[35%] min-w-[50%] overflow-y-auto custom-round-scrollbar px-4">
        {activeStep === 1 && (
          <SelectMembersStep
            onClose={handleCloseModal}
            onNext={() => changeStep("next")}
          />
        )}
        {activeStep === 2 && (
          <GroupDetailsStep
            onBack={() => changeStep("prev")}
            onClose={handleCloseModal}
          />
        )}
        {activeStep === 3 && <SuccessStep onClose={handleCloseModal} />}
      </div>
    </CreateGroupProvider>
  );
};

export default CreateGroupModal;
