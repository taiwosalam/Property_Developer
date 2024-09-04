// Imports
import { useState, useContext, useEffect } from "react";
import moment from "moment";
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/date-input";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { industryOptions } from "@/data";

const CompanyDetails = () => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const [registrationDate, setRegistrationDate] = useState<Date | undefined>(
    undefined
  );
  // To trigger Flow Progress
  useEffect(() => {
    handleInputChange();
  }, [handleInputChange, registrationDate]);
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company details">
        Kindly provide the following details below. Note your documents should
        be in PDF format and should not exceed 5mb.
      </SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[950px] specific-grid">
        <div>
          {/* Hidden input field for registration-date */}
          <input
            type="hidden"
            name="cac_date"
            className="setup-f"
            value={
              registrationDate
                ? moment(registrationDate).format("MM-DD-YYYY")
                : ""
            }
          />
          <DateInput
            required
            id="cac_date"
            label="date of registration"
            onChange={(date) => {
              setRegistrationDate(date);
            }}
            textStyles={`text-xs md:text-sm font-normal`}
          />
        </div>
        <Input
          required
          label="CAC Registration Number"
          id="cac_number"
          placeholder="Write here"
          inputClassName={`text-xs md:text-sm font-normal setup-f`}
        />

        <FileInput
          required
          id="cac_certificate"
          label="CAC Certificate"
          placeholder="CAC"
          buttonName="Document"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
          hiddenInputClassName="setup-f required"
          textStyles={`text-xs md:text-sm font-normal`}
          // onChange={handleInputChange}
        />

        <Select
          id="industry"
          label="industry"
          options={industryOptions}
          inputTextStyles={`text-xs md:text-sm font-normal`}
          hiddenInputClassName="setup-f"
          // onChange={handleInputChange}
        />

        <Input
          label="Membership Number"
          id="membership_number"
          placeholder="Write here"
          inputClassName={`text-xs md:text-sm font-normal setup-f`}
        />

        <FileInput
          id="membership_certificate"
          label="membership Certificate"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
          placeholder="certificate"
          buttonName="Document"
          hiddenInputClassName="setup-f"
          textStyles={`text-xs md:text-sm font-normal`}
          // onChange={handleInputChange}
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
