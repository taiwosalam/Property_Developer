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
import { Campaign } from "@/components/Settings/settings-campaign";

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
      <div className="custom-flex-col gap-[18px]">
        <div className="custom-flex-col gap-8">
          <SponsorUnit />

          <SMSUnit />
          <FeatureCompany />
          <Campaign />

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
