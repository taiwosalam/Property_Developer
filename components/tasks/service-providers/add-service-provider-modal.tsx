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
import {
  createServiceProvider,
  inviteProviderByPhone,
} from "@/app/(nav)/management/service-providers/data";
import { toast } from "sonner";
import { useModal } from "@/components/Modal/modal";
import { useRouter, usePathname } from "next/navigation";
import { clockClasses } from "@mui/x-date-pickers";
import { AuthForm } from "@/components/Auth/auth-components";

const AddServiceProviderModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddServiceProviderModalOptions>("options");
  const [isLoading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const { setIsOpen } = useModal();
  const pathname = usePathname();
  const router = useRouter();
  const [inviteByPhoneLoading, setInviteByPhoneLoading] = useState(false);

  const handleBack = () => {
    if (activeStep === "add-service-provider" && formStep === 2) {
      setFormStep(1);
    } else {
      setActiveStep("options");
      setFormStep(1);
    }
  };

  const handleInviteProviderByPhone = async (data: FormData) => {
    try {
      setInviteByPhoneLoading(true);
      const status = await inviteProviderByPhone(data);
      if (status) {
        toast.success("Invitation sent");
      }
    } catch (error) {
      if (error) {
        toast.error("Something went wrong");
      }
    } finally {
      setInviteByPhoneLoading(false);
    }
  };

  const closeModalAndRefresh = () => {
    setIsOpen(false);
    if (pathname !== "/management/service-providers") {
      router.push("/management/service-providers");
    } else {
      setTimeout(() => {
        window.dispatchEvent(new Event("refetchServiceProviders"));
      }, 0);
    }
  };

  const handleCreateProvider = async (data: FormData) => {
    try {
      setLoading(true);
      const response = await createServiceProvider(data);
      if (response) {
        toast.success("Service provider created successfully");
        closeModalAndRefresh();
      }
    } catch (err) {
      toast.error("Failed to create service provider");
    } finally {
      setLoading(false);
    }
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
          setFormStep={setFormStep}
          stepForm={formStep}
          submitAction={handleCreateProvider}
          isLoading={isLoading}
          setIsLoading={setLoading}
        />
      ),
    },
    "invite-service-provider": {
      heading: "Invite Service Provider",
      content: (
        <AuthForm
          returnType="form-data"
          onFormSubmit={handleInviteProviderByPhone}
          className="flex justify-center items-center"
        >
          <div className="custom-flex-col gap-5 w-[300px]">
            <Input
              id="email"
              name="email"
              label="email"
              type="email"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />
            <Input
              id="phone"
              name="phone"
              label="Phone Number"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />

            <div className="flex justify-center">
              <Button type="submit" size="base_medium" className="py-2 px-8"
              disabled={inviteByPhoneLoading}>
                invite
              </Button>
            </div>
          </div>
        </AuthForm>
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
