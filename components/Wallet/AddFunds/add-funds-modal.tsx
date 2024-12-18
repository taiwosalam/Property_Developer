import WalletBankTransferCard from "../wallet-bank-transfer-card";
import WalletModalPreset from "../wallet-modal-preset";
import WalletOnlineFundingCard from "../wallet-online-funding-card";

const AddFundsModal = () => {
  return (
    <WalletModalPreset title="Select payment method">
      <div className="custom-flex-col gap-4">
        <WalletBankTransferCard />
        <WalletOnlineFundingCard />
      </div>
    </WalletModalPreset>
  );
};

export default AddFundsModal;
