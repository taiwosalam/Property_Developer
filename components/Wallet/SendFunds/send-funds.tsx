// Types
import type { WalletModalDefaultProps, WalletSendFundsOptions } from "../types";

// Imports
import { useState } from "react";
import Input from "@/components/Form/Input/input";
import FundsBeneficiary from "./funds-beneficiary";
import Button from "@/components/Form/Button/button";
import { useWalletStore } from "@/store/wallet-store";
import { getUserInfoFromWalletId } from "../data";

interface SendFundsProps
  extends WalletModalDefaultProps<WalletSendFundsOptions> {
  setRecipient: React.Dispatch<
    React.SetStateAction<{
      name: string;
      picture: string;
      wallet_id: string;
    }>
  >;
}

const SendFunds: React.FC<SendFundsProps> = ({ changeStep, setRecipient }) => {
  const beneficiaries = useWalletStore((state) => state.beneficiaries);
  const [walletId, setWalletId] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClickBeneficiary = (beneficiary: {
    name: string;
    picture: string;
    wallet_id: string;
  }) => {
    setRecipient(beneficiary);
    changeStep("send fund to beneficiary");
  };

  const handleContinue = async () => {
    if (!walletId) return;
    setLoading(true);
    const data = await getUserInfoFromWalletId(walletId);
    if (data) {
      handleClickBeneficiary(data);
      changeStep("send fund to beneficiary");
      setWalletId("");
    }
    setLoading(false);
  };

  return (
    <div className="custom-flex-col gap-16">
      <div className="custom-flex-col gap-6">
        <Input
          id="wallet_id"
          placeholder="Recipient Wallet ID"
          label="Recipient Wallet ID"
          value={walletId}
          onChange={(value) => setWalletId(value)}
        />
        <div className="custom-flex-col gap-4 py-[18px] rounded-2xl bg-neutral-2 dark:bg-darkText-primary">
          <p className="pl-[18px] text-[#010A23] dark:text-white text-base font-medium">
            Beneficiaries
          </p>
          <div className="custom-flex-col gap-2 sections">
            {beneficiaries.length === 0 && (
              <p className="text-center">No beneficiaries found</p>
            )}
            {beneficiaries.map((beneficiary, idx) => (
              <FundsBeneficiary
                key={idx}
                seeMore
                {...beneficiary}
                onClick={() => handleClickBeneficiary(beneficiary)}
              />
            ))}
          </div>
        </div>
      </div>
      <Button
        size="sm_medium"
        className="py-2 px-8"
        onClick={handleContinue}
        disabled={loading}
      >
        {loading ? "Retrieving details..." : "Continue"}
      </Button>
    </div>
  );
};

export default SendFunds;
