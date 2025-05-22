"use client";

import React from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { deleteDocument } from "@/app/(nav)/documents/manage-tenancy-agreement/data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteDocumentModal = ({ documentId }: { documentId?: number }) => {
  const { activeStep, changeStep } = useStep(2);
  const router = useRouter();
  const [reqLoading, setReqLoading] = React.useState(false);

  const handleDelete = async () => {
    try {
      setReqLoading(true);
      if(!documentId) return toast.error("Document id is Missing");
      const res = await deleteDocument(documentId);
      if (res) {
        toast.success("Document deleted successfully");
        router.push("/documents");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReqLoading(false);
    }
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to proceed with deleting this document?
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleDelete} disabled={reqLoading}>
          {reqLoading ? "Please wait...." : "Delete"}
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
        The expenses has been successfully edited and updated.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default DeleteDocumentModal;
