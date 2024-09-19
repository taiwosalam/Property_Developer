// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";

const DeletePropertyModal = () => {
  const { activeStep, changeStep } = useStep(2);

  return activeStep === 1 ? (
    <ModalPreset type="warning" className="max-w-[326px]">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to proceed with deleting these property records
        and their units? <span className="text-status-error-primary">*</span>
        Please note that you can only delete properties without current occupant
        records.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={() => changeStep("next")}>proceed</Button>
        <ModalTrigger
          close
          className="text-brand-primary text-sm font-medium px-3"
        >
          Back
        </ModalTrigger>
      </div>
    </ModalPreset>
  ) : (
    <ModalPreset type="success" className="max-w-[326px]">
      <p className="text-text-disabled text-sm font-normal">
        The property records have been successfully deleted from your management
        profile.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default DeletePropertyModal;
