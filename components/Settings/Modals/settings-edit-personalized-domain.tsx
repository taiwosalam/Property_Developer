import React from "react";

// Imports
import WalletModalPreset from "@/components/Wallet/wallet-modal-preset";
import Button from "@/components/Form/Button/button";
import Input from "@/components/Form/Input/input";

const SettingsEditPersonalizedDomain = () => {
  return (
    <WalletModalPreset title="Edit Personalized Domain" style={{ width: 715 }}>
      <div className="custom-flex-col gap-10">
        <div className="grid grid-cols-2 gap-x-[18px] gap-y-6">
          <Input
            id="domain_name"
            label="domain name"
            placeholder="yourdomainname.com"
          />
          <Input id="patch" label="patch" placeholder="e.g./listings" />
          <Input
            id="redirect_type"
            label="redirect type"
            placeholder="Permanent (301)"
          />
          <Input
            id="redirect_to"
            label="redirect to"
            placeholder="ourproperty.ng/listing/user/324224535"
          />
        </div>
        <div className="flex justify-end">
          <Button size="base_bold" className="py-2 px-8">
            save
          </Button>
        </div>
      </div>
    </WalletModalPreset>
  );
};

export default SettingsEditPersonalizedDomain;
