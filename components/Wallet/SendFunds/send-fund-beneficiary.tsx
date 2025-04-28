"use client";

// Imports
import { useEffect, useState } from "react";
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import { useWalletStore, type Beneficiary } from "@/store/wallet-store";
import { AuthPinField } from "@/components/Auth/auth-components";
import { useModal } from "@/components/Modal/modal";
import {
  addBeneficiary,
  branchFundWallet,
  transferFunds,
} from "@/components/Wallet/data";
import { empty } from "@/app/config";
import { toast } from "sonner";
import useBranchStore from "@/store/branch-store";
import { ArrowLeftIcon } from "@/public/icons/icons";

const SendFundRecipient: React.FC<Omit<Beneficiary, "id">> = ({
  picture,
  name,
  wallet_id,
  badge_color,
  branch,
  noBackBtn,
}) => {
  const { setIsOpen } = useModal();
  const balance = useWalletStore((s) => s.balance);
  const { branch: branchData } = useBranchStore();
  const [activeStep, setActiveStep] = useState<"send funds" | "confirm pin">(
    "send funds"
  );
  const [loading, setLoading] = useState(false);
  const [pin, setPin] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [saveAsBeneficiary, setSaveAsBeneficiary] = useState(false);
  const my_wallet_id = useWalletStore((state) => state.walletId);
  const beneficiaries = useWalletStore((state) => state.beneficiaries);
  const isAlreadyBeneficiary = beneficiaries.some(
    (beneficiary) => beneficiary.wallet_id === wallet_id
  );
  const handleClickSend = async () => {
    if (activeStep === "send funds") {
      if (!description) {
        toast.warning("Please enter a description");
        return;
      }
      if (!(amount > 0)) {
        toast.warning("Please enter an amount");
        return;
      }
      if (branch && amount > Number(balance.my_balance)) {
        toast.warning("Insufficient balance");
        return;
      }
      setActiveStep("confirm pin");
    } else {
      if (pin.length !== 4) {
        toast.warning("Please enter your PIN");
        return;
      }
      setLoading(true);
      const action = branch
        ? branchFundWallet(branchData.branch_id, { amount, pin, description })
        : transferFunds(wallet_id, amount, description, pin);
      const status = await action;
      if (status) {
        setIsOpen(false);
        if (!isAlreadyBeneficiary && saveAsBeneficiary && my_wallet_id) {
          await addBeneficiary(wallet_id, my_wallet_id, {
            noToast: true,
          });
        }
        if (branch) {
          toast.success("Branch Wallet Funded Successfully");
          window.dispatchEvent(new Event("refetch-wallet"));
          // window.dispatchEvent(new Event("refetch-wallet"));
        }
        window.dispatchEvent(new Event("refetch_staff"));
      }
      setLoading(false);
    }
  };

  return (
    <div className="custom-flex-col gap-8">
      {activeStep === "send funds" ? (
        <div className="custom-flex-col gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="flex justify-center">
              <Picture
                src={picture || empty}
                alt="profile picture"
                size={60}
                rounded
              />
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <p className="text-[#010A23] dark:text-white text-base font-medium capitalize">
                  {name}
                </p>
                {/* FIX BADGE LATER */}
                {/* {badge_color && <BadgeIcon color={badge_color} />} */}
              </div>
              <p className="text-[#606060] dark:text-darkText-1 text-sm font-normal">
                Wallet ID: {wallet_id}
              </p>
            </div>
          </div>
          {branch && (
            <div className="flex items-center justify-between w-full">
              <p className="text-[#010A23] dark:text-white text-base font-medium capitalize">
                Company Balance
              </p>
              <p>
                {`${currencySymbols.naira} ${formatNumber(balance.my_balance, {
                  forceTwoDecimals: true,
                })}`}
              </p>
            </div>
          )}
          <div className="h-[1px] border border-dashed border-brand-9"></div>
          <div className="custom-flex-col gap-4">
            <Input
              id="amount"
              label="amount"
              CURRENCY_SYMBOL={currencySymbols.naira}
              formatNumber
              required
              onChange={(value) => {
                setAmount(parseFloat(value.replace(/,/g, "")));
              }}
            />
            <Input
              id="description"
              label="description"
              placeholder="Description"
              value={description}
              maxLength={100}
              required
              onChange={setDescription}
            />
          </div>
          {!isAlreadyBeneficiary && !branch && (
            <Checkbox
              radio
              className="flex-row-reverse justify-between"
              checked={saveAsBeneficiary}
              onChange={setSaveAsBeneficiary}
            >
              Save as beneficiary
            </Checkbox>
          )}
        </div>
      ) : (
        <div className="custom-flex-col gap-8">
          {!noBackBtn && (
            <button
              onClick={() => setActiveStep("send funds")}
              className="w-6 h-6 flex gap-2 items-center justify-start text-brand-9"
            >
              <ArrowLeftIcon />
              Back
            </button>
          )}
          <p className="text-center">Please enter your PIN to confirm.</p>
          <AuthPinField onChange={setPin} key="confirm-pin" />
        </div>
      )}
      <Button
        size="sm_medium"
        className="py-2 px-8"
        onClick={handleClickSend}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
};

export default SendFundRecipient;
