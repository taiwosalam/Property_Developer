import React from "react";

// Imports
import useStep from "@/hooks/useStep";
import NewDisbursementForm from "./new-disbursement-form";
import ModalPreset from "@/components/Modal/modal-preset";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";

const NewDisbursementModal = () => {
  const { activeStep, changeStep } = useStep(2);

  return activeStep === 1 ? (
    <NewDisbursementForm nextStep={() => changeStep("next")} />
  ) : (
    <ModalPreset type="success">
      <p>You have successfully added a new disbursement. </p>
      <ModalTrigger asChild close>
        <Button size="base_medium" className="py-2 px-5">
          ok
        </Button>
      </ModalTrigger>
    </ModalPreset>
  );
};

export default NewDisbursementModal;
