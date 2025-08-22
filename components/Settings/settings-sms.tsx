import React, { useEffect, useState } from "react";
import SettingsSection from "./settings-section";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import Input from "../Form/Input/input";
import { AuthForm } from "../Auth/auth-components";
import { toast } from "sonner";
import {
  updateSettings,
  updateSMSSettings,
} from "@/app/(nav)/settings/security/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useSettings } from "@/hooks/settingsContext";
import { sanitizeDomainInput } from "@/utils/sanitize-domain";

const MAX_SMS_NAME_LENGTH = 11;

const SettingsSMS = () => {
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(false);
  const { data, isLoading, error } = useSettings();
  const [name, setName] = useState<string>("");

  useEffect(() => {
    if (data?.sms_name) {
      const sanitizedName = sanitizeDomainInput(data.sms_name).slice(
        0,
        MAX_SMS_NAME_LENGTH
      );
      setName(sanitizedName);
    }
  }, [data]);

  const handleInputChange = (value: string) => {
    // Sanitize and trim to 11 chars
    const sanitized = sanitizeDomainInput(value).slice(0, MAX_SMS_NAME_LENGTH);
    setName(sanitized);
  };

  const handleUpdateSMS = async (formData: Record<string, string>) => {
    const sanitizedName = sanitizeDomainInput(formData.desired_name).slice(
      0,
      MAX_SMS_NAME_LENGTH
    );

    if (!sanitizedName) {
      toast.error("Name cannot be empty.");
      return;
    }

    const payload = {
      sms_name: sanitizedName,
    };

    try {
      setLoading(true);
      const res = await updateSMSSettings(objectToFormData(payload));
      if (res) {
        toast.success("SMS settings updated successfully");
        setNext(true);
      }
    } catch (err) {
      toast.error("Failed to update SMS name");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SettingsSection title="Customized SMS name">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle desc="Custom sender SMS name allows you to input a preferred name, providing a way to brand your SMS messages with a personalized touch.  replaces the sender numbers displayed on devices receiving your SMS messages with a name of your choice, up to 11 characters in length." />
          <AuthForm onFormSubmit={handleUpdateSMS} skipValidation>
            <div className="flex mb-4 sm:mb-0  gap-5">
              <Input
                id="desired_name"
                label="input desired name"
                className="sm:w-[277px] w-full"
                maxLength={MAX_SMS_NAME_LENGTH}
                name="desired_name"
                value={name}
                defaultValue={name}
                onChange={handleInputChange}
                // autoComplete="off"
              />
            </div>
            <SettingsUpdateButton
              submit
              action={handleUpdateSMS as any}
              loading={loading}
              next={next}
            />
          </AuthForm>
        </div>
      </SettingsSection>
    </div>
  );
};

export default SettingsSMS;
