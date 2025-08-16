"use client";

import React, { useEffect, useState } from "react";
import SettingsSection from "./settings-section";
import Select from "../Form/Select/select";
import Button from "@/components/Form/Button/button";
import useGoogleFonts from "@/hooks/useFonts";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import {
  transformWebsiteTypography,
  updateCompanyWebsiteTypography,
} from "@/app/(nav)/settings/profile/data";
import useFetch from "@/hooks/useFetch";
import { CompanySettingsResponse } from "@/app/(nav)/settings/others/types";

const settings = [
  // {
  //   title: "Site Title",
  //   desc: "Specify the site title properties.",
  // },
  {
    title: "Body Font",
    desc: "Specify the body font properties.",
    min: 12,
    max: 20,
    default: 16,
    defaultWeight: "400",
  },
  {
    title: "H1",
    desc: "Specify the H1 tag font properties.",
    min: 32,
    max: 64,
    default: 40,
    defaultWeight: "700",
  },
  {
    title: "H2",
    desc: "Specify the H2 tag font properties.",
    min: 24,
    max: 48,
    default: 30,
    defaultWeight: "600", // Verify this is correct
  },
  {
    title: "H3",
    desc: "Specify the H3 tag font properties.",
    min: 19,
    max: 40,
    default: 24,
    defaultWeight: "500",
  },
  {
    title: "H4",
    desc: "Specify the H4 tag font properties.",
    min: 16,
    max: 32,
    default: 22,
    defaultWeight: "500",
  },
  {
    title: "H5",
    desc: "Specify the H5 tag font properties.",
    min: 13,
    max: 24,
    default: 20,
    defaultWeight: "500",
  },
  {
    title: "H6",
    desc: "Specify the H6 tag font properties.",
    min: 11,
    max: 20,
    default: 16,
    defaultWeight: "400",
  },
];

// Options for font weight and style as objects.
const fontWeightsOptions = [
  { label: "ultra-light 100", value: "100" },
  { label: "light 200", value: "200" },
  { label: "book 300", value: "300" },
  { label: "normal 400", value: "400" },
  { label: "medium 500", value: "500" },
  { label: "semi-bold 600", value: "600" },
  { label: "bold 700", value: "700" },
  { label: "extra-bold 800", value: "800" },
  { label: "ultra-bold 900", value: "900" },
  { label: "ultra-light 100 italic", value: "100italic" },
  { label: "light 200 italic", value: "200italic" },
  { label: "book 300 italic", value: "300italic" },
  { label: "normal 400 italic", value: "400italic" },
  { label: "medium 500 italic", value: "500italic" },
  { label: "semi-bold 600 italic", value: "600italic" },
  { label: "bold 700 italic", value: "700italic" },
  { label: "extra-bold 800 italic", value: "800italic" },
  { label: "ultra-bold 900 italic", value: "900italic" },
];

const DEFAULT_FONT = "Lato";

const WebsiteTypography = () => {
  const googleFonts = useGoogleFonts();
  const [selectedFont, setSelectedFont] = useState<string | null>(DEFAULT_FONT);
  const [hasChanged, setHasChanged] = useState(false);

  const [typographySettings, setTypographySettings] = useState<{
    [key: string]: { fontWeight?: string; fontSize?: string };
  }>({});
  const [loading, setLoading] = useState<boolean>(false);

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

  // Update the font weight for a setting.
  const handleFontWeightSelect = (title: string, weightValue: string) => {
    setTypographySettings((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        fontWeight: weightValue,
      },
    }));
  };

  // Update the font size for a setting.
  // Allow only numbers and maximum 2 digits.
  const handleFontSizeChange = (title: string, fontSize: string) => {
    if (!/^\d{0,2}$/.test(fontSize)) return; // Rejects empty string
    setTypographySettings((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        fontSize,
      },
    }));
  };

  useEffect(() => {
    const changesExist = Object.values(typographySettings).some(
      (setting) => setting.fontWeight || setting.fontSize
    );
    setHasChanged(changesExist);
  }, [typographySettings]);

  const { data: companySettings } =
    useFetch<CompanySettingsResponse>("/company/settings");

  useEffect(() => {
    if (companySettings?.data?.website_settings) {
      const updatedSettings = transformWebsiteTypography(companySettings);
      setSelectedFont(updatedSettings.website_font);
      setTypographySettings(updatedSettings.typography);
    }
  }, [companySettings]);

  const handleUpdateWebsiteSettings = async () => {
    const payload = {
      website_font: selectedFont || DEFAULT_FONT,
      typography: typographySettings,
    };

    setLoading(true);
    try {
      await updateCompanyWebsiteTypography(payload);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const resetTypographySection = () => {
    setSelectedFont(DEFAULT_FONT);

    // Create default typography settings from the settings array
    const defaultSettings = settings.reduce((acc, setting) => {
      acc[setting.title] = {
        fontSize: setting.default.toString(),
        fontWeight: setting.defaultWeight,
      };
      return acc;
    }, {} as { [key: string]: { fontSize: string; fontWeight: string } });

    // Update typography settings with defaults
    setTypographySettings(defaultSettings);
  };

  return (
    <div>
      <SettingsSection title="Website Typography & Font Template">
        <SettingsSectionTitle
          title="Fonts Templates"
          desc="Choose Your Preferred Font Style for Your Company Website"
        />
        <div className="flex w-full items-start lg:items-center lg:flex-row flex-col gap-2 mb-8">
          <Select
            id="font"
            label=""
            placeholder="Select a font"
            onChange={(value) => handleFontSelect(value)}
            options={googleFonts}
            value={selectedFont || DEFAULT_FONT}
            inputContainerClassName="bg-neutral-2 w-full mt-2 lg:min-w-[300px]"
          />

          <div className="mb-4 mt-2 max-w-full">
            <p
              className="text-lg"
              style={{
                fontFamily: selectedFont ?? "Lato",
                // fontSize: typographySettings[setting.title]?.fontSize
                //   ? typographySettings[setting.title].fontSize + "px"
                //   : "inherit",
              }}
            >
              AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
            </p>
          </div>
        </div>

        <SettingsSectionTitle
          title="Website Typography"
          desc="Define the font size and style for your website's display."
        />
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {settings.map((setting) => {
            // Get the current font weight (default is "400")
            const currentWeight =
              typographySettings[setting.title]?.fontWeight || "400";
            // Determine if the style is italic.
            const isItalic = currentWeight.includes("italic");
            // Extract the numeric part of the weight.
            const numericWeight = currentWeight.replace("italic", "") || "400";

            // Check if the user has changed something for this setting.
            const hasChanged =
              typographySettings[setting.title]?.fontWeight ||
              typographySettings[setting.title]?.fontSize;

            return (
              <div key={setting.title} className="my-4 ">
                <div className="flex flex-col flex-1 mb-4">
                  <h3 className="text-text-quaternary dark:text-white text-base font-medium capitalize">
                    {setting.title}
                  </h3>
                  <p className="text-text-disabled">{setting.desc}</p>
                </div>

                <div className="flex flex-col k w-full flex-1 justify-end">
                  <div className="wrapper flex md:flex-nowrap sm:flex-wrap gap-2">
                    <Select
                      id={setting.title}
                      options={fontWeightsOptions}
                      label="Font Weight"
                      inputContainerClassName="max-w-[250px] "
                      onChange={(value) =>
                        handleFontWeightSelect(setting.title, value)
                      }
                      value={
                        typographySettings[setting.title]?.fontWeight ||
                        setting.defaultWeight
                      }
                    />

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor={`${setting.title}-size`}
                        className="text-text-label dark:text-darkText-2 text-sm md:text-base font-normal"
                      >
                        Font Size
                      </label>
                      <div className="flex pr-2 gap-2 items-center rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out">
                        <input
                          className="typography w-[200px] px-3 py-[11px] text-xs md:text-sm rounded-[8px] font-normal focus:outline-none keep-spinner appearance-auto opacity-100 dark:bg-transparent"
                          type="number"
                          id={`${setting.title}-size`}
                          placeholder="size"
                          value={
                            typographySettings[setting.title]?.fontSize ||
                            setting.default
                          }
                          onChange={(e) =>
                            handleFontSizeChange(setting.title, e.target.value)
                          }
                          max={setting.max}
                          min={setting.min}
                        />
                        <span className="text-text-disabled">px</span>
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW ONLY SHOWS WHEN CHANGED */}
                  {/* {hasChanged && ( */}
                  <div className="mb-4 mt-2 max-w-full sm:max-w-[300px] overflow-auto custom-round-scrollbar">
                    <p
                      style={{
                        fontWeight: numericWeight || setting.defaultWeight,
                        fontStyle: isItalic ? "italic" : "normal",
                        fontSize: typographySettings[setting.title]?.fontSize
                          ? typographySettings[setting.title].fontSize + "px"
                          : `${setting.default}px`,
                        fontFamily: selectedFont ?? DEFAULT_FONT,
                      }}
                    >
                      AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
                    </p>
                  </div>
                  {/* )} */}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-4">
          {hasChanged && (
            <Button
              variant="light_red"
              size="base_bold"
              className="py-2 px-8"
              onClick={resetTypographySection}
            >
              Reset section
            </Button>
          )}

          <SettingsUpdateButton
            action={handleUpdateWebsiteSettings}
            loading={loading}
          />
        </div>
      </SettingsSection>
    </div>
  );
};

export default WebsiteTypography;
