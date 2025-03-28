// Imports
import Input from "../Form/Input/input";
import { useEffect, useState } from "react";
import Button from "../Form/Button/button";
import { AuthForm } from "../Auth/auth-components";
import LandlordTenantModalPreset from "./landlord-tenant-modal-preset";
import UserCard, { UserCardProps } from "./landlord-and-tenant-card";
import useFetch from "@/hooks/useFetch";
import { transformMobileUseData } from "@/app/(nav)/management/landlord/data";
import { toast } from "sonner";

interface InvitationFormProps {
  method: "id" | "email";
  submitAction: (data: any) => Promise<void>;
  formStep?: number;
  identifier?: number | string;
  setIdentifier?: React.Dispatch<React.SetStateAction<string>>;
  setFormStep?: React.Dispatch<React.SetStateAction<number>>;
  page?: "landlord" | "tenant";
}

const InvitationForm: React.FC<InvitationFormProps> = ({
  submitAction,
  method,
  formStep,
  setFormStep,
  identifier,
  setIdentifier,
  page,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mobileUser, setMobileUser] = useState<UserCardProps | null>(null);
  const {
    data: apiData,
    error,
    loading,
    refetch,
  } = useFetch<any>(identifier ? `/get-users?identifier=${identifier}` : null);

  // Move to step 2 when fetch completes successfully
  useEffect(() => {
    if (!loading && apiData && !error && identifier) {
      const trans = transformMobileUseData(apiData);
      setMobileUser(trans);
      setFormStep && setFormStep(3);
    }
  }, [loading, apiData, error, identifier]);

  const handleSubmit = async (data: any) => {
    if (method === "id" && setFormStep && setIdentifier) {
      const identifier = data.identifier;
      if (!identifier) {
        toast.warning("Please enter a profile email or ID");
        return;
      }
      setIdentifier(identifier);
      return;
    } else {
      setIsLoading(true);
      await submitAction(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      toast.warning("No Mobile User with that Identity");
    }
  }, [error]);

  const handleProceed = async () => {
    if (method === 'id'){
      setIsLoading(true)
      await submitAction(identifier!);
      setIsLoading(false)
    }
  };

  return (
    <div className="relative min-h-[200px]">
      <AuthForm
        className={`items-center justify-center custom-flex-col gap-5 transition-opacity duration-150 ${
          formStep === 3 ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        onFormSubmit={handleSubmit}
      >
        <div className="custom-flex-col gap-5 max-w-[400px]">
          {method === "email" ? (
            <>
              <Input
                id="name"
                label="name"
                inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
              />
              <Input
                id="email"
                label="email"
                type="email"
                inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
              />
            </>
          ) : (
            <Input
              // id="profile_id"
              id="identifier"
              label="Input Profile Email/ID"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
            />
          )}
          <div className="flex justify-center">
            <Button
              type="submit"
              size="base_medium"
              className="py-2 px-8"
              disabled={isLoading}
            >
              {isLoading
                ? "Please wait..."
                : method === "email"
                ? "invite"
                : "Add"}
            </Button>
          </div>
        </div>
      </AuthForm>
      {formStep === 3 && (
        <div className="absolute top-0 left-0 right-0 pb-[20px] min-h-[200px]">
          <div className="flex flex-col gap-4 bg-white items-center justify-center">
            <h3 className="text-black dark:text-darkText-1 text-base font-medium">
              Kindly verify if the name matches the ID or Email of the mobile
              user you intend to add
            </h3>
            <div>{mobileUser && <UserCard {...mobileUser} />} </div>
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
        </div>
      )}
    </div>
  );
};

export default InvitationForm;
