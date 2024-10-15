import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { useContext } from "react";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import FooterModal from "./footer-modal";
import clsx from "clsx";
import { useUnitForm } from "./unit-form-context";

const AddUntFooter = () => {
  const { canSubmit } = useContext(FlowProgressContext);
  const { duplicate, setDuplicate } = useUnitForm();
  return (
    <footer
      className="fixed w-screen left-0 h-[70px] lg:h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-bold text-sm lg:text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent"
      style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {canSubmit && (
        <Modal>
          <ModalTrigger asChild>
            <button
              type="button"
              className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
            >
              Add More Unit
            </button>
          </ModalTrigger>
          <ModalContent>
            <FooterModal duplicate={duplicate} setDuplicate={setDuplicate} />
          </ModalContent>
        </Modal>
      )}
      <button
        form="add-unit-form"
        type="submit"
        className={clsx(
          "bg-brand-9 text-white active:text-brand-9 active:bg-transparent active:border-brand-9",
          canSubmit ? "hover:bg-[#0033c4b3]" : "opacity-50"
        )}
        disabled={!canSubmit}
      >
        Save
      </button>
    </footer>
  );
};

export default AddUntFooter;
