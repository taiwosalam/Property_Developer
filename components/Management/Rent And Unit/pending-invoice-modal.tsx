"use client";

import { useState } from "react";
import AddLandlordOrTenantCard from "../add-landlord-or-tenant-card";
import LandlordTenantModalPreset from "../landlord-tenant-modal-preset";
import ModalPreset from "@/components/Modal/modal-preset";
import Button from "@/components/Form/Button/button";
import { updateInvoiceStatus } from "@/app/(nav)/accounting/invoice/[invoiceId]/manage/data";
import { useModal } from "@/components/Modal/modal";
import { toast } from "sonner";
import { cancelRent } from "@/app/(nav)/management/rent-unit/data";

interface IPepndingTypes {
  unit_id?: string;
  invoice_id: number;
  page?: "edit" | "all-units" | "renew" | "invoice";
}

const PendingInvoiceModal = ({ unit_id, invoice_id, page }: IPepndingTypes) => {
  const [reqLoading, setReqLoading] = useState(false);
  const { setIsOpen } = useModal();

  const handleMarkPaid = async () => {
    const INVOICE_ID = Number(invoice_id);
    try {
      setReqLoading(true);
      const res = await updateInvoiceStatus(INVOICE_ID, {
        _method: "PUT",
      });
      if (res) {
        toast.success("Updated successfully");
        setIsOpen(false);
        window.dispatchEvent(new Event("refetchtenant"));
        window.dispatchEvent(new Event("property-updated"));
        page === "edit"
          ? window.dispatchEvent(new Event("refech-unit"))
          : page && page === "renew"
          ? window.dispatchEvent(new Event("refetchUnit"))
          : window.dispatchEvent(new Event("refetchRentUnit"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReqLoading(false);
    }
  };

  const handleCancelRent = async () => {
    const INVOICE_ID = Number(invoice_id);
    try {
      setReqLoading(true);
      const res = await cancelRent(INVOICE_ID, {
        _method: "PUT",
      });
      if (res) {
        toast.success("Rent Cancelled successfully");
        setIsOpen(false);
        page === "edit"
          ? window.dispatchEvent(new Event("refech-unit"))
          : page && page === "renew"
          ? window.dispatchEvent(new Event("refetchUnit"))
          : window.dispatchEvent(new Event("refetchRentUnit"));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <LandlordTenantModalPreset
      heading="Pending Payment – Awaiting Confirmation"
      style={{ maxWidth: "700px" }}
    >
      <div className="flex flex-col gap-3">
        <p>
          This payment is currently unsettled and marked as pending, awaiting
          completion by the client or recipient.
        </p>
        <p>
          If the payment has been received, click &apos;Mark as Paid.&apos; If it&apos;s
          delayed or no longer applicable, you may choose &apos;Cancel Payment&apos; to cancel the request.
        </p>
      </div>

      <div className="flex items-end justify-end mt-4 gap-2">
        <Button
          onClick={handleMarkPaid}
          type="button"
          disabled={reqLoading}
          size="base_medium"
          className="px-6 py-3"
        >
          {reqLoading ? "Please wait..." : "Mark as Paid"}
        </Button>
        <Button
          variant="light_red"
          size="base_medium"
          type="button"
          className="px-6 py-3"
          disabled={reqLoading}
          onClick={handleCancelRent}
        >
          {reqLoading ? "Please wait..." : "Cancel Payment"}
        </Button>
      </div>
    </LandlordTenantModalPreset>
  );
};

export default PendingInvoiceModal;
