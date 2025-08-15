"use client";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-col bg-white w-full md:w-[35vw] h-fit rounded-md">
      <div className="header w-full flex flex-col bg-[#eff6ff] h-20 rounded-md p-4">
        <button className="flex items-center justify-end" onClick={closeEdit}>
          <XIcon />
        </button>
        <h3 className="text-center flex items-center justify-center">
          {" "}
          Edit Customise Domain
        </h3>
      </div>

      <div className="form p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div>
            <div className="bg-neutral-2 rounded-2xl flex flex-col gap-2 mt-4 px-6 py-4">
              <p className="pb-2 text-slate-500">
                Custom Domain allows you to use your own domain name instead of
                the system&apos;s auto-generated subdomain. You can purchase any
                domain of your choice and connect it directly to your company
                dashboard for a more professional and personalized experience.
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
                <div className="flex justify-end gap-2">
                  <Button
                    className="px-16 w-28 bg-blue-500 dark:bg-blue-500 dark:text-white hover:bg-blue-500/70 dark:hover:bg-blue-500/70 text-white mt-5 py-2 h-9"
                    onClick={handleAddCustomDomain}
                    disabled={loading}
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
  );
};
