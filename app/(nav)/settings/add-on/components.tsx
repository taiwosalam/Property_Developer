"use client";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";
import ModalPreset from "@/components/Modal/modal-preset";
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import useWindowWidth from "@/hooks/useWindowWidth";
import { XIcon } from "@/public/icons/icons";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useSubscriptionStore from "@/store/subscriptionStore";
import { addCustomDomain } from "../company/data";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { ModalTrigger } from "@/components/Modal/modal";

export const ConfirmModal = () => {
  const { openSuccessModal, openSuccess, closeWarning, closeSuccess } =
    useSubscriptionStore();
  const handleSuccess = () => {
    closeWarning();
    openSuccess();
  };

  const [isLoading, setIsLoading] = useState(false);
  const { company_id } = usePersonalInfoStore();

  const handleAddCustomDomain = async () => {
    if (!company_id) return;
    try {
      setIsLoading(true);
      const res = await addCustomDomain(company_id, null);
      if (res) {
        window.dispatchEvent(new Event("refetchProfile"));
        handleSuccess();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to delete your initiated domain? This action is
        permanent and will remove the record completely.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button
          type="button"
          className="py-2 px-8"
          onClick={handleAddCustomDomain}
          disabled={isLoading}
        >
          {isLoading ? "Please wait..." : "Proceed"}
        </Button>
        <button
          onClick={closeWarning}
          className="text-brand-primary text-sm font-medium"
        >
          Back
        </button>
      </div>
    </ModalPreset>
  );
};

export const SuccessModal = () => {
  const { closeSuccess } = useSubscriptionStore();
  return (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        Domain integrations has been successfully removed and updated.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button
          type="button"
          //size="base_medium"
          className="py-2 px-8"
          onClick={closeSuccess}
        >
          ok
        </Button>
      </div>
    </ModalPreset>
  );
};

interface DomainTable {
  data?: {
    status: boolean;
    ssl: string;
    domain: string;
  }[];
}

const isValidDomain = (domain: string): boolean => {
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return pattern.test(domain);
};

export const EditModal = ({ data }: DomainTable) => {
  const {
    openSuccessModal,
    openSuccess,
    closeWarning,
    closeSuccess,
    closeEdit,
  } = useSubscriptionStore();

  const handleSave = () => {
    closeEdit();
    openSuccess();
  };

  const { isMobile } = useWindowWidth();
  const { company_id } = usePersonalInfoStore();

  const [domainName, setDomainName] = useState(
    data && data.length > 0 ? data[0]?.domain : "https://"
  );
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddCustomDomain = async () => {
    if (!company_id) return;

    if (!domainName) {
      toast.error("Please enter a domain name");
      return;
    }

    if (!isValidDomain(domainName)) {
      toast.error("Please enter a valid domain name");
      setError(
        "Invalid domain format. Example: example.com or https://example.com"
      );
      return;
    }
    try {
      setIsLoading(true);
      const res = await addCustomDomain(company_id, domainName);
      if (res) {
        toast.success("Domain updated successfully");
        window.dispatchEvent(new Event("refetchProfile"));
        closeEdit();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div
        className={`w-[700px] mx-auto max-w-[90%] max-h-[85%] bg-white dark:bg-darkText-primary rounded-lg overflow-auto custom-round-scrollbar`}
        style={{
          boxShadow:
            "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        }}
      >
        <div
          className={
            "custom-flex-col py-4 px-6 bg-brand-1 dark:bg-[#3C3D37] sticky top-0 z-[2]"
          }
        >
          <div className="flex items-center justify-end">
            <button
              className="flex items-center text-2xl justify-end text-darkText-primary dark:text-darkText-1"
              onClick={closeEdit}
            >
              <XIcon />
            </button>
          </div>
          <p className="text-text-secondary dark:text-white font-medium text-center capitalize text-lg">
            Edit Customize Domain
          </p>
        </div>
        <div className="p-6">
          <div className="form p-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div>
                <div className="bg-neutral-2 dark:bg-transparent dark:border dark:border-gray-400 rounded-2xl flex flex-col gap-2 mt-4 px-6 py-4">
                  <p className="text-slate-500 dark:text-darkText-1">
                    Custom Domain allows you to use your own domain name instead
                    of the system&apos;s auto-generated subdomain. You can
                    purchase any domain of your choice and connect it directly
                    to your company dashboard for a more professional and
                    personalized experience.
                  </p>
                  <div className="space-y-3">
                    <Input
                      id="domain"
                      value={domainName}
                      label="Custom domain"
                      inputClassName="w-full"
                      className="w-full"
                      onChange={(value: string) => setDomainName(value)}
                    />
                    <div className="flex justify-end gap-2 items-center">
                      <Button
                        className="bg-brand-9 flex items-center dark:bg-brand-9 dark:text-white hover:bg-brand-9/70 dark:hover:bg-brand-9/70 text-white mt-5 px-4"
                        onClick={handleAddCustomDomain}
                        disabled={loading}
                        size="mid"
                      >
                        {loading ? "Please wait..." : "Update"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
