import {
  ThemeCard,
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import SettingsSection from "@/components/Settings/settings-section";
import { AuthForm } from "@/components/Auth/auth-components";
import { useState } from "react";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { updateSettings } from "@/app/(nav)/settings/security/data";

type Props = {
  appearance: any;
  setAppearance: (x: any) => void;
  currentPlanKeyword: string;
};

const DashboardThemes = ({
  appearance,
  setAppearance,
  currentPlanKeyword,
}: Props) => {
  const [reqLoading, setReqLoading] = useState(false);

  const handleSelect = (value: string) => {
    setAppearance({ ...appearance, theme: value });
  };

  const handleUpdateTheme = async () => {
    const payload = { theme: appearance.theme };
    try {
      setReqLoading(true);
      toast.warning("Sorry, this theme is for Professional Plan subscribers only");
    //   UNCOMMENT LATER WHEN WE HAVE DESIGN
    //   const res = await updateSettings(objectToFormData(payload), "appearance");
    //   if (res && res.status === 200) {
    //     window.dispatchEvent(new Event("refetch-settings"));
    //   }
    } catch (err) {
      toast.error("Failed to Update Theme");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <SettingsSection title="Dashboard Themes">
      <SettingsSectionTitle
        title="Select Theme Template"
        desc="Select the themes that best match your interests."
      />
      <AuthForm onFormSubmit={handleUpdateTheme} skipValidation>
        <div className="themes flex gap-5 flex-wrap mt-6">
          <ThemeCard
            img="/global/theme1.svg"
            value="theme1"
            onSelect={handleSelect}
            isSelected={appearance.theme === "theme1"}
            plan={currentPlanKeyword}
          />
          <ThemeCard
            img="/global/theme2.svg"
            value="theme2"
            onSelect={handleSelect}
            isSelected={appearance.theme === "theme2"}
            plan={currentPlanKeyword}
          />
          <ThemeCard
            img="/global/theme3.svg"
            value="theme3"
            onSelect={handleSelect}
            isSelected={appearance.theme === "theme3"}
            plan={currentPlanKeyword}
          />
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton
            submit
            action={handleUpdateTheme}
            loading={reqLoading}
          />
        </div>
      </AuthForm>
    </SettingsSection>
  );
};

export default DashboardThemes;
