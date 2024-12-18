import WalletBankTransferCard from "@/components/Wallet/wallet-bank-transfer-card";
import WalletOnlineFundingCard from "@/components/Wallet/wallet-online-funding-card";

const SettingsPaymentOptionsComponent = () => {
  return (
    <div className="custom-flex-col gap-4">
      <WalletBankTransferCard />
      <WalletOnlineFundingCard />
    </div>
  );
};

export default SettingsPaymentOptionsComponent;
