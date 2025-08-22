"use client";

import { useEffect, useState } from "react";
import { AuthForm } from "@/components/Auth/auth-components";
import Input from "../Form/Input/input";
import Select from "../Form/Select/select";
import {
  SettingsSectionTitle,
  SettingsUpdateButton,
} from "./settings-components";
import SettingsSection from "./settings-section";
import Button from "../Form/Button/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { updateSettings, updateSMTPSettings } from "@/app/(nav)/settings/security/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useSettings } from "@/hooks/settingsContext";

const SettingsSmtp = () => {
  const { data, isLoading, error } = useSettings();
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(false);
  const email = useAuthStore((state) => state.email);
  const smtp_data = data?.smtp_settings;
  const [formState, setFormState] = useState({
    smtp_username: "",
    smtp_password: "",
    smtp_host: "",
    email_encryption: "",
    smtp_port: "",
    from_name: "",
    from_address: "",
    email_protocol: "",
  });

  useEffect(() => {
    if (smtp_data) {
      setFormState({
        smtp_username: data.smtp_settings.smtp_username || "",
        smtp_password: "", //data.smtp_settings.smtp_password || "",
        smtp_host: data.smtp_settings.smtp_host || "",
        email_encryption: data.smtp_settings.email_encryption || "",
        smtp_port: data.smtp_settings.smtp_port || "",
        from_name: data.smtp_settings.from_name || "",
        from_address: data.smtp_settings.from_address || "",
        email_protocol: data.smtp_settings.email_protocol || "",
      });
    }
  }, [smtp_data]);

  function onChangeForm(
    value: string,
    e?: React.ChangeEvent<HTMLInputElement>
  ) {
    setFormState((prev) => ({
      ...prev,
      // Use e?.target.name if e is defined, otherwise fallback to value as key
      [e?.target?.name ?? ""]: value,
    }));
  }

  const handleAddSMTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      from_address: formState.from_address,
      smtp_username: formState.smtp_username,
      email_protocol: "smtp",
      smtp_password: formState.smtp_password,
      smtp_host: formState.smtp_host,
      email_encryption: formState.email_encryption,
      smtp_port: formState.smtp_port,
      from_name: formState.from_name,
    };

    try {
      setLoading(true);
      const res = await updateSMTPSettings(objectToFormData(payload));
      if (res) {
        toast.success("SMTP settings updated successfully");
      }
    } catch (error) {
      console.error("SMTP update error:", error);
      toast.error("Failed to Update SMTP settings");
    } finally {
      setLoading(false);
    }
  };

  console.log(formState.email_encryption);

  return (
    <div>
      <SettingsSection title="Email Configuration">
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Set up email SMTP"
            desc="Choose how you intend to utilize your SMTP: for private and business correspondence, updates, notifications, mobile messages, transactional messages, marketing communications, or other purposes. This feature enables you to utilize your own domain email address to send messages to your users."
          />
          <form onSubmit={handleAddSMTP}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <Input
                id="smtp_username"
                label="SMTP username"
                name="smtp_username"
                className="w-full"
                onChange={onChangeForm}
                value={formState.smtp_username}
                required
              />
              <Input
                id="from_address"
                label="From Address"
                name="from_address"
                className="w-full"
                type="email"
                value={formState.from_address}
                onChange={onChangeForm}
                required
              />
              <Input
                id="smtp_password"
                name="smtp_password"
                label="SMTP password"
                className="w-full"
                value={formState.smtp_password}
                onChange={onChangeForm}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
              <Select
                id="mail_encryption"
                name="email_encryption" // Changed from mail_encryption to match state key
                options={[
                  { value: "tls", label: "TLS" },
                  { value: "ssl", label: "SSL" },
                ]}
                label="mail encryption"
                onChange={(value) => {
                  setFormState((prev) => ({
                    ...prev,
                    email_encryption: value,
                  }));
                }}
                value={formState.email_encryption}
                inputContainerClassName="w-full bg-neutral-2"
              />
              <Input
                id="smtp_port"
                name="smtp_port"
                label="SMTP port"
                className="w-full"
                onChange={onChangeForm}
                value={formState.smtp_port}
                required
              />
              <Input
                id="from_name"
                name="from_name"
                label="from name"
                className="w-full"
                value={formState.from_name}
                onChange={onChangeForm}
                required
              />
              <Input
                id="smtp_host"
                name="smtp_host"
                label="SMTP Server"
                className="w-full"
                value={formState.smtp_host}
                onChange={onChangeForm}
                required
              />
            </div>
            <div className="flex justify-end mt-6">
              <Button size="base_bold" className="py-[10px] px-8" type="submit">
                {loading ? "Please wait..." : "update"}
              </Button>
            </div>
          </form>
        </div>
      </SettingsSection>
    </div>
  );
};

export default SettingsSmtp;
