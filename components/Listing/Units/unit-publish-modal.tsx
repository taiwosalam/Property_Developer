import React from "react";

// Types
import { UnitPublishModalProps } from "./types";

// Imports
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";

const UnitPublishModal: React.FC<UnitPublishModalProps> = ({
  onYes,
  isPublished,
}) => {
  return (
    <div className="w-[501px] p-7 rounded-[20px] bg-white dark:bg-darkText-primary dark:border dark:border-[#3C3D37] custom-flex-col gap-10">
      <div className="custom-flex-col gap-6">
        <p className="text-black dark:text-white text-2xl font-bold">Prompt</p>
        <p className="text-base font-normal">
          Are you sure you want to {isPublished ? "unpublish" : "publish"} this
          unit?
        </p>
      </div>
      <div className="flex gap-3 justify-end">
        <Button onClick={onYes} size="base_medium" className="py-2 px-8">
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
