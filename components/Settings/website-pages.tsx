import React, { useState } from "react";
import SettingsSection from "./settings-section";
import {
  SettingsOthersCheckBox,
  SettingsUpdateButton,
} from "./settings-components";
import DocumentCheckbox from "../Documents/DocumentCheckbox/document-checkbox";

const websiteOptions = [
  {
    title: "About Us and Reviews Display",
    desc: "Easily toggle the About Us page on or off in your website menu.",
  },
  {
    title: "Services and Contact Page",
    desc: "Control services and contact page display in your website menu by toggling it on or off.",
  },
  {
    title: "Staffs and Branch Options",
    desc: "Toggle staff and branch pages on or off in your website menu",
  },
  {
    title: "Social Link Visibility",
    desc: "Toggle on or off to display social links or icons in your website menu",
  },
  {
    title: "Sponsored Logo",
    desc: "Toggle to activate or deactivate the sponsored logo. Deactivation requires a monthly fee.",
  },
];

const WebsitePages = () => {
  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});
  return (
    <div>
      <SettingsSection title="website page & Module">
        <div className="modules-list mb-5">
          <SettingsOthersCheckBox
            title="Modules Listing"
            desc="Toggle on or off to control the visibility of your listing on the website, based on your subscription plan."
            checked={checkedStates["Modules Listing"] ?? true}
            value="Modules Listing"
            onChange={(value, checked) => {
              setCheckedStates((prev) => ({
                ...prev,
                ["Modules Listing"]: checked,
              }));
            }}
          />
        </div>
        <div className="checks mb-5 flex flex-col gap-2">
          <DocumentCheckbox
            title="Properties For Rent"
            darkText={false}
            checked={true}
          >
            {""}
          </DocumentCheckbox>
          <DocumentCheckbox
            title="Properties For Sale"
            darkText={false}
            checked={false}
          >
            {""}
          </DocumentCheckbox>
          <DocumentCheckbox
            title="Properties For Short Let"
            darkText={false}
            checked={false}
          >
            {""}
          </DocumentCheckbox>
        </div>
        <div className="toggles flex flex-col gap-5 mb-7">
          {websiteOptions.map((option, index) => (
            <SettingsOthersCheckBox
              key={index}
              //   plan="professional" //Plan from API to determine whether user can toggle the switch
              title={option.title}
              desc={option.desc}
              checked={checkedStates[option.title] ?? true}
              value={option.title}
              onChange={(value, checked) => {
                setCheckedStates((prev) => ({
                  ...prev,
                  [option.title]: checked,
                }));
              }}
            />
          ))}
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
    </div>
  );
};

export default WebsitePages;
