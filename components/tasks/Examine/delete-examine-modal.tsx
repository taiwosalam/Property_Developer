"use client";

import React, { useState } from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { useParams, useRouter } from "next/navigation";
import { deleteExamine } from "@/app/(nav)/tasks/examine/[examineId]/manage/data";
import { toast } from "sonner";
import { useRole } from "@/hooks/roleContext";

const DeleteExamineModal = () => {
  const { activeStep, changeStep } = useStep(2);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const paramId = params?.examineId;
  const router = useRouter();

  const { role } = useRole();

  const toToMainPage = () => {
    switch (role) {
      case "director":
        router.push(`/tasks/examine`);
        break;
      case "manager":
        router.push(`/manager/tasks/examine`);
        break;
      case "account":
        router.push(`/accountant/tasks/examine`);
        break;
      case "staff":
        router.push(`/staff/tasks/examine`);
        break;
      default:
        router.push(`/unauthorized`);
    }
  };

  const handleDeleteExamine = async () => {
    if (!paramId) return;

    try {
      setIsDeleting(true);
      const res = await deleteExamine(paramId as string);
      if (res) {
        toast.success("Examine deleted");
        changeStep("next");
        setTimeout(() => {
          toToMainPage();
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to delete this Examine from your tasks? *Please
        note that you can only delete completed Examine.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleDeleteExamine}>
          {isDeleting ? "Please wait..." : "Proceed"}
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
        The Examine has been successfully removed.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button onClick={() => router.push("/tasks/examine")}>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default DeleteExamineModal;
