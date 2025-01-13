"use client";

import SettingsSection from "./settings-section";
import { SettingsSectionTitle } from "./settings-components";
import { AuthForm } from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import { AuthNewPassword } from "@/components/Auth/auth-components";
import { useState } from "react";
import Button from "../Form/Button/button";
import type { ValidationErrors } from "@/utils/types";
import { Modal, ModalContent } from "../Modal/modal";
import SettingsOTPFlow from "./Modals/settings-otp-flow";

const SettingsPasswordSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleSubmit = (data: Record<string, string>) => {
    // communicate with backend
    setIsOpen(true);
    const payload = {
      current_password: data.current_password,
      password: data.password,
      password_confirmation: data.confirm_password,
    }

    console.log("Payload", payload)
  };

  return (
    <SettingsSection title="password">
      <AuthForm
        onFormSubmit={handleSubmit}
        setValidationErrors={setValidationErrors}
      >
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Change Password"
            desc="Use this section to reset your account password."
          />
          <div className="flex flex-col sm:flex-row gap-5">
            <Input
              id="current_password"
              label="current password"
              className="w-full sm:w-[277px]"
              type="password"
              validationErrors={validationErrors}
            />
            <AuthNewPassword
              label="New Password"
              className="w-full sm:w-[277px]"
              validationErrors={validationErrors}
            />
            <Input
              id="confirm_password"
              label="re-enter new password"
              className="w-full sm:w-[277px]"
              type="password"
              validationErrors={validationErrors}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button size="base_bold" className="py-[10px] px-8" type="submit">
              Update
            </Button>
          </div>
        </div>
      </AuthForm>
      <Modal state={{ isOpen, setIsOpen }}>
        <ModalContent>
          <SettingsOTPFlow />
        </ModalContent>
      </Modal>
    </SettingsSection>
  );
};

export default SettingsPasswordSection;
