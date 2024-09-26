"use client";

import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import { XIcon } from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { CallRequestModalProps } from "./types";

const CallRequestModal: React.FC<CallRequestModalProps> = ({
  requesterName,
  requesterPicture,
  requestDate,
  phoneNumber,
  propertyName,
  propertyAddress,
  branch,
  accountOfficer,
  resolvedBy,
  resolvedDateTime,
}) => {
  return (
    <div className="w-[600px] max-w-[80%] max-h-[85%] h-fit rounded-[9px] bg-white overflow-x-auto custom-round-scrollbar">
      {/* Header */}
      <div className="h-20 bg-[#EFF6FF] flex items-center justify-center relative">
        <span className="font-medium text-[16px] text-text-secondary">
          Request for Call
        </span>
        <ModalTrigger
          close
          className="absolute top-4 right-6 cursor-pointer w-fit h-fit"
        >
          <XIcon size="30" />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="bg-[#FFFFFF]">
        <div className="flex items-center justify-center">
          <div className="pt-10 space-y-2 mb-6">
            <div className="flex items-center justify-center">
              <Picture size={50} src={requesterPicture} rounded />
            </div>
            <div className="flex items-center gap-0.5 justify-center">
              <span className="text-[16px] font-medium">{requesterName}</span>
              <BadgeIcon color="blue" />
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-medium text-[16px] text-text-tertiary">
                Date of request:
              </p>
              <p className="font-medium text-sm text-[#050901]">
                {requestDate}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-[#2563EB] mb-6 border-dashed" />
        <div className="m-6 mb-12 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px]">
                Phone Number
              </p>
              <p className="text-text-secondary font-medium text-[14px]">
                {phoneNumber}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px]">
                Property Name
              </p>
              <p className="text-text-secondary font-medium text-[14px]">
                {propertyName}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px]">
                Property Address
              </p>
              <p className="text-text-secondary font-medium text-[14px]">
                {propertyAddress}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px]">
                Branch
              </p>
              <p className="text-text-secondary font-medium text-[14px]">
                {branch}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px]">
                Account Officer
              </p>
              <p className="text-text-secondary font-medium text-[14px]">
                {accountOfficer}
              </p>
            </div>
          </div>
          {/* Footer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px]">
                Resolved by
              </p>
              <p className="text-text-tertiary font-medium text-[16px]">
                Date - Time
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-secondary font-medium text-[14px]">
                {resolvedBy}
              </p>
              <p className="text-text-secondary font-medium text-[14px]">
                {resolvedDateTime}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallRequestModal;
