import React, { SetStateAction, useEffect, useState } from "react";
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
import {
  IWebsiteSettings,
  updateWebsitePageAndColorScheme,
} from "@/app/(nav)/settings/profile/data";
import {
  ApiResponseUserPlan,
  CompanySettingsResponse,
} from "@/app/(nav)/settings/others/types";
import useFetch from "@/hooks/useFetch";
import SettingsWebsiteDomain from "./settings-website-domain";

const websiteOptions = [
  {
    name: "about_us_display",
    title: "About Us and Reviews Display",
    desc: "Easily toggle the About Us page on or off in your website menu.",
  },
  {
    name: "services_contact_page",
    title: "Services and Contact Page",
    desc: "Control services and contact page display in your website menu by toggling it on or off.",
  },
  {
    name: "staffs_branch_options",
    title: "Staffs and Branch Options",
    desc: "Toggle staff and branch pages on or off in your website menu",
  },
  {
    name: "social_link_visibility",
    title: "Social Link Visibility",
    desc: "Toggle on or off to display social links or icons in your website menu",
  },
  {
    name: "sponsored_logo",
    title: "Sponsored Logo",
    desc: "Toggle to activate or deactivate the sponsored logo. Deactivation requires a monthly fee.",
  },
];

const visibilityOptions = [
  {
    name: "rent_properties",
    title: "Properties For Rent",
  },
  {
    name: "sale_properties",
    title: "Properties For Sale",
  },
  {
    name: "shortlet_properties",
    title: "Properties For ShortLet",
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
  const [userPlan, setUserPlan] = useState<string>("");
  const [propertyVisibility, setPropertyVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [websiteSettings, setWebsiteSettings] =
    useState<IWebsiteSettings | null>(null);

  const { data: companySettings } =
    useFetch<CompanySettingsResponse>("/company/settings");

  console.log(companySettings);

  const { data: planData } = useFetch<ApiResponseUserPlan>(
    "/property-manager-subscription/active"
  );

  useEffect(() => {
    if (planData) {
      const planType = planData?.data?.plan;
      const premiumPlan = planType?.plan_name.toLowerCase();
      setUserPlan(premiumPlan);
    }
  }, [planData]);

  
  useEffect(() => {
    if (companySettings && companySettings?.data) {
      const webSetting = companySettings?.data?.website_settings;
      const updatedSettings: IWebsiteSettings = {
        about_us_display: webSetting?.about_us_display ?? true,
        color_scheme: webSetting?.color_scheme,
        rent_properties: webSetting?.rent_properties ?? true,
        services_contact_page: webSetting?.services_contact_page,
        sale_properties: webSetting?.sale_properties ?? true,
        shortlet_properties: webSetting?.shortlet_properties ?? true,
        social_link_visibility: webSetting?.social_link_visibility,
        sponsored_logo: webSetting?.sponsored_logo ?? true,
        staffs_branch_options: webSetting?.staffs_branch_options ?? true,
        modules_listing: webSetting?.modules_listing ?? true,
      };
      setWebsiteSettings(updatedSettings);
    }
  }, [companySettings]);

  
  useEffect(() => {
    if (websiteSettings) {
      setSelectedColor(websiteSettings.color_scheme ?? "#000000");
      setCustomColor(websiteSettings.color_scheme ?? "#000000");

      setCheckedStates({
        modules_listing: websiteSettings.modules_listing ?? true,
        about_us_display: websiteSettings.about_us_display ?? true,
        services_contact_page: websiteSettings.services_contact_page ?? true,
        social_link_visibility: websiteSettings.social_link_visibility ?? true,
        sponsored_logo: websiteSettings.sponsored_logo ?? true,
        staffs_branch_options: websiteSettings.staffs_branch_options ?? true
        ?? true,
      });

      setPropertyVisibility({
        rent_properties: websiteSettings.rent_properties ?? false,
        sale_properties: websiteSettings.sale_properties ?? false,
        shortlet_properties: websiteSettings.shortlet_properties ?? false,
      });
    }
  }, [websiteSettings]);

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColor(color);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setCustomColor(color);
  };

  const handleSetIsCheckedPropertyVisibility = (
    name: string,
    value: SetStateAction<boolean>
  ) => {
    // if (userPlan === "professional") {
    const newValue =
      typeof value === "function" ? value(propertyVisibility[name]) : value;
    setPropertyVisibility((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    // }
  };

  const handlePropertyVisibility = (name: string, checked: boolean) => {
    // if (userPlan !== "professional") return;

    setPropertyVisibility((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleWebsitePageAndColorScheme = async () => {
    const payload = {
      ...checkedStates,
      ...propertyVisibility,
      color_scheme: selectedColor ?? "default",
    };

    setLoading(true);
    try {
      await updateWebsitePageAndColorScheme(payload);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  //console.log(websiteSettings)

  return (
    <div>
      <SettingsSection title="website page & Color Scheme">
        <div className="modules-list mb-5">
          <SettingsOthersCheckBox
            plan={"professional"}
            title="Website Page"
            name="module_listing"
            desc="Toggle on or off to control the visibility of your listing on the website, based on your subscription plan."
            checked={checkedStates["modules_listing"]}
            value="module_listing"
            onChange={(value, checked) => {
              setCheckedStates((prev) => ({
                ...prev,
                ["modules_listing"]: checked,
              }));
            }}
          />
        </div>
        <div className="checks mb-5 flex flex-col gap-2">
          {visibilityOptions.map((option) => {
            return (
              <DocumentCheckbox
                key={option.name}
                title={option.title}
                darkText={false}
                //checked={true}
                name={option.name}
                state={{
                  isChecked: propertyVisibility[option.name] || false,

                  setIsChecked: (value) =>
                    handleSetIsCheckedPropertyVisibility(option.name, value),
                }}
                onChange={handlePropertyVisibility}
              >
                {""}
              </DocumentCheckbox>
            );
          })}
        </div>
        <div className="toggles flex flex-col gap-5 mb-7">
          {websiteOptions.map((option, index) => (
            <SettingsOthersCheckBox
              key={index}
              plan={"professional"} //Plan from API to determine whether user can toggle the switch
              title={option.title}
              desc={option.desc}
              checked={checkedStates[option.name]} // userPlan === "professional"  ?
              value={option.name}
              onChange={(value, checked) => {
                setCheckedStates((prev) => ({
                  ...prev,
                  [option.name]: checked,
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
        <SettingsUpdateButton
          action={handleWebsitePageAndColorScheme}
          loading={loading}
        />
      </SettingsSection>
    </div>
  );
};

export default WebsitePages;
