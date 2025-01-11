"use client";

import SettingsSection from "./settings-section";
import { SettingsSectionTitle } from "./settings-components";
import { AuthForm } from "@/components/Auth/auth-components";
import Input from "@/components/Form/Input/input";
import { useEffect, useState } from "react";
import Button from "../Form/Button/button";
import type { ValidationErrors } from "@/utils/types";
import { Modal, ModalContent } from "../Modal/modal";
import SettingsOTPFlow from "./Modals/settings-otp-flow";
import { useWalletStore } from "@/store/wallet-store";

const SettingsWalletSection = () => {
  const walletId = useWalletStore((state) => state.walletId);
  const [isOpen, setIsOpen] = useState(false);
  const [isForgetPin, setIsForgetPin] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (data: Record<string, string>) => {
    // Open the modal first
    setIsOpen(true);
  
    try {
      console.log("Going to API", data);
      // Add your API request logic here
      // const response = await fetch(...);
      if (isForgetPin) {
        setIsForgetPin(false); // Reset `isForgetPin` after submitting
      }
    } catch (error) {
      console.error("Error during API request", error);
    }
  };
  

  const handleForgetPin = () => {
    setIsForgetPin(true); // Set `isForgetPin` to true
    setIsOpen(true); // Open the modal
  };
  
  // use useeffect to update isForgetPin
  useEffect(() => {
    if (isForgetPin) {
      setIsOpen(true);
    }
  }, [isForgetPin]);

  
  return (
    <SettingsSection title="wallet">
      <AuthForm
        onFormSubmit={handleSubmit}
        setValidationErrors={setValidationErrors}
      >
        <div className="custom-flex-col gap-8">
          <SettingsSectionTitle
            title="Wallet Pin"
            desc="This PIN is necessary for bank withdrawals, wallet transfers, and other associated transactions."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="flex flex-col gap-1">
              <Input
                id="current-pin"
                label="current pin"
                className="w-full"
                type="password"
                maxLength={4}
                isPinField
                validationErrors={validationErrors}
              />
              <div className="self-start">
                <button
                  type="button"
                  onClick={handleForgetPin}
                  className="text-brand-9 hover:underline"
                >
                  Forget Pin?
                </button>
              </div>
            </div>
            <Input
              id="new-pin"
              label="new pin"
              className="w-full"
              type="password"
              maxLength={4}
              isPinField
              validationErrors={validationErrors}
            />
            <Input
              id="confirm-pin"
              label="re-enter pin"
              className="w-full"
              type="password"
              maxLength={4}
              isPinField
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
          <SettingsOTPFlow isForgetWallet={isForgetPin} />
        </ModalContent>
      </Modal>
    </SettingsSection>
  );
};

export default SettingsWalletSection;
