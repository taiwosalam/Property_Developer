import React, { useState } from "react";
import SettingsSection from "./settings-section";
import {
  CustomColorPicker,
  SettingsOthersCheckBox,
  SettingsSectionTitle,
  SettingsUpdateButton,
  WebsiteColorSchemes,
} from "./settings-components";
import DocumentCheckbox from "../Documents/DocumentCheckbox/document-checkbox";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import { website_color_schemes } from "./data";
import Picture from "../Picture/picture";

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

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("#ffffff");
  const [modalOpen, setModalOpen] = useState(false);

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };
  return (
    <div>
      <SettingsSection title="website page & Color Scheme">
        <div className="modules-list mb-5">
          <SettingsOthersCheckBox
            title="Website Page"
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
            checked={true}
          >
            {""}
          </DocumentCheckbox>
          <DocumentCheckbox
            title="Properties For Short Let"
            darkText={false}
            checked={true}
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

        {/* WEBSITE COLORS SETTINGS  */}
        <div className="custom-flex-col">
          <SettingsSectionTitle
            title="color scheme"
            desc="Customize the default color to your preference from the available options listed below."
          />
          <div className="flex gap-4">
            <WebsiteColorSchemes
              websiteColorSchemes={website_color_schemes as unknown as string[]}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
            />
          </div>
        </div>
        <div className="flex flex-col">
          <SettingsSectionTitle desc="Specify a color code or select a color that best represents your brand website. You can also incorporate additional color designs based on your preferences." />
          <div className="flex items-center gap-2">
            {customColor && !modalOpen && (
              <div
                className={`h-[40px] w-[40px] my-2 rounded-md text-base border border-gray-300 flex items-center justify-center cursor-pointer relative`}
                style={{ backgroundColor: customColor }}
              >
                {selectedColor === customColor && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Picture
                      src="/icons/whitemark.svg"
                      alt="Selected"
                      width={24}
                      height={24}
                    />
                  </div>
                )}
              </div>
            )}
            <Modal
              state={{
                isOpen: modalOpen,
                setIsOpen: setModalOpen,
              }}
            >
              <ModalTrigger className="w-10 h-10 rounded-lg border border-dashed border-borders-normal flex items-center justify-center">
                +
              </ModalTrigger>
              <ModalContent>
                <CustomColorPicker
                  color={customColor}
                  onChange={handleCustomColorChange}
                  setModalOpen={setModalOpen}
                />
              </ModalContent>
            </Modal>
          </div>
        </div>
        <SettingsUpdateButton />
      </SettingsSection>
    </div>
  );
};

export default WebsitePages;
