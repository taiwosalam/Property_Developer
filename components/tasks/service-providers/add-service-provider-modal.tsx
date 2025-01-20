"use client";
import { useState } from "react";

// Types
import type { AddServiceProviderModalOptions } from "./types";

// Imports
import LandlordTenantModalPreset from "@/components/Management/landlord-tenant-modal-preset";
import AddServiceProviderOptions from "./add-service-provider-options";
import AddServiceProviderForm from "./add-service-provider-form";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import { createServiceProvider } from "@/app/(nav)/management/service-providers/data";
const AddServiceProviderModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddServiceProviderModalOptions>("options");

  const handleBack = () => {
    setActiveStep("options");
  };

  const modal_states: Record<
    AddServiceProviderModalOptions,
    {
      heading: string;
      content: React.ReactNode;
    }
  > = {
    options: {
      heading: "Add New Service Provider",
      content: <AddServiceProviderOptions showForm={setActiveStep} />,
    },
    "add-service-provider": {
      heading: "Add Service Provider",
      content: (
        <AddServiceProviderForm
          submitAction={(data: FormData) => {
            // console.log(data);
            // createServiceProvider(data);
          }}
        />
      ),
    },
    "invite-service-provider": {
      heading: "Invite Service Provider",
      content: (
        <form className="flex justify-center" onSubmit={() => {}}>
          <div className="custom-flex-col gap-5 w-[300px]">
            <Input
              id="email"
              label="email"
              type="email"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />
            <Input
              id="phone_number"
              label="Phone Number"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />

            <div className="flex justify-center">
              <Button type="submit" size="base_medium" className="py-2 px-8">
                invite
              </Button>
            </div>
          </div>
        </form>
      ),
    },
    "add-with-email": {
      heading: "Add Service Provider with Email",
      content: (
        <form className="flex justify-center" onSubmit={() => {}}>
          <div className="custom-flex-col gap-5 w-[300px]">
            <Input
              id="service_provider_id"
              label="Service Provider ID"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />
            <div className="flex justify-center">
              <Button type="submit" size="base_medium" className="py-2 px-8">
                invite
              </Button>
            </div>
          </div>
        </form>
      ),
    },
  };

  return (
    <LandlordTenantModalPreset
      heading={modal_states[activeStep].heading}
      back={activeStep !== "options" ? { handleBack } : undefined}
    >
      {modal_states[activeStep].content}
    </LandlordTenantModalPreset>
  );
};

export default AddServiceProviderModal;
