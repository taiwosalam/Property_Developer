import { Modal, ModalContent } from "@/components/Modal/modal";
import { useContext, useEffect, useState } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import FooterModal from "./footer-modal";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useUnitForm } from "./unit-form-context";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useAddUnitStore } from "@/store/add-unit-store";
import { useRole } from "@/hooks/roleContext";
import { sampleInstallmentUnits } from "@/app/(nav)/management/properties/create-installment-property/[propertyId]/add-unit/data";

interface AddUnitFooterProps {
  noForm?: boolean;
}

const AddUnitFooter = ({ noForm }: AddUnitFooterProps) => {
  const searchParams = useSearchParams();
  const { canSubmit, handleInputChange, missingFields, validateForm } =
    useContext(FlowProgressContext);
  const { submitLoading, setSaveClick, shouldRedirect, setShouldRedirect } =
    useUnitForm();
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const router = useRouter();
  const { role } = useRole();
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const newForm = useAddUnitStore((s) => s.newForm ?? false);
  const [checkSubmit, setCheckSubmit] = useState(false);
  const [saveAfterValidation, setSaveAfterValidation] = useState(false);

  // ---- ADDED: Track form presence in DOM ----
  const [formInDom, setFormInDom] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const formById = document.getElementById("add-unit-form");
      const anyForm = document.querySelector("form");
      setFormInDom(!!formById || !!anyForm);
    }, 300);
    return () => clearInterval(interval);
  }, []);
  // -------------------------------------------

  const hasAddedUnits = addedUnits.length > 0 || sampleInstallmentUnits.length > 0;

  const getPropertiesRoute = () => {
    switch (role) {
      case "director":
        return "/management/properties";
      case "manager":
        return "/manager/management/properties";
      case "account":
        return "/accountant/management/properties";
      default:
        return "/unauthorized";
    }
  };

  const navigateBackOrToProperties = () => {
    const page = searchParams.get("page");
    if (page === "rent-unit") {
      router.back();
    } else {
      router.push(getPropertiesRoute());
    }
  };

  useEffect(() => {
    if (shouldRedirect && !submitLoading) {
      setShouldRedirect(false);
      navigateBackOrToProperties();
    }
  }, [shouldRedirect, submitLoading]);

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
    if (!noForm) {
      handleInputChange();
      setCheckSubmit(true);
    } else {
      setFooterModalOpen(true);
    }
  };

  useEffect(() => {
    if (checkSubmit) {
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

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // handleInputChange();
    const isValid = validateForm();
    const formInDom = document.getElementById(
      "add-unit-form"
    ) as HTMLFormElement | null;
    
    if (formInDom && !isValid) {
      toast.warning(
        `The following fields are required: ${missingFields.join(", ")}`
      );
      return;
    }
    if (addedUnits.length > 0) {
      const hasNotYetUploaded = addedUnits.some((unit) => unit.notYetUploaded);
      if (hasNotYetUploaded) {
        toast.warning(
          "There are units that have not been updated yet. Please update them to continue."
        );
        return;
      }
    }
    if (formInDom && canSubmit) {
      setSaveClick(true);
      formInDom.requestSubmit();
      return;
    }
    if (!formInDom) {
      if (addedUnits.length === 0) {
        toast.success("Property has been added to your drafts.");
        navigateBackOrToProperties();
        return;
      }
      navigateBackOrToProperties();
      return;
    }
  };

  console.log("formInDom", formInDom);
  console.log("hasAddedUnits", hasAddedUnits);
  return (
    <FixedFooter className="unit-footer-actions flex items-center justify-end gap-10">
      <Modal state={{ isOpen: footerModalOpen, setIsOpen: setFooterModalOpen }}>
        <ModalContent>
          <FooterModal noForm={noForm} />
        </ModalContent>
      </Modal>
      <div className="unit-action-buttons property-save-button-wrapper flex items-center gap-10">
        {/* RENDER BUTTON ONLY IF NO FORM IN DOM AND THERE ARE ADDED UNITS */}
        {!formInDom && hasAddedUnits && (
          <Button
            size="base_medium"
            className="add-more-units-button py-2 px-6"
            disabled={submitLoading}
            onClick={handleAddMoreClick}
          >
            {submitLoading ? "Adding..." : "Add More Unit"}
          </Button>
        )}
        <Button
          form="add-unit-form"
          type="button"
          size="base_medium"
          className="save-button py-2 px-6"
          disabled={submitLoading}
          onClick={handleSaveClick}
        >
          {submitLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </FixedFooter>
  );
};

export default AddUnitFooter;