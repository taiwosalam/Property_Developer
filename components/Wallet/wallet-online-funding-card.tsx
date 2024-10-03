import React from "react";

// Types
import type { WalletOnlineFundingCardProps } from "./types";

// Imports
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import { WalletFundsCardsHeading } from "./wallet-components";

const WalletOnlineFundingCard: React.FC<WalletOnlineFundingCardProps> = ({
  proceed,
}) => {
  return (
    <div className="p-[18px] rounded-2xl overflow-hidden bg-neutral-2 custom-flex-col gap-2">
      <WalletFundsCardsHeading
        title="online funding"
        desc="We partner with a third party for wallet funding through any local ATM card. They apply a 1.5% VAT rate and ₦100 fee for each debit transaction. The fee is waived for transactions under ₦2500."
      />
      <div></div>
      <div className="custom-flex-col gap-6">
        <Input
          id="amount"
          placeholder="₦ 0.00"
          label="Input the amount you wish to deposit"
          inputClassName="bg-white"
          labelclassName="normal-case"
        />
        <div className="flex justify-end">
          <Button onClick={proceed} size="xs_medium" className="py-1 px-2">
            proceed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WalletOnlineFundingCard;
