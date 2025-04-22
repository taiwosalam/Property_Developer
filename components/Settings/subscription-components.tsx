import React, { useState } from "react";
import SettingsSection from "./settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import Input from "../Form/Input/input";
import { CounterButton } from "./SettingsEnrollment/settings-enrollment-components";
import { FeatureFields, SMSFields, SponsorFields } from "@/app/(nav)/settings/subscription/data";
import { ChevronRight } from "lucide-react";
import CustomTable from "../Table/table";
import { CustomTableProps } from "../Table/types";
import Link from "next/link";

export const SMSUnit = () => {
  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };
  return (
    <SettingsSection title="SMS unit">
      <div className="custom-flex-col gap-6">
        <SettingsSectionTitle desc="SMS Credit Balance refers to the amount of credit or balance remaining in your account that can be used to send SMS messages. You have the option to purchase additional credits to increase your capacity for sending SMS messages to your users." />
        <div className="flex">
          <div className="w-[164px] py-2 px-3 rounded-[4px] bg-neutral-2 text-center">
            <p className="text-brand-9 text-xs font-normal">
              Unit Balance: <span className="font-medium">400</span>
            </p>
          </div>
        </div>
        <div className="custom-flex-col gap-4">
          <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium">
            Purchase SMS Credit{" "}
            <span className="text-xs font-normal">(₦4/unit)</span>
          </p>
          <div className="flex">
            <Input
              id="amount"
              label="Enter amount of SMS to purchase"
              className="w-[277px]"
            />
          </div>
        </div>
        <SettingsUpdateButton text="purchase unit" type="purchase unit" />

        <div className="custom-flex-col gap-4">
          <div className="flex justify-between">
            <h2 className="text-text-primary dark:text-white text-xl font-medium">
              Recent Sponsors
            </h2>
            <Link
              href="/settings/subscription/sponsors"
              className="flex items-center gap-1"
            >
              <span className="text-text-label dark:text-darkText-1">
                See all
              </span>
              <ChevronRight color="#5A5D61" size={16} />
            </Link>
          </div>
          <CustomTable
            data={[]}
            fields={SMSFields}
            {...table_style_props}
          />
        </div>
      </div>
    </SettingsSection>
  );
};

// FEATURE COMPANY
export const FeatureCompany = () => {
  const [count, setCount] = useState<number>(1);

  const handleIncrement = () => {
    setCount((prevCount) => (prevCount < 12 ? prevCount + 1 : prevCount));
  };

  const handleDecrement = () => {
    setCount((prevCount) => (prevCount > 1 ? prevCount - 1 : prevCount));
  };

   const table_style_props: Partial<CustomTableProps> = {
      tableHeadClassName: "h-[45px]",
    };

  return (
    <SettingsSection title="Feature Your Company">
      <div className="custom-flex-col gap-6">
        <SettingsSectionTitle desc="Promote your company by showcasing your company logo prominently on the initial screen of the user app, the landing page, and the homepage of the general website. This enhances visibility, allowing potential customers to easily recognize your brand and company. Clicking on your logo directs site visitors to your company page, providing them with more information about your brand and offerings." />
        <div className="custom-flex-col gap-4">
          <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium">
            The Cost{" "}
            <span className="text-xs font-normal">(₦1,000/per month)</span>
          </p>
          <div className="flex justify-between max-w-[150px] px-2 items-center gap-2 border-2 border-text-disabled dark:border-[#3C3D37] rounded-md">
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-2/3 px-2 py-2 border-transparent focus:outline-none"
            />
            <div className="btn flex flex-col items-end justify-end">
              <CounterButton
                onClick={handleIncrement}
                icon="/icons/plus.svg"
                alt="plus"
              />
              <CounterButton
                onClick={handleDecrement}
                icon="/icons/minus.svg"
                alt="minus"
              />
            </div>
          </div>
        </div>
        <SettingsUpdateButton text="feature now" type="feature" />

        <div className="custom-flex-col gap-4">
          <div className="flex justify-between">
            <h2 className="text-text-primary dark:text-white text-xl font-medium">
              Recent Sponsors
            </h2>
            <Link
              href="/settings/subscription/sponsors"
              className="flex items-center gap-1"
            >
              <span className="text-text-label dark:text-darkText-1">
                See all
              </span>
              <ChevronRight color="#5A5D61" size={16} />
            </Link>
          </div>
          <CustomTable
            data={[]}
            fields={FeatureFields}
            {...table_style_props}
          />
        </div>
      
      </div>
    </SettingsSection>
  );
};
