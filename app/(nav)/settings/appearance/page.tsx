"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

// Imports
import SettingsSection from "@/components/Settings/settings-section";
import {
  ThemeCard,
  SettingsSectionTitle,
  CustomColorPicker,
} from "@/components/Settings/settings-components";
import { website_color_schemes } from "@/components/Settings/data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { rgbToHex } from "@/utils/rgbaToHex";
import { hexToRgb } from "@/utils/rgbaToHex";

const Appearance = () => {
  const setColor = useThemeStoreSelectors.getState().setColor;
  const primaryColor = useThemeStoreSelectors.getState().primaryColor;

  // State variables for managing selected options
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [selectedNavbar, setSelectedNavbar] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    rgbToHex(primaryColor)
  );
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");

  // Update primary color and generate secondary color when selectedColor changes
  useEffect(() => {
    if (selectedColor) {
      setColor(selectedColor);
    }
  }, [setColor, selectedColor]);

  const handleSelect = (type: string, value: string) => {
    switch (type) {
      case "theme":
        setSelectedTheme(value);
        console.log("selected theme", value);
        break;
      case "view":
        setSelectedView(value);
        break;
      case "navbar":
        setSelectedNavbar(value);
        break;
      case "mode":
        setSelectedMode(value);
        break;
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleCustomColorClick = () => {
    setShowColorPicker((prev) => !prev); // Toggle the state
  };

  const handleCloseColorPicker = () => {
    setShowColorPicker(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
  };

  return (
    <>
      {/* DASHBOARD THEMES */}
      <SettingsSection title="Dashboard Themes">
        <SettingsSectionTitle
          title="Select Theme Template"
          desc="Select the themes that best match your interests."
        />
        <div className="themes flex gap-5 flex-wrap mt-6">
          <ThemeCard
            img="/global/theme1.svg"
            value="theme1"
            onSelect={(value) => handleSelect("theme", value)}
            isSelected={selectedTheme === "theme1"}
          />
          <ThemeCard
            img="/global/theme2.svg"
            value="theme2"
            onSelect={(value) => handleSelect("theme", value)}
            isSelected={selectedTheme === "theme2"}
          />
          <ThemeCard
            img="/global/theme3.svg"
            value="theme3"
            onSelect={(value) => handleSelect("theme", value)}
            isSelected={selectedTheme === "theme3"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </div>
      </SettingsSection>

      {/* GRID & LIST DISPLAY SETTINGS */}
      <SettingsSection title="Grid and List Settings">
        <SettingsSectionTitle
          title="Card Arrangement"
          desc="Kindly select from 'grid' or 'list' to determine the appearance of your cards."
        />
        <div className="themes flex gap-5 flex-wrap mt-6">
          <ThemeCard
            img="/global/grid-view.svg"
            value="grid"
            onSelect={(value) => handleSelect("view", value)}
            isSelected={selectedView === "grid"}
          />
          <ThemeCard
            img="/global/list-view.svg"
            value="list"
            onSelect={(value) => handleSelect("view", value)}
            isSelected={selectedView === "list"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </div>
      </SettingsSection>

      {/* NAVBAR DISPLAY SETTINGS */}
      <SettingsSection title="Navbar Settings">
        <SettingsSectionTitle
          title="Navbar"
          desc="Kindly select how you want your nav bar to be like"
        />
        <div className="themes flex gap-5 flex-wrap mt-6">
          <ThemeCard
            img="/global/nav1.svg"
            value="nav1"
            onSelect={(value) => handleSelect("navbar", value)}
            isSelected={selectedNavbar === "nav1"}
          />
          <ThemeCard
            img="/global/nav2.svg"
            value="nav2"
            onSelect={(value) => handleSelect("navbar", value)}
            isSelected={selectedNavbar === "nav2"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </div>
      </SettingsSection>

      {/* MODE - DARK/LIGHT MODE SETTINGS */}
      <SettingsSection title="Mode">
        <SettingsSectionTitle
          title="Color scheme"
          desc="Choose Light or Dark Mode Scheme."
        />
        <div className="themes flex gap-5 flex-wrap">
          <ThemeCard
            img="/global/nav1.svg"
            value="light"
            onSelect={(value) => handleSelect("mode", value)}
            isSelected={selectedMode === "light"}
          />
          <ThemeCard
            img="/global/nav2.svg"
            value="dark"
            onSelect={(value) => handleSelect("mode", value)}
            isSelected={selectedMode === "dark"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </div>
      </SettingsSection>

      {/* DASHBOARD COLOR SETTINGS */}
      <SettingsSection title="Theme and Color Settings">
        <SettingsSectionTitle
          title="Dashboard Color Scheme"
          desc="Customize the default color to your preference from the available options listed below."
        />
        <div className="themes flex gap-5 flex-wrap mt-6">
          {website_color_schemes.map((color) => (
            <div
              key={color}
              className={`h-[40px] w-[40px] my-2 rounded-md relative cursor-pointer ${
                selectedColor === color
                  ? "border-2 border-blue-500 rounded-md h-[40px] w-[40px]"
                  : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            >
              {selectedColor === color && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src="/icons/whitemark.svg"
                    alt="Selected"
                    width={24}
                    height={24}
                  />
                </div>
              )}
            </div>
          ))}

          <div className="">
            <p className="text-sm text-text-disabled">
              Specify a color code or select a color that best represents your
              brand. You can also incorporate additional color designs based on
              your preferences.
            </p>
          </div>
        </div>
        <Modal>
          <ModalTrigger
            className={`h-[40px] w-[40px] my-2 border-dashed rounded-md text-base border border-gray-300 bg-white flex items-center justify-center cursor-pointer ${
              showColorPicker ? "border-2 border-blue-500" : ""
            }`}
          >
            +
          </ModalTrigger>
          <ModalContent>
            <CustomColorPicker
              color={customColor}
              onChange={handleCustomColorChange}
              onClose={handleCloseColorPicker}
            />
          </ModalContent>
        </Modal>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Update
          </button>
        </div>
      </SettingsSection>
    </>
  );
};

export default Appearance;
