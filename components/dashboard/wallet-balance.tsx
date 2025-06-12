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
import { Modal, ModalContent, ModalTrigger, useModal } from "../Modal/modal";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";
import useFetch from "@/hooks/useFetch";
import { useWalletStore } from "@/store/wallet-store";
import {
  WalletDataResponse,
  transformBeneficiaries,
} from "@/app/(nav)/wallet/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { useTourStore } from "@/store/tour-store";
import { usePathname } from "next/navigation";
import CautionDepositModal from "../Modal/caution-deposit-modal";

const WalletBalanceCard: React.FC<walletBalanceCardProps> = ({
  noHeader,
  className,
}) => {
  const { goToStep, restartTour } = useTourStore();
  const pathname = usePathname();
  const walletPinStatus = useWalletStore((s) => s.walletPinStatus);
  const balance = useWalletStore((s) => s.balance);
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const [hideBalance, setHideBalance] = useState(true);

  const hideWalletBalance = () => {
    setHideBalance((prevHideBalance) => {
      const newHideBalance = !prevHideBalance;
      saveLocalStorage("hideBalance", newHideBalance);
      return newHideBalance;
    });
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

  const { data, error, refetch } =
    useFetch<WalletDataResponse>("/wallets/dashboard");

  useRefetchOnEvent("refetch-wallet", () => {
    refetch({ silent: true });
  });

  useEffect(() => {
    if (data) {
      // console.log("data", data)
      if (data.transactions.length > 0) {
        const recentTransactions = data.transactions.map((t) => {
          // Parse the date and time strings into a Date object (assuming UTC from server)
          const dateTimeString = `${t.date}T${t.time}Z`; // Add 'Z' to indicate UTC
          const serverDateTime = new Date(dateTimeString);

          // Get the user's time zone (replace with your actual method)
          const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //Gets from browser

          // Convert to user's local time
          const localDateTime = new Date(
            serverDateTime.toLocaleString("en-US", { timeZone: userTimeZone })
          );

          // Format the date and time as needed
          const formattedDate = localDateTime.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });
          const formattedTime = localDateTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });

          return {
            ...t,
            date: formattedDate,
            time: formattedTime,
            amount:
              currencySymbols.naira +
              formatNumber(t.amount, { forceTwoDecimals: true }),
          };
        });

        const transactions = data.transactions.map((t) => {
          return {
            id: t.id,
            source: t.source,
            description: t.description,
            date: t.date,
            time: t.time,
            amount: t.amount,
            type: t.type,
            status: t.status,
            transaction_type: t.transaction_type,
          };
        });
        setWalletStore("recentTransactions", recentTransactions);
        setWalletStore("transactions", transactions);
      }
      setWalletStore("walletPinStatus", data.balance.pin_status);
      setWalletStore("walletId", data.balance.wallet_id);
      setWalletStore("id", data.balance.id);
      setWalletStore("balance", {
        my_balance: data.balance.my_balance,
        caution_deposit: data.balance.escrow_balance,
        earned_bonus: data.balance.earned_bonus,
      });
      setWalletStore(
        "beneficiaries",
        transformBeneficiaries(data.beneficiaries)
      );
      setWalletStore("stats", data.stats);
      setWalletStore("account", {
        account_number: data.account.account_number,
        account_name: data.account.account_name,
        bank: data.account.bank,
        customer_code: data.account.customer_code,
      });
    }
  }, [data, setWalletStore]);

  useEffect(() => {
    const storedHideBalance = getLocalStorage("hideBalance");
    if (storedHideBalance !== null && storedHideBalance !== undefined) {
      setHideBalance(storedHideBalance);
    }
  }, []);

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
            {hideBalance
              ? "*******"
              : `${currencySymbols.naira} ${formatNumber(balance.my_balance, {
                  forceTwoDecimals: true,
                })}`}
          </p>
          <div className="text-white text-xs font-medium capitalize flex items-center space-x-1">
            <p className="text-text-white-secondary ">caution deposit</p>
            <span className="text-white ml-2">
              {hideBalance
                ? "*******"
                : `${currencySymbols.naira} ${formatNumber(
                    balance.caution_deposit,
                    {
                      forceTwoDecimals: true,
                    }
                  )}`}
            </span>
            <Modal>
              <ModalTrigger>
                <CautionIcon />
              </ModalTrigger>
              <ModalContent>
                <CautionDepositModal />
              </ModalContent>
            </Modal>
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
                <div
                  className="space-y-2 opacity-50 cursor-not-allowed"
                  key={index}
                >
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
      {/* {error && <p className="text-red-500 text-sm">{error}</p>} */}
    </div>
  );
};

export default WalletBalanceCard;
