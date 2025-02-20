import React, { useState } from "react";
import { SettingsSectionTitle } from "../Settings/settings-components";
import Input from "../Form/Input/input";
import CopyText from "../CopyText/copy-text";

const CompanyDomain = () => {
  const [customDomain, setCustomDomain] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleCustomDomainChange = (value: string) => {
    setCustomDomain(value);
  };

  return (
    <div>
      <SettingsSectionTitle
        title="Domain"
        desc="Create a website domain for your company to centralize all details and enable seamless software integration."
        required
      />
      <div className="flex flex-col sm:flex-row gap-4 mb-4 items-start sm:items-center w-full mt-2">
        <Input
          id="custom_domain"
          label=""
          placeholder=""
          value={customDomain}
          onChange={(value) => handleCustomDomainChange(value)}
          className="w-full sm:w-auto min-w-[200px] sm:min-w-[300px]"
        />
        {customDomain && (
          <CopyText
            text={`https://www.${customDomain}.ourlisting.ng`}
            className="text-brand-9 text-xs sm:text-sm text-center break-all"
          />
        )}
        {!customDomain && (
          <p className="text-brand-9 text-xs sm:text-sm text-center break-all">
            {`https://www.${customDomain}.ourlisting.ng`}
          </p>
        )}
        {customDomain && (
          <div className="status bg-green-500 text-white px-2 py-1 rounded-md text-xs">
            Available
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDomain;
