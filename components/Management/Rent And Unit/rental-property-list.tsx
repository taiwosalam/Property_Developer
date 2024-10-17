import React, { useState } from "react";
import { actions, activeStatuses, getBackgroundColor } from "./data";
import Image from "next/image";
import { ActionButtonProps } from "./types";
import { CameraIcon } from "lucide-react";
import { DetailItem } from "../detail-item";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import { images } from "@/components/PopupSlider/data";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const RentalPropertyListCard = () => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className="p-6 bg-white rounded-2xl shadow-md text-[16px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-[#1E3A8A]">
          Unit ID: 123456776342
        </span>
        <div className="flex items-center space-x-1">
          {activeStatuses.map((status) => (
            <div
              key={status}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getBackgroundColor(status) }}
            ></div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 py-4 border-y border-gray-200 overflow-y-auto">
        <div className="flex-grow-1 flex-shrink-0 grid grid-cols-2 gap-x-2 gap-y-4 w-fit xl:max-w-[calc(100%-200px-16px)]">
          <DetailItem
            label="Unit Details"
            value="Newly Built 5 Bedroom Detached Duplex"
          />
          <DetailItem label="Rent" value="₦300,000" />
          <DetailItem label="Unit No/Name" value="Flat 4" />
          <DetailItem label="Caution Deposit" value="₦300,000" />
          <DetailItem label="Unit Description" value="Abiola Moniya" />
          <DetailItem label="Service Charge" value="₦300,000" />
          <DetailItem
            label="Tenants Name"
            value={
              <span className="flex items-center">
                <span className="border-black border-b">David Ajala</span> <BadgeIcon color="green" />
              </span>
            }
          />
          <DetailItem label="Due Date" value="12/12/2024" />
        </div>
        <div
          className="flex-shrink-0 relative w-[200px] h-[200px]"
          onClick={() => setIsOpened(true)}
          role="button"
        >
          <Image
            src="/empty/SampleProperty3.jpeg"
            alt="Property"
            fill
            sizes="auto"
            className="rounded-lg"
          />
          <PopupImageModal
            images={images}
            isOpen={isOpened}
            onClose={() => setIsOpened(false)}
            currentIndex={0}
          />
          <div className="absolute top-7 right-7 bg-blue-50 rounded py-2 px-3 flex items-center space-x-2">
            <CameraIcon width={14} height={14} />
            <span className="text-sm">+13</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5 gap-2 px-2 flex-wrap">
        <div className="bg-status-success-1 rounded-lg py-1 px-4 text-sm font-medium text-status-success-3">
          <p>Gated Property</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((action) => (
            <ActionButton key={action.label} {...action} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentalPropertyListCard;

const ActionButton: React.FC<ActionButtonProps> = ({ label, color }) => (
  <button
    className="py-2 px-4 rounded-[20px] text-white text-xs font-medium"
    style={{ backgroundColor: color }}
  >
    {label}
  </button>
);
