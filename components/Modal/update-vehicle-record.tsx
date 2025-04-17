"use client";

import { useCallback, useState } from "react";
import Input from "../Form/Input/input";
import Button from "../Form/Button/button";
import { AuthForm } from "../Auth/auth-components";
import { transformMobileUseData } from "@/app/(nav)/management/landlord/data";
import { toast } from "sonner";
import UserCard, {
  UserCardProps,
} from "../Management/landlord-and-tenant-card";
import { getUsers } from "@/utils/getData";
import LandlordTenantModalPreset from "../Management/landlord-tenant-modal-preset";
import { updateVehicleDetails } from "../tasks/vehicles-record/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { updateVehicle } from "@/app/(nav)/management/vehicles-record/records/[recordId]/record/data";
import { useModal } from "./modal";

interface FormData {
  identifier?: string;
}

interface UpdateVehicleWithEmailProps {
  recordId: string;
}

const UpdateVehicleWithEmail: React.FC<UpdateVehicleWithEmailProps> = ({
  recordId,
}) => {
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState<string>("");
  const [mobileUser, setMobileUser] = useState<UserCardProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsOpen } = useModal();

  // Handle form submission (Step 1: Fetch user)
  const handleSubmit = useCallback(async (data: FormData) => {
    const id = data.identifier?.trim();
    if (!id) {
      toast.warning("Please enter a profile email or ID");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const userData = await getUsers(id);
      const transformedData = transformMobileUseData(userData);
      setMobileUser(transformedData);
      setIdentifier(id);
      setFormStep(2);
    } catch (err) {
      setError("No user found with that identifier");
      toast.error("No user found with that identifier");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle confirm action (Step 2: Update vehicle)
  const handleConfirm = useCallback(async () => {
    if (!mobileUser?.id) return;
    setIsLoading(true);
    const payload = {
      _method: "patch",
      user_id: mobileUser.id,
    };
    try {
      const res = await updateVehicle(recordId, objectToFormData(payload));
      if (res) {
        toast.success("Vehicle updated successfully");
        setIsOpen(false);
        setIdentifier("");
        setMobileUser(null);
        setError(null);
        window.dispatchEvent(new Event("refetchVehicleRecord"));
      }
    } catch (err) {
      toast.error("Failed to update vehicle");
      console.error("Update vehicle error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  // Handle back navigation (only in step 2)
  const handleBack = useCallback(() => {
    if (formStep === 2) {
      setFormStep(1);
      setIdentifier("");
      setMobileUser(null);
      setError(null);
    }
  }, [formStep]);

  return (
    <LandlordTenantModalPreset
      heading={
        formStep === 2
          ? "Verify User for Vehicle Update"
          : "Update Vehicle with Email/ID"
      }
      back={formStep === 2 ? { handleBack } : undefined}
    >
      <div className="relative min-h-[200px]">
        <AuthForm
          className={`flex flex-col items-center gap-5 transition-opacity duration-150 ${
            formStep === 2 ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
          onFormSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-5 max-w-[400px] w-full">
            <Input
              id="identifier"
              label="Profile Email/ID"
              inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="base_medium"
              className="py-2 px-8 mx-auto"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Proceed"}
            </Button>
          </div>
        </AuthForm>

        {formStep === 2 && mobileUser && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-transparent p-4">
            <h3 className="text-base font-medium text-gray-900 mb-4 text-center dark:text-white">
              Verify if this is the correct mobile user to update the vehicle
            </h3>
            <UserCard
              className="min-w-[300px] max-w-[400px] mb-4"
              {...mobileUser}
            />
            <div className="flex gap-4">
              <Button
                type="button"
                size="base_medium"
                className="py-2 px-8"
                disabled={isLoading}
                onClick={handleConfirm}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </Button>
              <Button
                type="button"
                size="base_medium"
                variant="sky_blue"
                className="py-2 px-8"
                disabled={isLoading}
                onClick={() => setFormStep(1)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </LandlordTenantModalPreset>
  );
};

export default UpdateVehicleWithEmail;
