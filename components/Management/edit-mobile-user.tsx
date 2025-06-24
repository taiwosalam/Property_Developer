import React, { useState, useEffect } from "react";
import LandlordTenantModalPreset from "./landlord-tenant-modal-preset";
import AddLandlordOrTenantCard from "./add-landlord-or-tenant-card";
import Button from "../Form/Button/button";
import { deleteLanlord, deleteTenant } from "./Tenants/data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ModalPreset from "../Modal/modal-preset";
import { useModal } from "../Modal/modal";
import Select from "../Form/Select/select";
import { tenantRejectOptions } from "@/app/(nav)/management/tenants/data";
import { flagTenant } from "@/app/(nav)/management/tenants/[tenantId]/manage/data";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import AddPropertyModal from "./Properties/add-property-modal";

const EditMobileUser = ({
  page,
  id,
  is_flagged,
  flag_reason,
  CAN_DELETE,
}: {
  page: "landlord" | "tenant";
  id: number | string;
  is_flagged?: boolean;
  flag_reason?: string;
  CAN_DELETE?: boolean;
}) => {
  const router = useRouter();
  const isLandlord = page === "landlord";
  const [reqLoading, setReqLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<
    "option" | "flag" | "delete" | "unflag" | "add-property"
  >(is_flagged ? "unflag" : "option");
  const [reason, setReason] = useState("");
  const { setIsOpen } = useModal();

  // Reset reason when switching to flag step
  useEffect(() => {
    if (activeStep === "flag") {
      setReason("");
    }
  }, [activeStep]);

  const handleFlagTenant = async () => {
    if (!reason) {
      toast.error("Please select a reason before flagging");
      return;
    }
    const payload = {
      is_flagged: 1,
      reason: reason,
    };
    try {
      setReqLoading(true);
      const res = await flagTenant(id as number, objectToFormData(payload));
      if (res) {
        toast.success("Flagged Successfully");
        setIsOpen(false);
        window.dispatchEvent(new Event("refetchtenant"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try again");
    } finally {
      setReqLoading(false);
    }
  };

  const handleUnflagTenant = async () => {
    const payload = {
      is_flagged: 0,
      reason: "",
    };
    try {
      setReqLoading(true);
      const res = await flagTenant(id as number, objectToFormData(payload));
      if (res) {
        toast.success("Unflagged Successfully");
        setIsOpen(false);
        window.dispatchEvent(new Event("refetchtenant"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, try again");
    } finally {
      setReqLoading(false);
    }
  };

  const handleDelete = async () => {
    const deleteWarningMsg = isLandlord
      ? "You cannot delete landlord with active rent"
      : "You cannot delete tenant with active rent";
    if (!CAN_DELETE) {
      toast.warning(deleteWarningMsg);
      setIsOpen(false);
      return;
    }
    try {
      const action = isLandlord
        ? deleteLanlord(id as number)
        : deleteTenant(id as number);
      const res = await action;
      if (res) {
        toast.success("Deleted Successfully");
        if (isLandlord) {
          router.push("/management/landlord");
        } else {
          router.push("/management/tenant");
        }
      }
    } catch (error) {
      toast.error("Failed to Delete, Try again");
    } finally {
      setReqLoading(false);
    }
  };

  const continuePropertyUnit = ()=> {
    if (isLandlord) {
      setActiveStep("add-property")
    } else {
      router.push(`/management/rent-unit/?is_active=vacant&tenant_id=${id}`)
    }
  }

  return (
    <>
      {activeStep === "option" ? (
        <LandlordTenantModalPreset heading="Edit Profile">
          <div className="flex flex-col md:flex-row items-center justify-center gap-7 md:gap-14">
            <AddLandlordOrTenantCard
              buttonText="proceed"
              title={is_flagged ? "Unflag Profile" : "Flag Profile"}
              loading={reqLoading}
              onClick={() => setActiveStep(is_flagged ? "unflag" : "flag")}
              desc={
                is_flagged
                  ? "This user is currently flagged. Proceed to unflag them."
                  : "Do you want to restrict the client from acquiring property from another company? If you proceed, they will be informed of your action."
              }
            />
            <AddLandlordOrTenantCard
              loading={reqLoading}
              buttonText="proceed"
              title="Delete Profile"
              onClick={() => setActiveStep("delete")}
              desc="Do you want to remove this client from your dashboard? You can only delete users who have no properties attached to their profile."
            />

            <AddLandlordOrTenantCard
              loading={reqLoading}
              buttonText="proceed"
              title={isLandlord ? "Add New Property" : "Link New Unit"}
              onClick={continuePropertyUnit}
              desc={
                isLandlord
                  ? "The process of adding a new property and its unit to a profile, assigning ownership of both to that profile."
                  : "The process involves connecting a newly added rental or facility unit to an existing profile record within the system."
              }
            />
          </div>
        </LandlordTenantModalPreset>
      ) : activeStep === "delete" ? (
        <ModalPreset type="warning">
          <div>Are you sure you want to delete this user?</div>
          <div className="flex gap-2">
            <Button
              onClick={handleDelete}
              size="base_medium"
              disabled={reqLoading}
              variant="light_red"
              className="py-2 px-8"
            >
              {reqLoading ? "Please wait..." : "Delete"}
            </Button>
            <Button
              onClick={() => setIsOpen(false)}
              size="base_medium"
              className="py-2 px-8"
            >
              Cancel
            </Button>
          </div>
        </ModalPreset>
      ) : activeStep === "flag" ? (
        <ModalPreset
          type="warning"
          className="overflow-visible"
          customWidth="w-[80%] lg:w-1/2 max-w-[600px] items-center"
        >
          <div className="flex items-center flex-col">
            <p className="my-2">Are you sure you want to flag this user?</p>
            <div className="flex w-full my-2 items-center relative z-[1000]">
              <Select
                label="Please select a reason from the options provided before proceeding."
                id="reason"
                options={tenantRejectOptions}
                onChange={setReason}
                className="w-full z-[100]"
              />
            </div>
            <div className="flex gap-2 items-center mt-4">
              <Button
                size="base_medium"
                variant="light_red"
                className="py-2 px-8"
                onClick={handleFlagTenant}
                disabled={reqLoading}
              >
                {reqLoading ? "Please wait..." : "Flag"}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="base_medium"
                className="py-2 px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalPreset>
      ) : activeStep === "add-property" ? (
        <>
          <AddPropertyModal />
        </>
      ) : (
        <ModalPreset
          type="warning"
          className="overflow-visible"
          customWidth="w-[80%] lg:w-1/2 max-w-[600px] items-center"
        >
          <div className="flex items-center flex-col">
            <p className="my-2">
              This user is flagged. Do you want to unflag them?
            </p>
            <p className="text-md font-semibold">Flag Reason</p>
            <p className="my-2 text-sm text-red-500">
              {flag_reason || "No reason provided"}
            </p>
            <div className="flex gap-2 items-center mt-4">
              <Button
                size="base_medium"
                variant="light_green"
                className="py-2 px-8"
                onClick={handleUnflagTenant}
                disabled={reqLoading}
              >
                {reqLoading ? "Please wait..." : "Unflag"}
              </Button>
              <Button
                onClick={() => setIsOpen(false)}
                size="base_medium"
                className="py-2 px-8"
              >
                Cancel
              </Button>
            </div>
          </div>
        </ModalPreset>
      )}
    </>
  );
};

export default EditMobileUser;
