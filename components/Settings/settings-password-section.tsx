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
import { changePassword, getPasswordResetOTP } from "@/app/(nav)/settings/security/data";
import { toast } from "sonner";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { useWalletStore } from "@/store/wallet-store";

const SettingsPasswordSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isForgetPin, setIsForgetPin] = useState(false);
  const otp = useWalletStore((s) => s.otp);
  const setWalletStore = useWalletStore((s) => s.setWalletStore);
  const [loading, setLoading] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [forgetPassword, setForgetPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const handleSubmit = async (data: Record<string, string>) => {
    try {
      setLoading(true)
      setWalletStore("current_pin", data.current_password);
      setWalletStore("new_pin", data.password);
      setWalletStore("confirm_pin", data.confirm_password);
      const res = await getPasswordResetOTP()
      if (res) {
        toast.success("Check Email For OTP")
        setIsOpen(true);
        setChangePassword(true);
      }
    } catch (err) {
      toast.error("Failed to send OTP")
    } finally {
      setLoading(false)
    }
  };

  const handleForgetPassword = async() => {
    try{
      setLoading(true)
      const res = await getPasswordResetOTP()
      if (res) {
        toast.success("Check Email For OTP")
        setIsOpen(true);
        setForgetPassword(true);
      }
    } catch(err){
      toast.error("Failed to send OTP")
    }finally{
      setLoading(false)
    }
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
          <div className="flex flex-col sm:flex-row flex-wrap gap-5">
            <div className="flex flex-col gap-1">
              <Input
                id="current_password"
                label="current password"
                className="w-full sm:w-[277px] min-w-[277px]"
                type="password"
                validationErrors={validationErrors}
              />
            </div>
            <AuthNewPassword
              label="New Password"
              className="w-full sm:w-[277px] min-w-[277px]"
              validationErrors={validationErrors}
            />
            <Input
              id="confirm_password"
              label="re-enter new password"
              className="w-full sm:w-[277px] min-w-[277px]"
              type="password"
              validationErrors={validationErrors}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button size="base_bold" className="py-[10px] px-8" type="submit">
              {loading ? "Please wait..." : "update"}
            </Button>
          </div>
        </div>
      </AuthForm>
      <Modal state={{ isOpen, setIsOpen }}>
        <ModalContent>
          <SettingsOTPFlow
            resetPass={forgetPassword}
            changePassword={changePassword}
          />
        </ModalContent>
      </Modal>
    </SettingsSection>
  );
};

export default SettingsPasswordSection;
