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
import { sendWalletSecurityOTp } from "@/app/(nav)/settings/profile/data";
import { toast } from "sonner";
import useFetch from "@/hooks/useFetch";
import { WalletDataResponse } from "@/app/(nav)/wallet/data";

const SettingsWalletSection = () => {
  const setWalletStore = useWalletStore((s) => s.setWalletStore)
  
  const [isOpen, setIsOpen] = useState(false);
  const [isForgetPin, setIsForgetPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const { data, error, refetch } =
  useFetch<WalletDataResponse>("/wallets/dashboard");
  
  const walletId = data?.balance.wallet_id;
  const handleSubmit = async (data: Record<string, string>) => {
    try {
      // API request logic here
      setLoading(true)
      const payload = {
        wallet_id: walletId as string,
        
      }
      // if there's no value in current_pin, new_pin, confirm_pin
      if(!data.current_pin && !data.new_pin && !data.confirm_pin) {
        toast.error("Enter current pin, new pin and re-enter pin")
        setIsOpen(false)
      }
      
      // check if there's value in current_pin, new_pin, confirm_pin
      if (data.current_pin && data.new_pin && data.confirm_pin) {
        setWalletStore("walletId", walletId as string);
        setWalletStore("current_pin", data.current_pin);
        setWalletStore("new_pin", data.new_pin);
        setWalletStore("confirm_pin", data.confirm_pin);
        const res = await sendWalletSecurityOTp(payload)
        if (res) {
          toast.success("OTP sent successfully")
          setIsOpen(true)
        }
      }   
      if (isForgetPin) {
        setIsForgetPin(false); // Reset `isForgetPin` after submitting
      }
    } catch (error) {
      console.error("Error during API request", error);
    } finally {
      setLoading(false)
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
                id="current_pin"
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
              id="new_pin"
              label="new pin"
              className="w-full"
              type="password"
              maxLength={4}
              isPinField
              validationErrors={validationErrors}
            />
            <Input
              id="confirm_pin"
              label="re-enter pin"
              className="w-full"
              type="password"
              maxLength={4}
              isPinField
              validationErrors={validationErrors}
            />
          </div>
          <div className="flex justify-end gap-4">
            <Button disabled={loading} size="base_bold" className="py-[10px] px-8" type="submit">
              {loading ? "Please wait..." : "Update"}
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
