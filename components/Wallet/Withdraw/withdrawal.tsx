import React, { useEffect, useState } from "react";

// Types
import type {
  WalletModalDefaultProps,
  WalletWithdrawFundsOptions,
} from "../types";

// Images
import InfoWarningIcon from "@/public/icons/info-warning-circle.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import FundingCard from "../AddFunds/funding-card";
import Button from "@/components/Form/Button/button";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { useWalletStore } from "@/store/wallet-store";
import { toast } from "sonner";

const Withdrawal: React.FC<
  WalletModalDefaultProps<WalletWithdrawFundsOptions>
> = ({ changeStep, branch }) => {
  const isDarkMode = useDarkMode()
  const setWalletStore = useWalletStore((s) => s.setWalletStore)
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const securityText = branch ? "For security reasons and to ensure accurate record-keeping, withdrawals are only permitted from the branch wallet to the company's main wallet. This policy helps maintain transparency, streamline financial management, and safeguard funds within the organization's system." : "For security purposes, you can only withdraw money from your wallet to a verified account details. You can modify these details only from your profile."

  useEffect(()=> {
    setWalletStore("amount", amount)
    setWalletStore("desc", description)
  }, [amount, description, setWalletStore])

  const handleContinue = () => {
    if (amount > 0 && description.length > 0) {
      changeStep("input pin");
    } else {
      toast.warning("Please enter an amount and description");
    }
  }
  
  return (
    <div className="custom-flex-col gap-8">
      <div className="custom-flex-col gap-[18px]">
        {!branch && <FundingCard
          type="sterling"
          title="0068190063"
          desc="David Ajala"
          cta="Sterling Bank"
          notRounded
        />}
        <div className="custom-flex-col gap-4">
          <Input
            id="amount"
            label="amount"
            placeholder="₦"
            style={{ backgroundColor: isDarkMode ? 'black' : "white" }}
            required
            onChange={(value) => {
              setAmount(parseFloat(value.replace(/,/g, "")));
            }}
          />
          <Input
            id="description"
            label="description"
            placeholder="Description"
            style={{ backgroundColor: isDarkMode ? "black" : "white" }}
            maxLength={100}
            required
            onChange={setDescription}
          />
        </div>
      </div>
      <div className="custom-flex-col gap-3">
        <Button
          // onClick={() => changeStep("input pin")}
          onClick={handleContinue}
          size="sm_medium"
          className="py-2 px-8"
        >
          continue
        </Button>
        <div className="py-3 px-4 flex gap-2 rounded-[4px] bg-status-caution-1 dark:bg-[#3C3D37]">
          <div className="flex items-start">
            <Picture src={InfoWarningIcon} alt="warning" size={26} />
          </div>
          <p className="text-[#606060] dark:text-darkText-1 text-sm font-normal">
            {securityText}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
