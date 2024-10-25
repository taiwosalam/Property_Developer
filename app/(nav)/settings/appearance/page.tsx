"use client";
import React, { useEffect, useState } from "react";

// Imports
import SettingsSection from "@/components/Settings/settings-section";
import {
  ThemeCard,
  SettingsSectionTitle,
  CustomColorPicker,
  WebsiteColorSchemes,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import { website_color_schemes } from "@/components/Settings/data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { Tooltip } from "@mui/material";
import Image from "next/image";

const Appearance = () => {
  const setColor = useThemeStoreSelectors.getState().setColor;
  const primaryColor = useThemeStoreSelectors.getState().primaryColor;

  // State variables for managing selected options
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<string | null>(null);
  const [selectedNavbar, setSelectedNavbar] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    primaryColor
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");
  // Update primary color and generate secondary color when selectedColor changes
  useEffect(() => {
    if (selectedColor) {
      setColor(selectedColor);
    }
  }, [setColor, selectedColor]);

  const handleSelect = (type: string, value: string) => {
    if (!value) return; 
    switch (type) {
      case "theme":
          setSelectedTheme(value);
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
    if (!color) return; // Added check to prevent setting undefined colors
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (color: string) => {
    if (!color) return; // Added check to prevent setting undefined colors
    setCustomColor(color);
    setSelectedColor(color);
    console.log("selected color = ", color);
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
            <div
              className="relative"
              title="Sorry, this theme is for Professional Plan subscribers only"
            >
              <ThemeCard
                img="/global/theme2.svg"
                value="theme2"
                onSelect={() => {}}
                isSelected={false}
                className="opacity-50 cursor-not-allowed"
              />
            </div>

            <div
              className="relative"
              title="Sorry, this theme is for Professional Plan subscribers only"
            >
              <ThemeCard
                img="/global/theme3.svg"
                value="theme3"
                onSelect={() => {}}
                isSelected={false}
                className="opacity-50 cursor-not-allowed"
              />
            </div>
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton />
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
          <SettingsUpdateButton />
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
          <SettingsUpdateButton />
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
            img="/global/light-mode.svg"
            value="light"
            onSelect={(value) => handleSelect("mode", value)}
            isSelected={selectedMode === "light"}
          />
          <ThemeCard
            img="/global/dark-mode.svg"
            value="dark"
            onSelect={(value) => handleSelect("mode", value)}
            isSelected={selectedMode === "dark"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton />
        </div>
      </SettingsSection>

      {/* DASHBOARD COLOR SETTINGS */}
      <SettingsSection title="Theme and Color Settings">
        <SettingsSectionTitle
          title="Dashboard Color Scheme"
          desc="Customize the default color to your preference from the available options listed below."
        />

        <WebsiteColorSchemes
          websiteColorSchemes={website_color_schemes as unknown as string[]}
          selectedColor={selectedColor}
          onColorSelect={handleColorSelect}
        />

        <div className="">
          <p className="text-sm text-text-disabled">
            Specify a color code or select a color that best represents your
            brand. You can also incorporate additional color designs based on
            your preferences.
          </p>
        </div>

        <div className="flex gap-2">
          {customColor && !modalOpen && (
            <div
              className={`h-[40px] w-[40px] my-2 rounded-md text-base border border-gray-300 flex items-center justify-center cursor-pointer relative`}
              style={{ backgroundColor: customColor }}>
                  {selectedColor === customColor && (
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
          )}
          <Modal
            state={{
              isOpen: modalOpen,
              setIsOpen: setModalOpen,
            }}
          >
            <ModalTrigger
              className={`h-[40px] w-[40px] my-2 border-dashed rounded-md text-base border border-gray-300 bg-white dark:bg-darkText-primary flex items-center justify-center cursor-pointer ${
                modalOpen ? "border-2 border-blue-500" : ""
              }`}
            >
              +
            </ModalTrigger>
            <ModalContent>
              <CustomColorPicker
                color={customColor}
                onChange={handleCustomColorChange}
                onClose={() => {
                  setCustomColor(customColor);
                  setModalOpen(false);
                }}
              />
            </ModalContent>
          </Modal>
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Appearance;
