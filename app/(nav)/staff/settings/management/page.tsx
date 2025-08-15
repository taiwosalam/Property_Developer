import React from "react";

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
} from "@/components/Settings/data";

import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";

const Management = () => {
  return (
    <>
      <SettingsSection
        title="staff configuration (account officer)"
        subTitle="Can be access through mobile app, software, or web cross platform."
      >
        <div className="custom-flex-col gap-8">
          <div className="flex">
            <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between w-full max-w-[900px]">
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText checked={true}>
                  Can manage assign tenants/occupants
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can manage assign properties
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view service provider
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can create announcement
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can add properties to branch
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view assign request
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can create branch inventory
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can reply assign messages
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can check in and manage vehicle records
                </DocumentCheckbox>
              </div>
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText checked={true}>
                  Can manage assign landlord/landlady
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can approve/ decline assign task
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view assign account statement
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view assign account statement
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can check in visitorsk
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can check calendars
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can create branch examine
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can reply to inspections
                </DocumentCheckbox>
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection
        title="staff configuration (staff)"
        subTitle="Can be access through mobile app or web cross platform."
      >
        <div className="custom-flex-col gap-8">
          <div className="flex">
            <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row justify-between w-full max-w-[900px]">
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText checked={true}>
                  Can be added to task
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view assign complain
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view announcement
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can create examine
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can reply to inspections
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view service provider
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can check in vehicle records
                </DocumentCheckbox>
              </div>
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText checked={true}>
                  Can check in visitors
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view assign request
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can create inventory
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Cab reply assign messages
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can check calendars
                </DocumentCheckbox>
                <DocumentCheckbox darkText checked={true}>
                  Can view and reply assign messages
                </DocumentCheckbox>
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="tenant / occupant screening">
        <div className="custom-flex-col gap-8">
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
                options={tenant_occupant_tiers as unknown as string[]}
                inputContainerClassName="bg-neutral-2 w-full sm:w-[277px]"
              />
              <Select
                id="occupant_screening_level_type"
                label="occupant screening level type"
                options={tenant_occupant_tiers as unknown as string[]}
                inputContainerClassName="bg-neutral-2 w-full sm:w-[277px]"
              />
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection title="rent penalty settings">
        <div className="custom-flex-col gap-8">
          <p className="text-text-disabled text-sm font-normal">
            The tenant is required to make full rent payment on or before the
            expiration of the current rent period. If the tenant is interested
            in renewing the rent but makes payment after the due date, there
            will be a monthly interest charged on the substantive rent until
            both the rent and the accrued interest are fully paid.
          </p>
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
              id="monthly_interest_rent"
              label="They will be subject to a monthly interest charge on rent"
              inputContainerClassName="bg-neutral-2"
            />
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Management;
