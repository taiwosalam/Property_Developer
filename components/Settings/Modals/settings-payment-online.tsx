import React from "react";

// Imports
import Button from "@/components/Form/Button/button";
import FundingCard from "@/components/Wallet/AddFunds/funding-card";

const SettingsPaymentOnline = () => {
  return (
    <div className="custom-flex-col gap-5">
      <Button size="sm_normal" className="py-2 px-8">
        Add (₦150,000)
      </Button>
      <FundingCard type="paystack" />
      <FundingCard type="flutterwave" />
      <FundingCard type="bank transfer" />
    </div>
  );
};

export default SettingsPaymentOnline;
