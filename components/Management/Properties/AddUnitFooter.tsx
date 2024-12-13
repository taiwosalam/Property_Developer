import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useContext } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import FooterModal from "./footer-modal";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";
import { useUnitForm } from "./unit-form-context";

const AddUntFooter = () => {
  const { canSubmit } = useContext(FlowProgressContext);
  const { submitLoading, setSaveClick } = useUnitForm();

  return (
    <FixedFooter className="flex items-center justify-end gap-10">
      {canSubmit && (
        <Modal>
          <ModalTrigger asChild>
            <Button
              size="base_medium"
              className="py-2 px-6"
              disabled={submitLoading}
            >
              {submitLoading ? "Adding..." : "Add More Unit"}
            </Button>
          </ModalTrigger>
          <ModalContent>
            <FooterModal />
          </ModalContent>
        </Modal>
      )}
      <Button
        form="add-unit-form"
        type="button"
        size="base_medium"
        className="py-2 px-6"
        disabled={!canSubmit || submitLoading}
        onClick={(e) => {
          setSaveClick(true);
          const form = e.currentTarget.form;
          setTimeout(() => {
            form?.requestSubmit();
          }, 0);
        }}
      >
        {submitLoading ? "Saving..." : "Save"}
      </Button>
    </FixedFooter>
  );
};

export default AddUntFooter;
