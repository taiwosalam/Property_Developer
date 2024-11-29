"use client";

// Types
import type { walletBalanceCardProps } from "./types";

// Images
import WalletBG from "@/public/global/wallet-bg.svg";
import { saveLocalStorage, getLocalStorage } from "@/utils/local-storage";
// Imports
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import SVG from "../SVG/svg";
import { Eye, EyeOff } from "lucide-react";
import {
  BluePlusIcon,
  BlueBuildingIcon,
  BlueSendIcon,
  CheckIcon,
} from "@/public/icons/dashboard-cards/icons";
import { CautionIcon } from "@/public/icons/icons";
import AddFundsModal from "../Wallet/AddFunds/add-funds-modal";
import ActivateWalletModal from "../Wallet/activate-wallet-modal";
import SendFundsModal from "../Wallet/SendFunds/send-funds-modal";
import WithdrawFundsModal from "../Wallet/Withdraw/withdraw-funds-modal";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { useAuthStore } from "@/store/authStore";

const WalletBalanceCard: React.FC<walletBalanceCardProps> = ({
  mainBalance,
  cautionDeposit,
  className,
  noHeader,
  ...props
}) => {
  const walletPinStatus = useAuthStore((state) => state.walletPinStatus);
  const [hideBalance, setHideBalance] = useState(false);
  const balance = walletPinStatus ? mainBalance : 0;
  const deposit = walletPinStatus ? cautionDeposit : 0;

  useEffect(() => {
    const storedHideBalance = getLocalStorage("hideBalance");
    if (storedHideBalance !== null && storedHideBalance !== undefined) {
      setHideBalance(storedHideBalance);
    }
  }, []);

  const hideWalletBalance = () => {
    setHideBalance((prevHideBalance) => {
      const newHideBalance = !prevHideBalance;
      saveLocalStorage("hideBalance", newHideBalance);
      return newHideBalance;
    });
  };

  const formatNumber = (number: number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const options = [
    {
      name: walletPinStatus ? "Add Funds" : "Activate Wallet",
      icon: walletPinStatus ? <BluePlusIcon /> : <CheckIcon />,
      action: walletPinStatus ? <AddFundsModal /> : <ActivateWalletModal />,
    },
    {
      name: "Send Funds",
      icon: <BlueSendIcon />,
      action: walletPinStatus ? <SendFundsModal /> : null,
    },
    {
      name: "Withdraw",
      icon: <BlueBuildingIcon />,
      action: walletPinStatus ? <WithdrawFundsModal /> : null,
    },
  ];

  return (
    <div className={clsx("space-y-2", className)}>
      {!noHeader && (
        <div className="w-full flex items-center justify-between font-normal">
          <p className="text-[#262626] text-sm dark:text-darkText-1">Wallet</p>
          <Link
            href="/wallet/transaction-history"
            className="text-[#4F5E71] text-xs flex items-center dark:text-darkText-1"
          >
            <p>Transaction History</p>
            <SVG type="right_arrow" className="ml-2" />
          </Link>
        </div>
      )}
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
          <div className="flex items-center gap-1 text-white opacity-95 font-normal text-sm">
            <p className="text-text-white-secondary text-sm font-medium">
              Balance
            </p>
            <button onClick={hideWalletBalance} type="button">
              {hideBalance ? (
                <span className="text-white">
                  <Eye size={12} />
                </span>
              ) : (
                <span className="text-white">
                  <EyeOff size={12} />
                </span>
              )}
            </button>
          </div>
          <p className="font-medium text-xl text-white">
            {hideBalance ? "*******" : "₦ " + formatNumber(balance)}
          </p>
          <div className="text-white text-xs font-medium capitalize flex items-center space-x-1">
            <p className="text-text-white-secondary ">caution deposit</p>
            <span className="text-white ml-2">
              {hideBalance ? "*******" : "₦ " + formatNumber(deposit)}
            </span>
            <CautionIcon />
          </div>
          <div className="w-full flex justify-between">
            {options.map((option, index) => {
              return option.action ? (
                <Modal key={index}>
                  <ModalTrigger className="space-y-2">
                    <div className="bg-white dark:bg-darkText-1 w-[30px] h-[30px] rounded-full flex items-center justify-center mx-auto">
                      <span className="text-brand-9 ">{option.icon}</span>
                    </div>
                    <p className="capitalize text-white dark:text-white text-xs font-normal">
                      {option.name}
                    </p>
                  </ModalTrigger>
                  <ModalContent>{option.action}</ModalContent>
                </Modal>
              ) : (
                <div className="space-y-2 opacity-50 cursor-not-allowed">
                  <div className="bg-white dark:bg-darkText-1 w-[30px] h-[30px] rounded-full flex items-center justify-center mx-auto">
                    <span className="text-brand-9 ">{option.icon}</span>
                  </div>
                  <p className="capitalize text-white dark:text-white text-xs font-normal">
                    {option.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletBalanceCard;
