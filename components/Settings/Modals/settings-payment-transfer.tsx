import React from "react";

// Types
import type { SettingsPaymentTransferProps } from "../types";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import WalletBankTransferCard from "@/components/Wallet/wallet-bank-transfer-card";

const SettingsPaymentTransfer: React.FC<SettingsPaymentTransferProps> = ({
  limitFields,
}) => {
  return (
    <div className="custom-flex-col gap-6">
      <WalletBankTransferCard cantInteract />
      <div className="custom-flex-col gap-6">
        <div className="custom-flex-col gap-1">
          <p className="text-text-primary text-sm font-medium">
            Sender&apos;s Details
          </p>
          <p className="text-[#606060] text-sm font-normal">
            Input account name and date of transaction Sent.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
          <Input
            id="account-name"
            placeholder="Account Name"
            style={{ backgroundColor: "white" }}
          />
          <Input id="date" type="date" style={{ backgroundColor: "white" }} />

          {!limitFields && (
            <>
              <Input
                id="user-id"
                placeholder="User ID"
                style={{ backgroundColor: "white" }}
              />
              <Input
                id="amount"
                placeholder="₦"
                style={{ backgroundColor: "white" }}
              />
            </>
          )}
        </div>
        <Button size="sm_medium" className="py-2 px-8">
          confirm
        </Button>
      </div>
    </div>
  );
};

export default SettingsPaymentTransfer;
