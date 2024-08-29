// Imports
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/date-input";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import { industryOptions } from "@/data";

const CompanyDetails = () => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company details">
        Kindly provide the following details below. Note your documents should
        be in PDF format and should not exceed 5mb.
      </SectionHeading>
      <div className="flex gap-5">
        <DateInput
          required
          id="registration-date"
          label="date of registration"
          className="flex-1 max-w-[300px]"
        />

        <Input
          required
          label="CAC Registration Number"
          id="cac-number"
          placeholder="Write here"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal`}
        />
        <FileInput
          required
          id="cac-certificate"
          label="CAC Certificate"
          className="flex-1"
          placeholder="Click the side button to upload CAC"
          buttonName="Document"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
        />
      </div>
      <div className="flex gap-5">
        <Select
          id="industry"
          label="industry"
          className="flex w-[300px]"
          options={industryOptions}
          textStyles={`text-sm font-normal`}
        />
        <Input
          label="Membership Number"
          id="membership-number"
          placeholder="Write here"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal`}
        />

        <FileInput
          id="membership-certificate"
          label="membership Certificate"
          fileType="pdf"
          size={5}
          sizeUnit="MB"
          className="flex-1"
          placeholder="Click the side button to upload certificate"
          buttonName="Document"
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
