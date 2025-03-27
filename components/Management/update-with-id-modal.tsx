"use client";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import LandlordTenantModalPreset from "./landlord-tenant-modal-preset";
import { AuthForm } from "../Auth/auth-components";
import { toast } from "sonner";
import { useState } from "react";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { updateTenantWithEmailOrID } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import { useModal } from "../Modal/modal";
import { updateLandlordWithEmailOrID } from "@/app/(nav)/management/landlord/[landlordId]/manage/data";

const UpdateProfileWithIdModal = ({
  id,
  page,
}: {
  id: number;
  page: "landlord" | "tenant";
}) => {
  const [reqLoading, setReqLoading] = useState(false);
  const { setIsOpen } = useModal();

  const handleUpdateWithEmail = async (data: FormData) => {
    const payload = {
      identifier: data.get("profile_id"),
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
        toast.success("Tenant Profile Updated Successfully");
        window.dispatchEvent(new Event("refetchtenant"));
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Failed to Update User");
    } finally {
      setReqLoading(false);
    }
  };

  return (
    <LandlordTenantModalPreset
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
            label="Input Profile Email"
            inputClassName="text-xs md:text-sm font-normal rounded-[8px]"
          />
          <div className="flex justify-center">
            <Button
              disabled={reqLoading}
              type="submit"
              size="base_medium"
              className="py-2 px-8"
            >
              {reqLoading ? "Please wait..." : "Update"}
            </Button>
          </div>
        </div>
      </AuthForm>
    </LandlordTenantModalPreset>
  );
};

export default UpdateProfileWithIdModal;
