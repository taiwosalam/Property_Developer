import Link from "next/link";
import { ActionButtonProps } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import MoveOutModal from "./move-out-modal";
import RelocateModal from "./reloate-modal";
import PendingInvoiceModal from "./pending-invoice-modal";

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  color,
  route,
  modal,
  unit_id,
  propertyType,
  invoice_id,
  startText,
  tenantId,
  tenantAgent,
  cautionDeposit,
  currency,
}) => {
  const isWebUser = tenantAgent?.toLowerCase() === "web";
  const commonStyles =
    "py-2 px-4 rounded-[20px] text-white text-xs font-medium cursor-pointer";
  // Evaluate color: if it's a function, call it with propertyType; otherwise, use it directly
  const buttonColor = typeof color === "function" ? color(propertyType) : color;
  // Determine final label based on startText override
  const resolvedLabel =
    (label === "Start Rent" || label === "Move In") && startText
      ? startText
      : label;

  if (route) {
    return (
      <Link href={route} passHref>
        <div className={commonStyles} style={{ backgroundColor: buttonColor }}>
          {/* {label} */}
          {resolvedLabel}
        </div>
      </Link>
    );
  }

  if (modal) {
    return (
      <Modal>
        <ModalTrigger asChild>
          <button
            className={commonStyles}
            style={{ backgroundColor: buttonColor }}
          >
            {resolvedLabel}
          </button>
        </ModalTrigger>
        {modal === "Relocate" ? (
          <ModalContent>
            <RelocateModal unit_id={unit_id as string} />
          </ModalContent>
        ) : modal === "Pending" ? (
          <ModalContent>
            <PendingInvoiceModal
              invoice_id={invoice_id as number}
              unit_id={unit_id as string}
            />
          </ModalContent>
        ) : (
          <ModalContent>
            <MoveOutModal
              tenant_id={Number(tenantId)}
              unit_id={unit_id as string}
              tenantAgent={tenantAgent}
              cautionDeposit={cautionDeposit ?? 0}
              currency={currency}
            />
          </ModalContent>
        )}
      </Modal>
    );
  }

  return null;
};
