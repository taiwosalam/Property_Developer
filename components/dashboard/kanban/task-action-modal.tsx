import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import { ChevronLeft } from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { usePathname } from "next/navigation";
import { getBadgeColor } from "@/lib/utils";
import {
  approveAndProcessComplaint,
  IChangeComplainStatus,
  rejectComplaint,
  transformComplaintDetails,
} from "@/app/(nav)/tasks/complaints/data";
import { toast } from "sonner";
import TruncatedText from "@/components/TruncatedText/truncated-text";
import { ColumnId } from "./KanbanBoard";
import useFetch from "@/hooks/useFetch";
import {
  ComplaintDetailResponse,
  ComplaintDetailsPageData,
} from "@/app/(nav)/tasks/complaints/types";
import { useSortable } from "@dnd-kit/sortable";
import { TaskDragData } from "./TaskCard";

interface ComplaintData {
  id: number;
  senderName: string;
  senderVerified: boolean;
  complaintTitle: string;
  propertyName: string;
  unitName?: string;
  propertyAddress: string;
  accountOfficer: string;
  branch: string;
  brief: string;
  tier: number;
}

interface TaskModalProps {
  complaintData: ComplaintData;
  statusChanger?: boolean;
  setModalOpen?: (value: boolean) => void;
  destinationColumn?: ColumnId | null;
  onRequestFailure?: () => void;
  targetStatus?: string | null;
  //onConfirm?: (note: string, status?: string) => void;
  onClick?: () => void;
  onConfirm: (
    note: string,
    status?: "completed" | "rejected" | "processing" | "approved"
  ) => void; // Updated to accept status
  showApproveRejectButtons?: boolean;
}

const TaskModal = ({
  complaintData,
  statusChanger,
  setModalOpen,
  destinationColumn,
  onRequestFailure,
  onConfirm,
  targetStatus,
  showApproveRejectButtons,
}: TaskModalProps) => {
  const pathname = usePathname();
  const {
    senderName,
    senderVerified,
    complaintTitle,
    propertyName,
    unitName,
    propertyAddress,
    accountOfficer,
    branch,
    brief,
    tier,
    id,
  } = complaintData;

  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNotesChange = (value: string) => {
    setNotes(value);
  };

  useEffect(() => {
    setNotes(""); // Reset notes when modal opens
    setError(null);
  }, [id]);

  const handleSubmit = async (
    status?: "processing" | "rejected" | "completed" | "approved"
  ) => {
    if (!notes.trim()) {
      setError("Please provide a note");
      toast.warning("Please provide a note");
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(notes, status);
      setModalOpen?.(false);
    } catch (err) {
      console.error("TaskModal error:", err);
      setError("Failed to update status. Please try again.");
      toast.error("Failed to update complaint status");
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (destinationColumn === "completed") return "Complete Complaint";
    if (destinationColumn === "rejected") return "Reject Complaint";
    if (destinationColumn === "processing") return "Process Complaint";
    return "Change Status";
  };

  return (
    <div
      className="bg-white dark:bg-darkText-primary dark:shadow-2xl rounded-lg shadow-lg w-full xl:max-w-5xl px-9 max-w-[90%] max-h-[500px] overflow-y-scroll no-scrollbar">
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Left side - Complaint details */}
        <div className="md:w-1/2 my-10">
          <ModalTrigger close className="cursor-pointer">
            <span className="text-brand-9">
              <ChevronLeft />
            </span>
          </ModalTrigger>
          <div className="my-4 w-full space-y-2 text-sm text-text-secondary">
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[150px]">
                Complaints sent by:
              </p>
              <div className="flex items-center space-x-1">
                <span className="dark:text-darkText-2 capitalize">
                  {senderName}
                </span>
                {senderVerified && (
                  <BadgeIcon color={getBadgeColor(tier) ?? "gray"} />
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 text-sm w-[140px] line-clamp-2">
                Complaint Title:
              </p>
              <span className="dark:text-darkText-2">{complaintTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px] line-clamp-2">
                Property Name:
              </p>
              <span className="dark:text-darkText-2">{propertyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px] line-clamp-2">
                Unit Name:
              </p>
              <span className="dark:text-darkText-2 capitalize">
                {unitName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px]">
                Property Address:
              </p>
              <span className="dark:text-darkText-2 line-clamp-2 capitalize">
                {propertyAddress}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">
                Account Officer:
              </p>
              <span className="dark:text-darkText-2">{accountOfficer}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">
                Branch:
              </p>
              <span className="dark:text-darkText-2">{branch}</span>
            </div>
            <div>
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">
                Brief:
              </p>
              <TruncatedText>
                <span className="dark:text-darkText-2">{brief}</span>
              </TruncatedText>
            </div>
          </div>
        </div>

        {/* Right side - Action section */}
        <div className="md:w-1/2 md:pl-6 my-6">
          <p className="font-medium text-[16px] text-center text-text-tertiary dark:text-darkText-1">
            {statusChanger
              ? "Change the status of this complaint"
              : `Update complaint to ${destinationColumn || "new status"}`}

            {/* {!statusChanger
              ? "Kindly approve or reject this complaint"
              : "Change the status of this complaint"} */}
          </p>
          <div className="font-medium text-text-secondary dark:text-darkText-1 my-3 flex gap-1">
            <p className="text-red-500">*</p> Attach note:
          </div>
          <div className="mt-4">
            <TextArea
              id="note"
              placeholder="Type Here"
              value={notes}
              onChange={handleNotesChange}
            ></TextArea>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="mt-4 space-y-2">
            {showApproveRejectButtons ? (
              <>
                <Button
                  disabled={isLoading}
                  size="16_bold"
                  className="py-2 px-6 w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => handleSubmit("approved")}
                >
                  {isLoading ? "Please wait..." : "Approve Complaint"}
                </Button>
                <Button
                  disabled={isLoading}
                  size="16_bold"
                  variant="light_red"
                  className="py-2 px-6 w-full"
                  onClick={() => handleSubmit("rejected")}
                >
                  {isLoading ? "Please wait..." : "Reject Complaint"}
                </Button>
              </>
            ) : (
              <Button
                disabled={isLoading}
                size="16_bold"
                className="py-2 px-6 w-full"
                onClick={() => handleSubmit()}
              >
                {isLoading ? "Please wait..." : getButtonLabel()}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
