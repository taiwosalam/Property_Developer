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

type Props = {
  appearance: any;
  setAppearance: (x: any) => void;
};

const GridListSettings = ({ appearance, setAppearance }: Props) => {
  const [reqLoading, setReqLoading] = useState(false);

  const handleSelect = (value: string) => {
    setAppearance({ ...appearance, view: value });
  };

  const handleUpdateCard = async () => {
    const payload = { card: appearance.view };
    try {
      setReqLoading(true);
      const res = await updateSettings(objectToFormData(payload), "appearance");
      if (res && res.status === 200) {
        window.dispatchEvent(new Event("refetch-settings"));
        toast.success(`Card arrangement updated successfully`);
      }
    } catch (err) {
      toast.error("Failed to Update Card Arrangement");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <SettingsSection title="Grid and List Settings">
      <SettingsSectionTitle
        title="Card Arrangement"
        desc="Kindly select from 'grid' or 'list' to determine the appearance of your cards."
      />
      <AuthForm onFormSubmit={handleUpdateCard} skipValidation>
        <div className="themes flex gap-5 overflow-x-scroll  scrollbar-hide mt-6">
          <ThemeCard
            img="/global/grid-view.svg"
            value="grid"
            onSelect={handleSelect}
            isSelected={appearance.view === "grid"}
          />
          <ThemeCard
            img="/global/list-view.svg"
            value="list"
            onSelect={handleSelect}
            isSelected={appearance.view === "list"}
          />
        </div>
        <div className="flex justify-end mt-4">
          <SettingsUpdateButton
            submit
            action={handleUpdateCard}
            loading={reqLoading}
          />
        </div>
      </AuthForm>
    </SettingsSection>
  );
};

export default GridListSettings;
