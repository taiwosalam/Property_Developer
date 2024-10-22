"use client";

import { ModalTrigger } from "@/components/Modal/modal";
import Picture from "@/components/Picture/picture";
import { XIcon } from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { CallRequestModalProps } from "./types";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";

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
<<<<<<< HEAD
    <div className="w-[600px] max-w-[80%] max-h-[85%] h-fit rounded-lg bg-white dark:bg-[#F1F1F1] overflow-x-auto custom-round-scrollbar">
      {/* Header */}
      <div className="py-5 bg-brand-1 dark:bg-[#F1F1F1] flex items-center justify-center sticky top-0 z-[2]">
        <span className="font-medium text-[16px] text-text-secondary">
          Request for Call
        </span>
        <ModalTrigger close className="absolute top-4 right-6">
          <XIcon size="30" />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="bg-white dark:bg-darkText-primary">
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
              <p className="font-medium text-[16px] text-text-tertiary dark:text-darkText-1">
                Date of request:
              </p>
              <p className="font-medium text-sm text-[#050901] dark:text-darkText-2">
                {requestDate}
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-brand-7 mb-6 border-dashed" />
        <div className="m-6 mb-12 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
                Phone Number
              </p>
              <p className="text-text-secondary font-medium text-[14px] text-right  dark:text-darkText-2">
                {phoneNumber}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
                Property Name
              </p>
              <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2">
                {propertyName}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
                Property Address
              </p>
              <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2">
                {propertyAddress}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
                Branch
              </p>
              <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2">
                {branch}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
                Account Officer
              </p>
              <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2">
                {accountOfficer}
              </p>
            </div>
          </div>
          {/* Footer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
                Resolved by
              </p>
              <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
                Date - Time
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-text-secondary font-medium text-[14px] dark:text-darkText-2">
                {resolvedBy}
              </p>
              <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2">
                {resolvedDateTime}
              </p>
            </div>
=======
    <ModalPreset title="Request for Call">
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
            <p className="font-medium text-sm text-[#050901]">{requestDate}</p>
>>>>>>> d285e21502a3c1979e093a00d2e6f862fdb4c3b7
          </div>
        </div>
      </div>
      <div className="border-t border-brand-7 mb-6 border-dashed" />
      <div className="m-6 mb-12 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-text-tertiary font-medium text-[16px]">
              Phone Number
            </p>
            <p className="text-text-secondary font-medium text-[14px] text-right">
              {phoneNumber}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-tertiary font-medium text-[16px]">
              Property Name
            </p>
            <p className="text-text-secondary font-medium text-[14px] text-right">
              {propertyName}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-tertiary font-medium text-[16px]">
              Property Address
            </p>
            <p className="text-text-secondary font-medium text-[14px] text-right">
              {propertyAddress}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-tertiary font-medium text-[16px]">Branch</p>
            <p className="text-text-secondary font-medium text-[14px] text-right">
              {branch}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-text-tertiary font-medium text-[16px]">
              Account Officer
            </p>
            <p className="text-text-secondary font-medium text-[14px] text-right">
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
            <p className="text-text-secondary font-medium text-[14px] text-right">
              {resolvedDateTime}
            </p>
          </div>
        </div>
      </div>
    </ModalPreset>
  );
};

export default CallRequestModal;
