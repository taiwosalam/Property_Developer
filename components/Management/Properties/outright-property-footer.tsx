import clsx from "clsx";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useContext } from "react";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import DeletePropertyModal from "./delete-property-modal";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useAddUnitStore } from "@/store/add-unit-store";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useRole } from "@/hooks/roleContext";
import { usePermission } from "@/hooks/getPermission";

const OutrightPropertyFormFooter: React.FC<{
  editMode?: boolean;
  requestLoading: boolean;
  handleReset: () => void;
  propertyId?: string;
  onAddUnit?: () => void;
}> = ({ editMode, requestLoading, handleReset, propertyId, onAddUnit }) => {
  const searchParams = useSearchParams();
  const { canSubmit, missingFields, handleInputChange } =
    useContext(FlowProgressContext);
  const { canDelete, addedUnits } = useAddUnitStore();
  const propertyID = 12;
  const router = useRouter();
  const { role } = useRole();

  // PERMISSIONS
  const canAddOrDeleteBranchProperties = usePermission(
    role,
    "Can add/delete branch properties"
  );
  const canShowDeleteButton =
    canDelete && (role === "director" || canAddOrDeleteBranchProperties);

  // switch case for properties page redirect
  const getPropertyPage = () => {
    switch (role) {
      case "manager":
        return "/manager/management/properties";
      case "account":
        return "/accountant/management/properties";
      default:
        return "/management/properties";
    }
  };

  const handleSave = () => {
    const hasUnuploadedUnits = addedUnits.some((unit) => unit.notYetUploaded);
    if (hasUnuploadedUnits) {
      toast.error("Please update all units before saving");
      return;
    }

    const page = searchParams.get("page");
    if (page === "rent-unit") {
      router.back();
    } else {
      router.push(getPropertyPage());
    }
  };

  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // e.preventDefault();
    // handleInputChange(); // Ensure the latest input state is checked

    // if (!canSubmit) {
    //   toast.error(
    //     `The following fields are required: ${missingFields.join(", ")}`
    //   );
    //   return;
    // }
    // const form = e.currentTarget.form;
    // form?.requestSubmit();
  };

  return (
    <div className="property-footer-action-buttons">
      {editMode && (
        <Button
          size="sm_medium"
          className="property-update-button-wrapper py-2 px-6 block ml-auto mt-5"
          type="button"
          disabled={!canSubmit || requestLoading}
          onClick={handleSubmitClick}
          // form="edit-property-form"
        >
          {requestLoading ? "Updating..." : "Update"}
        </Button>
      )}
      <FixedFooter
        className={clsx("flex items-center gap-10", {
          "justify-end": !editMode,
          "justify-between": editMode,
        })}
      >
        {editMode ? (
          <>
            {canShowDeleteButton ? (
              <Modal>
                <ModalTrigger asChild>
                  <Button
                    size="sm_medium"
                    variant="light_red"
                    className="py-2 px-6"
                  >
                    Delete all units and property
                  </Button>
                </ModalTrigger>
                <ModalContent>
                  <DeletePropertyModal propertyId={propertyId as string} />
                </ModalContent>
              </Modal>
            ) : (
              <div></div>
            )}
            <div className="flex items-center gap-4 footer-action">
              <Button
                type="button"
                size="sm_medium"
                variant="sky_blue"
                className="py-2 px-6"
                onClick={onAddUnit}
                // disabled={!canSubmit || requestLoading}
              >
                {requestLoading ? "Please wait..." : "Continue"}
              </Button>
              <Button
                size="sm_medium"
                className="property-save-button-wrapper py-2 px-6"
                onClick={handleSave}
                disabled={!canSubmit || requestLoading}
              >
                {requestLoading ? "Please wait..." : "Save"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="create-property-form-footer flex items-center gap-10">
              <Button
                type="reset"
                variant="sky_blue"
                size="base_medium"
                className="py-2 px-6"
                onClick={handleReset}
              >
                Clear Fields
              </Button>
              <Button
                type="button"
                // disabled={!canSubmit || requestLoading}
                size="base_medium"
                className="py-2 px-6"
                onClick={handleSubmitClick}
                // form="create-property-form"
              >
                {requestLoading ? "Please Wait..." : "Continue"}
              </Button>
            </div>
          </>
        )}
      </FixedFooter>
    </div>
  );
};

export default OutrightPropertyFormFooter;
