import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";

const MoveOutModal = () => {
  const commonClasses =
    "bg-neutral-3 dark:bg-[#3C3D37] px-[18px] py-2 rounded-[4px] flex-row-reverse justify-between items-center";
  return (
    <ModalPreset title="Move Out">
      <div className="space-y-6">
        <p className="text-sm text-text-secondary dark:text-darkText-1">
          Your actions indicate that the tenants have already moved out from the
          current unit of the property, and the said unit is now available for
          listing to other potential tenants. If you proceed, you will lose unit
          data, and the tenants will await caution deposit approval.
        </p>
        <div className="space-y-4">
          <h3 className="text-black dark:text-white text-base font-medium">
            Caution Deposit Requirement
          </h3>
          <div className="space-y-3">
            <DocumentCheckbox
              title="Check Inventory"
              className={commonClasses}
              alignCheckboxCenter
            />
            <DocumentCheckbox
              title="Create Examine"
              className={commonClasses}
              alignCheckboxCenter
            />
            <DocumentCheckbox
              title="Create Maintenance"
              className={commonClasses}
              alignCheckboxCenter
            />
            <DocumentCheckbox
              title="Flag Tenant"
              className={commonClasses}
              alignCheckboxCenter
            />
          </div>
        </div>
        <button className="w-full bg-status-error-1 text-status-error-2 py-2 rounded mt-10">
          Move Out
        </button>
      </div>
    </ModalPreset>
  );
};

export default MoveOutModal;
