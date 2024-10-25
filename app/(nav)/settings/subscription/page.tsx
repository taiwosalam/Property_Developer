"use client";

import React, { useState, useEffect } from "react";

// Types
import type { CustomTableProps } from "@/components/Table/types";

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
import Select from "@/components/Form/Select/select";
import CustomTable from "@/components/Table/table";
import DocumentCheckbox from "@/components/Documents/DocumentCheckbox/document-checkbox";
import Pagination from "@/components/Pagination/pagination";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/Dropdown/dropdown";
import { VerticalEllipsisIcon } from "@/public/icons/icons";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { Drawer } from "@mui/material";
import SettingsLegalDrawer from "@/components/Settings/Modals/settings-legal-drawer";

const Subscriptions = () => {
  const isDarkMode = useDarkMode();
  const table_style_props: Partial<CustomTableProps> = {
    tableHeadClassName: "bg-brand-9 h-[45px]",
    tableHeadCellSx: {
      color: isDarkMode ? "#EFF6FF" : "#050901",
      fontWeight: 500,
      border: "none",
      textAlign: "left",
      fontSize: "14px",
    },
    tableBodyCellSx: {
      border: "none",
      textAlign: "left",
      fontWeight: 500,
      color: isDarkMode ? "#EFF6FF" : "#050901",
      fontSize: "14px",
    },
    oddRowColor: isDarkMode ? "#101828" : "#fff",
    evenRowColor: isDarkMode ? "#101828" : "#FAFAFA",
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

  const transformedPersonalizedDomain = personalized_domain.data.map(
    (data) => ({
      ...data,
      status: (
        <div className="flex">
          <p className="p-2 bg-brand-1 rounded-[4px] text-brand-9">
            {data.status}
          </p>
        </div>
      ),
      // more: (
      //   <Dropdown>
      //     <DropdownTrigger className="p-2 flex items-center justify-center">
      //       <VerticalEllipsisIcon />
      //     </DropdownTrigger>
      //     <DropdownContent>
      //       <div className="w-[250px] bg-white custom-flex-col py-2 gap-2 text-text-secondary text-base font-bold capitalize text-center">
      //         <button className="p-4">Manage Disbursement</button>
      //         <button className="p-4">Preview Disbursement</button>
      //       </div>
      //     </DropdownContent>
      //   </Dropdown>
      // ),
    })
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true); // Function to open the drawer
  };

  return (
    <>
      <SettingsSection title="Current Subscription/Ads-on">
        <div className="custom-flex-col gap-7">
          <SettingsSectionTitle desc="Current Subscription and Ads-on Plan are business model where you pay a recurring fee at regular intervals either monthly or annually to access a dashboard modules, data, information and menu. Here's a breakdown of your current subscriptions." />
          <CustomTable
            data={transformedSubscriptions}
            fields={current_subscriptions.fields}
            {...table_style_props}
          />
        </div>
      </SettingsSection>
      <div
        className="line h-[1px] border border-dashed border-brand-9 opacity-50 w-full !px-0"
        style={{ paddingLeft: 0, paddingRight: 0 }}
      ></div>
      <div className="custom-flex-col gap-[18px]">
        <h2 className="text-primary-navy dark:text-white text-base font-medium">
          Adds On Subscriptions
        </h2>
        <div className="custom-flex-col gap-8">
          <SettingsSection title="Personalized Domain">
            <div className="custom-flex-col gap-8">
              <div className="custom-flex-col gap-6">
                <SettingsSectionTitle desc="A personalized domain is used for forwarding one URL to another, especially if your company has a website and you want this current landing page to have the same URL as your company website. You can create a sub-domain under your website for this landing page or purchase your preferred domain name and redirect this domain to it." />
                <div className="custom-flex-col gap-10">
                  <div className="custom-flex-col gap-4">
                    <SettingsSectionTitle title="Domain" />
                    <CustomTable
                      fields={personalized_domain.fields}
                      data={transformedPersonalizedDomain}
                      {...table_style_props}
                    />
                  </div>
                  <div className="custom-flex-col gap-8">
                    <SettingsSectionTitle
                      title="Add Domain"
                      desc="Cool! You're about to make domain name! make this site accessible using your own for that to work, you'll need to create a new CNAME record pointing to wp-ultimo-v2.local on your DNS manager. After you finish that step, come back to this screen and click the button below."
                    />
                    <div className="flex">
                      <Input
                        id="domain_name"
                        label="domain name"
                        placeholder="yourdomainname.com"
                        className="w-[277px]"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <SettingsUpdateButton text="add domain" type="add domain" />
            </div>
          </SettingsSection>
          <SettingsSection title="listing">
            <div className="custom-flex-col gap-8">
              <div className="custom-flex-col gap-[30px]">
                <div className="flex flex-col gap-4">
                  <DocumentCheckbox darkText>
                    Automatically list vacant units.
                  </DocumentCheckbox>
                  <DocumentCheckbox darkText>
                    Automatically renew and update property listings.
                  </DocumentCheckbox>
                  <div className="flex gap-4 flex-col md:flex-row">
                    <div className="flex flex-col gap-4 md:flex-row">
                      <Input
                        placeholder="123"
                        id="sponsor_unit_available"
                        label="Listing sponsor Unit Available"
                        className="flex-1"
                      />
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
            </div>
          </SettingsSection>
          <SettingsSection title="Feature Your Company">
            <div className="custom-flex-col gap-6">
              <SettingsSectionTitle desc="Promote your company by showcasing your company logo prominently on the initial screen of the user app, the landing page, and the homepage of the general website. This enhances visibility, allowing potential customers to easily recognize your brand and company. Clicking on your logo directs site visitors to your company page, providing them with more information about your brand and offerings." />
              <div className="custom-flex-col gap-4">
                <p className="text-text-quaternary dark:text-darkText-1 text-base font-medium">
                  The Cost{" "}
                  <span className="text-xs font-normal">
                    (₦1,000/per month)
                  </span>
                </p>
                <div className="flex">
                  <Select
                    required
                    id="months"
                    options={["1", "2", "3", "4"]}
                    inputContainerClassName="w-[277px] bg-neutral-2"
                    label="Choose the number of months from the available options."
                  />
                </div>
              </div>
              <SettingsUpdateButton text="feature now" type="feature" />
            </div>
          </SettingsSection>
          <SettingsSection title="Legal Process">
            <div className="custom-flex-col gap-6">
              <SettingsSectionTitle desc="Property legal process encompasses the various legal procedures and steps involved in matters related to real estate and property ownership. These procedures are governed by laws and regulations established at local, state, and national levels." />
              <div className="flex gap-2">
                <Select
                  options={["property 1", "property 2", "property 3"]}
                  id="legal_process_property"
                  value={""}
                  label="Select property"
                  className="w-full sm:w-1/2"
                />
                <Select
                  options={["Unit 1", "Unit 2", "Unit 3"]}
                  id="legal_process_unit"
                  value={""}
                  label="Select property Unit"
                  className="w-full sm:w-1/2"
                />
              </div>
              <div className="flex items-end justify-end mt-4">
                <Button
                  type="button"
                  className="bg-brand-9 rounded-md text-white"
                  onClick={handleOpenDrawer}
                >
                  Proceed
                </Button>
              </div>
            </div>
          </SettingsSection>
          <SettingsSection title="Subscription History">
            <div className="custom-flex-col gap-8">
              <CustomTable
                data={transformedSubscriptions}
                fields={current_subscriptions.fields}
                {...table_style_props}
              />
              <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={() => {}}
              />
            </div>
          </SettingsSection>
        </div>
      </div>
      <Drawer
        anchor="bottom"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          "& .MuiPaper-root": {
            borderTopLeftRadius: "32px",
            borderTopRightRadius: "32px",
            overflow: "hidden",
            height: "80vh",
          },
        }}
      >
        <SettingsLegalDrawer onClose={() => setIsDrawerOpen(false)} />
      </Drawer>
    </>
  );
};

export default Subscriptions;
