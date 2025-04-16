"use client";

import React, { useState } from "react";
// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import SettingsSection from "@/components/Settings/settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import { CounterButton } from "./SettingsEnrollment/settings-enrollment-components";
import CustomTable from "../Table/table";
import { added_units } from "@/app/(nav)/settings/subscription/data";
import { CustomTableProps } from "../Table/types";

const SponsorUnit = () => {
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
    <SettingsSection title="listing Sponsor">
      <SettingsSectionTitle desc="Sponsor your property listing on the mobile app to appear first, attract clients faster, and increase visibility to potential tenants and occupants. You can sponsor individual property units directly under listings module" />
      <div className="custom-flex-col gap-8 mt-3">
        <div className="custom-flex-col gap-[30px]">
          <div className="flex flex-col gap-4">
            <div className="flex">
              <div className="w-[164px] py-2 px-3 rounded-[4px] bg-neutral-2 text-center">
                <p className="text-brand-9 text-xs font-normal">
                  Available Sponsors: <span className="font-medium">400</span>
                </p>
              </div>
            </div>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex gap-2 items-end justify-end">
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

                <div className="flex items-end">
                  <Button
                    variant="change"
                    size="xs_normal"
                    className="py-2 px-3"
                  >
                    Buy More Unit
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 md:flex-row">
                <Input
                  id="sponsor-proprty"
                  label="Sponsor Proprty"
                  placeholder="Insert unit ID"
                  className="flex-1"
                />
                <div className="flex items-end">
                  <Button
                    variant="change"
                    size="xs_normal"
                    className="py-2 px-3"
                  >
                    Add Unit ID
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <CustomTable
            data={added_units.data}
            fields={added_units.fields}
            {...table_style_props}
          />
        </div>
        <SettingsUpdateButton />
      </div>
    </SettingsSection>
  );
};

export default SponsorUnit;
