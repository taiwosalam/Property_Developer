import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";

const UnitPublishModal = () => {
  return (
    <div className="w-[501px] p-7 rounded-[20px] bg-white custom-flex-col gap-10">
      <div className="custom-flex-col gap-6">
        <p className="text-black text-2xl font-bold">Prompt</p>
        <p className="text-base font-normal">
          Are you sure you want to unpublish this unit?
        </p>
      </div>
      <div className="flex gap-3 justify-end">
        <Button size="base_medium" className="py-2 px-8">
          Yes
        </Button>
        <ModalTrigger asChild close>
          <Button size="base_medium" className="py-2 px-8">
            cancel
          </Button>
        </ModalTrigger>
      </div>
    </div>
  );
};

export default UnitPublishModal;
