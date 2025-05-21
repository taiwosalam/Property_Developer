import { usePersonalInfoStore } from "@/store/personal-info-store";
import { Button } from "../ui/button";
import Input from "../Form/Input/input";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import useWindowWidth from "@/hooks/useWindowWidth";
import { useState } from "react";
import { addCustomDomain } from "@/app/(nav)/settings/company/data";
import { toast } from "sonner";
import WalletModalPreset from "../Wallet/wallet-modal-preset";

interface CompanySettingDomainProps {
  setIsOpen: (prevState: boolean) => void;
}

const isValidDomain = (domain: string): boolean => {
  const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  return pattern.test(domain);
};

export const CompanySettingDomain = ({
  setIsOpen,
}: CompanySettingDomainProps) => {
  const { isMobile } = useWindowWidth();
  const { company_id } = usePersonalInfoStore();

  const [domainName, setDomainName] = useState("https://");
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
        toast.success("Domain added successfully");
        setIsOpen(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <WalletModalPreset
        title="Add Customise Domain"
        headerClassName="text-xl"
        className="w-[700px]"
      >
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
                  {loading ? "Please wait..." : "Initiate"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </WalletModalPreset>
    </>
  );
};
