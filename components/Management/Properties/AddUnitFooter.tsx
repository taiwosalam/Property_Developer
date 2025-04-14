import { Modal, ModalContent } from "@/components/Modal/modal";
import { useContext, useEffect, useState } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import FooterModal from "./footer-modal";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useUnitForm } from "./unit-form-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAddUnitStore } from "@/store/add-unit-store";

interface AddUnitFooterProps {
  noForm?: boolean;
}

const AddUnitFooter = ({ noForm }: AddUnitFooterProps) => {
  const { canSubmit, handleInputChange, missingFields } =
    useContext(FlowProgressContext);
  const { submitLoading, setSaveClick } = useUnitForm();
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const router = useRouter();
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const newForm = useAddUnitStore((s) => s.newForm ?? false); // Fallback to false if undefined
  const [checkSubmit, setCheckSubmit] = useState(false);

  useEffect(() => {
    if (checkSubmit) {
      console.log("Validation Effect:", { canSubmit, noForm, missingFields });
      if (!canSubmit && !noForm) {
        toast.error(
          `The following fields are required: ${missingFields.join(", ")}`
        );
      } else {
        setFooterModalOpen(true);
      }
      setCheckSubmit(false);
    }
  }, [canSubmit, missingFields, checkSubmit, noForm]);

  const handleAddMoreClick = () => {
    console.log("Add More Clicked:", { noForm, newForm, canSubmit });
    if (!noForm) {
      handleInputChange();
      setCheckSubmit(true);
    } else {
      setFooterModalOpen(true);
    }
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Save Clicked:", {
      noForm,
      newForm,
      canSubmit,
      addedUnitsLength: addedUnits.length,
      hasNotYetUploaded: addedUnits.some((unit) => unit.notYetUploaded),
      missingFields,
    });

    // Check for unuploaded units
    if (addedUnits.length > 0) {
      const hasNotYetUploaded = addedUnits.some((unit) => unit.notYetUploaded);
      if (hasNotYetUploaded) {
        console.log("Blocked: Units not yet uploaded");
        toast.warning(
          "There are units that have not been updated yet. Please update them to continue."
        );
        return;
      }
    }

    // Check if a form exists (based on noForm, newForm, or missingFields)
    if (!noForm || newForm || missingFields.length > 0) {
      console.log("Form validation required:", { canSubmit, missingFields });
      if (!canSubmit) {
        console.log("Validation failed, showing toast");
        toast.error(
          `The following fields are required: ${missingFields.join(", ")}`
        );
        return;
      }
      console.log("Form valid, proceeding with submission");
      setSaveClick(true);
      const form = e.currentTarget.form;
      setTimeout(() => {
        form?.requestSubmit();
      }, 0);
    } else if (addedUnits.length === 0) {
      console.log("No units added, no valid form, showing warning");
      toast.warning("Please add at least one unit before saving.");
      return;
    } else {
      console.log(
        "No form, units added, redirecting to /management/properties"
      );
      router.push("/management/properties");
    }
  };

  return (
    <FixedFooter className="flex items-center justify-end gap-10">
      <Modal state={{ isOpen: footerModalOpen, setIsOpen: setFooterModalOpen }}>
        <ModalContent>
          <FooterModal noForm={noForm} />
        </ModalContent>
      </Modal>
      <Button
        size="base_medium"
        className="py-2 px-6"
        disabled={submitLoading}
        form="add-unit-form"
        onClick={handleAddMoreClick}
      >
        {submitLoading ? "Adding..." : "Add More Unit"}
      </Button>
      <Button
        form="add-unit-form"
        type="button"
        size="base_medium"
        className="py-2 px-6"
        disabled={submitLoading}
        onClick={handleSaveClick}
      >
        {submitLoading ? "Saving..." : "Save"}
      </Button>
    </FixedFooter>
  );
};

export default AddUnitFooter;
