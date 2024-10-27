import clsx from "clsx";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useContext, Fragment } from "react";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import DeletePropertyModal from "./delete-property-modal";
import FixedFooter from "@/components/FixedFooter/fixed-footer";

const PropertyFormFooter: React.FC<{
  editMode?: boolean;
  handleReset: () => void;
}> = ({ editMode, handleReset }) => {
  const { canSubmit } = useContext(FlowProgressContext);
  return (
    <FixedFooter
      className={clsx("flex items-center gap-10", {
        "justify-end": !editMode,
        "justify-between": editMode,
      })}
    >
      {editMode ? (
        <Fragment>
          <Modal>
            <ModalTrigger asChild>
              <Button
                size="sm_medium"
                variant="light_red"
                className="py-2 px-6"
              >
                delete property
              </Button>
            </ModalTrigger>
            <ModalContent>
              <DeletePropertyModal />
            </ModalContent>
          </Modal>
          <div className="flex items-center gap-4">
            <Button
              type="button"
              size="sm_medium"
              variant="sky_blue"
              className="py-2 px-6"
            >
              Add more unit
            </Button>
            <Button
              type="submit"
              size="sm_medium"
              className="py-2 px-6"
              disabled={!canSubmit}
            >
              update
            </Button>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <Button
            type="reset"
            variant="sky_blue"
            size="base_medium"
            className="py-2 px-6"
            onClick={handleReset}
          >
            Clear Fields
          </Button>
          <Button
            type="submit"
            disabled={!canSubmit}
            size="base_medium"
            className="py-2 px-6"
          >
            Add Unit
          </Button>
        </Fragment>
      )}
    </FixedFooter>
  );
};

export default PropertyFormFooter;
