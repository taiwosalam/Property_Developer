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
  const newForm = useAddUnitStore((s) => s.newForm ?? false);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [saveAfterValidation, setSaveAfterValidation] = useState(false);

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

  useEffect(() => {
    if (saveAfterValidation) {
      if (!canSubmit && !noForm) {
        toast.error(
          `The following fields are required: ${missingFields.join(", ")}`
        );
      } else {
        setSaveClick(true);
        const form = document.getElementById(
          "add-unit-form"
        ) as HTMLFormElement | null;
        form?.requestSubmit();
      }
      setSaveAfterValidation(false);
    }
  }, [saveAfterValidation, canSubmit, missingFields, noForm, setSaveClick]);

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

    const formInDom = document.getElementById(
      "add-unit-form"
    ) as HTMLFormElement | null;

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
    } else if (addedUnits.length === 0 && !canSubmit) {
      console.log(
        "No units added, redirecting to /management/properties with draft toast"
      );
      toast.success("Property has been added to your drafts.");
      router.push("/management/properties");
    } else if (canSubmit && addedUnits.length === 0) {
      // if canSubmit is true and no units added, redirect after submission
      console.log(
        "Single unit submitted, redirecting to /management/properties"
      );
      setSaveClick(true);
      const form = e.currentTarget.form;
      setTimeout(() => {
        form?.requestSubmit();
      }, 0);
      router.push("/management/properties");
    } else if (canSubmit && addedUnits.length > 0 && formInDom) {
      // if canSubmit is true and no units added, redirect after submission
      console.log(
        "Single unit submitted, redirecting to /management/properties"
      );
      setSaveClick(true);
      const form = e.currentTarget.form;
      setTimeout(() => {
        form?.requestSubmit();
      }, 0);
      router.push("/management/properties");
    } else {
      console.log(
        "No form, units added, redirecting to /management/properties"
      );
      router.push("/management/properties");
    }
  };

  // const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   console.log("Save Clicked:", {
  //     noForm,
  //     newForm,
  //     canSubmit,
  //     addedUnitsLength: addedUnits.length,
  //     hasNotYetUploaded: addedUnits.some((unit) => unit.notYetUploaded),
  //     missingFields,
  //   });

  //   const hasNotYetUploaded = addedUnits.some((unit) => unit.notYetUploaded);

  //   if (addedUnits.length > 0 && hasNotYetUploaded) {
  //     toast.warning(
  //       "There are units that have not been updated yet. Please update them to continue."
  //     );
  //     return;
  //   }

  //   console.log("noForm", noForm);
  //   if (!noForm || newForm || missingFields.length > 0) {
  //     setSaveClick(true);
  //     handleInputChange();
  //     setSaveAfterValidation(true);
  //     return;
  //   }

  //   if (addedUnits.length === 0 && !canSubmit) {
  //     toast.success("Property has been added to your drafts.");
  //     router.push("/management/properties");
  //   } else if (canSubmit && addedUnits.length === 0) {
  //     setSaveClick(true);
  //     const form = document.getElementById(
  //       "add-unit-form"
  //     ) as HTMLFormElement | null;
  //     form?.requestSubmit();
  //     router.push("/management/properties");
  //   } else {
  //     router.push("/management/properties");
  //   }
  // };

  return (
    <FixedFooter className="unit-footer-actions flex items-center justify-end gap-10">
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
