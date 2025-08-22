import {
  ThemeCard,
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import SettingsSection from "@/components/Settings/settings-section";
import { AuthForm } from "@/components/Auth/auth-components";
import { useTheme } from "next-themes";
import { useState } from "react";
import { updateSettings } from "@/app/(nav)/settings/security/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";

type Props = {
  appearance: any;
  setAppearance: (x: any) => void;
};

const ModeSettings = ({ appearance, setAppearance }: Props) => {
  const { setTheme } = useTheme();
  const [reqLoading, setReqLoading] = useState(false);

  const handleSelect = (value: string) => {
    setTheme(value);
    setAppearance({ ...appearance, mode: value });
  };

  const handleUpdateMode = async () => {
    const payload = { colorMode: appearance.mode };
    try {
      setReqLoading(true);
      const res = await updateSettings(objectToFormData(payload), "appearance");
      if (res && res.status === 200) {
        window.dispatchEvent(new Event("refetch-settings"));
        toast.success(`Mode updated successfully`);
      }
    } catch (err) {
      toast.error("Failed to Update Mode");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <SettingsSection title="Mode">
      <SettingsSectionTitle
        title="Color scheme"
        desc="Choose Light or Dark Mode Scheme."
      />
      <AuthForm onFormSubmit={handleUpdateMode} skipValidation>
        <div className="themes flex gap-5 overflow-x-scroll  scrollbar-hide mt-6">
          <ThemeCard
            img="/global/light-mode.svg"
            value="light"
            onSelect={handleSelect}
            isSelected={appearance.mode === "light"}
          />
          <ThemeCard
            img="/global/dark-mode.svg"
            value="dark"
            onSelect={handleSelect}
            isSelected={appearance.mode === "dark"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton
            submit
            action={handleUpdateMode}
            loading={reqLoading}
          />
        </div>
      </AuthForm>
    </SettingsSection>
  );
};

export default ModeSettings;
