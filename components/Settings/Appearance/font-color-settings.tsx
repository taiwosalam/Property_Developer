import {
  SettingsSectionTitle,
  WebsiteColorSchemes,
  SettingsUpdateButton,
  ZoomSettings,
  CustomColorPicker,
} from "@/components/Settings/settings-components";
import SettingsSection from "@/components/Settings/settings-section";
import { website_color_schemes } from "@/components/Settings/data";
import { AuthForm } from "@/components/Auth/auth-components";
import Select from "@/components/Form/Select/select";
import useGoogleFonts from "@/hooks/useFonts";
import { useThemeStoreSelectors, useThemeStore } from "@/store/themeStore";
import { useZoomStore } from "@/store/zoomStore";
import { debounce } from "@/utils/debounce";
import Image from "next/image";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useState, useEffect } from "react";
import { updateSettings } from "@/app/(nav)/settings/security/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { saveLocalStorage } from "@/utils/local-storage";

type Props = {
  appearance: any;
  setAppearance: (x: any) => void;
  isDarkMode: boolean;
};

const FontAndColorSettings = ({
  appearance,
  setAppearance,
  isDarkMode,
}: Props) => {
  const setColor = useThemeStoreSelectors.getState().setColor;
  const primaryColor = useThemeStore((state) => state.primaryColor);
  const googleFonts = useGoogleFonts();
  const modifiedGoogleFonts = ["Lato", ...googleFonts];
  const [reqLoading, setReqLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [customColor, setCustomColor] = useState("#ffffff");
  const [selectedColor, setSelectedColor] = useState<string | null>(
    appearance.color || primaryColor
  );
  const zoomLevel = useZoomStore((state) => state.zoomLevel);
  const increaseZoom = useZoomStore((state) => state.increaseZoom);
  const decreaseZoom = useZoomStore((state) => state.decreaseZoom);
  const resetZoom = useZoomStore((state) => state.resetZoom);
  const setZoom = useZoomStore((state) => state.setZoom);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    if (appearance.color) {
      setColor(appearance.color);
      setCustomColor(appearance.color);
      setSelectedColor(appearance.color);
    }
  }, [appearance.color]);

  useEffect(() => {
    if (appearance.zoom) setZoom(Number(appearance.zoom));
  }, [appearance.zoom, setZoom]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${zoomLevel}%`;
  }, [zoomLevel]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleFontSelect = (fontName: string) => {
    setAppearance({ ...appearance, font: fontName });
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

  const handleColorSelect = (color: string) => {
    if (!color) return;
    if (isDarkMode && color === "#000000") {
      toast.error("Unable to set primary color in dark mode.");
      setSelectedColor("#2563EB");
      setCustomColor("#2563EB");
    } else {
      setSelectedColor(color);
      setCustomColor(color);
    }
  };

  const handleCustomColorChange = (color: string) => {
    if (!color) return;
    setCustomColor(color);
    setSelectedColor(color);
  };

  const toggleFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem
        .requestFullscreen()
        .then(() => setFullScreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setFullScreen(false))
        .catch(() => {});
    }
  };

  const debouncedHandleColorSelect = debounce(handleColorSelect, 300);
  const debouncedHandleCustomColorChange = debounce(
    handleCustomColorChange,
    300
  );

  const handleUpdateScheme = async () => {
    const payload = {
      dashboardColor: selectedColor,
      fonts: appearance.font,
      zoom: zoomLevel,
    };
    try {
      setReqLoading(true);
      const res = await updateSettings(objectToFormData(payload), "appearance");
      if (res && res.status === 200) {
        toast.success(`Scheme updated successfully`);
        saveLocalStorage("zoomLevel", payload.zoom.toString());
        const additionalDetails = localStorage.getItem("additional_details");
        const details = additionalDetails ? JSON.parse(additionalDetails) : {};
        if (details.appearance) {
          details.appearance.dashboardColor = res.data.data.dashboardColor;
        }
        details.dashboardColor = selectedColor;
        localStorage.setItem("additional_details", JSON.stringify(details));
        window.dispatchEvent(new Event("refetch-settings"));
      }
    } catch (err) {
      toast.error("Failed to Update Scheme");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <SettingsSection title="Theme Font and Color Settings">
      <SettingsSectionTitle
        title="Fonts Templates"
        desc="Choose Your Preferred Font Style for Your Company Profile Website"
      />
      <AuthForm onFormSubmit={handleUpdateScheme} skipValidation>
        <Select
          id="font"
          placeholder={appearance.font || "Select a font"}
          onChange={handleFontSelect}
          options={modifiedGoogleFonts}
          defaultValue={appearance?.font}
          inputContainerClassName="bg-neutral-2"
          className="max-w-[300px] mt-2 mb-4"
        />
        <SettingsSectionTitle
          title="Dashboard Color Scheme"
          desc="Customize the default color to your preference from the available options listed below."
        />
        <WebsiteColorSchemes
          websiteColorSchemes={website_color_schemes as unknown as string[]}
          selectedColor={selectedColor}
          onColorSelect={debouncedHandleColorSelect}
        />
        <div>
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
            state={{
              isOpen: modalOpen,
              setIsOpen: setModalOpen,
            }}
          >
            <ModalTrigger className="h-[40px] w-[40px] my-2 border-dashed rounded-md text-base border border-gray-300 bg-white dark:bg-darkText-primary flex items-center justify-center cursor-pointer">
              +
            </ModalTrigger>
            <ModalContent>
              {/* @ts-ignore */}
              <CustomColorPicker
                color={customColor}
                onChange={debouncedHandleCustomColorChange}
                setModalOpen={setModalOpen}
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
          <SettingsUpdateButton
            submit
            action={handleUpdateScheme}
            loading={reqLoading}
          />
        </div>
      </AuthForm>
    </SettingsSection>
  );
};

export default FontAndColorSettings;
