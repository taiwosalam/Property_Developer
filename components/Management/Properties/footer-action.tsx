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
  const setAddUnitStore = useAddUnitStore((s) => s.setAddUnitStore);
  const { canSubmit, missingFields, handleInputChange } =
    useContext(FlowProgressContext);
  const {
    submitLoading,
    setIsEditing,
    resetForm,
    setSaveClick,
    formSubmitted,
    notYetUploaded,
    unitData,
  } = useUnitForm();
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const newForm = useAddUnitStore((s) => s.newForm);

  // TRACK WHEN FORM IS SUBMITTED
  useEffect(() => {
    if (formSubmitted) {
      setAddUnitStore("newForm", false);
      setGlobalStore("closeUnitForm", true);
    }
  }, [formSubmitted]);

  // Replicate shouldShowButtons logic from UnitPictures
  const isExistingUnit =
    unitData?.id && addedUnits.some((unit) => unit.id === unitData.id);

  const shouldShowButtons =
    addedUnits.length > 0 &&
    (notYetUploaded || newForm || !unitData || !unitData.id) &&
    !isExistingUnit;

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
      {shouldShowButtons && (
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
