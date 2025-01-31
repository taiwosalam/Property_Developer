"use client"
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


const roleMapping: Record<string, string> = {
  "staff configuration (branch manager)": "manager",
  "staff configuration (account officer)": "account",
  "staff configuration (staff)": "staff",
  // "Users Configuration (Landlord, Occupant & Tenants)": "user",
};

const Management = () => {
  const { data, isLoading, error } = useSettings();
  const [updating, setUpdating] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rentPenalty, setRentPenalty] = useState("")
  const [screeningLevel, setScreeningLevel] = useState({
    tenant_screening_level: 0,
    occupant_screening_level: 0,
  })

  useEffect(()=> {
    if(data?.screening_levels !== null){
      setScreeningLevel({
        tenant_screening_level: data?.screening_levels?.tenant_screening_level,
        occupant_screening_level: data?.screening_levels?.occupant_screening_level
      })
    }

    if (data?.rent_penalty_setting !== null){
      setRentPenalty(data?.rent_penalty_setting?.penalty_value);
    }
  },[data])

  const formatPermission = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[\s\/&-]+/g, "_") // Replace spaces, slashes, ampersands, and dashes with "_"
      .replace(/[^a-z0-9_]/g, ""); // Remove any remaining special characters
  };

  const [selectedPermissions, setSelectedPermissions] = useState(() => {
    return staffConfigurations.reduce((acc, { title, permissions }) => {
      acc[title] = permissions.flat().map(formatPermission); // Convert all permissions to the required format
      return acc;
    }, {} as Record<string, string[]>);
  });



  const handleCheckboxClick = (title: string, permission: string) => {
    const formattedPermission = formatPermission(permission);
    setSelectedPermissions((prev) => {
      const currentPermissions = prev[title] || [];
      const updatedPermissions = currentPermissions.includes(formattedPermission)
        ? currentPermissions.filter((p) => p !== formattedPermission) // Remove if already selected
        : [...currentPermissions, formattedPermission]; // Add if not selected

      return { ...prev, [title]: updatedPermissions };
    });
  };

  const handleUpdate = async (title: string) => {
    const role = roleMapping[title] || title; // Map title or fallback to original
    const permissions = selectedPermissions[title] || []; // Ensure we have an array

    const payload = {
      role, // Use mapped role
      permissions, // Correctly formatted array
    };
    try {
      setLoading(true)
      const res = await updateSettingsManagement(objectToFormData(payload))
      if (res) {
        toast.success(`Management updated successfully`)
      }
    } catch (err) {
      toast.error("Failed to update role")
    } finally {
      setLoading(false)
    }
  };

  // UPDATE RENT PENALTY
  const handleUpdateRentPenalty = async (data: Record<string, any>) => {
    const payload = {
      penalty_value: data.monthly_interest_rent
    }
    
    if(!payload.penalty_value) {
      toast.error("Please enter rent penalty")
      return
    }

    try {
      setLoading(true)
      const res = await updateSettings(objectToFormData(payload), 'rent_penalty_setting')
      if (res) {
        toast.success(`Rent Penalty updated successfully`)
      }
    } catch (err) {
      toast.error("Unable to update Rent Penalty")
    } finally {
      setLoading(false)
    }
  }

  // TENANT & OCCUPANT SCREENING LEVEL
  const handleUpdateScreeningLevel = async (data: Record<string, any>) => {
    const payload = {
      tenant_screening_level: data.tenant_screening_level_type,
      occupant_screening_level: data.occupant_screening_level_type
    }
    try {
      setLoading(true)
      const res = await updateSettings(objectToFormData(payload), 'screening_levels')
      if (res) {
        toast.success(`Screening levels updated successfully`)
      }
    } catch (err) {
      toast.error("Unable to update Screening levels")
    } finally {
      setLoading(false)
    }
  }



  return (
    <>
      <>
        {staffConfigurations.map(({ title, subTitle, permissions }) => (
          <SettingsSection key={title} title={title} subTitle={subTitle}>
            <div className="custom-flex-col gap-8">
              <div className="flex">
                <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between w-full max-w-[900px]">
                  {permissions.map((column, index) => (
                    <div key={index} className="custom-flex-col gap-4">
                      {column.map((text, idx) => {
                        const formattedText = formatPermission(text);
                        return (
                          <DocumentCheckbox
                            key={idx}
                            darkText
                            checked={selectedPermissions[title]?.includes(formattedText)}
                            onClick={() => handleCheckboxClick(title, text)}
                          >
                            {text}
                          </DocumentCheckbox>
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
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          </SettingsSection>
        ))}
      </>
      <SettingsSection
        title="Users Configuration (Landlord, Occupant & Tenants)"
        subTitle="Can be access through mobile app or web cross platform."
      >
        <div className="custom-flex-col gap-8">
          <div className="flex">
            <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between w-full max-w-[900px]">
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText checked={false}>
                  Create Profile Account For Tenants/Occupant
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={false}>
                  Create Profile Account For Landlord/Landlady
                </DocumentCheckbox>
              </div>
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText checked={false}>
                  Create Profile Account For Service Provider
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={false}>
                  Create Profile Account When You Sent Invite
                </DocumentCheckbox>
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="tenant / occupant screening">
        <div className="custom-flex-col gap-8">
          <AuthForm onFormSubmit={handleUpdateScreeningLevel}>
            <div className="custom-flex-col gap-10">
              <div className="custom-flex-col gap-6">
                <p className="text-text-disabled text-sm font-normal">
                  Choose the tier level of tenant/occupant you prefer to apply for
                  your property. If tenants/occupant are not yet on the selected
                  tier, they will need to update their profile to meet your
                  requirements before they can apply. The chosen tier level will
                  determine the content of the application form that
                  tenants/occupant must fill out before applying for listed
                  property.
                  <br />
                  <span className="text-status-error-2">*</span>Choosing from Tier
                  1 to Tier 5 determines and increases the difficulty of screening
                  new tenant/occupant. Tier 1 and Tier 2 are recommended levels
                  for screening.
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
                  defaultValue={`${screeningLevel?.tenant_screening_level}%`}
                  options={tenant_occupant_options as unknown as string[]}
                  inputContainerClassName="bg-neutral-2 w-full sm:w-[277px]"
                />
                <Select
                  id="occupant_screening_level_type"
                  label="occupant screening level type"
                  defaultValue={`${screeningLevel?.occupant_screening_level}%`}
                  options={tenant_occupant_options as unknown as string[]}
                  inputContainerClassName="bg-neutral-2 w-full sm:w-[277px]"
                />
              </div>
            </div>
            <SettingsUpdateButton
            submit
            loading={loading}
            action={handleUpdateScreeningLevel as any}
            />
          </AuthForm>
        </div>
      </SettingsSection >
      <SettingsSection title="rent penalty settings">
        <div className="custom-flex-col gap-8">
          <p className="text-text-disabled text-sm font-normal">
            The tenant is required to make full rent payment on or before the
            expiration of the current rent period. If the tenant is interested
            in renewing the rent but makes payment after the due date, there
            will be a monthly interest charged on the substantive rent until
            both the rent and the accrued interest are fully paid.
          </p>
          <AuthForm onFormSubmit={handleUpdateRentPenalty}>
            <div className="flex">
              <Select
                options={[
                  "1%",
                  "2%",
                  "2.5%",
                  "3%",
                  "3.5%",
                  "5%",
                  "6%",
                  "7%",
                  "7.5%",
                  "8%",
                  "9%",
                  "10%",
                ]}
                defaultValue={rentPenalty}
                id="monthly_interest_rent"
                label="They will be subject to a monthly interest charge on rent"
                inputContainerClassName="bg-neutral-2"
              />
            </div>
            <div className="flex items-end w-full justify-end">
              <SettingsUpdateButton
                submit
                action={handleUpdateRentPenalty as any}
                loading={loading}
                next={false}
              />
            </div>
          </AuthForm>
        </div>
      </SettingsSection>
    </>
  );
};

export default Management;
