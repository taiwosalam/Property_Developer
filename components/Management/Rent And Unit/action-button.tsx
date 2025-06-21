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
}) => {
  const commonStyles =
    "py-2 px-4 rounded-[20px] text-white text-xs font-medium cursor-pointer";
  // Evaluate color: if it's a function, call it with propertyType; otherwise, use it directly
  const buttonColor = typeof color === "function" ? color(propertyType) : color;

  if (route) {
    return (
      <Link href={route} passHref>
        <div className={commonStyles} style={{ backgroundColor: buttonColor }}>
          {label}
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
            {label}
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
            <MoveOutModal unit_id={unit_id as string} />
          </ModalContent>
        )}
      </Modal>
    );
  }

  return null;
};
