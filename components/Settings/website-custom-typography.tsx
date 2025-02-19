"use client";

import React, { useState } from "react";
import SettingsSection from "./settings-section";
import Select from "../Form/Select/select";
import Button from "@/components/Form/Button/button";

const settings = [
  {
    title: "Site Title",
    desc: "Specify the site title properties.",
  },
  {
    title: "Body Font",
    desc: "Specify the body font properties.",
  },
  {
    title: "H1",
    desc: "Specify the H1 tag font properties.",
  },
  {
    title: "H2",
    desc: "Specify the H2 tag font properties.",
  },
  {
    title: "H3",
    desc: "Specify the H3 tag font properties.",
  },
  {
    title: "H4",
    desc: "Specify the H4 tag font properties.",
  },
  {
    title: "H5",
    desc: "Specify the H5 tag font properties.",
  },
  {
    title: "H6",
    desc: "Specify the H6 tag font properties.",
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

const WebsiteTypography = () => {
  // State to hold typography settings (fontWeight & fontSize) for each setting.
  // Each key is the setting title.
  const [typographySettings, setTypographySettings] = useState<{
    [key: string]: { fontWeight?: string; fontSize?: string };
  }>({});

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
    if (!/^\d{0,2}$/.test(fontSize)) return;
    setTypographySettings((prev) => ({
      ...prev,
      [title]: {
        ...prev[title],
        fontSize,
      },
    }));
  };

  return (
    <div>
      <SettingsSection title="Website Typography Settings">
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
            <div
              key={setting.title}
              className="flex flex-wrap items-center justify-between mb-8"
            >
              <div className="flex flex-col flex-1">
                <h3 className="font-semibold text-[18px]">{setting.title}</h3>
                <p className="text-text-disabled">{setting.desc}</p>
              </div>

              <div className="flex flex-col flex-1 justify-end">
                <div className="wrapper flex md:flex-nowrap sm:flex-wrap gap-2">
                  <Select
                    id={setting.title}
                    options={fontWeightsOptions}
                    label="Font Weight & Style"
                    inputContainerClassName="max-w-[250px]"
                    onChange={(value) =>
                      handleFontWeightSelect(setting.title, value)
                    }
                  />

                  <div className="flex flex-col gap-2">
                    <label htmlFor={`${setting.title}-size`}>Font Size</label>
                    <div className="flex pr-2 gap-2 items-center rounded-[4px] w-full custom-primary-outline border border-solid border-[#C1C2C366] bg-neutral-2 dark:bg-darkText-primary hover:border-[#00000099] dark:hover:border-darkText-2 transition-colors duration-300 ease-in-out">
                      <input
                        className="max-w-[250px] px-3 py-[9px] text-xs md:text-sm rounded-[4px] font-normal focus:outline-none"
                        type="number"
                        id={`${setting.title}-size`}
                        placeholder="size"
                        value={
                          typographySettings[setting.title]?.fontSize || ""
                        }
                        onChange={(e) =>
                          handleFontSizeChange(setting.title, e.target.value)
                        }
                        max={99}
                      />
                      <span className="text-text-disabled">px</span>
                    </div>
                  </div>
                </div>

                {/* PREVIEW ONLY SHOWS WHEN CHANGED */}
                {hasChanged && (
                  <div className="mb-4 mt-2 max-w-[300px] overflow-auto custom-round-scrollbar">
                    <p
                      style={{
                        fontWeight: numericWeight,
                        fontStyle: isItalic ? "italic" : "normal",
                        fontSize: typographySettings[setting.title]?.fontSize
                          ? typographySettings[setting.title].fontSize + "px"
                          : "inherit",
                      }}
                    >
                      AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div className="flex justify-end gap-4">
          <Button variant="light_red" size="base_bold" className="py-2 px-8">
            Reset section
          </Button>
          <Button size="base_bold" className="py-2 px-8">
            Update
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
};

export default WebsiteTypography;
