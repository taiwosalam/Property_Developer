import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import ManageMaintenanceModal from "./manage-maintenance-modal";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";

interface MaintenanceCardProps {
  maintenanceId: string;
  status: "not started" | "ongoing" | "completed";
  propertyName: string;
  dateCreated: string;
  serviceProvider: string;
  startEndDate: string;
  priority: string;
  serviceType: string;
  viewOnly?: boolean;
}

const MaintenanceCard: React.FC<MaintenanceCardProps> = ({
  maintenanceId,
  status,
  propertyName,
  dateCreated,
  serviceProvider,
  startEndDate,
  priority,
  serviceType,
  viewOnly,
}) => {
  let statusClasses = "";
  switch (status) {
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
      className="bg-white rounded-lg px-[18px] pt-4 pb-6 font-medium"
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p>
          <span className="text-base text-text-tertiary">
            Maintenance ID:{" "}
            <span className="text-text-secondary text-sm">{maintenanceId}</span>
          </span>
        </p>
        <p
          className={clsx(
            statusClasses,
            "p-2 border capitalize rounded-sm text-xs font-normal ml-auto"
          )}
        >
          {status}
        </p>
      </div>
      <hr className="mt-3 mb-6 border-t border-dashed border-brand-7 opacity-50" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-5 [&>div]:flex [&>div]:flex-col [&>div]:gap-2 mb-7">
        <div>
          <p className="text-text-tertiary text-base">Property Name:</p>
          <p className="text-text-secondary text-sm">{propertyName}</p>
        </div>
        <div>
          <p className="text-text-tertiary text-base">Date Created:</p>
          <p className="text-text-secondary text-sm">{dateCreated}</p>
        </div>
        <div>
          <p className="text-text-tertiary text-base">Service Provider:</p>
          <p className="text-text-secondary text-sm">{serviceProvider}</p>
        </div>
        <div>
          <p className="text-text-tertiary text-base">Start - End Date:</p>
          <p className="text-text-secondary text-sm">{startEndDate}</p>
        </div>
        <div>
          <p className="text-text-tertiary text-base">Priority:</p>
          <p className="text-text-secondary text-sm">{priority}</p>
        </div>
        <div>
          <p className="text-text-tertiary text-base">Service Type:</p>
          <p className="text-text-secondary text-sm">{serviceType}</p>
        </div>
      </div>
      {!viewOnly && (
        <Modal>
          <ModalTrigger asChild>
            <Button size="xs_normal" className="px-6 py-2 block ml-auto">
              Manage
            </Button>
          </ModalTrigger>
          <ModalContent>
            <ManageMaintenanceModal />
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default MaintenanceCard;
