"use client";

import React, { useState, useEffect } from "react";
import { SettingsSectionTitle } from "../Settings/settings-components";
import Input from "../Form/Input/input";
import CopyText from "../CopyText/copy-text";
import { checkDomainAvailability } from "@/app/(onboarding)/setup/data";
import { useGlobalStore } from "@/store/general-store";

//  Props interface
interface CompanyDomainProps {
  companyName: string;
  isEditMode: boolean;
  domain?: string; 
}

const CompanyDomain: React.FC<CompanyDomainProps> = ({
  companyName,
  isEditMode,
  domain,
}) => {
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const [customDomain, setCustomDomain] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [searching, setSearching] = useState<boolean>(false);

  // Initialize customDomain based on isEditMode and domain or companyName
  useEffect(() => {
    if (isEditMode && domain) {
      // In editMode, extract the subdomain from the full domain (e.g., "example" from "example.ourlisting.ng")
      const subdomain = domain.replace(/\.ourlisting\.ng$/, "");
      setCustomDomain(subdomain);
    } else if (companyName) {
      // When not in editMode, derive from companyName
      const defaultDomain = companyName.trim().toLowerCase().replace(/\s+/g, "");
      setCustomDomain(defaultDomain);
    }
  }, [companyName, isEditMode, domain]);

  const handleCustomDomainChange = (value: string) => {
    setCustomDomain(value);
  };

  // Debounce API call for domain availability
  useEffect(() => {
    if (customDomain.trim() === "") {
      setIsAvailable(null);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const available = await checkDomainAvailability(customDomain);
      setIsAvailable(available);
      setGlobalStore("domainAvailable", available)
      setSearching(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [customDomain]);

  // Check if the current customDomain matches the domain prop (i.e., it’s the owner’s domain)
  const isOwner = customDomain && domain && `${customDomain}.ourlisting.ng` === domain;

  return (
    <div className="company-domain-wrapper">
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
        {/* Show status div only if not in editMode or if in editMode and not the owner's domain */}
        {(!isEditMode || !isOwner) && customDomain && (
          <>
            {searching ? (
              <div className="status bg-gray-500 text-white px-2 py-1 rounded-md text-xs">
                Searching...
              </div>
            ) : (
              isAvailable !== null && (
                <div
                  className={`status ${isAvailable ? "bg-green-500" : "bg-red-500"
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