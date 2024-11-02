import ModalPreset from "@/components/Wallet/wallet-modal-preset";

const MoveOutModal = () => {
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
          <div className="space-y-3 px-2">
            <div className="flex items-center justify-between bg-gray-300 dark:bg-transparent dark:border dark:border-[#3C3D37] p-2">
              <label htmlFor="check-inventory">Check Inventory</label>
              <input type="checkbox" id="check-inventory" className="mr-2" />
            </div>
            <div className="flex items-center justify-between bg-gray-300 dark:bg-transparent dark:border dark:border-[#3C3D37] p-2">
              <label htmlFor="create-examine">Create Examine</label>
              <input type="checkbox" id="create-examine" className="mr-2" />
            </div>
            <div className="flex items-center justify-between bg-gray-300 dark:bg-transparent dark:border dark:border-[#3C3D37] p-2">
              <label htmlFor="create-maintenance">Create Maintenance</label>
              <input type="checkbox" id="create-maintenance" className="mr-2" />
            </div>
            <div className="flex items-center justify-between bg-gray-300 dark:bg-transparent dark:border dark:border-[#3C3D37] p-2">
              <label htmlFor="flag-tenant">Flag Tenant</label>
              <input type="checkbox" id="flag-tenant" className="mr-2" />
            </div>
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
