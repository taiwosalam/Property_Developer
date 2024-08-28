// Imports
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import type { CompanyDetails } from "@/app/setup/types";
import { industryOptions } from "@/data";

interface CompanyDetailsProps {
  companyDetails: CompanyDetails;
  onChange: (field: keyof CompanyDetails, value: string | File | null) => void;
}

const CompanyAddress: React.FC<CompanyDetailsProps> = ({
  onChange,
  companyDetails,
}) => {
  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company address">
        Provide your complete head office address for the verification process.
        Please select your state, local government area, city, and upload a
        utility bill that is no older than 3 months.
      </SectionHeading>
      <div className="flex gap-5">
        <Select
          options={[]}
          id="state"
          label="state"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal ${
            companyDetails.state === "" ? "bg-transparent" : ""
          }`}
          onChange={(value) => onChange("state", value)}
          value={companyDetails.state}
        />
        <Select
          options={[]}
          id="lga"
          label="local goovernmeant"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal ${
            companyDetails.lga === "" ? "bg-transparent" : ""
          }`}
          onChange={(value) => onChange("lga", value)}
          value={companyDetails.lga}
        />
        <Input
          label="city"
          id="city"
          placeholder="Write here"
          value={companyDetails.city}
          onChange={(value) => onChange("city", value)}
          className="flex-1 max-w-[410px]"
          inputTextStyles={`text-sm font-normal ${
            companyDetails.city === "" ? "bg-transparent" : ""
          }`}
        />
      </div>

      <div className="flex gap-5">
        <Input
          label="head office address"
          id="head-office-address"
          placeholder="Write here"
          value={companyDetails.headOfficeAddress}
          onChange={(value) => onChange("headOfficeAddress", value)}
          className="flex-1 max-w-[620px]"
          inputTextStyles={`text-sm font-normal ${
            companyDetails.headOfficeAddress === "" ? "bg-transparent" : ""
          }`}
        />
        <FileInput
          id="utility-document"
          label="utility document"
          fileType="pdf"
          size={5}
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

export default CompanyAddress;
