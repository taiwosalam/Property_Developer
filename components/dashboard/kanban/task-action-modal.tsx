import React, { ChangeEvent, useEffect, useState } from "react";
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
import { ComplaintDetailResponse, ComplaintDetailsPageData } from "@/app/(nav)/tasks/complaints/types";

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

  const [cardData, setCardData] = useState<ComplaintDetailsPageData | null>(
    null
  );

  const {
    data: complaintDataResponse,
    loading,
    error: fetchError,
  } = useFetch<ComplaintDetailResponse>(`complaint/${id}`);

  useEffect(() => {
    if (complaintDataResponse) {
      const transformDetails = transformComplaintDetails(complaintDataResponse);
      setCardData(transformDetails);
    }
  }, [complaintDataResponse]);

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
    console.log("TaskModal handleSubmit:", {
      notes,
      destinationColumn,
      status,
      id,
    });
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
    if (destinationColumn === "approved") return "Complete Complaint";
    if (destinationColumn === "rejected") return "Reject Complaint";
    if (destinationColumn === "processing") return "Process Complaint";
    return "Change Status";
  };

  const handleStatusChange = async () => {
    if (!id || !destinationColumn) {
      toast.error("Invalid complaint or destination");
      return;
    }
    if (notes.length < 1) {
      toast.warning("Please provide a note");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let success = false;
      if (destinationColumn === "approved") {
        const payload: IChangeComplainStatus = {
          id: id.toString(),
          route: "complete", // Adjust based on your API's route for completing complaints
        };
        const data = await approveAndProcessComplaint(notes, payload);
        success = !!data;
      } else if (destinationColumn === "rejected") {
        const data = await rejectComplaint(notes, id.toString());
        success = !!data;
      } else if (destinationColumn === "processing") {
        const payload: IChangeComplainStatus = {
          id: id.toString(),
          route: "process",
        };
        const data = await approveAndProcessComplaint(notes, payload);
        success = !!data;
      }

      if (success) {
        toast.success("Complaint status changed");
        setModalOpen?.(false);
      } else {
        throw new Error("Failed to update complaint status");
      }
    } catch (error) {
      setError("Failed to update status. Please try again.");
      toast.error("Failed to update complaint status");
      // Note: Revert logic should be handled in KanbanBoard if needed
      onRequestFailure?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveOrProcessComplaint = async (route: string) => {
    if (!id) {
      return;
    }
    if (notes.length < 1) {
      toast.warning("Please provide a note");
      return;
    }
    const payload: IChangeComplainStatus = {
      id: id.toString(),
      route,
    };
    try {
      setIsLoading(true);
      const data = await approveAndProcessComplaint(notes, payload);
      if (data) {
        toast.success("Complaint status changed");
        setModalOpen?.(false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  const handleRejectComplaint = async () => {
    if (!id) {
      return;
    }
    if (!notes.length) {
      toast.warning("Please attach a note");
      return;
    }

    try {
      setIsLoading(true);
      const data = await rejectComplaint(notes, id.toString());
      if (data) {
        toast.success("Complaint status changed");
        setModalOpen?.(false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-darkText-primary dark:shadow-2xl rounded-lg shadow-lg w-full xl:max-w-5xl px-9 max-w-[90%] max-h-[500px] overflow-y-scroll no-scrollbar">
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
                  {cardData?.senderName}
                </span>
                {senderVerified && (
                  <BadgeIcon color={getBadgeColor(cardData?.tier) ?? "gray"} />
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 text-sm w-[140px] line-clamp-2">
                Complaint Title:
              </p>
              <span className="dark:text-darkText-2">{cardData?.complaintTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px] line-clamp-2">
                Property Name:
              </p>
              <span className="dark:text-darkText-2">{cardData?.propertyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px] line-clamp-2">
                Unit Name:
              </p>
              <span className="dark:text-darkText-2 capitalize">
                {cardData?.unitName}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px]">
                Property Address:
              </p>
              <span className="dark:text-darkText-2 line-clamp-2 capitalize">
                {cardData?.propertyAddress}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">
                Account Officer:
              </p>
              <span className="dark:text-darkText-2">{cardData?.accountOfficer}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">
                Branch:
              </p>
              <span className="dark:text-darkText-2">{cardData?.branch}</span>
            </div>
            <div>
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">
                Brief:
              </p>
              <TruncatedText>
                <span className="dark:text-darkText-2">{cardData?.brief}</span>
              </TruncatedText>
            </div>
          </div>
        </div>

        {/* Right side - Action section */}
        <div className="md:w-1/2 md:pl-6 my-6">
          <p className="font-medium text-[16px] text-center">
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
