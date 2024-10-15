import React from "react";

// Types
import type { DefaultSettingsModalProps } from "../types";

// Imports
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";

const SettingsAddMoreModal: React.FC<DefaultSettingsModalProps> = ({
  changeStep,
}) => {
  return (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to proceed with adding another signature?
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button
          onClick={() => changeStep("next")}
          size="sm_medium"
          className="py-2 px-8 w-[175px]"
        >
          proceed
        </Button>
        <ModalTrigger
          close
          className="text-brand-primary text-sm font-medium px-3"
        >
          Back
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default SettingsAddMoreModal;
