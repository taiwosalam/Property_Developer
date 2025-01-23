// Imports
import PhoneNumberInput from "../Form/PhoneNumberInput/phone-number-input";
import { SectionHeading } from "../Section/section-components";

const CompanyMobileNumber: React.FC<{ phoneNumbers?: string[] }> = ({
  phoneNumbers,
}) => {
  // console.log("phoneNumbers", phoneNumbers);
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
            id={`phone_number_${index + 1}`}
            placeholder="800 0000 000"
            inputClassName="setup-f"
            defaultValue={phoneNumbers?.[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default CompanyMobileNumber;
