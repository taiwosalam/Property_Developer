"use client";

import React, { useState, useEffect } from "react";
import { SettingsSectionTitle } from "../Settings/settings-components";
import Input from "../Form/Input/input";
import CopyText from "../CopyText/copy-text";
import { checkDomainAvailability } from "@/app/(onboarding)/setup/data";

const CompanyDomain = ({ companyName }: { companyName: string }) => {
  const [customDomain, setCustomDomain] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [searching, setSearching] = useState(false);

  // When companyName prop changes, compute and set the default domain.
  useEffect(() => {
    if (companyName) {
      const defaultDomain = companyName.trim().toLowerCase().replace(/\s+/g, "");
      setCustomDomain(defaultDomain);
    }
  }, [companyName]);

  const handleCustomDomainChange = (value: string) => {
    setCustomDomain(value);
  };

  // Debounce API call for domain availability
  useEffect(() => {
    if (customDomain.trim() !== "") {
      const timer = setTimeout(async () => {
        setSearching(true);
        const available = await checkDomainAvailability(customDomain);
        setIsAvailable(available);
        setSearching(false);
      }, 500);

      return () => {
        clearTimeout(timer);
      };
    } else {
      setIsAvailable(null);
    }
  }, [customDomain]);

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
          placeholder="Enter your custom domain"
          value={customDomain}
          onChange={handleCustomDomainChange}
          className="w-full sm:w-auto min-w-[200px] sm:min-w-[300px]"
        />
        {customDomain ? (
          <CopyText
            text={`https://${customDomain}.ourlisting.ng`}
            className="text-brand-9 text-xs sm:text-sm text-center break-all"
          />
        ) : (
          <p className="text-brand-9 text-xs sm:text-sm text-center break-all">
            {`https://${customDomain}.ourlisting.ng`}
          </p>
        )}
        {customDomain && (
          <>
            {searching ? (
              <div className="status bg-gray-500 text-white px-2 py-1 rounded-md text-xs">
                Searching...
              </div>
            ) : (
              isAvailable !== null && (
                <div
                  className={`status ${
                    isAvailable ? "bg-green-500" : "bg-red-500"
                  } text-white px-2 py-1 rounded-md text-xs`}
                >
                  {isAvailable ? "Available" : "Not Available"}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CompanyDomain;
