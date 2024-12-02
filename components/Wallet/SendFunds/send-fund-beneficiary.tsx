"use client";

// Images
import TickDefault from "@/public/icons/tick-default.svg";
// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { currencySymbols } from "@/utils/number-formatter";

const SendFundBeneficiary: React.FC<{
  picture: string;
  name: string;
  wallet_id: string;
}> = ({ picture, name, wallet_id }) => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="custom-flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center">
            <Picture src={picture} alt="profile picture" size={60} rounded />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <p className="text-[#010A23] dark:text-white text-base font-medium capitalize">
                {name}
              </p>
              <BadgeIcon color="red" />
            </div>
            <p className="text-[#606060] dark:text-darkText-1 text-sm font-normal">
              Wallet ID: {wallet_id}
            </p>
          </div>
        </div>
        <div className="h-[1px] border border-dashed border-brand-9"></div>
        <div className="custom-flex-col gap-4">
          <Input
            id="amount"
            label="amount"
            CURRENCY_SYMBOL={currencySymbols.naira}
          />
          <Input
            id="description"
            label="description"
            placeholder="Description"
          />
        </div>
        <button className="flex items-center justify-between">
          <p className="text-text-tertiary dark:text-darkText-1 text-sm font-normal">
            Save as beneficiary
          </p>
          <Picture src={TickDefault} alt="tick" size={20} />
        </button>
      </div>
      <Button size="sm_medium" className="py-2 px-8">
        send
      </Button>
    </div>
  );
};

export default SendFundBeneficiary;
