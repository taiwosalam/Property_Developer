import React from "react";

// Imports
import Input from "../Form/Input/input";
import { SectionHeading } from "../Section/section-components";

const CompanyMobileNumber = () => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company mobile number">
        Please provide a valid phone number as it is essential for the company
        profile.
      </SectionHeading>
      <div className="flex gap-5">
        <Input id="number" placeholder="08065558146" className="flex-1" />
        <Input id="number" placeholder="08065558146" className="flex-1" />
        <Input id="number" placeholder="08065558146" className="flex-1" />
        <Input id="number" placeholder="08065558146" className="flex-1" />
      </div>
    </div>
  );
};

export default CompanyMobileNumber;
