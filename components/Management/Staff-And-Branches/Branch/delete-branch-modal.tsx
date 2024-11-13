// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { useParams, useRouter } from "next/navigation";
import { deleteBranch } from "@/app/(nav)/management/staff-branch/data";
import { toast } from "sonner";

const DeleteBranchModal = () => {
  const branchId = useParams().branchId as string;
  const { activeStep, changeStep } = useStep(2);
  const router = useRouter();

  const handleConfirmDelete = async () => {
    // await deleteBranch(branchId);
    // if (success) {
    //   // If the delete operation was successful, show success toast
    //   toast.success(res?.message || "Branch deleted successfully");
    //   // Proceed to the next step in your process
    //   changeStep("next");
    //   router.push("/management/staff-branch");
    // } else {
    //   // If the delete operation failed, show an error toast
    //   toast.error(message || "Failed to delete branch");
    // }
  };

  return activeStep === 1 ? (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you certain you want to delete this branch?{" "}
        <span className="text-status-error-primary">*</span>Please note that you
        can only delete an empty branch.
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button onClick={handleConfirmDelete}>proceed</Button>
        <ModalTrigger
          close
          className="text-brand-primary text-sm font-medium px-3"
        >
          Back
        </ModalTrigger>
      </div>
    </ModalPreset>
  ) : (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">
        Branch has been successfully deleted.
      </p>
      <div className="flex justify-center">
        <ModalTrigger close asChild>
          <Button>ok</Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export default DeleteBranchModal;
