"use client";

import SettingsSection from "./settings-section";
import { SettingsSectionTitle, SettingsUpdateButton } from "./settings-components";
import Input from "@/components/Form/Input/input";
import Select from "../Form/Select/select";
import { Check } from "lucide-react";
import FundingCard from "../Wallet/AddFunds/funding-card";
import Picture from "../Picture/picture";
import DangerIcon from "@/public/icons/danger.svg";
import { lookupBankDetails } from "@/app/(nav)/management/landlord/[landlordId]/manage/edit/data";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import "nigerian-bank-icons/index.css";
import BankLogo from "./bankLogo";
import useBankLogo from "@/app/(nav)/bank";

const SettingsBank = () => {
    const [reqLoading, setReqLoading] = useState(false);
    const [bankName, setBankName] = useState("");
    const [bankCode, setBankCode] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [accountName, setAccountName] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const [lookupLoading, setLookupLoading] = useState(false);
    const {
      data: bankList,
      loading: bankListLoading,
      error: bankListError,
    } = useFetch<{
      data: { bank_name: string; bank_code: string }[];
    }>("bank/bank-list");

    
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
    
    const slug = bankName?.toLowerCase().replace(/\s+/g, '-');
    const logo = useBankLogo({ slug }) || "/icons/default-bank.svg";
    console.log("Name", logo);
    
    return (
        <SettingsSection title="Bank Details">
            <div className="custom-flex-col gap-8">
                <SettingsSectionTitle
                    title="Bank Account For Withdrawal"
                    desc="A bank account for wallet withdrawal is the account linked to your wallet, allowing you to transfer funds from your digital wallet directly to your bank."
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-end">
                    <Select
                        id="bank_name"
                        label="bank name"
                        inputContainerClassName="w-full bg-neutral-2"
                        options={
                            bankList?.data.map((bank) => ({
                              value: bank.bank_code,
                              label: bank.bank_name,
                            })) || []
                          }
                          placeholder={
                            bankListLoading
                              ? "Loading bank list..."
                              : bankListError
                              ? "Error loading bank list"
                              : "Select bank"
                          }
                          value={bankName}
                          error={bankListError}
                          onChange={(value) => {
                            setBankCode(value);
                            setIsVerified(false);
                            setAccountName("");
                            const selectedBank = bankList?.data.find(
                              (bank) => String(bank.bank_code) === value
                            );
                            setBankName(selectedBank?.bank_name || "");
                          }}
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
                   {accountName && 
                   <div className="h-[45px] px-6 flex gap-[18px] items-center bg-status-success-1">
                        <div className="w-4 h-4 pt-[1px] rounded-full flex items-center justify-center bg-status-success-primary">
                            <Check size={10} color="white" />
                        </div>
                        <p className="text-status-success-primary text-xs font-normal capitalize truncate">
                         {accountName}
                        </p>
                    </div>
                    }
                </div>
                <div className="flex">
                    <div className="custom-flex-col max-w-[436px]  gap-4">
                        <FundingCard
                            type="sterling"
                            title={accountNumber || "___"}
                            desc={accountName || "___"}
                            cta={bankName || "___"}
                            notRounded
                            logo={logo}
                        />
                        <div className="flex items-center gap-2">
                            <Picture src={DangerIcon} alt="danger" size={24} />
                            <p className="text-text-label text-xs font-normal">
                            It is advisable to use a bank account name that matches the registered name of your company.
                            </p>
                        </div>
                    </div>
                </div>
                <SettingsUpdateButton 
                type="otp" 
                loading={false}
                />
            </div>
        </SettingsSection>
    )
}

export default SettingsBank