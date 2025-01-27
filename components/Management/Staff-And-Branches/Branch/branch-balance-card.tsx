"use client";

// Images
import WalletBG from "@/public/global/wallet-bg.svg";

// Imports
import clsx from "clsx";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { ChevronRight, Eye, EyeOff } from "lucide-react";
import {
  BluePlusIcon,
  BlueBuildingIcon,
  BlueLockIcon,
  CheckIcon,
  BlueUnlockIcon,
} from "@/public/icons/dashboard-cards/icons";
import { CautionIcon } from "@/public/icons/icons";
import { useWalletStore } from "@/store/wallet-store";
import AddFundsModal from "@/components/Wallet/AddFunds/add-funds-modal";
import ActivateWalletModal from "@/components/Wallet/activate-wallet-modal";
import WithdrawFundsModal from "@/components/Wallet/Withdraw/withdraw-funds-modal";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import useBranchStore from "@/store/branch-store";
import { toast } from "sonner";
import { holdBranchWallet } from "@/app/(nav)/management/staff-branch/[branchId]/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const BranchBalanceCard = ({
  mainBalance,
  cautionDeposit,
  className,
}: {
  mainBalance: number;
  cautionDeposit: number;
  className?: string;
}) => {
  const walletPinStatus = useWalletStore((s) => s.sub_wallet.status);
  const is_active = useWalletStore((s) => s.sub_wallet.is_active);
  const [hideBalance, setHideBalance] = useState(false);
  const [loading, setLoading] = useState(false)
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const { branch } = useBranchStore()

  const { data, error, refetch } =
    useFetch<WalletDataResponse>("/wallets/dashboard");
    useRefetchOnEvent("refetch-wallet", () => {
      refetch({ silent: true });
    });  

  useEffect(() => {
    if (data) {
      setWalletStore("balance", {
        my_balance: data.balance.my_balance,
        caution_deposit: data.balance.escrow_balance,
        earned_bonus: data.balance.earned_bonus,
      });
    }
  }, [data,setWalletStore])

  const options = [
    {
      name: walletPinStatus === "active" ? "Add Funds" : "Activate Wallet",
      icon: walletPinStatus === "active" ? <BluePlusIcon /> : <CheckIcon />,
      action: walletPinStatus === "active" ? <AddFundsModal branch /> : <ActivateWalletModal />,
    },
    {
      name: "Withdraw",
      icon: <BlueBuildingIcon />,
      action: walletPinStatus === "active" ? <WithdrawFundsModal branch={true} /> : null,
    },
    {
      name: walletPinStatus === "active" && is_active ? "Hold Wallet" : "UnHold Wallet",
      icon: walletPinStatus === "active" && is_active ? <BlueUnlockIcon /> : <BlueLockIcon />,
    },
  ];

  useEffect(() => {
    const storedHideBalance = localStorage.getItem("hideBalance");
    if (storedHideBalance !== null) {
      setHideBalance(JSON.parse(storedHideBalance));
    }
  }, []);

  const toggleBalanceVisibility = () => {
    setHideBalance((prev) => {
      const newHideBalance = !prev;
      localStorage.setItem("hideBalance", JSON.stringify(newHideBalance));
      return newHideBalance;
    });
  };


  const handleHoldWallet = async ()=> {
    try{
      setLoading(true)
      const res = await holdBranchWallet(branch.branch_id)
      if (res) {
        toast.success("Branch Wallet Hold Successfully")
        window.dispatchEvent(new Event("refetch-wallet"));
        window.dispatchEvent(new Event("refetch_staff"));
      }
    }catch{
      toast.error("Failed to Hold Branch Wallet")
    }finally {
      setLoading(false)
    }
  }

  return (
    <div className={clsx("space-y-2", className)}>
      <div className="p-5 relative custom-primary-bg rounded-lg">
        <div className="absolute inset-0">
          <Image
            src={WalletBG}
            alt="wallet background"
            fill
            sizes="400px"
            className="object-cover"
          />
        </div>
        <div className="relative space-y-3">
          {/* Header Section */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <p className="text-text-invert text-sm font-medium">
                Branch Balance
              </p>
              <button onClick={toggleBalanceVisibility} className="">
                {hideBalance ? (
                  <Eye size={15} className="text-text-invert" />
                ) : (
                  <EyeOff size={15} className="text-text-invert" />
                )}
              </button>
            </div>
          </div>

          {/* Main Balance */}
          {walletPinStatus === "active" ? (
            <p className="font-extrabold text-xl text-white">
              {hideBalance
                ? "*******"
                : `${currencySymbols.naira} ${formatNumber(mainBalance, {
                  forceTwoDecimals: true,
                })}`}
            </p>
          ) : (
            <p className="font-extrabold text-xl text-white">
              Inactive
            </p>
          )}

          {/* Caution Deposit Section */}
          <div className="text-white text-xs font-medium capitalize flex items-center space-x-2">
            <p className="text-text-white-secondary">Caution Deposit</p>
            {walletPinStatus === "active" ? (
              <span>
                {!hideBalance
                  ? `${currencySymbols.naira} ${formatNumber(
                    cautionDeposit,
                    {
                      forceTwoDecimals: true,
                    }
                  )}`
                  : "*******"}
              </span>
            ) : (
              <span>Inactive</span>
            )}
            <CautionIcon />
          </div>

          <div className="w-full flex items-start space-x-4">
            <div className="w-full flex justify-between">
              {options.map((option, index) => {
                return option.action && walletPinStatus === "active" ? (
                  <Modal 
                    key={index}
                  >
                    <ModalTrigger className="space-y-2">
                      <div className={`bg-white ${!is_active && "opacity-50 cursor-not-allowed"} dark:bg-darkText-1 w-[30px] h-[30px] rounded-full flex items-center justify-center mx-auto`}>
                        <span className="text-brand-9">{option.icon}</span>
                      </div>
                      <p className="capitalize text-white dark:text-white text-xs font-normal">
                        {option.name}
                      </p>
                    </ModalTrigger>
                   {is_active && <ModalContent>{option.action}</ModalContent>}
                  </Modal>
                ) : (
                  option.name === "Activate Wallet" ? (
                    <Link
                      href={`/management/staff-branch/${branch.branch_id}/edit-branch`}
                      className={`space-y-2 ${option.name === "Activate Wallet" ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
                      key={index}
                    >
                      <div className="bg-white dark:bg-darkText-1 w-[30px] h-[30px] rounded-full flex items-center justify-center mx-auto">
                        <span className="text-brand-9 ">{option.icon}</span>
                      </div>
                      <p className="capitalize text-white dark:text-white text-xs font-normal">
                        {option.name}
                      </p>
                    </Link>
                  ) : (
                    <button
                      className={`space-y-2 ${option.name === "Hold Wallet" || option.name === "UnHold Wallet" && walletPinStatus === "active" ? "opacity-100" : "opacity-50 cursor-not-allowed"}`}
                      key={index}
                      type="button"
                      onClick={handleHoldWallet}
                    >
                      <div className="bg-white dark:bg-darkText-1 w-[30px] h-[30px] rounded-full flex items-center justify-center mx-auto">
                        {loading ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-9"></div>
                        ) : (
                          <span className="text-brand-9 ">{option.icon}</span>
                        )}
                      </div>
                      <p className="capitalize text-white dark:text-white text-xs font-normal">
                        {option.name}
                      </p>
                    </button>
                  )
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchBalanceCard;
