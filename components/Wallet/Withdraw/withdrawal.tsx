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
import useFetch from "@/hooks/useFetch";
import { BankAPIResponse, BankPageData, transformBank } from "@/app/(nav)/settings/data";
import useBankLogo from "@/app/(nav)/bank";
import { currencySymbols } from "@/utils/number-formatter";

const Withdrawal: React.FC<
  WalletModalDefaultProps<WalletWithdrawFundsOptions>
> = ({ changeStep, branch }) => {
  const isDarkMode = useDarkMode()
  const setWalletStore = useWalletStore((s) => s.setWalletStore)
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [companyBankDetails, setCompanyBankDetails] = useState<BankPageData>({
    bank_name: "",
    account_name: "",
    account_number: "",
    bank_code: "",
  });
  const securityText = branch ? "For security reasons and to ensure accurate record-keeping, withdrawals are only permitted from the branch wallet to the company's main wallet. This policy helps maintain transparency, streamline financial management, and safeguard funds within the organization's system." : "Each withdrawal incurs a fee of 1.5% of the withdrawal amount. We collaborate with a trusted third-party provider to facilitate wallet withdrawals to any pre-registered Nigerian bank account."

  const {
    data: bankData,
    error: bankError,
    refetch: bankRefetch
  } = useFetch<BankAPIResponse>("/banks")

  useEffect(() => {
    if (bankData) {
      const res = transformBank(bankData);
      if (res) {
        setCompanyBankDetails(res)
      }
    }
  }, [bankData])

  // console.log("bank name", companyBankDetails.bank_name)

  useEffect(() => {
    setWalletStore("amount", amount)
    setWalletStore("desc", description)
  }, [amount, description, setWalletStore])

  const slug = companyBankDetails.bank_name?.toLowerCase().replace(/\s+/g, '-');
  const logo = useBankLogo({ slug }) || "/icons/default-bank.svg";
  const bankNotAvailable = !companyBankDetails.bank_name && !companyBankDetails.account_name && !companyBankDetails.account_number && !companyBankDetails.bank_code;

  const [error, setError] = useState<string | null>(null);

  const handleAmountChange = (value: string) => {
    const newAmount = parseFloat(value.replace(/,/g, ""));
    setAmount(newAmount);

    if (newAmount < 1000) {
      setError("Minimum withdrawal amount is ₦1,000.");
    } else if (newAmount > 10000000) {
      setError("Maximum withdrawal limit is ₦10,000,000.");
    } else {
      setError(null);
    }
  };


  const handleContinue = () => {
    if (amount > 0 && description.length > 0) {
      changeStep("input pin");
    } else {
      toast.warning("Please enter an amount and description");
    }
  }

  const CURRENCY_SYMBOL = currencySymbols.naira;

  return (
    <div className="custom-flex-col gap-8">
      <div className="custom-flex-col gap-[18px]">
        {(!branch && !bankNotAvailable) &&
          <FundingCard
            type="sterling"
            title={companyBankDetails.account_number}
            desc={companyBankDetails.account_name}
            cta={companyBankDetails.bank_name}
            notRounded
            logo={logo}
          />}
        {bankNotAvailable &&
          <div
            className="p-4 flex items-center justify-between rounded-2xl bg-neutral-2 dark:bg-darkText-primary"
            style={{ boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.02)" }}
          >
            <p>Sorry, your withdrawal cannot be processed at this time. Please add your company&apos;s bank account details to your account. Click here to update your bank details.</p>
          </div>
        }
        <div className="custom-flex-col gap-4">
          <div className="custom-flex-col">
            <Input
              id="amount"
              label="amount"
              CURRENCY_SYMBOL={CURRENCY_SYMBOL}
              style={{ backgroundColor: isDarkMode ? 'black' : "white" }}
              required
              // onChange={(value) => {
              //   setAmount(parseFloat(value.replace(/,/g, "")));
              // }}
              onChange={handleAmountChange}
            />
            {(!branch && error) &&
              <p className="text-red-600 text-sm mt-1">{error}</p>
            }
          </div>
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
          disabled={!!error}
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
