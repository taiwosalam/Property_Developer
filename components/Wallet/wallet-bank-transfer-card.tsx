// Imports
import clsx from "clsx";
import Button from "../Form/Button/button";
import { WalletFundsCardsHeading } from "./wallet-components";
import { useWalletStore } from "@/store/wallet-store";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";
import { useEffect } from "react";
import useFetch from "@/hooks/useFetch";

const WalletBankTransferCard = () => {
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const { data, error, refetch } =
    useFetch<WalletDataResponse>("/wallets/dashboard");

  useEffect(() => {
    if (data) {
      setWalletStore("account", {
        account_number: data.account.account_number,
        account_name: data.account.account_name,
        bank: data.account.bank,
        customer_code: data.account.customer_code,
      });
    }
  }, [data]);

  const account = useWalletStore((state) => state.account);

  const handleCopy = () => {
    navigator.clipboard.writeText(account.account_number);
  };

  return (
    <div
      className={clsx(
        "p-[18px] rounded-2xl overflow-hidden bg-neutral-2 dark:bg-darkText-primary dark:border dark:border-[#3C3D37] custom-flex-col gap-2"
      )}
    >
      <WalletFundsCardsHeading
        title="bank transfer"
        desc="You can perform bank transfers of any amount to add funds directly to your wallet. This service is free, apart from normal bank charges depending on your banking systems."
      />
      <div className="flex justify-between text-text-disabled text-sm font-medium">
        <div className="custom-flex-col gap-[2px]">
          <p className="dark:text-white">{account.bank}</p>
          <p className="text-text-quaternary dark:text-darkText-1">
            {account.account_name}
          </p>
        </div>
        <div className="custom-flex-col gap-[2px]">
          <p className="dark:text-white">Account Number</p>
          <p className="text-brand-primary">{account.account_number}</p>
        </div>

        <div className="flex items-end">
          <Button size="xs_medium" className="py-1 px-2" onClick={handleCopy}>
            Copy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletBankTransferCard;
