import React from "react";

// Imports
import PhoneNumberInput from "../Form/PhoneNumber/phone-number";
import {
  SectionHeading,
  SectionSeparator,
} from "../Section/section-components";

const CompanyMobileNumber = () => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company mobile number">
        Please provide a valid phone number as it is essential for the company
        profile.
        {/* <SectionSeparator className="max-w-[1200px] mt-1.5" /> */}
      </SectionHeading>
      <div className="flex gap-5">
        {Array.from({ length: 4 }).map((_, index: number) => (
          <PhoneNumberInput
            key={index}
            id={`phone-number-${index}`}
            placeholder="800 0000 000"
            className="flex-1 max-w-[300px]"
            inputTextStyles={`text-sm font-normal`}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyMobileNumber;
