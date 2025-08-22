"use client";

import SettingsSection from "./settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import Input from "@/components/Form/Input/input";
import Select from "../Form/Select/select";
import { Check, Loader2 } from "lucide-react";
import FundingCard from "../Wallet/AddFunds/funding-card";
import Picture from "../Picture/picture";
import DangerIcon from "@/public/icons/danger.svg";
import { lookupBankDetails } from "@/app/(nav)/management/landlord/[landlordId]/manage/edit/data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import "nigerian-bank-icons/index.css";
import useBankLogo from "@/app/(nav)/bank";
import { toast } from "sonner";
import Button from "../Form/Button/button";

interface BranchBankSettingsProps {
  branch_bank_name?: string;
  branch_account_name?: string;
  branch_account_number?: string;
  action?: (details: {
    bank_name: string;
    account_name: string;
    account_number: string;
    bank_code: string;
  }) => void;
}

interface BankOption {
  value: string;
  label: string;
}

const BranchBankSettings: React.FC<BranchBankSettingsProps> = ({
  branch_bank_name,
  branch_account_name,
  branch_account_number,
  action,
}) => {
  // State management
  const [isEditing, setIsEditing] = useState(false);
  const [bankName, setBankName] = useState(branch_bank_name || "");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState(
    branch_account_number || ""
  );
  const [accountName, setAccountName] = useState(branch_account_name || "");
  const [isVerified, setIsVerified] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [defaultBankOption, setDefaultBankOption] = useState<
    BankOption | undefined
  >(undefined);

  // Fetch bank list
  const {
    data: bankList,
    loading: bankListLoading,
    error: bankListError,
  } = useFetch<{
    data: { bank_name: string; bank_code: string }[];
  }>("bank/bank-list");

  // Derived state
  const hasBankDetails =
    !!branch_bank_name && !!branch_account_name && !!branch_account_number;
  const showForm = isEditing || !hasBankDetails;
  const showFundingCard = !isEditing && hasBankDetails;

  // Initialize form state
  useEffect(() => {
    setBankName(branch_bank_name || "");
    setAccountNumber(branch_account_number || "");
    setAccountName(branch_account_name || "");

    if (branch_bank_name && bankList?.data) {
      const selectedBank = bankList.data.find(
        (bank) => bank.bank_name === branch_bank_name
      );
      if (selectedBank) {
        setBankCode(selectedBank.bank_code);
        setDefaultBankOption({
          value: selectedBank.bank_code,
          label: selectedBank.bank_name,
        });
      }
    }

    // Show form if no bank details exist
    setIsEditing(!branch_bank_name);
  }, [
    branch_bank_name,
    branch_account_name,
    branch_account_number,
    bankList?.data,
  ]);

  // Handlers
  const handleAccountNumberChange = async (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setAccountNumber(numericValue.slice(0, 10));
    setAccountName("");

    if (numericValue.length === 10 && bankCode) {
      setLookupLoading(true);
      const name = await lookupBankDetails(bankCode, numericValue);
      setAccountName(name || "");
      setIsVerified(!!name);
      setLookupLoading(false);
    } else {
      setIsVerified(false);
    }
  };

  const handleBankChange = (value: string) => {
    setBankCode(value);
    setIsVerified(false);
    setAccountName("");

    if (!value) {
      setAccountNumber("");
    }

    const selectedBank = bankList?.data.find(
      (bank) => String(bank.bank_code) === value
    );
    setBankName(selectedBank?.bank_name || "");
  };

  const handleUpdateBranchBank = async () => {
    if (!bankCode || !accountNumber || !accountName || !bankName) {
      toast.warning("Please fill in all bank details");
      return;
    }

    if (!isVerified) {
      toast.warning("Please verify the account number");
      return;
    }

    const payload = {
      bank_name: bankName,
      account_name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
    };

    try {
      setReqLoading(true);
      if (action) {
        await action(payload);
        toast.success("Branch bank details updated successfully");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Failed to update branch bank details");
    } finally {
      setReqLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Prepare bank logo and options
  const slug = bankName?.toLowerCase().replace(/\s+/g, "-");
  const logo = useBankLogo({ slug }) || "/icons/default-bank.svg";
  const bankOptions: BankOption[] =
    bankList?.data.map((bank) => ({
      value: bank.bank_code,
      label: bank.bank_name,
    })) || [];

  const subTitle =
    "To streamline payments from branch, please add the most suitable branch account that should appear on invoices.";

  return (
    <div className="branch-bank-account-input">
      <SettingsSection title="Branch Bank Details">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Bank Account For Invoice"
            desc={subTitle}
          />

          {/* Funding Card */}

          {showFundingCard && (
            <div className="custom-flex-col max-w-[436px] gap-4">
              <FundingCard
                type="sterling"
                title={accountNumber}
                desc={accountName}
                cta={bankName}
                notRounded
                logo={logo}
              />

              <div className="flex items-center gap-2 w-full">
                <Picture src={DangerIcon} alt="danger" size={24} />
                <p className="text-text-label text-xs font-normal">
                  It is advisable to use a bank account name that matches the
                  registered name of your company.
                </p>
              </div>
            </div>
          )}
          {showFundingCard && (
            <div className="flex justify-end gap-4 w-full">
              <Button
                size="base_bold"
                className="py-[10px] px-8"
                onClick={handleEdit}
              >
                Edit
              </Button>
            </div>
          )}

          {/* Form */}
          {showForm && (
            <div className="custom-flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
                <Select
                  id="bank_name"
                  label="bank name"
                  inputContainerClassName="w-full bg-neutral-2"
                  options={bankOptions}
                  placeholder={
                    bankListLoading
                      ? "Loading bank list..."
                      : bankListError
                      ? "Error loading bank list"
                      : "Select bank"
                  }
                  defaultValue={defaultBankOption}
                  error={bankListError}
                  onChange={handleBankChange}
                />
                <Input
                  id="account_number"
                  label="account number"
                  className="w-full"
                  value={accountNumber}
                  maxLength={10}
                  onChange={handleAccountNumberChange}
                  disabled={!bankCode}
                />
                {lookupLoading ? (
                  <div className="h-[45px] px-6 flex gap-[18px] items-center bg-status-info-1">
                    <Loader2 className="w-4 h-4 animate-spin text-status-info-primary" />
                    <p className="text-status-info-primary text-xs font-normal">
                      Verifying account...
                    </p>
                  </div>
                ) : accountName ? (
                  <div className="h-[45px] px-6 flex gap-[18px] items-center bg-status-success-1">
                    <div className="w-4 h-4 pt-[1px] rounded-full flex items-center justify-center bg-status-success-primary">
                      <Check size={10} color="white" />
                    </div>
                    <p className="text-status-success-primary text-xs font-normal capitalize truncate">
                      {accountName}
                    </p>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-2 w-full">
                <Picture src={DangerIcon} alt="danger" size={24} />
                <p className="text-text-label text-xs font-normal">
                  It is advisable to use a bank account name that matches the
                  registered name of your company.
                </p>
              </div>
              <SettingsUpdateButton
                type="otp"
                submit
                text={!hasBankDetails ? "Add" : "Update"}
                loading={reqLoading}
                action={handleUpdateBranchBank}
              />
            </div>
          )}
        </div>
      </SettingsSection>
    </div>
  );
};

export default BranchBankSettings;
