import Link from "next/link";
import { ActionButtonProps } from "./types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  color,
  route,
  modal,
}) => {
  const commonStyles =
    "py-2 px-4 rounded-[20px] text-white text-xs font-medium cursor-pointer";

  if (route) {
    return (
      <Link href={route} passHref>
        <div className={commonStyles} style={{ backgroundColor: color }}>
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
            style={{ backgroundColor: color }}
            // onClick={modal}
          >
            {label}
          </button>
        </ModalTrigger>
        {modal === "Relocate" ? (
          <ModalContent title="Relocate Unit">
            <div>Relocate Unit</div>
          </ModalContent>
        ) : (
          <ModalContent title="Move Out Unit">
            <div>Move Out Unit</div>
          </ModalContent>
        )}
      </Modal>
    );
  }

  return null;
};
