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
        title="staff configuration (branch manager)"
        subTitle="Can be access through mobile app, software, or web cross platform."
      >
        <div className="custom-flex-col gap-8">
          <div className="flex">
            <div className="flex justify-between w-full max-w-[900px]">
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText>
                  Can view and reply branch messages
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can add/delete branch properties
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view and edit branch profile
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can upgrade or downgrade branch staff account
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view branch request
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can approve/decline account officer property added
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can check in visitors
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view all request
                </DocumentCheckbox>
                <DocumentCheckbox darkText>Can create Examine</DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can manage inspections
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can create and manage announcement
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can add and manage tenants/occupants
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view and reply branch reviews
                </DocumentCheckbox>
              </div>
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText>
                  Can add/delete branch staff
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can add/delete branch staff
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view branch account statement
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can approve/decline account officer portfolio
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can add and manage landlords/landlady
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can approve/decline account officer announcement
                </DocumentCheckbox>
                <DocumentCheckbox darkText>Can view complain</DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can create inventory
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can manage calender
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can create service provider
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can check in and manage vehicle records
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can approve and refund caution deposit
                </DocumentCheckbox>
              </div>
            </div>
          </div>
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
      <SettingsSection
        title="staff configuration (account officer)"
        subTitle="Can be access through mobile app, software, or web cross platform."
      >
        <div className="custom-flex-col gap-8">
          <div className="flex">
            <div className="flex justify-between w-full max-w-[900px]">
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText>
                  Can manage assign tenants/occupants
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can manage assign properties
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view service provider
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can create announcement
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can add properties to branch
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view assign request
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can create branch inventory
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can reply assign messages
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can check in and manage vehicle records
                </DocumentCheckbox>
              </div>
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText>
                  Can manage assign landlord/landlady
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can approve/ decline assign task
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view assign account statement
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view assign account statement
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can check in visitors
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can check calendars
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can create branch examine
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
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
            <div className="flex justify-between w-full max-w-[900px]">
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText>
                  Can be added to task
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view assign complain
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view announcement
                </DocumentCheckbox>
                <DocumentCheckbox darkText>Can create examine</DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can reply to inspections
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view service provider
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can check in vehicle records
                </DocumentCheckbox>
              </div>
              <div className="custom-flex-col gap-4">
                <DocumentCheckbox darkText>
                  Can check in visitors
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can view assign request
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can create inventory
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Cab reply assign messages
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
                  Can check calendars
                </DocumentCheckbox>
                <DocumentCheckbox darkText>
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
            <div className="flex gap-10">
              <Select
                id="tenant_screening_level_type"
                label="tenant screening level type"
                options={tenant_occupant_tiers as unknown as string[]}
                inputContainerClassName="bg-neutral-2 w-[277px]"
              />
              <Select
                id="occupant_screening_level_type"
                label="occupant screening level type"
                options={tenant_occupant_tiers as unknown as string[]}
                inputContainerClassName="bg-neutral-2 w-[277px]"
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
