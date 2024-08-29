// Imports
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import FileInput from "../Form/FileInput/file-input";
import { SectionHeading } from "../Section/section-components";
import type { CompanyDetails } from "@/app/setup/types";
import { getAllStates, getCities, getLocalGovernments } from "@/utils/states";
import { useState, useEffect } from "react";

interface CompanyDetailsProps {
  companyDetails: CompanyDetails;
  onChange: (field: keyof CompanyDetails, value: string | File | null) => void;
}

const CompanyAddress: React.FC<CompanyDetailsProps> = ({
  onChange,
  companyDetails,
}) => {
  const [localGovernments, setLocalGovernments] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  // Update local governments when the state changes
 useEffect(() => {
   if (companyDetails.state) {
     setLocalGovernments(getLocalGovernments(companyDetails.state));

     // Clear LGA and City when the state changes
     onChange("lga", ""); // Clear LGA
     onChange("city", ""); // Clear City
   } else {
     setLocalGovernments([]);
     setCities([]);
   }
 }, [companyDetails.state]);

  // Update cities when the state or local government changes
  useEffect(() => {
    if (companyDetails.state && companyDetails.lga) {
      setCities(getCities(companyDetails.state, companyDetails.lga));

      // Clear city if LGA is changed
      onChange("city", "");
    } else {
      setCities([]);
    }
  }, [companyDetails.lga]);

  return (
    <div className="custom-flex-col gap-5">
      <SectionHeading title="company address">
        Provide your complete head office address for the verification process.
        Please select your state, local government area, city, and upload a
        utility bill that is no older than 3 months.
      </SectionHeading>
      <div className="flex gap-5">
        <Select
          options={getAllStates()}
          id="state"
          label="state"
          className="flex-1 max-w-[300px]"
          textStyles={`text-sm font-normal ${
            companyDetails.state === "" ? "bg-transparent" : ""
          }`}
          onChange={(value) => {
            onChange("state", value); // Update state value
            onChange("lga", ""); // Clear lga value
            onChange("city", ""); // Clear city value
          }}
          value={companyDetails.state}
        />
        <Select
          options={localGovernments}
          id="lga"
          label="local goovernment"
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
          buttonName="Document"
          onChange={(value) => onChange("utilityDocument", value)}
        />
      </div>
    </div>
  );
};

export default CompanyAddress;
