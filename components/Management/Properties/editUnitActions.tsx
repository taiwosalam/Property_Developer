import Button from "@/components/Form/Button/button";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { useContext } from "react";
import { useUnitForm } from "./unit-form-context";
import { toast } from "sonner";

const EditUnitActions: React.FC<{ handleCancel: () => void }> = ({
  handleCancel,
}) => {
  const { canSubmit, missingFields, handleInputChange } =
    useContext(FlowProgressContext);
  const { submitLoading } = useUnitForm();

  const handleUpdateClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleInputChange();
    if (!canSubmit) {
      toast.error(
        `The following fields are required: ${missingFields.join(", ")}`
      );
      return;
    }
    const form = e.currentTarget.form;
    form?.requestSubmit();
  };
  return (
    <div className="flex gap-4 justify-end">
      <Button
        type="reset"
        size="sm_medium"
        variant="light_red"
        className="py-1 px-8"
        onClick={handleCancel}
      >
        Close
      </Button>
      <Button
        type="button"
        size="sm_medium"
        className="py-1 px-8"
        disabled={submitLoading}
        onClick={handleUpdateClick}
      >
        {submitLoading ? "Updating..." : "Update"}
      </Button>
    </div>
  );
};

export default EditUnitActions;
