import React from "react";

// Images
import TickDefault from "@/public/icons/tick-default.svg";

import Avatar2 from "@/public/empty/avatar-2.svg";

// Imports
import Input from "@/components/Form/Input/input";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const SendFundBeneficiary = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="custom-flex-col gap-4">
        <div className="flex flex-col items-center gap-2">
          <div className="flex justify-center">
            <Picture src={Avatar2} alt="profile picture" size={60} rounded />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center">
              <p className="text-[#010A23] text-base font-medium capitalize">
                David Ajala
              </p>
              <BadgeIcon color="red" />
            </div>
            <p className="text-[#606060] text-sm font-normal">
              Wallet ID: 1234567890
            </p>
          </div>
        </div>
        <div className="h-[1px] border border-dashed border-brand-9"></div>
        <div className="custom-flex-col gap-4">
          <Input
            id="amount"
            label="amount"
            placeholder="₦"
            style={{ backgroundColor: "white" }}
          />
          <Input
            id="description"
            label="description"
            placeholder="Description"
            style={{ backgroundColor: "white" }}
          />
        </div>
        <button className="flex items-center justify-between">
          <p className="text-text-tertiary text-sm font-normal">
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
