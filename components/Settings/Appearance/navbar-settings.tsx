import {
  ThemeCard,
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "@/components/Settings/settings-components";
import SettingsSection from "@/components/Settings/settings-section";
import { AuthForm } from "@/components/Auth/auth-components";
import { useState } from "react";
import { updateSettings } from "@/app/(nav)/settings/security/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { toast } from "sonner";
import { saveLocalStorage } from "@/utils/local-storage";

type Props = {
  appearance: any;
  setAppearance: (x: any) => void;
};

const NavbarSettings = ({ appearance, setAppearance }: Props) => {
  const [reqLoading, setReqLoading] = useState(false);

  const handleSelect = (value: string) => {
    setAppearance({ ...appearance, navbar: value });
  };

  const handleUpdateNavbar = async () => {
    const payload = { navbar: appearance.navbar };
    try {
      setReqLoading(true);
      const res = await updateSettings(objectToFormData(payload), "appearance");
      if (res && res.status === 200) {
        window.dispatchEvent(new Event("refetch-settings"));
        toast.success(`Navbar updated successfully`);
        saveLocalStorage("navbar", appearance.navbar);
        setAppearance((prev: any) => ({ ...prev, navbar: appearance.navbar }));
      }
    } catch (err) {
      toast.error("Failed to Update Navbar");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <SettingsSection title="Navbar Settings">
      <SettingsSectionTitle
        title="Navbar"
        desc="Kindly select how you want your nav bar to be like"
      />
      <AuthForm onFormSubmit={handleUpdateNavbar} skipValidation>
        <div className="themes flex gap-5 overflow-x-scroll  scrollbar-hide mt-6">
          <ThemeCard
            img="/global/nav1.svg"
            value="column"
            onSelect={handleSelect}
            isSelected={appearance.navbar === "column"}
          />
          <ThemeCard
            img="/global/nav2.svg"
            value="row"
            onSelect={handleSelect}
            isSelected={appearance.navbar === "row"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton
            submit
            action={handleUpdateNavbar}
            loading={reqLoading}
          />
        </div>
      </AuthForm>
    </SettingsSection>
  );
};

export default NavbarSettings;
