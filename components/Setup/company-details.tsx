// Imports
import { useContext } from "react";
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/date-input";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import { FlowProgressContext } from "../FlowProgress/flow-progress";
import { industryOptions } from "@/data";
import dayjs from "dayjs";

const CompanyDetails = ({data}: {data: any}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const date = dayjs(data.date_of_registration);

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company details">
        Kindly provide the following details below. Note your documents should
        be in PDF format and should not exceed 2mb.
      </SectionHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-[950px] specific-grid">
        <Input
          required
          label="CAC Registration Number"
          id="cac_registration_number"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f bg-white"
          defaultValue={data.cac_registration_number}
        />
        <DateInput
          required
          id="date_of_registration"
          label="date of registration"
          onChange={handleInputChange}
          inputClassName="setup-f required"
          disableFuture
          value={date}
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
          // defaultValue={data.cac_certificate}
        />

        <Select
          id="industry"
          label="Select Your Industry"
          options={industryOptions}
          hiddenInputClassName="setup-f"
          defaultValue={data.industry}
        />

        <Input
          label="Membership Number"
          id="membership_number"
          placeholder="Write here"
          inputClassName="rounded-[8px] setup-f bg-white"
          defaultValue={data.membership_number}
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
          // defaultValue={data.membership_certificate}
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
