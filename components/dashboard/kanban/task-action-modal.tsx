import React from "react";
import { ModalTrigger } from "@/components/Modal/modal";
import Button from "@/components/Form/Button/button";
import TextArea from "@/components/Form/TextArea/textarea";
import { ChevronLeft } from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { usePathname } from "next/navigation";

interface ComplaintData {
  senderName: string;
  senderVerified: boolean;
  complaintTitle: string;
  propertyName: string;
  propertyAddress: string;
  accountOfficer: string;
  branch: string;
  brief: string;
}

const TaskModal = ({ complaintData, statusChanger }: { complaintData: ComplaintData, statusChanger?: boolean }) => {
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
  } = complaintData;

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
                <span className="dark:text-darkText-2">{senderName}</span>
                {senderVerified && <BadgeIcon color="green" />}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 text-sm w-[140px]">
                Complaint Title:
              </p>
              <span className="dark:text-darkText-2">{complaintTitle}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px]">Property Name:</p>
              <span className="dark:text-darkText-2">{propertyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary dark:text-darkText-1 w-[140px]">Property Address:</p>
              <span className="dark:text-darkText-2">{propertyName}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">Account Officer:</p>
              <span className="dark:text-darkText-2">{accountOfficer}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">Branch:</p>
              <span className="dark:text-darkText-2">{branch}</span>
            </div>
            <div>
              <p className="text-text-tertiary  dark:text-darkText-1 w-[140px]">Brief:</p>
              <span className="dark:text-darkText-2"> {brief}</span>
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
          <p className="font-medium text-text-secondary dark:text-darkText-1 my-3">Attach note:</p>
          <div className="mt-4">
            <TextArea id="note" placeholder="Type Here"></TextArea>
          </div>
          <div className="mt-4">
            {!statusChanger ? (
              <div className="space-y-2">
                <Button
                  size="16_bold"
                  className="py-2 px-6 w-full"
                  //   className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                  onClick={() => { }} // Empty onClick for Approve
                >
                  Approve Complaint
                </Button>
                <Button
                  size="16_bold"
                  variant="light_red"
                  className="py-2 px-6 w-full"
                  //   className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                  onClick={() => { }} // Empty onClick for Reject
                >
                  Reject Complaint
                </Button>
              </div>
            ) : (
              <Button
                size="16_bold"
                className="py-2 px-6 w-full"
                //   className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                onClick={() => { }} // Empty onClick for Approve
              >
                Change Status
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
