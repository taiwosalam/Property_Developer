"use client";

import React, { useCallback, useEffect, useState } from "react";

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
import debounce from "lodash/debounce";

interface ApiResponse {
  data: { [key: string]: { [key: string]: string[] } };
}
const MAX_SERVICE_PER_SECTION = 4;

const Services = () => {
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [clickLock, setClickLock] = useState<{ [key: string]: boolean }>({});
  const [selectedServices, setSelectedServices] = useState<{
    [key: string]: string[];
  }>({});

  const [pageData, setPageData] = useState<{ [key: string]: string[] }>({});

  const {
    data: apiData,
    error,
    refetch,
  } = useFetch<ApiResponse>("/company/services");

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
          case "land_surveyor":
            transformedKey = "Land Surveyor";
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

        //
        // Safely assigning values to initialServicesState
        if (Array.isArray(res[key])) {
          initialServicesState[transformedKey] = res[key];
        }
        // } else {
        //   toast.error(`Invalid data for ${key}. Contact support.`);
        //   return;
        // }
      });

      setSelectedServices((prevState) => ({
        ...prevState,
        ...initialServicesState,
      }));
    }
  }, [res]);

  const handleServiceClick = (section: string, serviceName: string) => {
    const lockKey = `${section}-${serviceName}`;
    if (clickLock[lockKey]) {
      return; // Skip if locked
    }

    setClickLock((prev) => ({ ...prev, [lockKey]: true }));

    let hasToasted = false; 
    setSelectedServices((prev) => {
      const currentSelection = prev[section] || [];
      const isSelected = currentSelection.includes(serviceName);

      if (isSelected) {
        // Deselect: Always allow
        const newSelection = currentSelection.filter(
          (name) => name !== serviceName
        );
        return { ...prev, [section]: newSelection };
      }

      if (currentSelection.length >= MAX_SERVICE_PER_SECTION) {
        if (!hasToasted) {
          toast.warning(
            `You can only select up to ${MAX_SERVICE_PER_SECTION} services in the "${section}" section.`
          );
          hasToasted = true;
        }
        return prev;
      }

      return { ...prev, [section]: [...currentSelection, serviceName] };
    });

    setClickLock((prev) => ({ ...prev, [lockKey]: false }));
  };

  const handleSubmit = async (section: string) => {
    if (loading[section]) return;
    const payload = { data: selectedServices[section] || [] };
    const type = section
      .toLowerCase()
      .replace(/\s/g, "_")
      .replace(/&/g, "")
      .replace(/__+/g, "_")
      .split(" ")
      .join("_");

    try {
      setLoading((prev) => ({ ...prev, [section]: true }));
      const res = await updateServicesSettings(objectToFormData(payload), type);
      if (res && res.status === 200) {
        toast.success(`Services updated successfully`);
      }
    } catch (err) {
      toast.error("Failed to update services");
    } finally {
      setLoading((prev) => ({ ...prev, [section]: false }));
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
                    isSelected={
                      selectedServices[section]?.includes(name) || false
                    }
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
                disabled={loading[section]}
              >
                {loading[section] ? "Please wait..." : "Update"}
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
