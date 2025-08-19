import React from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import CreateExamineDate from "./create-examine-date";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { createExamine } from "@/app/(nav)/tasks/examine/data";
import { toast } from "sonner";
import { useState } from "react";

interface IExamineModal {
  setIsOpen?: (isOpen: boolean) => void
 
}
const CreateExamineModal = ({ setIsOpen }: IExamineModal) => {
  const { activeStep, changeStep } = useStep(2);

  return activeStep === 1 ? (
    <CreateExamineDate next={() => changeStep("next")} setIsOpen={setIsOpen} />
  ) : (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        You have effectively scheduled an examination date.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button size="base_bold" className="py-[10px] px-8 w-[175px]">
            ok
          </Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default CreateExamineModal;
