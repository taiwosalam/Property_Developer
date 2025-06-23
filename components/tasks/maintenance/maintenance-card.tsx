import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import ManageMaintenanceModal from "./manage-maintenance-modal";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import { useState } from "react";

interface MaintenanceCardProps {
  card: {
    maintenanceId: string;
    status: "not started" | "ongoing" | "completed" | "pending";
    propertyName: string;
    dateCreated: string;
    serviceProvider: string;
    startEndDate: string;
    priority: "high" | "critical" | "low" | "very low" | "medium";
    serviceType: string;
    viewOnly?: boolean;
  };
  modal: {
    maintenanceId: number;
    property_name: string;
    created_at: string;
    priority: "high" | "critical" | "low" | "very low" | "medium";
    service_type: string;
    service_provider: string;
    work_details: string;
    quotation: string;
    start_date: string;
    end_date: string;
    cost: string;
  };
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({ card, modal }) => {
  const [isOpen, setIsOpen] = useState(false);
  let statusClasses = "";
  switch (card?.status) {
    case "not started":
      statusClasses =
        "border-status-error-1 bg-status-error-1 text-status-error-primary";
      break;
    case "ongoing":
      statusClasses =
        "border-status-caution-1 bg-status-caution-1 text-status-caution-2";
      break;
    case "completed":
      statusClasses =
        "border-status-success-1 bg-status-success-1 text-status-success-primary";
      break;
  }
  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-lg px-[18px] pt-4 pb-6 font-medium"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p>
          <span className="text-base text-text-tertiary dark:text-darkText-2">
            Maintenance ID:{" "}
            <span className="text-text-secondary text-sm">
              {card?.maintenanceId}
            </span>
          </span>
        </p>
        <p
          className={clsx(
            statusClasses,
            "p-2 border capitalize rounded-sm text-xs font-normal ml-auto"
          )}
        >
          {card?.status}
        </p>
      </div>
      <hr className="mt-3 mb-6 border-t border-dashed border-brand-7 opacity-50" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 mb-7">
        <div>
          <p className="text-text-tertiary text-base dark:text-darkText-1">
            Property Name:
          </p>
          <p className="text-text-secondary text-sm dark:text-darkText-2">
            {card?.propertyName}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary text-base dark:text-darkText-1">
            Date Created:
          </p>
          <p className="text-text-secondary text-sm dark:text-darkText-2">
            {card?.dateCreated}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary text-base dark:text-darkText-1">
            Service Provider:
          </p>
          <p className="text-text-secondary text-sm dark:text-darkText-2">
            {card?.serviceProvider}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary text-base dark:text-darkText-1">
            Start - End Date:
          </p>
          <p className="text-text-secondary text-sm dark:text-darkText-2">
            {card?.startEndDate}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary text-base dark:text-darkText-1">
            Priority:
          </p>
          <p className="text-text-secondary text-sm dark:text-darkText-2 capitalize">
            {card?.priority}
          </p>
        </div>
        <div>
          <p className="text-text-tertiary text-base dark:text-darkText-1">
            Service Type:
          </p>
          <p className="text-text-secondary text-sm dark:text-darkText-2">
            {card?.serviceType}
          </p>
        </div>
      </div>
      {!card?.viewOnly && (
        <Modal
          state={{
            isOpen,
            setIsOpen,
          }}
        >
          <ModalTrigger asChild>
            <Button size="xs_normal" className="px-6 py-2 block ml-auto">
              Manage
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ManageMaintenanceModal {...modal} setIsOpen={setIsOpen} />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default MaintenanceCard;
