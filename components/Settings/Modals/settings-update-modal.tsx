import React from "react";

// Imports
import Button from "../../Form/Button/button";
import { ModalTrigger } from "../../Modal/modal";
import ModalPreset from "../../Modal/modal-preset";

const SettingsUpdateModal = () => {
  return (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        Your action was updated successfully
      </p>
      <div className="flex justify-center">
        <ModalTrigger asChild close>
          <Button size="base_medium" className="py-2 px-5 w-[175px]">
            ok
          </Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default SettingsUpdateModal;
