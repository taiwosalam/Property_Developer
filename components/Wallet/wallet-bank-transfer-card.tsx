import React from "react";

// Types
import type { WalletBankTransferCardProps } from "./types";

// Imports
import clsx from "clsx";
import Button from "../Form/Button/button";
import { WalletFundsCardsHeading } from "./wallet-components";

const WalletBankTransferCard: React.FC<WalletBankTransferCardProps> = ({
  proceed,
  cantInteract,
}) => {
  return (
    <div
      className={clsx(
        "p-[18px] rounded-2xl overflow-hidden bg-neutral-2 custom-flex-col gap-2",
        {
          "pointer-events-none opacity-50": cantInteract,
        }
      )}
    >
      <WalletFundsCardsHeading
        title="bank transfer"
        desc="You can perform bank transfers of any amount to add funds directly to your wallet. This service is free, apart from normal bank charges depending on your banking systems."
      />
      <div className="flex justify-between text-text-disabled text-sm font-medium">
        <div className="custom-flex-col gap-[2px]">
          <p>Zenith Bank</p>
          <p className="text-text-quaternary">
            Taiwo Salam & Co. Properties Ltd
          </p>
        </div>
        <div className="custom-flex-col gap-[2px]">
          <p>Account Number</p>
          <p className="text-brand-primary">1211265949</p>
        </div>
        {!cantInteract && (
          <div className="flex items-end">
            <Button onClick={proceed} size="xs_medium" className="py-1 px-2">
              proceed
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletBankTransferCard;
