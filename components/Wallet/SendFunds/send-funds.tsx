// Types
import type { WalletModalDefaultProps, WalletSendFundsOptions } from "../types";

// Imports
import { useState } from "react";
import Input from "@/components/Form/Input/input";
import FundsBeneficiary from "./funds-beneficiary";
import Button from "@/components/Form/Button/button";
import { useWalletStore } from "@/store/wallet-store";
import { getUserInfoFromWalletId } from "../data";
import type { Beneficiary } from "@/store/wallet-store";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { toast } from "sonner";

interface SendFundsProps
  extends WalletModalDefaultProps<WalletSendFundsOptions> {
  setRecipient: React.Dispatch<React.SetStateAction<Omit<Beneficiary, "id">>>;
}

const SendFunds: React.FC<SendFundsProps> = ({ changeStep, setRecipient }) => {
  const beneficiaries = useWalletStore((state) => state.beneficiaries);
  const [walletId, setWalletId] = useState("");
  const [loading, setLoading] = useState(false);
  const handleNext = (beneficiary: Omit<Beneficiary, "id">) => {
    setRecipient(beneficiary);
    changeStep("recipient");
  };

  const handleContinue = async () => {
    if (!walletId) return;
    if (!/^\d{8}$/.test(walletId.trim())) {
      toast.error("Invalid wallet Id");
      return;
    }
    setLoading(true);
    const data = await getUserInfoFromWalletId(walletId.trim());
    if (data) {
      handleNext({
        name: data.name,
        picture: data.picture,
        wallet_id: data.encodedId,
        badge_color: data.isVerified
          ? "gray"
          : data.tier
          ? tierColorMap[data.tier]
          : undefined,
        company_name: data.company_name,
      });
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
                onClick={() => handleNext(beneficiary)}
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
