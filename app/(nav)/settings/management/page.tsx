"use client";
import React, { useEffect, useState } from "react";

// Types
import type { TenantOccupantTier } from "@/components/Settings/types";

// Imports
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsTenantOccupantTier,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";

import Select from "@/components/Form/Select/select";

import {
  tenant_occupant_tiers,
  tenant_occupant_level_types,
  tenant_occupant_options,
} from "@/components/Settings/data";

import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import { staffConfigurations, updateSettingsManagement } from "./data";
import Button from "@/components/Form/Button/button";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { AuthForm } from "@/components/Auth/auth-components";
import { updateSettings } from "../security/data";
import { useSettings } from "@/hooks/settingsContext";
import RentPenalty from "@/components/Management/rent-penalty";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import useFetch from "@/hooks/useFetch";
import ManagementCheckbox from "@/components/Documents/DocumentCheckbox/management-checkbox";
import { ApiResponseUserPlan } from "../others/types";

const roleMapping: Record<string, string> = {
  "admin configuration (company director)": "director",
  "partner configuration (branch manager)": "manager",
  "colleague configuration (account manager)": "account",
  "staff configuration (other staff) Configuration": "staff",
  "Users Configuration (Landlord, Occupant & Tenants)": "user",
};

const Management = () => {
  const { data, isLoading, error } = useSettings();
  const [updating, setUpdating] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({
    manager: false,
    account: false,
    staff: false,
    rent_penalty: false,
    screening_levels: false,
  });
  const [isScreeningLevel, setIsScreeningLevel] = useState(false);
  const [isPenalty, setIsPenalty] = useState(false);
  const [rentPenalty, setRentPenalty] = useState("");
  const [screeningLevel, setScreeningLevel] = useState({
    tenant_screening_level: 0,
    occupant_screening_level: 0,
  });
  const [userPlan, setUserPlan] = useState<string>("");

  const { data: planData } = useFetch<ApiResponseUserPlan>(
    "/property-manager-subscription/active"
  );

  useEffect(() => {
    if (planData) {
      const premiumPlan =
        planData?.data?.plan?.plan_name.toLowerCase() ?? "free";
      setUserPlan(premiumPlan);
    }
  }, [planData]);

  const formatPermission = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[\s\/&-]+/g, "_") // Replace spaces, slashes, ampersands, and dashes with "_"
      .replace(/[^a-z0-9_]/g, ""); // Remove any remaining special characters
  };

  const [selectedPermissions, setSelectedPermissions] = useState(() =>
    staffConfigurations.reduce((acc, { title }) => {
      acc[title] = [];
      return acc;
    }, {} as Record<string, string[]>)
  );

  const {
    data: manaConfigData,
    loading: configLoading,
    error: configError,
    refetch,
  } = useFetch<any>("/company/permissions");
  useRefetchOnEvent("refetchManagementSettings", () =>
    refetch({ silent: true })
  );

  // Sync selectedPermissions with backend data when manaConfigData changes
  useEffect(() => {
    if (manaConfigData?.data) {
      setSelectedPermissions((prev) => {
        const updatedPermissions = { ...prev };
        staffConfigurations.forEach(({ title }) => {
          const role = roleMapping[title]; // e.g., "manager"
          const backendPermissions = manaConfigData.data[role] || []; // e.g., ["can_add_delete_branch_staff", ...]
          updatedPermissions[title] = backendPermissions; // Directly use backend permissions
        });
        return updatedPermissions;
      });
    }
  }, [manaConfigData]);

  useEffect(() => {
    if (data?.screening_levels !== null) {
      setScreeningLevel({
        tenant_screening_level: data?.screening_levels?.tenant_screening_level,
        occupant_screening_level:
          data?.screening_levels?.occupant_screening_level,
      });
    }

    if (data && data?.rent_penalty_setting !== null) {
      setRentPenalty(data?.rent_penalty_setting?.penalty_value);
    }
  }, [data]);

  const handleCheckboxClick = (title: string, permission: string) => {
    // Check if this is a user role configuration and user doesn't have professional plan
    if (roleMapping[title] === "user" && userPlan !== "professional") {
      toast.warning(
        "Only Professional plan users can modify user configurations"
      );
      return;
    }

    const formattedPermission = formatPermission(permission);
    setSelectedPermissions((prev) => {
      const currentPermissions = prev[title] || [];
      const updatedPermissions = currentPermissions.includes(
        formattedPermission
      )
        ? currentPermissions.filter((p) => p !== formattedPermission)
        : [...currentPermissions, formattedPermission];

      return { ...prev, [title]: updatedPermissions };
    });
  };

  /* MANAGEMENT CONFIGURATION */
  const handleUpdate = async (title: string) => {
    const role = roleMapping[title] || title; // Map title or fallback to original
    const permissions = selectedPermissions[title] || []; // Ensure we have an array

    const payload = {
      role, // Use mapped role
      permissions, // Correctly formatted array
    };
    try {
      setLoadingStates((prev) => ({ ...prev, [role]: true }));
      const res = await updateSettingsManagement(objectToFormData(payload));
      if (res) {
        toast.success(`Management updated successfully`);
      }
    } catch (err) {
      toast.error("Failed to update role");
    } finally {
      setLoadingStates((prev) => ({ ...prev, [role]: false }));
    }
  };

  // UPDATE RENT PENALTY

  // TENANT & OCCUPANT SCREENING LEVEL
  const handleUpdateScreeningLevel = async (data: Record<string, any>) => {
    const extractTierNumber = (val: string | number) => {
      if (typeof val === "string" && val.toLowerCase().startsWith("tier")) {
        const match = val.match(/\d+/);
        return match ? Number(match[0]) : val;
      }
      return val;
    };

    if (
      !data?.tenant_screening_level_type &&
      !data?.tenant_screening_level_type
    ) {
      //toast.error("Please select a tenant screening level type");
      return;
    }

    const payload = {
      tenant_screening_level: extractTierNumber(
        data.tenant_screening_level_type
      ),
      occupant_screening_level: extractTierNumber(
        data.occupant_screening_level_type
      ),
    };
    try {
      setIsScreeningLevel(true);
      const res = await updateSettings(
        objectToFormData(payload),
        "screening_levels"
      );
      if (res) {
        toast.success(`Screening levels updated successfully`);
      }
    } catch (err) {
      toast.error("Unable to update Screening levels");
    } finally {
      setIsScreeningLevel(false);
    }
  };

  return (
    <>
      <>
        {staffConfigurations.map(({ title, permissions }) => (
          <SettingsSection key={title} title={title} subTitle={""}>
            <div className="custom-flex-col gap-8">
              <div className="flex">
                <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between w-full max-w-[900px]">
                  {permissions.map((column, index) => (
                    <div key={index} className="custom-flex-col gap-4">
                      {column.map((text, idx) => {
                        const formattedText = formatPermission(text);
                        const isChecked =
                          selectedPermissions[title]?.includes(formattedText) ||
                          false;

                        return (
                          // In the render section where ManagementCheckbox is used
                          <ManagementCheckbox
                            key={idx}
                            darkText
                            checked={isChecked}
                            onClick={() => handleCheckboxClick(title, text)}
                          >
                            {text}
                          </ManagementCheckbox>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-end w-full justify-end">
                <Button
                  size="base_bold"
                  className="py-[10px] px-8"
                  onClick={() => handleUpdate(title)}
                  disabled={loadingStates[roleMapping[title]] || configLoading}
                >
                  {loadingStates[roleMapping[title]] ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </SettingsSection>
        ))}
      </>
      <SettingsSection title="tenant / occupant screening configuration">
        <div className="custom-flex-col gap-8">
          <AuthForm onFormSubmit={handleUpdateScreeningLevel}>
            <div className="custom-flex-col gap-10">
              <div className="custom-flex-col gap-6">
                <p className="text-text-disabled text-sm font-normal">
                  Choose the tier level of tenant/occupant you prefer to apply
                  for your property. If tenants/occupant are not yet on the
                  selected tier, they will need to update their profile to meet
                  your requirements before they can apply. The chosen tier level
                  will determine the content of the application form that
                  tenants/occupant must fill out before applying for listed
                  property.
                  <br />
                  <span className="text-status-error-2">*</span>Choosing from
                  Tier 1 to Tier 5 determines and increases the difficulty of
                  screening new tenant/occupant. Tier 1 and Tier 2 are
                  recommended levels for screening.
                </p>
                <div className="custom-flex-col gap-4">
                  <SettingsSectionTitle title="Tenant / Occupant level type" />
                  {Object.entries(tenant_occupant_level_types).map(
                    ([tier, props]) => (
                      <SettingsTenantOccupantTier
                        key={tier}
                        {...{ tier: tier as TenantOccupantTier, ...props }}
                      />
                    )
                  )}
                </div>
              </div>
              <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-10">
                <Select
                  id="tenant_screening_level_type"
                  label="tenant screening level type"
                  defaultValue={`Tier ${screeningLevel?.tenant_screening_level}`}
                  options={tenant_occupant_options as unknown as string[]}
                  inputContainerClassName="bg-neutral-2 w-full sm:w-[277px]"
                />
                <Select
                  id="occupant_screening_level_type"
                  label="occupant screening level type"
                  defaultValue={`Tier ${screeningLevel?.occupant_screening_level}`}
                  options={tenant_occupant_options as unknown as string[]}
                  inputContainerClassName="bg-neutral-2 w-full sm:w-[277px]"
                />
              </div>
            </div>
            <SettingsUpdateButton
              submit
              loading={isScreeningLevel}
              action={handleUpdateScreeningLevel as any}
            />
          </AuthForm>
        </div>
        {/* </SettingsSection >
      <SettingsSection title="rent penalty settings"> */}
      </SettingsSection>
      <RentPenalty />
    </>
  );
};

export default Management;
