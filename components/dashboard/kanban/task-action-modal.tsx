import React, { ChangeEvent, useState } from "react";
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
} from "@/app/(nav)/tasks/complaints/data";
import { toast } from "sonner";
import TruncatedText from "@/components/TruncatedText/truncated-text";

interface ComplaintData {
  id: number;
  senderName: string;
  senderVerified: boolean;
  complaintTitle: string;
  propertyName: string;
  propertyAddress: string;
  accountOfficer: string;
  branch: string;
  brief: string;
  tier: number;
}

const TaskModal = ({
  complaintData,
  statusChanger,
  setModalOpen,
}: {
  complaintData: ComplaintData;
  statusChanger?: boolean;
  setModalOpen?: (value: boolean) => void;
}) => {
  const pathname = usePathname();
  const {
    senderName,
    senderVerified,
    complaintTitle,
    propertyName,
    propertyAddress,
    accountOfficer,
    branch,
    brief,
    tier,
    id,
  } = complaintData;

  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleNotesChange = (value: string) => {
    setNotes(value);
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
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRejectComplaint = async () => {
    if (!id) {
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
      console.log(error);
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
                  {senderName?.toLowerCase()}
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
          <p className="font-medium text-[16px] text-center">
            {!statusChanger
              ? "Kindly approve or reject this complaint"
              : "Change the status of this complaint"}
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
          <div className="mt-4">
            {!statusChanger ? (
              <div className="space-y-2">
                <Button
                  disabled={isLoading || notes.length === 0}
                  size="16_bold"
                  className="py-2 px-6 w-full"
                  //   className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  onClick={() => handleApproveOrProcessComplaint("approval")} // Empty onClick for Approve
                >
                  {isLoading ? "Please wait..." : "Approve Complaint"}
                </Button>
                <Button
                  disabled={isLoading || notes.length === 0}
                  size="16_bold"
                  variant="light_red"
                  className="py-2 px-6 w-full"
                  //   className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  onClick={handleRejectComplaint} // Empty onClick for Reject
                >
                  {isLoading ? "Please wait..." : "Reject Complaint"}
                </Button>
              </div>
            ) : (
              <Button
                disabled={isLoading}
                size="16_bold"
                className="py-2 px-6 w-full"
                //   className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => handleApproveOrProcessComplaint("process")} // Empty onClick for Approve
              >
                {isLoading ? "Please wait..." : "Change Status"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
