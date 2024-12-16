import { Modal, ModalContent } from "@/components/Modal/modal";
import { useContext, useState } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import FooterModal from "./footer-modal";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useUnitForm } from "./unit-form-context";
import { toast } from "sonner";

const AddUntFooter = () => {
  const { canSubmit, handleInputChange, missingFields } =
    useContext(FlowProgressContext);
  const { submitLoading, setSaveClick } = useUnitForm();
  const [footerModalOpen, setFooterModalOpen] = useState(false);

  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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
  };

  return (
    <FixedFooter className="flex items-center justify-end gap-10">
      <Modal state={{ isOpen: footerModalOpen, setIsOpen: setFooterModalOpen }}>
        <ModalContent>
          <FooterModal />
        </ModalContent>
      </Modal>
      <Button
        size="base_medium"
        className="py-2 px-6"
        disabled={submitLoading}
        onClick={() => {
          if (!canSubmit) {
            toast.error(
              `The following fields are required: ${missingFields.join(", ")}`
            );
            return;
          }
          setFooterModalOpen(true);
        }}
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
