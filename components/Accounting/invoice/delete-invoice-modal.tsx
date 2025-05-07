"use client";

import React, { useState } from "react";

// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { deleteInvoice } from "@/app/(nav)/accounting/invoice/[invoiceId]/manage/data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DeleteInvoiceModal = ({ invoiceId }: { invoiceId?: string }) => {
  const { activeStep, changeStep } = useStep(2);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!invoiceId) return toast.warning("Cannot Find Invoice ID");
    try {
      setIsLoading(true);
      const res = await deleteInvoice(Number(invoiceId));
      if (res) {
        toast.success("Invoice deleted successfully");
        router.push("/accounting/invoice");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to proceed with deleting this invoice?
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleDelete} disabled={isLoading}>
          {isLoading ? "Please wait..." : "Proceed"}
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
        The invoice has been successfully edited and updated.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default DeleteInvoiceModal;
