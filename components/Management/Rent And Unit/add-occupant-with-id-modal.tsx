"use client";

import { useState, useEffect } from "react";
import ModalPreset from "../landlord-tenant-modal-preset";
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import UserCard, { UserCardProps } from "../landlord-and-tenant-card";
import { AuthForm } from "@/components/Auth/auth-components";
import useFetch from "@/hooks/useFetch";
import { toast } from "sonner";
import { transformMobileUseData } from "@/app/(nav)/management/landlord/data";
import { useModal } from "@/components/Modal/modal";
import { AxiosRequestConfig } from "axios";

const AddOccupantWithId = ({
  selectedId,
  setSelectedId,
  setSelectedTenantId,
}: {
  selectedId?: string | number;
  setSelectedId?: React.Dispatch<React.SetStateAction<string>>;
  setSelectedTenantId?: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileUser, setMobileUser] = useState<UserCardProps | null>(null);
  const [fetchUrl, setFetchUrl] = useState<string | null>(null);
  const { setIsOpen } = useModal();

  const { data: apiData, error, loading } = useFetch<any>(fetchUrl || "");

  useEffect(() => {
    if (!loading && apiData && !error) {
      const transformed = transformMobileUseData(apiData);
      setMobileUser(transformed);
      setFormStep(2);
    }
  }, [loading, apiData, error]);

  useEffect(() => {
    if (error) {
      toast.warning("No User with that Identity");
    }
  }, [error]);

  const handleSubmit = (data: any) => {
    const input = data.identifier?.trim();
    if (!input) {
      toast.warning("Please enter a valid ID");
      return;
    }
    setFetchUrl(`/get-users?identifier=${input}`);
  };

  const handleProceed = async () => {
    if (!apiData?.data?.id) {
      toast.error("Unable to confirm user.");
      return;
    }
    setIsLoading(true);
    setSelectedId?.(apiData.data.id);
    setSelectedTenantId?.(apiData.data.id);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <ModalPreset
      heading="Add occupant with ID"
      style={{
        maxWidth: "600px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="relative min-h-[200px]">
        <AuthForm
          className={`items-center justify-center custom-flex-col gap-5 transition-opacity duration-150 ${
            formStep === 2 ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          onFormSubmit={handleSubmit}
        >
          <div className="custom-flex-col gap-5 max-w-[400px]">
            <Input
              id="identifier"
              label="Input Occupant ID"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />
            <div className="flex justify-center">
              <Button
                type="submit"
                size="base_medium"
                className="py-2 px-8"
                disabled={loading}
              >
                {loading ? "Searching User..." : "Add"}
              </Button>
            </div>
          </div>
        </AuthForm>

        {formStep === 2 && (
          <div className="absolute top-0 left-0 right-0 pb-[20px] min-h-[200px]">
            <div className="flex flex-col gap-4 bg-white items-center justify-center">
              <h3 className="text-black dark:text-darkText-1 text-base font-medium">
                Kindly verify if the name matches the ID of the mobile user you
                intend to add
              </h3>
              {mobileUser && (
                <UserCard className="min-w-[300px]" {...mobileUser} />
              )}
              <div className="flex gap-4">
                <Button
                  type="button"
                  size="base_medium"
                  className="py-2 px-8"
                  disabled={isLoading}
                  onClick={handleProceed}
                >
                  {isLoading ? "Please wait..." : "Proceed"}
                </Button>
                <Button
                  size="custom"
                  onClick={() => {
                    setFormStep(1);
                    setFetchUrl(null);
                    setMobileUser(null);
                  }}
                  type="button"
                  className="py-2 px-8 font-bold text-sm lg:text-base"
                  variant="sky_blue"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalPreset>
  );
};

export default AddOccupantWithId;
