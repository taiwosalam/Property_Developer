import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useContext } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import FooterModal from "./footer-modal";
import Button from "@/components/Form/Button/button";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const AddUntFooter = () => {
  const { canSubmit } = useContext(FlowProgressContext);

  return (
    <FixedFooter className="flex items-center justify-end gap-10">
      {canSubmit && (
        <Modal>
          <ModalTrigger asChild>
            <Button size="base_medium" className="py-2 px-6">
              Add More Unit
            </Button>
          </ModalTrigger>
          <ModalContent>
            <FooterModal />
          </ModalContent>
        </Modal>
      )}
      <Button
        form="add-unit-form"
        type="submit"
        size="base_medium"
        className="py-2 px-6"
        disabled={!canSubmit}
      >
        Save
      </Button>
    </FixedFooter>
  );
};

export default AddUntFooter;
