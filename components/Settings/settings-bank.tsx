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
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import "nigerian-bank-icons/index.css";
import BankLogo from "./bankLogo";
import useBankLogo from "@/app/(nav)/bank";
import { AuthForm } from "../Auth/auth-components";
import { toast } from "sonner";
import { useWalletStore } from "@/store/wallet-store";
import { sendWalletSecurityOTp } from "@/app/(nav)/settings/profile/data";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";
import { BankAPIResponse, BankPageData, transformBank } from "@/app/(nav)/settings/data";
import Button from "../Form/Button/button";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const SettingsBank = () => {
  const [reqLoading, setReqLoading] = useState(false);
  const [next, setNext] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const setWalletStore = useWalletStore((s) => s.setWalletStore)
  const [isVerified, setIsVerified] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [companyBankDetails, setCompanyBankDetails] = useState<BankPageData>({
    bank_name: "",
    account_name: "",
    account_number: "",
    bank_code: "",
  });
  const { bank_name, account_name, account_number, bank_code } = companyBankDetails
  const bankNotAvailable = bank_name === "" && account_name === ""  && account_number === ""  && bank_code === "";

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


  const { data:companyBank, error:companyBankError, refetch:refetchCompanyBank } =
  useFetch<BankAPIResponse>("/banks");
  useRefetchOnEvent("fetch-banks", () => refetchCompanyBank({ silent: true }));

  useEffect(() => {
    if(companyBank){
      const res = transformBank(companyBank);
      if(res){
        setCompanyBankDetails(res) 
        setEdit(true)
      }
    }
  }, [companyBank])

  useEffect(() => {
    // Sync API data with local states
    setBankName(bank_name || "");
    setBankCode(bank_code || "");
    setAccountNumber(account_number || "");
    setAccountName(account_name || "");
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

  const slug = bankName?.toLowerCase().replace(/\s+/g, '-');
  const logo = useBankLogo({ slug }) || "/icons/default-bank.svg";
  // console.log("Name", logo);

  const handleAddBank = async ()=> {
    if(!bankCode || !accountNumber || !accountName || !bankName) {
      toast.warning("Please fill in all bank details");
      return;
    }
    const payload = {
      bank_code: bankCode,
      account_number: accountNumber,
      account_name: accountName,
      bank_name: bankName,
    };

    try{
      setReqLoading(true);
      setWalletStore("bank_details", payload);
      console.log("Payload", payload)
      const walletid = {
        wallet_id: walletId as string
      }
      const res = await sendWalletSecurityOTp(walletid);
      if (res) {
        toast.success("Check Email For OTP");
        setNext(true)
      }
    } catch (err){
      toast.error("Failed to add bank details")
    } finally{
      setReqLoading(false)
    }
  }

const handleEdit = ()=> {
  setEdit(false);
  setOpenEdit(true);
}

  return (
    <SettingsSection title="Bank Details">
      <div className="custom-flex-col gap-8">
        <SettingsSectionTitle
          title="Bank Account For Withdrawal"
          desc="A bank account for wallet withdrawal is the account linked to your wallet, allowing you to transfer funds from your digital wallet directly to your bank."
        />
        {(bankNotAvailable || openEdit) &&  
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
          </div>}
           <div className="flex">
            <div className="custom-flex-col max-w-[436px]  gap-4">
             {(!bankNotAvailable || !openEdit) && 
             <FundingCard
                type="sterling"
                title={accountNumber || "___"}
                desc={accountName || "___"}
                cta={bankName || "___"}
                notRounded
                logo={logo}
              />}
            {!bankNotAvailable &&  <div className="flex items-center gap-2">
                <Picture src={DangerIcon} alt="danger" size={24} />
                <p className="text-text-label text-xs font-normal">
                  It is advisable to use a bank account name that matches the registered name of your company.
                </p>
              </div>}
            </div>
          </div>
          {edit && 
          <div className="flex justify-end gap-4">
          <Button size="base_bold" className="py-[10px] px-8" onClick={handleEdit}>
            Edit
          </Button>
          </div>}  
         {!edit && 
         <SettingsUpdateButton
            type="otp"
            // text={edit ? "Edit" : "Update"}
            loading={reqLoading}
            action={handleAddBank}
            next={next}
          />}
      </div>
    </SettingsSection>
  )
}

export default SettingsBank