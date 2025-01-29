"use client";

import React, { useEffect, useState } from "react";

// Imports
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";

import { services } from "@/components/Settings/services";
import { services_sections } from "@/components/Settings/data";
import SettingsServicesTag from "@/components/Settings/settings-services-tag";
import Button from "@/components/Form/Button/button";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { updateServicesSettings, updateSettings } from "../security/data";
import useFetch from "@/hooks/useFetch";

interface ApiResponse {
  data: { [key: string]: { [key: string]: string[] } };
}

const Services = () => {
  const [loading, setLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<{ [key: string]: string[] }>({});

  const [pageData, setPageData] = useState<{ [key: string]: string[] }>({});

  const { data: apiData, error, refetch } = useFetch<ApiResponse>("/company/services");

  const res = apiData?.data;

useEffect(() => {
  if (res) {
    const initialServicesState: { [key: string]: string[] } = {};

    Object.keys(res).forEach((key) => {
      let transformedKey = key;

      // Transform the keys
      switch (key) {
        case "estate_surveyor_valuer":
          transformedKey = "Estate Surveyor & Valuer";
          break;
        case "quantity_surveyor":
          transformedKey = "Quantity Surveyor";
          break;
        case "legal_practitioner":
          transformedKey = "Legal Practitioner";
          break;
        case "architect":
          transformedKey = "Architect";
          break;
        case "civil_engineer":
          transformedKey = "Civil Engineer";
          break;
        case "hospitality":
          transformedKey = "Hospitality";
          break;
        case "realtor":
          transformedKey = "Realtor";
          break;
        case "town_planner":
          transformedKey = "Town Planner";
          break;
        default:
          break;
      }

      // console.log("transformedKey", transformedKey);
      // Safely assigning values to initialServicesState
      if (Array.isArray(res[key])) {
        initialServicesState[transformedKey] = res[key];
      } else {
        console.error(`Expected an array for ${key}, but got`, res[key]);
      }
    });

    setSelectedServices((prevState) => ({
      ...prevState,
      ...initialServicesState,
    }));
  }
}, [res]);

  
  const handleServiceClick = (section: string, serviceName: string) => {
    setSelectedServices((prev) => {
      const currentSelection = prev[section] || [];
      const isSelected = currentSelection.includes(serviceName);

      if (isSelected) {
        // Remove service if already selected
        return { ...prev, [section]: currentSelection.filter((name) => name !== serviceName) };
      }

      if (currentSelection.length >= 4) {
        toast.warning(`You can only select up to 4 services in the "${section}" section.`);
        return prev; // Prevent state update
      }

      return { ...prev, [section]: [...currentSelection, serviceName] };
    });
  };

  const handleSubmit = async (section: string) => {
    const payload = { data: selectedServices[section] || [] };
    const type = section
      .toLowerCase()
      .replace(/\s/g, '_')
      .replace(/&/g, '')
      .replace(/__+/g, '_')
      .split(' ')
      .join('_');

    try {
      setLoading(true)
      const res = await updateServicesSettings(objectToFormData(payload), type)
      if (res && res.status === 200) {
        toast.success(`Services updated successfully`)
      }
    } catch (err) {
      toast.error("Failed to update services")
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      {Object.entries(services_sections).map(([section, service_owner]) => (
        <SettingsSection key={section} title={section}>
          <div className="custom-flex-col gap-8">
            <div className="custom-flex-col gap-4">
              <SettingsSectionTitle title={service_owner} />
              <div className="flex gap-4 flex-wrap">
                {services[service_owner].map(({ name, active }, idx) => (
                  <SettingsServicesTag
                    // active={active}
                    active={selectedServices[section]?.includes(name)}
                    key={`${name}-${idx}`}
                    onClick={() => handleServiceClick(section, name)}
                    isSelected={selectedServices[section]?.includes(name) || false}
                  >
                    {name}
                  </SettingsServicesTag>
                ))}
              </div>
            </div>
            <div className="flex items-end w-full justify-end">
              <Button
                size="base_bold"
                className="py-[10px] px-8"
                onClick={() => handleSubmit(section)}
                disabled={loading}
              >
                {loading ? "Please wait..." : "Update"}
              </Button>
            </div>
            {/* <SettingsUpdateButton action={handleSubmit(section) as any} /> */}
          </div>
        </SettingsSection>
      ))}
    </>
  );
};

export default Services;
