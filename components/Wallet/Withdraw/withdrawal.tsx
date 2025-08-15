"use client";

import React, { useEffect, useState, useMemo } from "react";
import type {
  WalletModalDefaultProps,
  WalletWithdrawFundsOptions,
} from "../types";
import InfoWarningIcon from "@/public/icons/info-warning-circle.svg";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import FundingCard from "../AddFunds/funding-card";
import Button from "@/components/Form/Button/button";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { useWalletStore } from "@/store/wallet-store";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import {
  BankAPIResponse,
  BankPageData,
  transformBank,
} from "@/app/(nav)/settings/data";
import useBankLogo from "@/app/(nav)/bank";
import { currencySymbols } from "@/utils/number-formatter";
import { useRole } from "@/hooks/roleContext";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useBranchInfoStore } from "@/store/branch-info-store";
import Link from "next/link";

// Constants
const DISCOUNT_PERCENTAGE = 0.2;
const BANK_CHARGES = 53.75;
const MIN_WITHDRAWAL = 1000;
const MAX_WITHDRAWAL = 10_000_000;

// Types
interface BranchBankDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
}

// Utility Functions
// const calculateExpectedAmount = (amount: number): number => {
//   if (!amount || amount <= 0) return 0;
//   const discountAmount = (amount * DISCOUNT_PERCENTAGE) / 100;
//   return amount - discountAmount - BANK_CHARGES;
// };

const calculateExpectedAmount = (amount: number): number => {
  if (!amount || amount <= 0) return 0;
  const discountAmount = (amount * DISCOUNT_PERCENTAGE) / 100;
  return discountAmount + BANK_CHARGES;
};

const getSecurityText = (isBranch: boolean): string =>
  isBranch
    ? "For security reasons and to ensure accurate record-keeping, withdrawals are only permitted from the branch wallet to the company's main wallet. This policy helps maintain transparency, streamline financial management, and safeguard funds within the organization's system."
    : "Each withdrawal incurs a fee of the withdrawal amount. We collaborate with a trusted third-party provider to facilitate wallet withdrawals to any pre-registered Nigerian bank account.";

const Withdrawal: React.FC<
  WalletModalDefaultProps<WalletWithdrawFundsOptions>
> = ({ changeStep, branch }) => {
  const isDarkMode = useDarkMode();
  const { role } = useRole();
  const { branch: branchData } = usePersonalInfoStore();
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const managerBankName = useBranchInfoStore((s) => s.bank_name);
  const managerAccountName = useBranchInfoStore((s) => s.account_name);
  const managerAccountNumber = useBranchInfoStore((s) => s.account_number);

  const [bankDetails, setBankDetails] = useState<
    BankPageData | BranchBankDetails
  >({
    bank_name: "",
    account_name: "",
    account_number: "",
    bank_code: "",
  });

  const {
    data: bankData,
    error: bankError,
    loading: bankLoading,
  } = useFetch<BankAPIResponse>("/banks");

  // Fallback formatToNaira function
  const formatToNaira = (amount: number): string => {
    return `₦${amount.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  // Set bank details based on role
  useEffect(() => {
    if (
      role === "manager" &&
      managerBankName &&
      managerAccountName &&
      managerAccountNumber
    ) {
      setBankDetails({
        bank_name: managerBankName,
        account_name: managerAccountName,
        account_number: managerAccountNumber,
        bank_code: "", // Not provided in branch data
      });
    } else if (bankData) {
      const transformedBank = transformBank(bankData);
      if (transformedBank) {
        setBankDetails(transformedBank);
      }
    }
  }, [
    bankData,
    managerBankName,
    managerAccountName,
    managerAccountNumber,
    role,
  ]);

  // Update wallet store
  useEffect(() => {
    setWalletStore("amount", amount);
    setWalletStore("desc", description);
  }, [amount, description, setWalletStore]);

  // Calculate expected amount
  const expectedAmount = useMemo(() => {
    if (branch || amount < MIN_WITHDRAWAL) return amount;
    return calculateExpectedAmount(amount);
  }, [amount, branch]);

  // Bank logo and availability
  const slug = bankDetails.bank_name?.toLowerCase().replace(/\s+/g, "-");
  const logo = useBankLogo({ slug }) || "/icons/default-bank.svg";
  const isBankNotAvailable =
    !bankDetails.bank_name ||
    !bankDetails.account_name ||
    !bankDetails.account_number;

  // Handle amount input change
  const handleAmountChange = (value: string) => {
    const newAmount = Number(value.replace(/,/g, ""));

    if (newAmount > MAX_WITHDRAWAL) {
      setError(
        `Maximum withdrawal limit is ₦${MAX_WITHDRAWAL.toLocaleString()}.`
      );
      setAmount(MAX_WITHDRAWAL);
    } else if (newAmount < MIN_WITHDRAWAL) {
      setError(
        `Minimum withdrawal amount is ₦${MIN_WITHDRAWAL.toLocaleString()}.`
      );
      setAmount(newAmount);
    } else {
      setError(null);
      setAmount(newAmount);
    }
  };

  // Handle continue button click
  const handleContinue = () => {
    if (
      amount >= MIN_WITHDRAWAL &&
      description.length > 0 &&
      !isBankNotAvailable
    ) {
      changeStep("input pin");
    } else {
      toast.warning(
        "Please enter a valid amount, description, and ensure bank details are available."
      );
    }
  };

  const getUpdateBankSettingsPage = () => {
    switch (role) {
      case "director":
        return "/settings/security";
      case "manager":
        return "/manager/settings/security";
      default:
        return "/settings/security";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        {bankLoading ? (
          <div
            className="animate-pulse p-4 w-full h-24 flex items-center justify-between rounded-2xl bg-gray-200 dark:bg-darkText-primary"
            style={{ boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.02)" }}
          />
        ) : (
          <div>
            {!branch && !isBankNotAvailable && (
              <FundingCard
                type="sterling"
                title={bankDetails.account_number}
                desc={bankDetails.account_name}
                cta={bankDetails.bank_name}
                notRounded
                logo={logo}
              />
            )}
            {isBankNotAvailable && (
              <div
                className="p-4 flex items-center justify-between rounded-2xl bg-neutral-2 dark:bg-darkText-primary"
                style={{ boxShadow: "5px 5px 10px 0px rgba(0, 0, 0, 0.02)" }}
              >
                <p>
                  Sorry, your withdrawal cannot be processed at this time.
                  Please add your {role === "manager" ? "branch" : "company"}{" "}
                  bank account details to your account. Click{" "}
                  <Link
                    className="text-brand-9 hover:underline"
                    href={getUpdateBankSettingsPage()}
                  >
                    here
                  </Link>{" "}
                  to update your bank details.
                </p>
              </div>
            )}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col space-y-4">
            <Input
              id="amount"
              label="Amount"
              CURRENCY_SYMBOL={currencySymbols.naira}
              value={amount ? amount.toLocaleString() : ""}
              max={MAX_WITHDRAWAL}
              style={{ backgroundColor: isDarkMode ? "black" : "white" }}
              required
              onChange={handleAmountChange}
            />
            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            {amount >= MIN_WITHDRAWAL && (!branch || role === "manager") && (
              <div>
                <Input
                  readOnly
                  id="amount_expected"
                  label="Charges"
                  CURRENCY_SYMBOL={currencySymbols.naira}
                  style={{ backgroundColor: isDarkMode ? "black" : "white" }}
                  value={expectedAmount.toLocaleString()}
                  className="focus:border-none focus-within:border-none focus:outline-none focus:ring-0 hover:border-none active:border-none pointer-events-none"
                />
                <p className="text-red-600 text-sm mt-1">
                  {`${DISCOUNT_PERCENTAGE}% convenience fee and ${formatToNaira(
                    BANK_CHARGES
                  )} bank VAT`}
                </p>
              </div>
            )}
          </div>
          <Input
            id="description"
            label="Description"
            placeholder="Description"
            style={{ backgroundColor: isDarkMode ? "black" : "white" }}
            maxLength={100}
            required
            onChange={setDescription}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          onClick={handleContinue}
          disabled={!!error || isBankNotAvailable}
          size="sm_medium"
          className="py-2 px-8"
        >
          Continue
        </Button>
        <div className="py-3 px-4 flex gap-2 rounded-[4px] bg-status-caution-1 dark:bg-[#3C3D37]">
          <Picture src={InfoWarningIcon} alt="warning" size={26} />
          <p className="text-[#606060] dark:text-darkText-1 text-sm font-normal">
            {getSecurityText(!!branch)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Withdrawal;
