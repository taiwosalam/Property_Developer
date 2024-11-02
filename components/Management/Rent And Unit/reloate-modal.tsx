import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
const RelocateModal = () => {
  return (
    <WalletModalPreset title="Relocate">
      <div className="custom-flex-col gap-6 justify-between">
        <p className="text-sm dark:text-darkText-1">
          Your actions indicate that the occupant have already relocated from
          the current unit of the estate. If you proceed, you will lose unit
          data.
        </p>
        <button className="bg-status-error-1 text-status-error-2 py-2 rounded mt-20">
          Move Out
        </button>
      </div>
    </WalletModalPreset>
  );
};

export default RelocateModal;
