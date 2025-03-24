"use client";

import React, { useEffect, useState } from "react";
import SettingsSection from "./settings-section";
import Input from "../Form/Input/input";
import CopyText from "../CopyText/copy-text";
import WebsiteTemplate3 from "@/public/templates/template2.png";
import WebsiteTemplate1 from "@/public/templates/template3.png";
import WebsiteTemplate2 from "@/public/templates/template1.png";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
  ThemeCard,
} from "./settings-components";
import {
  updateCompanyDomain,
  updateCompanyWebsiteTemplate,
} from "@/app/(nav)/settings/profile/data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { templateSettings } from "lodash";
import { CompanySettingsResponse } from "@/app/(nav)/settings/others/types";
import useFetch from "@/hooks/useFetch";

const SettingsWebsiteDomain = () => {
  const [customDomain, setCustomDomain] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { company_id, user_id } = usePersonalInfoStore();

  const handleCustomDomainChange = (value: string) => {
    const cleanedValue = value
      .trim()
      .replace(/\s+/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "");

    setCustomDomain(cleanedValue);
  };

  const handleSelect = (type: string, value: string) => {
    setSelectedTemplate(value);
  };

  const { data: companySettings } =
    useFetch<CompanySettingsResponse>("/company/settings");

  useEffect(() => {
    if (companySettings) {
      const updatedDomain = companySettings?.data?.domain;
      const domain = updatedDomain
        ? updatedDomain.replace(/\.ourlisting\.ng$/, "")
        : "";
      const updatedTemplate =
        companySettings?.data?.website_settings?.web_template;
      setCustomDomain(domain);
      setSelectedTemplate(updatedTemplate || "");
    }
  }, [companySettings]);

  const handleUpdate = async () => {
    // if (customDomain || selectedTemplate) return;

    const payload = {
      web_template: selectedTemplate || "template1",
    };

    setLoading(true);
    try {
      if (customDomain && company_id) {
        await updateCompanyDomain(company_id.toString(), customDomain);
      }
      if (selectedTemplate) {
        await updateCompanyWebsiteTemplate(payload);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SettingsSection title="website domain & template">
        <SettingsSectionTitle
          title="Website Domain"
          desc=" Select a preferred subdomain to showcase your company profile and
          market your properties listings portfolio to the world."
        />
        <p className="text-text-secondary dark:text-darkText-1 text-md mt-4">
          Customize website domain name
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-4 mt-2 items-start sm:items-center w-full">
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
              text={`https://${customDomain}.ourlisting.ng`}
              className="text-brand-9 text-xs sm:text-sm text-center break-all"
            />
          )}
          {!customDomain && (
            <p className="text-brand-9 text-xs sm:text-sm text-center break-all">
              {`https://${customDomain}.ourlisting.ng`}
            </p>
          )}
          {customDomain && (
            <div className="status bg-green-500 text-white px-2 py-1 rounded-md text-xs">
              Available
            </div>
          )}
        </div>

        <div className="rssFeed flex flex-col gap-1 mb-4">
          <h4 className="text-text-secondary dark:text-darkText-1 text-md font-normal">
            RSS Feed Link for Listings
          </h4>
          <CopyText
            text={`https://www.ourlisting.ng/user/${user_id}`}
            className="text-brand-9 text-xs underline sm:text-sm"
          />
        </div>
        <div className="custom-flex-col gap-6 mt-6">
          <SettingsSectionTitle
            title="choose template"
            desc="Choose how your website will be presented to your customers and clients."
          />
          <div className="flex flex-wra gap-6 items-start justify-start h-auto">
            <ThemeCard
              img={WebsiteTemplate1}
              value="template1"
              onSelect={(value) => handleSelect("template1", value)}
              isSelected={selectedTemplate === "template1"}
              profile={true}
            />
            <ThemeCard
              img={WebsiteTemplate2}
              value="template2"
              onSelect={(value) => handleSelect("template2", value)}
              isSelected={selectedTemplate === "template2"}
              profile={true}
            />
            <ThemeCard
              img={WebsiteTemplate3}
              value="template3"
              onSelect={(value) => handleSelect("template3", value)}
              isSelected={selectedTemplate === "template3"}
              profile={true}
            />
          </div>
          <SettingsUpdateButton action={handleUpdate} loading={loading} />
        </div>
      </SettingsSection>
    </div>
  );
};

export default SettingsWebsiteDomain;
