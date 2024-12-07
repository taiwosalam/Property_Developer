import Button from "@/components/Form/Button/button";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useContext } from "react";

const EditUnitActions: React.FC<{ handleCancel: () => void }> = ({
  handleCancel,
}) => {
  const { canSubmit } = useContext(FlowProgressContext);
  return (
    <div className="flex gap-4 justify-end">
      <Button
        type="reset"
        size="sm_medium"
        variant="light_red"
        className="py-1 px-8"
        onClick={handleCancel}
      >
        Cancel
      </Button>
      <Button
        form="edit-unit-form"
        type="submit"
        size="sm_medium"
        className="py-1 px-8"
        disabled={!canSubmit}
      >
        Update
      </Button>
    </div>
  );
};

export default EditUnitActions;
