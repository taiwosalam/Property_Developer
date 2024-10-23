import React from "react";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import WalletBankTransferCard from "../wallet-bank-transfer-card";
import useDarkMode from "@/hooks/useCheckDarkMode";

const AddFund = () => {
  const isDarkMode = useDarkMode()
  return (
    <div className="custom-flex-col gap-6">
      <WalletBankTransferCard cantInteract />
      <div className="custom-flex-col gap-6">
        <div className="custom-flex-col gap-1">
          <p className="text-text-primary dark:text-white text-sm font-medium">
            Sender&apos;s Details
          </p>
          <p className="text-[#606060] dark:text-darkText-1 text-sm font-normal">
            Input account sender name, date of transaction, wallet ID and Amount
            Sent.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <Input
            id="account-name"
            placeholder="Account Name"
             style={{ backgroundColor: isDarkMode ? 'black' : "white" }} 
          />
          <Input id="date" type="date" style={{ backgroundColor: isDarkMode ? 'black' : "white" }} />
          <Input
            id="wallet-id"
            placeholder="Wallet ID"
             style={{ backgroundColor: isDarkMode ? 'black' : "white" }} 
          />
          <Input
            id="amount"
            placeholder="₦"
             style={{ backgroundColor: isDarkMode ? 'black' : "white" }} 
          />
        </div>
        <Button size="sm_medium" className="py-2 px-8">
          confirm
        </Button>
      </div>
    </div>
  );
};

export default AddFund;
