// Imports
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/date-input";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import { industryOptions } from "@/data";
import { useState } from "react";

const CompanyDetails = () => {
  const [registrationDate, setRegistrationDate] = useState<Date | undefined>(
    undefined
  );
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company details">
        Kindly provide the following details below. Note your documents should
        be in PDF format and should not exceed 5mb.
      </SectionHeading>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
        <div>
          {/* Hidden input field for registration-date */}
          <input
            type="hidden"
            name="cac_date"
            value={registrationDate ? registrationDate.toISOString() : ""}
          />
          <DateInput
            required
            id="cac_date"
            label="date of registration"
            onChange={setRegistrationDate}
          />
        </div>
        <Input
          required
          label="CAC Registration Number"
          id="cac_number"
          placeholder="Write here"
          inputTextStyles={`text-xs md:text-sm font-normal`}
        />
        <FileInput
          required
          id="cac_certificate"
          label="CAC Certificate"
          placeholder="Click the side button to upload CAC"
          buttonName="Document"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
          textStyles={`text-xs md:text-sm font-normal`}
        />
        <Select
          id="industry"
          label="industry"
          options={industryOptions}
          textStyles={`text-xs md:text-sm font-normal`}
        />
        <Input
          label="Membership Number"
          id="membership-number"
          placeholder="Write here"
          inputTextStyles={`text-xs md:text-sm font-normal`}
        />

        <FileInput
          id="membership_certificate"
          label="membership Certificate"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
          placeholder="Click the side button to upload certificate"
          buttonName="Document"
          textStyles={`text-xs md:text-sm font-normal`}
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
