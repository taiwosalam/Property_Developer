// Types
import type { InspectionCardProps } from "./types";

// Images
import ChatIcon from "@/public/icons/chat.svg";

// Imports
import clsx from "clsx";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import InspectionCardInfo from "./inspection-card-info";
import InspectionCardDetail from "./inspection-card-detail";
import InspectionDetailModal from "./inspection-detail-modal";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";

const InspectionCard: React.FC<InspectionCardProps> = ({ type }) => {
  return (
    <div
      className="rounded-lg bg-white custom-flex-col gap-6 pb-6"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="custom-flex-col gap-3">
        <InspectionCardInfo className="p-[18px]" />
        <div className="py-2 px-[18px] bg-brand-1 flex justify-between text-base font-medium">
          <p className="text-text-secondary">Inspection details</p>
          <p
            className={clsx("capitalize", {
              "text-support-2": type === "virtual",
              "text-support-3": type === "physical",
            })}
          >
            {type} Inspection
          </p>
        </div>
      </div>
      <div className="custom-flex-col gap-8 px-[18px]">
        <div className="flex justify-between gap-2">
          <InspectionCardDetail
            title="Booked by"
            desc="Salam AIshat"
            verirified
          />
          <InspectionCardDetail title="Inspection Date" desc="25/01/2024" />
          <InspectionCardDetail title="Inspection Time" desc="12:30pm" />
        </div>
        <div className="flex items-center gap-4 justify-end">
          <Picture src={ChatIcon} alt="chat" size={24} />
          <Modal>
            <ModalTrigger asChild>
              <Button size="xs_normal" className="py-2 px-6">
                more details
              </Button>
            </ModalTrigger>
            <ModalContent>
              <InspectionDetailModal />
            </ModalContent>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default InspectionCard;
