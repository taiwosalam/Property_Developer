import { Currency, currencySymbols } from "@/utils/number-formatter";
import { FeeDetail } from "../types";
import { useState } from "react";
import { parseAmount } from "./data";
import { RentSectionTitle } from "../rent-section-container";
import Button from "@/components/Form/Button/button";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PendingInvoiceModal from "../pending-invoice-modal";

export const PendingInvoicePayment: React.FC<{
  total: number;
  feeDetails: FeeDetail[];
  currency?: Currency;
  invoice_id: number;
  unit_id: string;
  page: "renew" | "edit";
}> = ({ total, unit_id, invoice_id, feeDetails, currency, page }) => {
  const [toggled, setToggled] = useState(false);
  const CURRENCY = currencySymbols[currency as keyof typeof currencySymbols];

  return (
    <div className="space-y-1 pending-invoice-payment-wrapper">
      <RentSectionTitle>
        Pending Payment – Awaiting Confirmation
      </RentSectionTitle>
      <div className="mt-4 bg-white p-4 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          {feeDetails.map((fee, index) => (
            <DetailItem
              key={index}
              style={{ width: "120px" }}
              label={fee.name}
              value={`${fee?.amount}`}
            />
          ))}
        </div>
        <div className="flex items-end justify-end w-full mt-2">
          <Modal>
            <ModalTrigger asChild>
              <Button
                type="button"
                variant="custom"
                className="py-2 px-6 text-white text-xs font-medium cursor-pointer bg-[#FF9800]"
                size="base_medium"
              >
                Manage Payment
              </Button>
            </ModalTrigger>
            <ModalContent>
              <PendingInvoiceModal
                invoice_id={invoice_id as number}
                unit_id={unit_id as string}
                page={page}
              />
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({
  label,
  value,
  style,
}: {
  label: string;
  value: React.ReactNode;
  style?: React.CSSProperties;
}) => (
  <div className="flex flex-col lg:flex-row gap-x-2 gap-y-1 font-normal text-base">
    <p
      className="text-[#747474] dark:text-white l:w-1/3 capitalize"
      style={style}
    >
      {label}
    </p>
    <p className="lg:flex-1 capitalize text-black dark:text-darkText-1">
      {value ?? "--- ---"}
    </p>
  </div>
);
