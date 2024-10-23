"use client";

import React from "react";

// Images
import Avatar3 from "@/public/empty/avatar-3.svg";

// Imports
import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import UnitItem from "@/components/Management/Properties/unit-item";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";

import {
  LandlordTenantInfo,
  LandlordTenantUserTag,
  LandlordTenantInfoSection,
} from "@/components/Management/landlord-tenant-info-components";
import Button from "@/components/Form/Button/button";
import useDarkMode from "@/hooks/useCheckDarkMode";

const ManageApplication = () => {
  const isDarkMode = useDarkMode();
  return (
    <div className="custom-flex-col gap-[88px] pb-[100px]">
      <div className="custom-flex-col gap-6">
        <div
          style={{ boxShadow: " 4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
          className="custom-flex-col gap-[10px] p-6 rounded-lg overflow-hidden bg-white dark:bg-darkText-primary"
        >
          <p className="text-primary-navy dark:text-white text-xl font-bold">
            Property Details
          </p>
          <SectionSeparator />
          <div className="flex gap-4 lg:gap-0 flex-col lg:flex-row">
            <KeyValueList
              data={{}}
              chunkSize={4}
              referenceObject={{
                "property title": "",
                "full access": "",
                landlord: "",
                description: "",
                state: "",
                branch: "",
                categories: "",
                rent: "",
                "local government": "",
                "account officer": "",
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-5">
          <div
            className="custom-flex-col gap-5 pt-6 bg-white dark:bg-darkText-primary rounded-2xl overflow-hidden"
            style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.02)" }}
          >
            <div className="flex items-center px-10 gap-5">
              <Picture src={Avatar3} alt="profile picture" size={120} rounded />
              <div className="custom-flex-col gap-4">
                <div className="custom-flex-col">
                  <div className="flex gap-2">
                    <p className="text-black dark:text-white text-xl font-bold capitalize">
                      Abimbola Adedeji
                    </p>
                    <BadgeIcon color="green" />
                  </div>
                  <p
                    style={{ color: isDarkMode ? "white" : "rgba(21, 21, 21, 0.70)" }}
                    className={`text-sm dark:text-white font-normal ${secondaryFont.className}`}
                  >
                    abimbola@gmail.com
                  </p>
                </div>
                <div className="flex">
                  <LandlordTenantUserTag type="mobile" />
                </div>
                <p className="text-neutral-800 dark:text-darkText-1 text-base font-medium">
                  ID: 22132876554444
                </p>
              </div>
            </div>
            <div
              className="py-3 px-6 rounded-2xl"
              style={{ backgroundColor: isDarkMode ? "white" : "var(--background-color, #fde9ea80)" }}
            >
              <p className="text-status-error-2 text-xs font-medium">
                The tenant has been flagged for owing rent and causing damages
                by <span className="font-bold">David & Co Limited</span>. Please
                instruct the applicant to settle with their previous manager so
                that they can unflag the account using their ID.
              </p>
            </div>
          </div>
          <LandlordTenantInfo
            info={{
              gender: "",
              birthday: "",
              religion: "",
              phone: "",
              "marital status": "",
            }}
          />
          <LandlordTenantInfo
            heading="bank details"
            info={{
              "bank name": "",
              "account name": "",
              "bank account no": "",
              "wallet ID": "",
            }}
          />
          <LandlordTenantInfo
            heading="others"
            info={{
              occupation: "",
              "employment type": "",
              "family type": "",
              xxxxxxxxxxxxx: "",
            }}
          />
        </div>
      </div>
      <LandlordTenantInfoSection title="Current Rent">
        <div className="opacity-40">
          <UnitItem />
        </div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="Property">
        <div className="opacity-40">
          <UnitItem />
        </div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="Previous Rent">
        <div className="opacity-40">
          <UnitItem />
        </div>
      </LandlordTenantInfoSection>
      <LandlordTenantInfoSection title="Previous Property">
        <div className="opacity-40">
          <UnitItem />
        </div>
      </LandlordTenantInfoSection>
      <div className="fixed bottom-0 right-0 w-full bg-white dark:bg-darkText-primary py-5 px-[60px] flex gap-6 justify-end">
        <Button variant="light_red" size="base_bold" className="py-2 px-8">
          reject application
        </Button>
        <div className="flex gap-6">
          <Button
            size="base_bold"
            variant="sky_blue"
            href="/applications"
            className="py-2 px-8"
          >
            exit
          </Button>
          <Button size="base_bold" className="py-2 px-8">
            create invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageApplication;
