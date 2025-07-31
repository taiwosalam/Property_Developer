"use client";
import { useEffect, useState } from "react";

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
  inviteByIdOrEmail,
  inviteProviderByPhone,
} from "@/app/(nav)/management/service-providers/data";
import { toast } from "sonner";
import { useModal } from "@/components/Modal/modal";
import { useRouter, usePathname } from "next/navigation";
import { AuthForm } from "@/components/Auth/auth-components";
import useFetch from "@/hooks/useFetch";
import { transformMobileUseData } from "@/app/(nav)/management/landlord/data";
import UserCard, {
  UserCardProps,
} from "@/components/Management/landlord-and-tenant-card";

const AddServiceProviderModal = () => {
  const [activeStep, setActiveStep] =
    useState<AddServiceProviderModalOptions>("options");
  const [isLoading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const { setIsOpen } = useModal();
  const pathname = usePathname();
  const router = useRouter();
  const [inviteByPhoneLoading, setInviteByPhoneLoading] = useState(false);
  const [inviteByEmailLoading, setInviteByEmailLoading] = useState(false);
  const [identifier, setIdentifier] = useState<string>("");
  const [emailIdInput, setEmailIdInput] = useState("");
  const [mobileUser, setMobileUser] = useState<UserCardProps | null>(null);

  const handleEmailIdInputChange = (
    data: string,
    event?: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEmailIdInput(data);
  };

  const addProvider = () => {
    if (!emailIdInput) return;
    setIdentifier(emailIdInput);
  };

  const {
    data: apiData,
    error,
    loading,
    refetch,
  } = useFetch<any>(identifier ? `/get-users?identifier=${identifier}` : null);

  useEffect(() => {
    if (apiData) {
      const user = transformMobileUseData(apiData);
      setMobileUser(user);
      setFormStep(3);
    }
  }, [apiData, setFormStep, identifier]);

  useEffect(() => {
    if (error) {
      toast.warning("No mobile user found with this ID or email");
    }
  }, [error]);

  const handleBack = () => {
    if (activeStep === "add-service-provider" && formStep === 2) {
      setFormStep(1);
    } else {
      setActiveStep("options");
      setFormStep(1);
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

  const handleInviteProviderByPhone = async (data: FormData) => {
    try {
      setInviteByPhoneLoading(true);
      const res = await inviteProviderByPhone(data);
      if (res) {
        closeModalAndRefresh();
      }
    } catch (error) {
      if (error) {
        toast.error("Something went wrong");
      }
    } finally {
      setInviteByPhoneLoading(false);
    }
  };

  const handleInviteProviderByEmail = async (data: FormData) => {
    try {
      setInviteByEmailLoading(true);
      const res = await inviteByIdOrEmail(data);
      if (res) {
        closeModalAndRefresh();
      }
    } catch (error) {
      if (error) {
        toast.error("Something went wrong");
      }
    } finally {
      setInviteByEmailLoading(false);
    }
  };

  const handleCreateProvider = async (data: FormData) => {
    setLoading(true);
    try {
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
              id="name"
              name="name"
              label="Full Name"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />

            <div className="flex justify-center">
              <Button
                type="submit"
                size="base_medium"
                className="py-2 px-8"
                disabled={inviteByPhoneLoading}
              >
                {inviteByPhoneLoading ? "please wait" : "invite"}
              </Button>
            </div>
          </div>
        </AuthForm>
      ),
    },
    "add-with-email": {
      heading: "Add Service Provider with Email/Id",
      content: (
        <div className="relative min-h-[200px]">
          <div
            className={`items-center justify-center custom-flex-col gap-5 transition-opacity duration-150 ${
              formStep === 3 ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
          >
            <div className="custom-flex-col gap-5 max-w-[400px]">
              <Input
                value={emailIdInput}
                onChange={handleEmailIdInputChange}
                id="identifier"
                label="Service Provider Email/ID"
                inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
              />
              <div className="flex justify-center">
                <Button
                  onClick={addProvider}
                  size="base_medium"
                  className="py-2 px-8"
                >
                  {inviteByEmailLoading ? "please wait..." : "invite"}
                </Button>
              </div>
            </div>
          </div>
          <AuthForm
            returnType="form-data"
            onFormSubmit={handleInviteProviderByEmail}
            className="flex justify-center items-center"
          >
            <input
              hidden
              defaultValue={emailIdInput}
              id="identifier"
              name="identifier"
            />
            {formStep === 3 && (
              <div className="absolute top-0 left-0 right-0 pb-[20px] min-h-[200px]">
                <div className="flex flex-col gap-4 bg-white items-center justify-center">
                  <h3 className="text-black dark:text-darkText-1 text-base font-medium">
                    Kindly verify if the name matches the ID or Email of the
                    mobile user you intend to add
                  </h3>
                  {mobileUser && (
                    <UserCard className="min-w-[300px]" {...mobileUser} />
                  )}
                </div>

                <div className="flex gap-4 justify-center items-center pt-6">
                  <Button
                    size="base_medium"
                    className="py-2 px-8"
                    type="submit"
                    disabled={inviteByEmailLoading}
                  >
                    {inviteByEmailLoading ? "Please wait..." : "Proceed"}
                  </Button>
                  <Button
                    size="custom"
                    onClick={() => {
                      setFormStep && setFormStep(1);
                      setIdentifier && setIdentifier("");
                    }}
                    type="button"
                    className="py-2 px-8 font-bold text-sm lg:text-base"
                    variant="sky_blue"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </AuthForm>
        </div>
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
