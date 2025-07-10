"use client";
import Button from "@/components/Form/Button/button";
import { useGlobalStore } from "@/store/general-store";
import { useUnitForm } from "./unit-form-context";
import { useContext, useEffect } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useAddUnitStore } from "@/store/add-unit-store";
import { toast } from "sonner";

const DynamicFooterActions = () => {
  const closeUnitForm = useGlobalStore((s) => s.closeUnitForm);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const allowEditUnit = useGlobalStore((s) => s.allowEditUnit);
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const { canSubmit, missingFields, handleInputChange } =
    useContext(FlowProgressContext);
  const {
    submitLoading,
    setIsEditing,
    resetForm,
    setSaveClick,
    formSubmitted,
  } = useUnitForm();
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const hasNotYetUploaded = addedUnits.some((unit) => unit.notYetUploaded);

  // TRACK WHEN FORM IS SUBMITTED
  useEffect(() => {
    if (formSubmitted) {
      setAddUnitStore("newForm", false);
      setGlobalStore("closeUnitForm", true);
    }
  }, [formSubmitted]);

  const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleInputChange();
    const formInDom = document.getElementById(
      "add-unit-form"
    ) as HTMLFormElement | null;

    if (formInDom && !canSubmit) {
      toast.error(
        `The following fields are required: ${missingFields.join(", ")}`
      );
      return;
    }

    // IF FORM IN DOM AND CAN SUBMIT, TRIGGER SUBMISSION
    if (formInDom && canSubmit) {
      setSaveClick(true);
      formInDom.requestSubmit();
      return;
    }
  };

  const handleRemoveClick = () => {
    // Always remove the form when Remove is clicked
    setAddUnitStore("newForm", false);
    setGlobalStore("closeUnitForm", true);
    setGlobalStore("allowEditUnit", false);
    
    // Reset form if it exists
    const formInDom = document.getElementById(
      "add-unit-form"
    ) as HTMLFormElement | null;
    if (formInDom) {
      formInDom.reset();
    }
    
    // Reset form state
    resetForm();
  };

  return (
    <div className="my-4">
      {allowEditUnit && !hasNotYetUploaded && (
        <div className="flex gap-4 justify-end edit-unit-action-btns">
          <Button
            size="sm_medium"
            variant="light_red"
            className="py-1 px-8"
            onClick={handleRemoveClick}
          >
            Remove
          </Button>
          <Button
            type="button"
            size="sm_medium"
            className="py-1 px-8"
            disabled={submitLoading}
            onClick={handleUpdateClick}
          >
            {submitLoading ? "Updating..." : "Update"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DynamicFooterActions;
