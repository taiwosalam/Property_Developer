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
  const [cac_certificate, setCac_certificate] = useState<File | null>(null);
  const [membership_certificate, setMembership_certificate] =
    useState<File | null>(null);
  // const [industry, setIndustry] = useState("");

  // To trigger Flow Progress
  useEffect(() => {
    handleInputChange();
  }, [
    registrationDate,
    handleInputChange,
    cac_certificate,
    membership_certificate,
    // industry,
  ]);
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
        <div>
          {/* input for flow progress */}
          <input
            type="hidden"
            className="setup-f"
            value={cac_certificate ? cac_certificate.name : ""}
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
            textStyles={`text-xs md:text-sm font-normal`}
            onChange={(x) => {
              setCac_certificate(x);
            }}
          />
        </div>
        <div>
          <Select
            id="industry"
            label="industry"
            options={industryOptions}
            inputTextStyles={`text-xs md:text-sm font-normal`}
            hiddenInputClassName="setup-f"
            onChange={handleInputChange}
          />
        </div>
        <Input
          label="Membership Number"
          id="membership-number"
          placeholder="Write here"
          inputClassName={`text-xs md:text-sm font-normal setup-f`}
        />
        <div>
          {/* input for flow progress */}
          <input
            type="hidden"
            className="setup-f"
            value={membership_certificate ? membership_certificate.name : ""}
          />
          <FileInput
            id="membership_certificate"
            label="membership Certificate"
            fileType="pdf"
            size={5}
            sizeUnit="MB"
            placeholder="certificate"
            buttonName="Document"
            textStyles={`text-xs md:text-sm font-normal`}
            onChange={(x) => {
              setMembership_certificate(x);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
