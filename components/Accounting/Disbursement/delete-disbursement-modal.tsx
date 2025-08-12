"use client";

import React from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { toast } from "sonner";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteDisbursement } from "@/app/(nav)/accounting/disbursement/data";
import { useRole } from "@/hooks/roleContext";

const DeleteDisbursementModal = ({
  disbursementId,
}: {
  disbursementId?: number;
}) => {
  const router = useRouter();
  const { activeStep, changeStep } = useStep(2);
  const [reqLoading, setReqLoading] = React.useState<boolean>(false);

  const { role } = useRole();

  const getRoute = () => {
    switch (role?.trim()) {
      case "director":
        router.push("/accounting/disbursement");
        break;
      case "manager":
        router.push("/manager/accounting/disbursement");
        break;
      case "account":
        router.push("/accountant/accounting/disbursement");
        break;
      case "staff":
        router.push("/staff/accounting/disbursement");
        break;
      default:
        router.push("/unauthorized");
        break;
    }
  };

  const handleDeleteDisbursement = async () => {
    if (!disbursementId) return toast.warning("Disbursement ID not Found!");

    try {
      setReqLoading(true);
      const res = await deleteDisbursement(disbursementId);
      if (res) {
        toast.success("Disbursement deleted successfully!");
        getRoute();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReqLoading(false);
    }
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to proceed with deleting this disbursement?
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleDeleteDisbursement} disabled={reqLoading}>
          {reqLoading ? "Please wait..." : "Proceed"}
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
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        The disbursement has been successfully edited and updated.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default DeleteDisbursementModal;
