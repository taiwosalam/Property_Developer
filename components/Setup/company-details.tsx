// Imports
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import DateInput from "../Form/DateInput/dateInput";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import type { CompanyDetails } from "@/app/setup/types";
import { industryOptions } from "@/data";

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
        <Input
          required
          label="CAC Registration Number"
          id="cac-number"
          placeholder="CAC3787256"
          value={companyDetails.cacNumber}
          onChange={(value) => onChange("cacNumber", value)}
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal ${
            companyDetails.cacNumber === "" ? "bg-transparent" : ""
          }`}
        />
        <FileInput
          required
          id="cac-certificate"
          label="CAC Certificate"
          className="flex-1"
          placeholder="Click the side button to upload CAC"
          buttonName="CAC"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          onChange={(value) => onChange("cacCertificate", value)}
        />
      </div>
      <div className="flex gap-5">
        <Select
          id="industry"
          label="industry"
          className="flex w-[300px]"
          value={companyDetails.industry}
          onChange={(value) => onChange("industry", value)}
          options={industryOptions}
          textStyles={`text-sm font-normal`}
        />
        <Input
          label="Membership Number"
          id="membership-number"
          placeholder="56"
          value={companyDetails.membershipNumber}
          onChange={(value) => onChange("membershipNumber", value)}
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal ${
            companyDetails.membershipNumber === "" ? "bg-transparent" : ""
          }`}
        />

        <FileInput
          id="membership-certificate"
          label="membership Certificate"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          className="flex-1"
          placeholder="Click the side button to upload certificate"
          buttonName="Certificate"
          onChange={(value) => onChange("membershipCertificate", value)}
        />
      </div>
      <div className="flex gap-5">
        <Input
          label="head office address"
          id="head-office-address"
          placeholder="3 Bodija, Ibadan"
          value={companyDetails.headOfficeAddress}
          onChange={(value) => onChange("headOfficeAddress", value)}
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal ${
            companyDetails.headOfficeAddress === "" ? "bg-transparent" : ""
          }`}
        />
        <DateInput
          id="utility-date"
          label="utility date"
          placeholder="07/02/2014"
          className="flex-1 max-w-[300px]"
          inputTextStyles={`text-sm font-normal ${
            companyDetails.utilityDate === "" ? "bg-transparent" : ""
          }`}
          onChange={(value) => onChange("utilityDate", value)}
          value={companyDetails.utilityDate}
        />
        <FileInput
          id="utility-document"
          label="utility document"
          fileType="pdf"
          size={2}
          sizeUnit="MB"
          className="flex-1"
          placeholder="Click the side button to upload utility"
          buttonName="Utility"
          onChange={(value) => onChange("utilityDocument", value)}
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
