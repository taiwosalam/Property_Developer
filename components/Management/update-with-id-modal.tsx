"use client";

// Imports
import Input from "@/components/Form/Input/input";
import Button from "@/components/Form/Button/button";
import LandlordTenantModalPreset from "./landlord-tenant-modal-preset";
import { AuthForm } from "../Auth/auth-components";
import { toast } from "sonner";
import { useState } from "react";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import { updateWithEmailOrID } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import { useModal } from "../Modal/modal";

const UpdateProfileWithIdModal = ({ id }: { id: number }) => {
  const [reqLoading, setReqLoading] = useState(false);
  const { setIsOpen } = useModal();

  const handleUpdateWithEmail = async (data: FormData) => {
    const payload = {
      identifier: data.get("profile_id"),
      _method: "PUT"
    };

    // console.log(typeof payload.identifier)
    try {
      setReqLoading(true);
      const res = await updateWithEmailOrID(payload, id);
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
    <LandlordTenantModalPreset heading={"Update Tenants/Occupant Profile"}>
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
