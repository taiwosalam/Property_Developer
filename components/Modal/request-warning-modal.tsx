// "use client";

// import { useGlobalStore } from "@/store/general-store";
// import { Modal, ModalContent } from "./modal";
// import Button from "../Form/Button/button";
// import { XIcon } from "@/public/icons/icons";
// import { Dispatch, SetStateAction, useState, useEffect } from "react";
// import { WarningStep1, WarningStep2 } from "./warning-modal-step";

// const RequestWarningModal = () => {
//   const [step, setStep] = useState(1);
//   const { warningModal, setWarningModal } = useGlobalStore((state) => ({
//     warningModal: state.warningModal,
//     setWarningModal: state.setWarningModal,
//   }));

//   const { isOpen, message } = warningModal;

//   // Adapt setWarningModal to match Dispatch<SetStateAction<boolean>>
//   const setIsOpen: Dispatch<SetStateAction<boolean>> = (value) => {
//     const newValue = typeof value === "function" ? value(isOpen) : value;
//     setWarningModal(newValue, newValue ? message : "");
//     if (!newValue) {
//       setStep(1); // Reset step when closing
//     }
//   };

//   // Reset step to 1 when modal opens
//   useEffect(() => {
//     if (isOpen) {
//       setStep(1);
//     }
//   }, [isOpen]);

//   const handleClose = () => {
//     setIsOpen(false);
//   };

//   const handleNext = () => {
//     setStep((prev) => prev + 1);
//   };

//   const handlePrevious = () => {
//     setStep((prev) => Math.max(1, prev - 1));
//   };

//   const renderContent = () => {
//     switch (step) {
//       case 1:
//         return (
//           <WarningStep1
//             message={message}
//             onNext={handleNext}
//             onClose={handleClose}
//           />
//         );
//       case 2:
//         return (
//           <WarningStep2 onPrevious={handlePrevious} onClose={handleClose} />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Modal state={{ isOpen, setIsOpen }}>
//       <ModalContent>
//         {renderContent()}
//       </ModalContent>
//     </Modal>
//   );
// };

// export default RequestWarningModal;

"use client";

import { useGlobalStore } from "@/store/general-store";
import { Modal, ModalContent } from "./modal";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { WarningStep1, WarningStep2 } from "./warning-modal-step";
import useStep from "@/hooks/useStep";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import SponsorModal from "../Settings/Modals/sponsor-modal";
import { PropertyManagerSubsTransformedPlan } from "@/app/(nav)/settings/subscription/types";
import { parseFormattedNumber } from "@/app/(nav)/accounting/invoice/create-invoice/data";
import { activatePlan } from "@/app/(nav)/settings/subscription/data";

const RequestWarningModal = () => {
  const { warningModal, setWarningModal } = useGlobalStore((state) => ({
    warningModal: state.warningModal,
    setWarningModal: state.setWarningModal,
  }));

  const { isOpen, message } = warningModal;

  // Initialize useStep with 3 steps
  const { activeStep, changeStep, setActiveStep } = useStep(3);
  // State to store selected plan data
  const [selectedPlan, setSelectedPlan] = useState<Pick<
    PropertyManagerSubsTransformedPlan,
    "id" | "price" | "planTitle"
  > | null>(null);

  // Adapt setWarningModal to match Dispatch<SetStateAction<boolean>>
  const setIsOpen: Dispatch<SetStateAction<boolean>> = (value) => {
    const newValue = typeof value === "function" ? value(isOpen) : value;
    setWarningModal(newValue, newValue ? message : "");
    if (!newValue) {
      setActiveStep(1); // Reset step when closing
      setSelectedPlan(null);
    }
  };

  // Reset step to 1 when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
    }
  }, [isOpen, setActiveStep]);

  const handleClose = () => {
    setIsOpen(false);
  };


  const renderContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <WarningStep1
            message={message}
            onNext={() => changeStep("next")}
            onClose={handleClose}
            changeStep={changeStep}
          />
        );
      case 2:
        return (
          <LandlordTenantModalPreset
            heading="Property Manager Subscription"
            back={{ handleBack: () => changeStep("prev") }}
            style={{ maxHeight: "80vh", minWidth: "80vw" }}
          >
            <WarningStep2
              onPrevious={() => changeStep("prev")}
              onClose={handleClose}
              changeStep={changeStep}
              setSelectedPlan={setSelectedPlan}
            />
          </LandlordTenantModalPreset>
        );
      case 3:
        return (
          <SponsorModal
            page="subscription"
            count={0}
            cost={parseFormattedNumber(selectedPlan?.price) ?? 0}
            message={true}
            onSubmit={() => activatePlan(selectedPlan?.id ?? 0)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal state={{ isOpen, setIsOpen }}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  );
};

export default RequestWarningModal;
