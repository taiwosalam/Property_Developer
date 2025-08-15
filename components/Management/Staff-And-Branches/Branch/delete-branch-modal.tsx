// Imports
import useStep from "@/hooks/useStep";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteBranch } from "@/app/(nav)/management/staff-branch/[branchId]/edit-branch/data";
import { toast } from "sonner";

const DeleteBranchModal: React.FC<{
  branchId: string;
  hasMoney?: boolean;
}> = ({ branchId, hasMoney }) => {
  const router = useRouter();
  const { activeStep, changeStep } = useStep(2);
  const [reqLoading, setReqLoading] = useState(false);

  const handleConfirmDelete = async () => {
    if (hasMoney){
      toast.error("Sorry, you cannot delete this branch due to the existing wallet balance.");
      return;
    }
    setReqLoading(true);
    const status = await deleteBranch(branchId);
    if (status) {
      toast.success("Branch has been successfully deleted.");
      router.push("/management/staff-branch");
      // changeStep("next");
      // setTimeout(() => {
      // }, 1500);
    }
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
