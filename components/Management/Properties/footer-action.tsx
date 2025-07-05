"use client";
import Button from "@/components/Form/Button/button";
import { useGlobalStore } from "@/store/general-store";
import { useUnitForm } from "./unit-form-context";
import { useContext } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useAddUnitStore } from "@/store/add-unit-store";

const DynamicFooterActions = () => {
  const closeUnitForm = useGlobalStore((s) => s.closeUnitForm);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const allowEditUnit = useGlobalStore((s) => s.allowEditUnit);

  const { canSubmit, missingFields, handleInputChange } =
    useContext(FlowProgressContext);
  const { submitLoading, setIsEditing, resetForm } = useUnitForm();
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const hasNotYetUploaded = addedUnits.some((unit) => unit.notYetUploaded);

  return (
    <div className="my-4">
      {allowEditUnit && !hasNotYetUploaded && (
        <div className="flex gap-4 justify-end edit-unit-action-btns">
          <Button
            size="sm_medium"
            variant="light_red"
            className="py-1 px-8"
            onClick={() => {
              setGlobalStore("closeUnitForm", true);
            }}
          >
            Close
          </Button>
          <Button
            type="button"
            size="sm_medium"
            className="py-1 px-8"
            disabled={submitLoading}
            // onClick={handleUpdateClick}
          >
            {submitLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DynamicFooterActions;
