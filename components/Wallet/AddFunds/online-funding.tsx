import React from "react";

// Imports
import FundingCard from "./funding-card";
import Button from "@/components/Form/Button/button";

const OnlineFunding = () => {
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

export default OnlineFunding;
