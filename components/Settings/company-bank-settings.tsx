"use client";

import SettingsSection from "./settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import Input from "@/components/Form/Input/input";
import Select from "../Form/Select/select";
import { Check, Loader2 } from "lucide-react"; // Added Loader2 for spinner
import FundingCard from "../Wallet/AddFunds/funding-card";
import Picture from "../Picture/picture";
import DangerIcon from "@/public/icons/danger.svg";
import { lookupBankDetails } from "@/app/(nav)/management/landlord/[landlordId]/manage/edit/data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import "nigerian-bank-icons/index.css";
import useBankLogo from "@/app/(nav)/bank";
import { toast } from "sonner";
import { useWalletStore } from "@/store/wallet-store";
import { sendWalletSecurityOTp } from "@/app/(nav)/settings/company/data";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";
import { useCompanyBankDetails } from "@/hooks/useCompanyBankDetails";
import Button from "../Form/Button/button";

interface CompanyBankSettingsProps {
  action?: (details: {
    bank_name: string;
    account_name: string;
    account_number: string;
    bank_code: string;
  }) => void;
}

const CompanyBankSettings: React.FC<CompanyBankSettingsProps> = ({
  action,
}) => {
  const [reqLoading, setReqLoading] = useState(false);
  const [next, setNext] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const [isVerified, setIsVerified] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [showCard, setShowCard] = useState(false);

  const {
    companyBankDetails,
    error: bankError,
    loading: bankLoading,
  } = useCompanyBankDetails();

  const { bank_name, account_name, account_number, bank_code } =
    companyBankDetails || {};

  const bankNotAvailable =
    bank_name === "" &&
    account_name === "" &&
    account_number === "" &&
    bank_code === "";

  const {
    data: bankList,
    loading: bankListLoading,
    error: bankListError,
  } = useFetch<{
    data: { bank_name: string; bank_code: string }[];
  }>("bank/bank-list");

  const { data, error, refetch } =
    useFetch<WalletDataResponse>("/wallets/dashboard");
  const walletId = data?.balance.wallet_id;

  useEffect(() => {
    if (companyBankDetails) {
      setBankName(bank_name || "");
      setBankCode(bank_code || "");
      setAccountNumber(account_number || "");
      setAccountName(account_name || "");
      setShowCard(!!bank_name);
      setEdit(!!bank_name);
      if (!bank_name) {
        setOpenEdit(true); // Show input fields when no company bank details
      }
    }
  }, [bank_name, account_name, account_number, bank_code]);

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
      setAccountNumber(""); // Clear account number if no bank is selected
    }
    const selectedBank = bankList?.data.find(
      (bank) => String(bank.bank_code) === value
    );
    setBankName(selectedBank?.bank_name || "");
  };

  const slug = bankName?.toLowerCase().replace(/\s+/g, "-");
  const logo = useBankLogo({ slug }) || "/icons/default-bank.svg";

  const handleAddBank = async () => {
    if (!bankCode || !accountNumber || !accountName || !bankName) {
      toast.warning("Please fill in all bank details");
      return;
    }
    const payload = {
      bank_code: bankCode,
      account_name: accountName,
      account_number: accountNumber,
      bank_name: bankName,
    };

    try {
      setReqLoading(true);
      setWalletStore("bank_details", payload);
      const walletid = {
        wallet_id: walletId as string,
      };
      const res = await sendWalletSecurityOTp(walletid);
      if (res) {
        toast.success("Check Email For OTP");
        setNext(true);
      }
    } catch (err) {
      toast.error("Failed to add bank details");
    } finally {
      setReqLoading(false);
    }
  };

  const handleEdit = () => {
    setEdit(false);
    setOpenEdit(true);
    setShowCard(false);
  };

  const bankOptions =
    bankList?.data.map((bank) => ({
      value: bank.bank_code,
      label: bank.bank_name,
    })) || [];

  const subTitle =
    "A bank account for wallet withdrawal is the account linked to your wallet, allowing you to transfer funds from your digital wallet directly to your bank.";

  return (
    <SettingsSection title="Bank Details">
      <div className="custom-flex-col gap-8">
        <SettingsSectionTitle
          title="Bank Account For Withdrawal"
          desc={subTitle}
        />
        {(bankNotAvailable || openEdit) && (
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
              value={bankCode}
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
        )}
        <div className="flex flex-col">
          {showCard && (
            <div className="custom-flex-col max-w-[436px] gap-4">
              <FundingCard
                type="sterling"
                title={accountNumber || "___"}
                desc={accountName || "___"}
                cta={bankName || "___"} // Ensure bankName (label) is used
                notRounded
                logo={logo}
              />
            </div>
          )}
          <div className="custom-flex-col max-w-[436px] gap-4">
            {(showCard || !bankNotAvailable) && (
              <div className="flex items-center gap-2">
                <Picture src={DangerIcon} alt="danger" size={24} />
                <p className="text-text-label text-xs font-normal">
                  It is advisable to use a bank account name that matches the
                  registered name of your company.
                </p>
              </div>
            )}
          </div>
        </div>
        {edit && (
          <div className="flex justify-end gap-4">
            <Button
              size="base_bold"
              className="py-[10px] px-8"
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>
        )}
        {!edit && (
          <SettingsUpdateButton
            type="otp"
            text="Update"
            loading={reqLoading}
            action={handleAddBank}
            next={next}
          />
        )}
      </div>
    </SettingsSection>
  );
};

export default CompanyBankSettings;
