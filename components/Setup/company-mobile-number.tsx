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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1300px]">
        {Array.from({ length: 4 }).map((_, index: number) => (
          <PhoneNumberInput
            key={index}
            id={`${index === 0 ? "company_phone" : `phone-number-${index}`}`}
            placeholder="800 0000 000"
            inputTextStyles={`text-xs md:text-sm font-normal setup-f`}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyMobileNumber;
