"use client";
import { useEffect, useState } from "react";

// Imports
import SettingsSection from "@/components/Settings/settings-section";
import {
  ThemeCard,
  SettingsSectionTitle,
  CustomColorPicker,
  WebsiteColorSchemes,
  SettingsUpdateButton,
  ZoomSettings,
} from "@/components/Settings/settings-components";
import { website_color_schemes } from "@/components/Settings/data";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useThemeStoreSelectors, useThemeStore } from "@/store/themeStore";
import Image from "next/image";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { toast } from "sonner";
import Select from "@/components/Form/Select/select";
import useGoogleFonts from "@/hooks/useFonts";
import { useTheme } from "next-themes";
import useSettingsStore from "@/store/settings";
import { useZoomStore } from "@/store/zoomStore";
import { SelectedOptions } from "@/components/Settings/types";
import { debounce } from "@/utils/debounce";

const Appearance = () => {
  const isDarkMode = useDarkMode();
  const setColor = useThemeStoreSelectors.getState().setColor;
  const primaryColor = useThemeStore((state) => state.primaryColor);

  // State variables for managing selected options
  const { selectedOptions, setSelectedOption } = useSettingsStore();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    selectedOptions.theme
  );
  const [selectedView, setSelectedView] = useState<string | null>(
    selectedOptions.view
  );
  const [selectedNavbar, setSelectedNavbar] = useState<string | null>(
    selectedOptions.navbar
  );
  const [selectedMode, setSelectedMode] = useState<string | null>(
    selectedOptions.mode
  );
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    primaryColor
  );

  // Zoom control
  const zoomLevel = useZoomStore((state) => state.zoomLevel);
  const increaseZoom = useZoomStore((state) => state.increaseZoom);
  const decreaseZoom = useZoomStore((state) => state.decreaseZoom);
  const resetZoom = useZoomStore((state) => state.resetZoom);
  const setZoom = useZoomStore((state) => state.setZoom);

  // const [modalOpen, setModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");
  const { theme, setTheme } = useTheme();
  const [fullScreen, setFullScreen] = useState(false);
  // Update primary color and generate secondary color when selectedColor changes
  useEffect(() => {
    if (selectedColor) {
      setColor(selectedColor);
    }
  }, [setColor, selectedColor]);

  useEffect(() => {
    if (primaryColor) {
      setSelectedColor(primaryColor);
    }
  }, [primaryColor]);

  useEffect(() => {
    // Check if running in the browser
    if (typeof window !== "undefined") {
      storedFont = localStorage.getItem("selectedFont") || "";
      if (storedFont) {
        setSelectedFont(storedFont);
        const link = document.createElement("link");
        link.href = `https://fonts.googleapis.com/css2?family=${storedFont.replace(
          / /g,
          "+"
        )}:wght@400;700&display=swap`;
        link.rel = "stylesheet";
        document.head.appendChild(link);
        document.body.style.fontFamily = storedFont;
      }
    }
  }, []);

  // Zoom controls
  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel}%`;
  }, [zoomLevel]);

  // Fullscreen useEffect controls
  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .then(() => setFullScreen(true))
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
        });
    } else {
      document
        .exitFullscreen()
        .then(() => setFullScreen(false))
        .catch((err) => {
          console.error(
            `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
          );
        });
    }
  };

  let storedFont = "";

  const handleSelect = (type: keyof SelectedOptions, value: string) => {
    if (!value) return;
    setSelectedOption(type, value);
    switch (type) {
      case "theme":
        setSelectedTheme(value);
        break;
      case "view":
        setSelectedView(value);
        toast.success(`Management card view set to ${value}`);
        break;
      case "navbar":
        setSelectedNavbar(value);
        break;
      case "mode":
        setTheme(value);
        setSelectedMode(value);
        break;
      case "font":
        handleFontSelect(value);
        break;
      default:
        break;
    }
  };

  const handleColorSelect = (color: string) => {
    if (!color) return;
    if (isDarkMode && color === "#000000") {
      toast.error("Unable to set primary color in dark mode.");
      setSelectedColor("#2563EB"); // Set to the alternative color
      setCustomColor("#2563EB");
    } else {
      setSelectedColor(color);
      setCustomColor(color);
    }
  };

  const handleCustomColorChange = (color: string) => {
    if (!color) return; // Added check to prevent setting undefined colors
    setCustomColor(color);
    setSelectedColor(color);
    // console.log("selected color = ", color);
  };

  const handleFontSelect = (fontName: string) => {
    if (fontName === "Lato") {
      fontName = "Lato"; // Set to Lato if Default Font is selected
    }
    setSelectedFont(fontName);
    // Check if running in the browser
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedFont", fontName);
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
        / /g,
        "+"
      )}:wght@400;700&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      document.body.style.fontFamily = fontName;
    }
  };

  const debouncedHandleColorSelect = debounce(handleColorSelect, 300);
  const debouncedHandleCustomColorChange = debounce(
    handleCustomColorChange,
    300
  );

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
            value="column"
            onSelect={(value) => handleSelect("navbar", value)}
            isSelected={selectedNavbar === "column"}
          />
          <ThemeCard
            img="/global/nav2.svg"
            value="row"
            onSelect={(value) => handleSelect("navbar", value)}
            isSelected={selectedNavbar === "row"}
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
        <div className="themes flex gap-5 flex-wrap mt-4">
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
      <SettingsSection title="Theme Font and Color Settings">
        <SettingsSectionTitle
          title="Fonts Templates"
          desc="Choose Your Preferred Font Style for Your Company Profile Website"
        />

        {/* <Select
          id="font"
          placeholder={storedFont || "Select a font"}
          onChange={(value) => handleFontSelect(value)}
          options={modifiedGoogleFonts}
          inputContainerClassName="bg-neutral-2"
          className="max-w-[300px] mt-2 mb-4"
        /> */}

        <SettingsSectionTitle
          title="Dashboard Color Scheme"
          desc="Customize the default color to your preference from the available options listed below."
        />

        <WebsiteColorSchemes
          websiteColorSchemes={website_color_schemes as unknown as string[]}
          selectedColor={selectedColor}
          onColorSelect={debouncedHandleColorSelect}
        />

        <div className="">
          <p className="text-sm text-text-disabled">
            Specify a color code or select a color that best represents your
            brand. You can also incorporate additional color designs based on
            your preferences.
          </p>
        </div>

        <div className="flex gap-2">
          {customColor && (
            <div
              className={`h-[40px] w-[40px] my-2 rounded-md text-base border border-gray-300 flex items-center justify-center cursor-pointer relative`}
              style={{ backgroundColor: customColor }}
            >
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
          // state={{
          //   isOpen: modalOpen,
          //   setIsOpen: setModalOpen,
          // }}
          >
            <ModalTrigger className="h-[40px] w-[40px] my-2 border-dashed rounded-md text-base border border-gray-300 bg-white dark:bg-darkText-primary flex items-center justify-center cursor-pointer">
              +
            </ModalTrigger>
            <ModalContent>
              <CustomColorPicker
                color={customColor}
                onChange={debouncedHandleCustomColorChange}
                // onClose={() => {
                //   setCustomColor(customColor);
                //   setModalOpen(false);
                // }}
              />
            </ModalContent>
          </Modal>
        </div>
        {/* ZOOM SETTINGS */}
        <div className="zoom mt-4">
          <SettingsSectionTitle
            title="Zoom Moderation"
            desc="Customize the dashboard's size and font weight to perfectly suit your desired style and functionality."
          />
          {/* ZOOM & FULLSCREEN */}
          <ZoomSettings
            resetZoom={resetZoom}
            increaseZoom={increaseZoom}
            decreaseZoom={decreaseZoom}
            zoomLevel={zoomLevel}
            setZoom={setZoom}
            toggleFullscreen={toggleFullscreen}
            fullScreen={fullScreen}
          />
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton />
        </div>
      </SettingsSection>
    </>
  );
};

export default Appearance;
