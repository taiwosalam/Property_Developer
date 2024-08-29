import React from "react";

// Imports
import PhoneNumberInput from "../Form/PhoneNumber/phone-number";
import {
  SectionHeading,
  SectionSeparator,
} from "../Section/section-components";

interface CompanyMobileNumberProps {
  companyMobileNumber: string[];
  onChange: (index: number, value: string) => void;
}

const CompanyMobileNumber: React.FC<CompanyMobileNumberProps> = ({
  companyMobileNumber,
  onChange,
}) => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company mobile number">
        Please provide a valid phone number as it is essential for the company
        profile.
        {/* <SectionSeparator className="max-w-[1200px] mt-1.5" /> */}
      </SectionHeading>
      <div className="flex gap-5">
        {companyMobileNumber.map((number, index: number) => (
          <PhoneNumberInput
            key={index}
            id={`number-${index}`}
            placeholder="800 0000 000"
            value={number} // Set the value to the corresponding phone number
            className="flex-1 max-w-[300px]"
            inputTextStyles={`text-sm font-normal ${
              number === "" ? "bg-transparent" : ""
            }`}
            onChange={(value) => onChange(index, value)} // Handle change for each phone number
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyMobileNumber;
