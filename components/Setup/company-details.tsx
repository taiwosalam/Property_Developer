// Imports
import { useContext } from "react";
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/date-input";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { industryOptions } from "@/data";

const CompanyDetails = () => {
  const { handleInputChange } = useContext(FlowProgressContext);

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company details">
        Kindly provide the following details below. Note your documents should
        be in PDF format and should not exceed 2mb.
      </SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[950px] specific-grid">
        <DateInput
          required
          id="cac_date"
          label="date of registration"
          onChange={handleInputChange}
          inputClassName="setup-f"
          disableFuture={true}
        />
        <Input
          required
          label="CAC Registration Number"
          id="cac_number"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f"
        />

        <FileInput
          required
          id="cac_certificate"
          label="CAC Certificate"
          placeholder="CAC"
          buttonName="Document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          hiddenInputClassName="setup-f required"
        />

        <Select
          id="industry"
          label="industry"
          options={industryOptions}
          hiddenInputClassName="setup-f"
        />

        <Input
          label="Membership Number"
          id="membership_number"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f"
        />

        <FileInput
          id="membership_certificate"
          label="membership Certificate"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          placeholder="certificate"
          buttonName="Document"
          hiddenInputClassName="setup-f"
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
