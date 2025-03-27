import React, { useState } from "react";
import LandlordTenantModalPreset from "./landlord-tenant-modal-preset";
import AddLandlordOrTenantCard from "./add-landlord-or-tenant-card";
import Button from "../Form/Button/button";
import { deleteLanlord, deleteTenant } from "./Tenants/data";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ModalPreset from "../Modal/modal-preset";
import { useModal } from "../Modal/modal";

const EditMobileUser = ({
  page,
  id,
}: {
  page: "landlord" | "tenant";
  id: number | string;
}) => {
  const router = useRouter();
  const isLandlord = page === "landlord";
  const [reqLoading, setReqLoading] = useState(false);
  const [activeStep, setActiveStep] = useState("option");
  const { setIsOpen } = useModal();

  const handleDelete = async () => {
    try {
      const action = isLandlord
        ? deleteLanlord(id as number)
        : deleteTenant(id as number);
      const res = await action;
      if (res) {
        toast.success("Deleted Successfully");
        router.back();
      }
    } catch (error) {
      toast.error("Failed to Delete.,Try again");
    } finally {
      setReqLoading(false);
    }
  };
  
  return (
    <>
      {activeStep === "option" ? (
        <LandlordTenantModalPreset heading="Edit Profile">
          <div className="flex flex-col md:flex-row items-center justify-center gap-7 md:gap-14">
            <AddLandlordOrTenantCard
              buttonText="proceed"
              title="Flag/Unflagging"
              loading={reqLoading}
              onClick={() => setActiveStep("flag")}
              desc="Do you want to restrict the client from acquiring property from another company? If you proceed, they will be informed of your action."
            />
            <AddLandlordOrTenantCard
              loading={reqLoading}
              buttonText="proceed"
              title="Delete Profile"
              onClick={() => setActiveStep("delete")}
              desc="Do you want to remove this client from your dashboard? You can only delete users who have no properties attached to their profile."
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
              { reqLoading ? "Please wait..." : "Delete" }
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
      ) : (
        <ModalPreset type="warning">
          <div>Are you sure you want to flag this user?</div>
          <div className="flex gap-2">
            <Button
              //   onClick={handleDelete}
              size="base_medium"
              variant="light_red"
              className="py-2 px-8"
            >
              Flag
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
      )}
    </>
  );
};

export default EditMobileUser;
