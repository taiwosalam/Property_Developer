import { declineOrApproveInvite } from "@/app/(nav)/listing/property/data";
import Button from "@/components/Form/Button/button";
import { ModalTrigger } from "@/components/Modal/modal";
import ModalPreset from "@/components/Modal/modal-preset";

export const ConfirmModal = ({
  changeStep,
}: {
  changeStep: (step: any) => void;
}) => {
  return (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        You can decline or ignore this if received in error. If you prefer not
        to transfer management, please contact your owner/client to resolve any
        issues, or reach out to the requesting company for resolutions.{" "}
      </p>
    </ModalPreset>
  );
};

export const SuccessModal = ({ decline }: { decline?: boolean }) => {
  const text = decline
    ? "The transfer request has been successfully declined."
    : "You have successfully approved the transfer of the property to the company.";
  return (
    <ModalPreset type="success">
      <p className="text-text-disabled text-sm font-normal">{text}</p>
      <div className="flex flex-col items-center gap-4">
        <ModalTrigger asChild close>
          <Button type="button" size="base_medium" className="py-2 px-8">
            ok
          </Button>
        </ModalTrigger>
      </div>
    </ModalPreset>
  );
};

export const ProceedModal = ({
  changeStep,
  inviteId,
}: {
  changeStep: (step: any) => void;
  inviteId?: number;
}) => {
  const approveInvite = async (type: string) => {
    if (!inviteId) return;
    try {
      await declineOrApproveInvite(inviteId, type);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ModalPreset type="warning">
      <p className="text-text-disabled text-sm font-normal">
        Are you sure you want to approve the transfer of property management to
        another company? This action cannot be reversed once approved.{" "}
      </p>
      <div className="flex flex-col items-center gap-4">
        <Button
          type="button"
          size="base_medium"
          className="py-2 px-8"
          onClick={() => {
            approveInvite("reject");
            changeStep(3);
          }}
        >
          Decline
        </Button>
        <button
          onClick={() => {
            approveInvite("accept");
            changeStep(2);
          }}
          className="text-brand-primary text-sm font-medium"
        >
          Approve
        </button>
      </div>
    </ModalPreset>
  );
};
