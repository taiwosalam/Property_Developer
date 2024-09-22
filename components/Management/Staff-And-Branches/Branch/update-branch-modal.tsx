import React from "react";

// IMports
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";

const UpdateBranchModal = () => {
  return (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        Your action has been made successfully, click the ok button to continue
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default UpdateBranchModal;
