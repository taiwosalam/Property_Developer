import { Modal, ModalContent } from "@/components/Modal/modal";
import { useContext, useState } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import FooterModal from "./footer-modal";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useUnitForm } from "./unit-form-context";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAddUnitStore } from "@/store/add-unit-store";

interface AddUntFooterProps {
  noForm?: boolean;
}

const AddUntFooter = ({ noForm }: AddUntFooterProps) => {
  const { canSubmit, handleInputChange, missingFields } =
    useContext(FlowProgressContext);
  const { submitLoading, setSaveClick } = useUnitForm();
  const [footerModalOpen, setFooterModalOpen] = useState(false);
  const router = useRouter();
  const addedUnits = useAddUnitStore((s) => s.addedUnits);
  const newForm = useAddUnitStore((s) => s.newForm);

  const handleAddMoreClick = () => {
    handleInputChange();
    if (!canSubmit) {
      toast.error(
        `The following fields are required: ${missingFields.join(", ")}`
      );
      return;
    }
    setFooterModalOpen(true);
  };

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (noForm) {
      // Check if any unit has notYetUploaded set to true
      const hasNotYetUploaded = addedUnits.some((unit) => unit.notYetUploaded);
      if (hasNotYetUploaded) {
        toast.warning(
          "There are units that have not been updated yet. Please update them to continue."
        );
        return;
      }
      router.push("/management/properties");
    } else {
      handleInputChange();
      if (!canSubmit) {
        toast.error(
          `The following fields are required: ${missingFields.join(", ")}`
        );
        return;
      }
      setSaveClick(true);
      const form = e.currentTarget.form;
      setTimeout(() => {
        form?.requestSubmit();
      }, 0);
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

export default AddUntFooter;
