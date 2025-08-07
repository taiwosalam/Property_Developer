"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { debounce, templateSettings } from "lodash";
import {
  ApiResponseUserPlan,
  CompanySettingsResponse,
} from "@/app/(nav)/settings/others/types";
import useFetch from "@/hooks/useFetch";
import { checkWebsiteDomain } from "@/app/(nav)/settings/company/data";
import { toast } from "sonner";
import Button from "../Form/Button/button";
import Link from "next/link";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import SponsorModal from "./Modals/sponsor-modal";
import { CompanySettingDomain } from "./CompanySettingDomain";
import { CompanySettingsDomainTable } from "./company-domain-table";
import dayjs from "dayjs";

const SettingsWebsiteDomain = () => {
  const [customDomain, setCustomDomain] = useState("");
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { company_id, user_id } = usePersonalInfoStore();
  const [userPlan, setUserPlan] = useState("");
  const [isCheckingDomain, setCheckingDomain] = useState(false);
  //const [isOwner, setIsOwner] = useState<boolean | string>(false);
  const [domainDetails, setDomainDetails] = useState<any[] | null>(null);

  const [isDomainModal, setIsDomainModal] = useState(false);

  const { data: planData } = useFetch<ApiResponseUserPlan>(
    "/property-manager-subscription/active"
  );

  useEffect(() => {
    if (planData) {
      const premiumPlan =
        planData?.data?.plan?.plan_name?.toLowerCase() ?? "free";
      setUserPlan(premiumPlan);
    }
  }, [planData]);

  const handleSelect = (type: string, value: string) => {
    setSelectedTemplate(value);
  };

  const { data: companySettings, refetch } =
    useFetch<CompanySettingsResponse>("/company/settings");
  useRefetchOnEvent("refetchProfile", () => refetch({ silent: true }));

  

  const isOwner =
    customDomain &&
    `${customDomain}.ourlisting.ng` === companySettings?.data?.domain;

  useEffect(() => {
    if (companySettings) {
      const updatedDomain = companySettings?.data?.domain;
      const domain = updatedDomain
        ? updatedDomain.replace(/\.ourlisting\.ng$/, "")
        : "";
      const updatedTemplate =
        companySettings?.data?.website_settings?.web_template;

      const customDomain = {
        domain: companySettings?.data?.custom_domain?.toLowerCase() ?? null,
        ssl: "pending", //companySettings?.data?.custom_domain_ssl_status ?? "____ ____",
        status: "pending", //companySettings?.data?.custom_domain_status,
        updated_at: companySettings?.data?.updated_at
          ? dayjs(companySettings?.data?.updated_at).format("DD-MM-YYYY")
          : "___ ___",
      };

      setDomainDetails([customDomain]);

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
      if (!isOwner && domainStatus !== "available") {
        toast.error("Domain name is not available for update");
        return;
      }
      if (customDomain && company_id && domainStatus === "available") {
        const res = await updateCompanyDomain(
          company_id.toString(),
          customDomain
        );
        if (res) {
          setDomainStatus("");
        }
      }
      if (selectedTemplate) {
        await updateCompanyWebsiteTemplate(payload);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  /* Check Domain */
  const [domainStatus, setDomainStatus] = useState<string | null>("");
  const [error, setError] = useState<string | null>("");

  const checkDomainAvailability = useCallback(
    debounce(async (value) => {
      const cleanedValue = value
        .trim()
        .replace(/\s+/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "");

      setError("Please enter a valid domain (e.g., example.com)");
      setDomainStatus(null);
      setCustomDomain(cleanedValue);

      setCustomDomain(cleanedValue);
      setCheckingDomain(true);
      setDomainStatus("searching");
      setError(null);

      try {
        const res = await checkWebsiteDomain(cleanedValue);
        if (res && res.data) {
          setDomainStatus(
            res.data.message === "available" ? "available" : "not-available"
          );
        } else {
          setError("Error checking domain availability");
          setDomainStatus(null);
        }
      } catch (error) {
        setError("Error checking domain availability");
        setDomainStatus(null);
      } finally {
        setCheckingDomain(false);
      }
    }, 500),
    []
  );

  // Handle input change (runs immediately for smooth typing)
  const handleInputChange = (value: string) => {
    setCustomDomain(value); // Update input state immediately
    if (!value.trim()) {
      // Clear status and error when input is empty
      setDomainStatus(null);
      setError(null);
      checkDomainAvailability.cancel(); // Cancel any pending debounced API call
    } else {
      checkDomainAvailability(value); // Trigger debounced API check
    }
  };

  // Conditional styles for the status container
  const getStatusStyles = () => {
    switch (domainStatus) {
      case "searching":
        return "bg-black opacity-80 text-white";
      case "available":
        return "bg-green-500 text-white";
      case "not-available":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-700 hidden"; // Hide when no status
    }
  };

  // Conditional status text
  const getStatusText = () => {
    switch (domainStatus) {
      case "searching":
        return "Searching...";
      case "available":
        return "Available";
      case "not-available":
        return "Not Available";
      default:
        return "";
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
          Website domain name
        </p>
        <div className="flex flex-col sm:flex-row gap-8 mb-4 mt-2 items-start sm:items-center w-full">
          <Input
            id="custom_domain"
            label=""
            placeholder=""
            value={customDomain}
            onChange={(value) => handleInputChange(value)}
            className="w-full sm:w-auto min-w-[200px] sm:min-w-[300px]"
          />
          {customDomain ? (
            <Link
              href={`https://${customDomain}.ourlisting.ng`}
              target="_blank"
              className="text-brand-9 text-xs sm:text-sm text-center break-all underline"
            >{`https://${customDomain}.ourlisting.ng`}</Link>
          ) : (
            <p className="text-brand-9 text-xs sm:text-sm text-center break-all">
              https://example.ourlisting.ng
            </p>
          )}
          {!isOwner && customDomain && domainStatus && (
            <div
              className={`status px-4 py-1 rounded-md text-xs font-semibold ${getStatusStyles()}`}
            >
              {getStatusText()}
            </div>
          )}

          {domainDetails &&
            domainDetails.length > 0 &&
            !domainDetails[0].domain && (
              <Modal
                state={{
                  isOpen: isDomainModal,
                  setIsOpen: setIsDomainModal,
                }}
              >
                <ModalTrigger>
                  <Button
                    variant="change"
                    size="xs_normal"
                    className="py-2 px-3"
                  >
                    Add Custom Domain
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <CompanySettingDomain setIsOpen={setIsDomainModal} />
                </ModalContent>
              </Modal>
            )}
        </div>

        {domainDetails && domainDetails[0].domain !== null && (
          <div>
            <CompanySettingsDomainTable data={domainDetails} />
          </div>
        )}

        {/* { <div className="rssFeed flex flex-col gap-1 mb-4">
          <h4 className="text-text-secondary dark:text-darkText-1 text-md font-normal">
            RSS Feed Link for Listings
          </h4>
          <CopyText
            text={`https://www.ourlisting.ng/user/${user_id}`}
            className="text-brand-9 text-xs underline sm:text-sm"
          />
        </div> } */}
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
              plan={currentPlanKeyword}
            />
            <ThemeCard
              plan={currentPlanKeyword}
              img={WebsiteTemplate2}
              value="template2"
              onSelect={(value) => handleSelect("template2", value)}
              isSelected={selectedTemplate === "template2"}
              profile={true}
            />
            <ThemeCard
              plan={currentPlanKeyword}
              img={WebsiteTemplate3}
              value="template3"
              onSelect={(value) => handleSelect("template3", value)}
              isSelected={selectedTemplate === "template3"}
              profile={true}
            />
          </div>
          {domainStatus !== "available" && !isOwner ? (
            <div className="flex justify-end">
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          ) : (
            <SettingsUpdateButton action={handleUpdate} loading={loading} />
          )}
        </div>
      </SettingsSection>
    </div>
  );
};

export default SettingsWebsiteDomain;
