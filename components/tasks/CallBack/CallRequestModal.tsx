"use client";

import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { CallRequestModalProps } from "./types";
import ModalPreset from "@/components/Wallet/wallet-modal-preset";
import { getBadgeColor } from "@/lib/utils";

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
  tier_id,
}) => {
  return (
    <ModalPreset title="Request for Call">
      <div className="flex items-center justify-center">
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-center">
            <Picture size={50} src={requesterPicture} rounded />
          </div>
          <div className="flex items-center gap-0.5 justify-center">
            <span className="text-[16px] font-medium capitalize">
              {requesterName}
            </span>
            <BadgeIcon color={getBadgeColor(tier_id) || "gray"} />
          </div>
          <div className="flex items-center space-x-1">
            <p className="font-medium text-[16px] text-text-tertiary">
              Date of request:
            </p>
            <p className="font-medium text-sm text-[#050901] dark:text-darkText-2">
              {requestDate}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-brand-7 mb-6 border-dashed -mx-6" />
      <div className="m-6 mb-12 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-text-tertiary font-medium text-[16px] dark:text-darkText-1">
              Phone Number
            </p>
            <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2">
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
            <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2 capitalize">
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
              Account Manager
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
            <p className="text-text-secondary font-medium text-[14px] dark:text-darkText-1 capitalize">
              {resolvedBy}
            </p>
            <p className="text-text-secondary font-medium text-[14px] text-right dark:text-darkText-2">
              {resolvedDateTime}
            </p>
          </div>
        </div>
      </div>
    </ModalPreset>
  );
};

export default CallRequestModal;
