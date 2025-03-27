"use client";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import LandlordTenantModalPreset from "./landlord-tenant-modal-preset";
import { AuthForm } from "../Auth/auth-components";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { updateTenantWithEmailOrID } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import { useModal } from "../Modal/modal";
import { updateLandlordWithEmailOrID } from "@/app/(nav)/management/landlord/[landlordId]/manage/data";
import UserCard, { UserCardProps } from "./landlord-and-tenant-card";
import useFetch from "@/hooks/useFetch";
import { transformMobileUseData } from "@/app/(nav)/management/landlord/data";
import ModalPreset from "../Modal/modal-preset";

const UpdateProfileWithIdModal = ({
  id,
  page,
  data,
}: {
  id: number;
  page: "landlord" | "tenant";
  data: UserCardProps | null;
}) => {
  const [activeStep, setActiveStep] = useState(1);
  const [reqLoading, setReqLoading] = useState(false);
  const [mobileUser, setMobileUser] = useState<UserCardProps | null>(null);
  const [userId, setUserId] = useState("");
  const { setIsOpen } = useModal();

  const {
    data: apiData,
    error,
    loading,
    refetch,
  } = useFetch<any>(userId ? `/get-users?identifier=${userId}` : null);

  // Move to step 2 when fetch completes successfully
  useEffect(() => {
    if (!loading && apiData && !error && userId) {
      const trans = transformMobileUseData(apiData);
      setMobileUser(trans);
      setActiveStep(2);
    }
  }, [loading, apiData, error, userId]);

  console.log("mobileUser", mobileUser);

  const handleUpdateWithEmail = async (data: FormData) => {
    const identifier = data.get("profile_id");
    if (!identifier) {
      toast.error("Please enter a profile email or ID");
      return;
    }
    setUserId(identifier as string);
  };

  const handleProceed = async () => {
    const payload = {
      identifier: userId,
      _method: "PUT",
    };
    try {
      setReqLoading(true);
      const action =
        page === "landlord"
          ? updateLandlordWithEmailOrID(payload, id)
          : updateTenantWithEmailOrID(payload, id);
      const res = await action;
      if (res) {
        setActiveStep(3);
        window.dispatchEvent(new Event("refetchtenant"));
      }
    } catch (error) {
      toast.error("Failed to Update User");
    } finally {
      setReqLoading(false);
    }
  };

  const isLandlord = page === "landlord";

  useEffect(() => {
    if (error) {
      toast.warning("No Mobile User with that Identity");
    }
  }, [error]);

  const handleBack = () => {
    setActiveStep(1);
    setMobileUser(null);
    setUserId("");
  };

  return (
    <div>
      {activeStep === 1 ? (
        <LandlordTenantModalPreset
          style={{ minWidth: "100%" }}
          heading={
            page === "landlord"
              ? "Update Landlord/Landlady Profile"
              : "Update Tenants/Occupant Profile"
          }
        >
          <AuthForm
            returnType="form-data"
            onFormSubmit={handleUpdateWithEmail}
            className="flex justify-center"
          >
            <div className="custom-flex-col gap-5 w-[300px]">
              <Input
                id="profile_id"
                label="Input Profile Email/ID"
                inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
              />
              <div className="flex justify-center">
                <Button
                  disabled={reqLoading || loading}
                  type="submit"
                  size="base_medium"
                  className="py-2 px-8"
                >
                  {loading
                    ? "Fetching..."
                    : reqLoading
                    ? "Please wait..."
                    : "Update"}
                </Button>
              </div>
            </div>
          </AuthForm>
        </LandlordTenantModalPreset>
      ) : activeStep === 2 ? (
        <LandlordTenantModalPreset
          heading="Update warning!"
          back={{ handleBack }}
        >
          <div className="w-[100%]">
            <h3>
              Are you sure you want to Update the following
              {isLandlord ? "Landlord/LandLady" : "tenants/occupants"} with the
              mobile users data?
            </h3>
            <div className="flex gap-4 my-4">
              {data && <UserCard {...data} />}
              {mobileUser && <UserCard {...mobileUser} />}
            </div>
            <p>
              Proceeding will override all existing user profile details except
              for the rent records, and inherit all property details
            </p>
            <div className="flex justify-end items-center gap-4 mt-2">
              <Button
                type="button"
                size="base_medium"
                className="py-2 px-8"
                disabled={reqLoading}
                onClick={handleProceed}
              >
                {reqLoading ? "Updating..." : "Proceed"}
              </Button>
              <Button
                size="custom"
                onClick={() => setIsOpen(false)}
                type="button"
                className="py-2 px-8 font-bold text-sm lg:text-base"
                variant="sky_blue"
              >
                Cancel
              </Button>
            </div>
          </div>
        </LandlordTenantModalPreset>
      ) : activeStep === 3 ? (
        <ModalPreset type="success">
          <div className="w-[100%]">
            <p className="text-green-600 text-base font-semibold mb-4">
              The {isLandlord ? "Landlord/Landlady" : "Tenant/Occupant"} profile
              has been successfully updated!
            </p>
            <p className="text-gray-600 mb-6">
              All details have been synced with the mobile user data, except for
              rent records.
            </p>
            <div className="flex justify-center">
              <Button
                type="button"
                size="base_medium"
                className="py-2 px-8"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </ModalPreset>
      ) : null}
    </div>
  );
};

export default UpdateProfileWithIdModal;
