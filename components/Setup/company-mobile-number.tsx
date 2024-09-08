// Imports
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import { SectionHeading } from "../Section/section-components";

const CompanyMobileNumber = () => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="Company Mobile Number">
        Please provide a valid phone number as it is essential for the company
        profile.
      </SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1300px]">
        {Array.from({ length: 4 }).map((_, index: number) => (
          <PhoneNumberInput
            key={index}
            id={`company_phone${index === 0 ? "" : `${index + 1}`}`}
            placeholder="800 0000 000"
            inputClassName="setup-f custom-phone-input"
            inputContainerClassName="font-normal rounded-[8px] hover:outline outline-1 outline-auto outline-[#00000099] focus-within:outline focus-within:outline-[#0033c4] focus-within:outline-2 !text-xs md:!text-sm font-normal"
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyMobileNumber;
