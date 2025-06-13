"use client";

import { useGlobalStore } from "@/store/general-store";
import { Modal, ModalContent } from "./modal";
import Button from "../Form/Button/button";
import { XIcon } from "@/public/icons/icons";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { WarningStep1, WarningStep2 } from "./warning-modal-step";

const RequestWarningModal = () => {
  const [step, setStep] = useState(1);
  const { warningModal, setWarningModal } = useGlobalStore((state) => ({
    warningModal: state.warningModal,
    setWarningModal: state.setWarningModal,
  }));

  const { isOpen, message } = warningModal;

  // Adapt setWarningModal to match Dispatch<SetStateAction<boolean>>
  const setIsOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    const newValue = typeof value === "function" ? value(isOpen) : value;
    setWarningModal(newValue, newValue ? message : "");
    if (!newValue) {
      setStep(1); // Reset step when closing
    }
  };

  // Reset step to 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <WarningStep1
            message={message}
            onNext={handleNext}
            onClose={handleClose}
          />
        );
      case 2:
        return (
          <WarningStep2 onPrevious={handlePrevious} onClose={handleClose} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal state={{ isOpen, setIsOpen }}>
      <ModalContent>
        <div className="relative">{renderContent()}</div>
      </ModalContent>
    </Modal>
  );
};

export default RequestWarningModal;
