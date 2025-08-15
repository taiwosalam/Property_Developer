// Imports
import useStep from "@/hooks/useStep";
import { useState } from "react";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { deleteProperty } from "@/app/(nav)/management/properties/[id]/edit-property/data";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/roleContext";

const DeletePropertyModal = ({ propertyId }: { propertyId: string }) => {
  const { activeStep, changeStep } = useStep(2);
  const router = useRouter();
  const { role } = useRole();
  const [isDeleting, setIsDeleting] = useState(false);

  // switch case for properties page redirect
  const getPropertyPage = () => {
    switch (role) {
      case "manager":
        return "/manager/management/properties";
      case "account":
        return "/accountant/management/properties";
      default:
        return "/management/properties";
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await deleteProperty(propertyId);
    if (success) {
      changeStep("next");
      setTimeout(() => {
        router.push(getPropertyPage());
      }, 2500);
    }
    setIsDeleting(false);
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning" className="max-w-[326px]">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to proceed with deleting these property records
        and their units? <span className="text-status-error-primary">*</span>
        Please note that you can only delete properties without current occupant
        records.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? "Deleting..." : "Proceed"}
        </Button>
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
