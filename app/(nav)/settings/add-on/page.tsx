"use client";

import { useState } from "react";

// Types
import type { CustomTableProps, DataItem } from "@/components/Table/types";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import SettingsSection from "@/components/Settings/settings-section";

import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";

import {
  added_units,
  current_subscriptions,
  personalized_domain,
} from "./data";

import clsx from "clsx";
import CustomTable from "@/components/Table/table";
import { Drawer, MenuItem } from "@mui/material";
import SettingsLegalDrawer from "@/components/Settings/Modals/settings-legal-drawer";
import useSubscriptionStore from "@/store/subscriptionStore";
import SponsorUnit from "@/components/Settings/sponsor-unit";
import {
  FeatureCompany,
  SMSUnit,
} from "@/components/Settings/subscription-components";
import PersonalizedDomain from "@/components/Settings/personalized-doamin";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const Subscriptions = () => {
  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "h-[45px]",
  };

  const transformedSubscriptions = current_subscriptions.data.map((data) => ({
    ...data,
    status: (
      <p
        className={clsx({
          "text-status-success-2": data.status === "Active",
          "text-status-caution-2": data.status === "Pending",
        })}
      >
        {data.status}
      </p>
    ),
  }));


  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true); // Function to open the drawer
  };


  return (
    <>
      {/* <SettingsSection title="Current Subscription/Ads-on">
        <div className="custom-flex-col gap-7">
          <SettingsSectionTitle desc="Current Subscription and Ads-on Plan are business model where you pay a recurring fee at regular intervals either monthly or annually to access a dashboard modules, data, information and menu. Here's a breakdown of your current subscriptions." />
          <CustomTable
            data={transformedSubscriptions}
            fields={current_subscriptions.fields}
            {...table_style_props}
          />
        </div>
      </SettingsSection> */}
      {/* <div
        className="border-dashed border-brand-9 opacity-50 w-full !px-0"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      ></div> */}
      <div className="custom-flex-col gap-[18px]">
        {/* <h2 className="text-primary-navy dark:text-white text-base font-medium">
          Adds On Subscriptions
        </h2> */}
        <div className="custom-flex-col gap-8">
        <SponsorUnit />
          
          
          <SMSUnit />
          <FeatureCompany />
          {/* <SettingsSection title="Subscription History">
            <div className="custom-flex-col gap-8">
              <CustomTable
                data={transformedSubscriptions}
                fields={current_subscriptions.fields}
                {...table_style_props}
              />
            </div>
          </SettingsSection> */}
          {/* <PersonalizedDomain /> */}
        </div>
      </div>
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        classes={{ paper: "custom-round-scrollbar" }}
        sx={{
          "& .MuiPaper-root": {
            borderTopLeftRadius: "32px",
            borderTopRightRadius: "32px",
            overflow: "auto",
            height: "80vh",
            zIndex: 1,
          },
        }}
      >
        <SettingsLegalDrawer onClose={() => setIsDrawerOpen(false)} />
      </Drawer>
    </>
  );
};

export default Subscriptions;
