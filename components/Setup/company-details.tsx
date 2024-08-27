// Imports
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import DateInput from "../Form/DateInput/dateInput";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import type { CompanyDetails } from "@/app/setup/types";

interface CompanyDetailsProps {
  companyDetails: CompanyDetails;
  onChange: (field: keyof CompanyDetails, value: string | File | null) => void;
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  onChange,
  companyDetails,
}) => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company details">
        Kindly provide the following details below. Note your CAC should be in
        PDF format and should not exceed 2mb.
      </SectionHeading>
      <div className="flex gap-5">
        <DateInput
          required
          id="registration-date"
          label="date of registration"
          placeholder="07/02/2014"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal ${
            companyDetails.registrationDate === "" ? "bg-transparent" : ""
          }`}
          onChange={(value) => onChange("registrationDate", value)}
          value={companyDetails.registrationDate}
        />

        <FileInput
          required
          id="cac-certificate"
          label="CAC Certificate"
          className="flex-1"
          placeholder="Click the side button to upload CAC"
          buttonName="CAC"
          onChange={(value) => onChange("cacCertificate", value)}
        />
      </div>
      <div className="flex gap-5">
        <Input
          required
          id="industry"
          label="industry"
          placeholder="Real Estate Agent"
          className="flex-1 max-w-[300px]"
          value={companyDetails.industry}
          inputTextStyles={`text-sm font-normal ${
            companyDetails.industry === "" ? "bg-transparent" : ""
          }`}
          onChange={(value) => onChange("industry", value)}
        />
        <div className="flex flex-1 gap-2">
          <FileInput
            id="membership-certificate"
            label="membership Certificate"
            className="flex-1"
            placeholder="Click the side button to upload certificate"
            buttonName="Certificate"
            onChange={(value) => onChange("membershipCertificate", value)}
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
