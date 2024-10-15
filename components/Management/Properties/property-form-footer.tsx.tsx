import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useContext, Fragment } from "react";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import clsx from "clsx";
import Button from "@/components/Form/Button/button";
import DeletePropertyModal from "./delete-property-modal";

const PropertyFormFooter: React.FC<{
  editMode?: boolean;
  handleReset: () => void;
}> = ({ editMode, handleReset }) => {
  const { canSubmit } = useContext(FlowProgressContext);
  return (
    <footer
      className="fixed z-[3] w-screen left-0 h-[80px] bottom-0 py-5 px-[60px] bg-white flex items-center justify-end gap-10 [&>button]:rounded-[4px] font-semibold text-base [&>button]:py-[8px] [&>button]:px-[32px] [&>button]:border-2 [&>button]:border-transparent"
      style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {editMode ? (
        <Fragment>
          <Modal>
            <ModalTrigger asChild>
              <Button
                size="sm_medium"
                variant="light_red"
                className="py-2 px-7"
              >
                delete property
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeletePropertyModal />
            </ModalContent>
          </Modal>
          <Button
            type="button"
            size="sm_medium"
            variant="sky_blue"
            className="py-2 px-7"
          >
            Add more unit
          </Button>
          <Button type="submit" size="sm_medium" className="py-2 px-7">
            update
          </Button>
        </Fragment>
      ) : (
        <Fragment>
          <button
            type="reset"
            className="bg-brand-1 text-brand-9 hover:bg-brand-2 active:bg-transparent active:border-brand-2"
            onClick={handleReset}
          >
            Clear Fields
          </button>
          <button
            type="submit"
            className={clsx(
              "bg-brand-9 text-white active:text-brand-9 active:bg-transparent active:border-brand-9",
              canSubmit ? "hover:bg-[#0033c4b3]" : "opacity-50"
            )}
            disabled={!canSubmit}
          >
            Add Unit
          </button>
        </Fragment>
      )}
    </footer>
  );
};

export default PropertyFormFooter;
