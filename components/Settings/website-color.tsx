"use client";

import React, { useState } from "react";
import SettingsSection from "./settings-section";
import {
  CustomColorPicker,
  SettingsSectionTitle,
  SettingsUpdateButton,
  WebsiteColorSchemes,
} from "./settings-components";
import Select from "../Form/Select/select";
import useGoogleFonts from "@/hooks/useFonts";
import { website_color_schemes } from "./data";
import Picture from "../Picture/picture";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";

const WebsiteColor = () => {
  const googleFonts = useGoogleFonts();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [customColor, setCustomColor] = useState("#ffffff");
  const [modalOpen, setModalOpen] = useState(false);

  const handleFontSelect = (fontName: string) => {
    setSelectedFont(fontName);
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
      / /g,
      "+"
    )}:wght@400;700&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
  };

  const [checkedStates, setCheckedStates] = useState<{
    [key: string]: boolean;
  }>({});

  // console.log("company id", company_id)
  const [address, setAddress] = useState({
    state: "",
    lga: "",
    city: "",
  });
  const handleAddressChange = (key: keyof typeof address, value: string) => {
    setAddress((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "state" && { lga: "", city: "" }),
      ...(key === "lga" && { city: "" }),
    }));
  };

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
      <SettingsSection title="website color settings">
        <SettingsSectionTitle
          title="Fonts Templates"
          desc="Choose Your Preferred Font Style for Your Company Profile Website"
        />
        <div className="flex w-full items-start lg:items-center lg:flex-row flex-col gap-2 mb-4">
          <Select
            id="font"
            label=""
            placeholder="Select a font"
            onChange={(value) => handleFontSelect(value)}
            options={googleFonts}
            inputContainerClassName="bg-neutral-2 w-full mt-2 lg:min-w-[300px]"
          />
          <p
            className="font text-sm text-brand-9"
            style={{ fontFamily: selectedFont || googleFonts[0] }}
          >
            Your website will display a default font initially, but selecting
            your preferred font will update all text on your website to match
            the chosen style.
          </p>
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

export default WebsiteColor;
