"use client";

// Imports
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";

const DeleteItemWarningModal: React.FC<{
  item: string;
  amount: number;
  handleDelete: () => void;
  useCase?: string;
}> = ({ item, amount, handleDelete, useCase }) => {
  return (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to remove the{" "}
        <span className="font-bold text-text-tertiary">{item}</span> and its
        amount <span className="font-bold text-text-tertiary">₦{amount}</span>{" "}
        from the {useCase} list?
      </p>
      <div className="flex flex-col items-center gap-4">
        <ModalTrigger asChild close onClick={handleDelete}>
          <Button>proceed</Button>
        </ModalTrigger>
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

export default DeleteItemWarningModal;
