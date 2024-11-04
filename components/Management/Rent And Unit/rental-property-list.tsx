import { useState } from "react";
import { actions, activeStatuses, getBackgroundColor } from "./data";
import Image from "next/image";
import { CameraIcon } from "lucide-react";
import { DetailItem } from "../detail-item";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import { images } from "@/components/PopupSlider/data";
import PropertyTag from "@/components/Tags/property-tag";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { ActionButton } from "./action-button";

const RentalPropertyListCard: React.FC<{
  propertyType: "rental" | "facility";
  unitId: string;
}> = ({ propertyType, unitId }) => {
  const [isOpened, setIsOpened] = useState(false);
  return (
    <div className="p-6 bg-white dark:bg-darkText-primary rounded-2xl shadow-md text-[16px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-brand-10 dark:text-darkText-1">
          Unit ID: 123456776342
        </span>
        <div className="flex items-center gap-1 flex-wrap">
          {activeStatuses.map((status) => (
            <div
              key={status}
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: getBackgroundColor(status) }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 py-4 border-y border-gray-200 overflow-y-auto">
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
                <span className="border-black border-b">David Ajala</span>{" "}
                <BadgeIcon color="green" />
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
            images={images.map((image) => ({ src: image, isVideo: false }))}
            isOpen={isOpened}
            onClose={() => setIsOpened(false)}
          />
          <div className="absolute top-3 right-3 bg-blue-50 rounded py-1 px-2 flex items-center space-x-2">
            <CameraIcon width={10} height={10} />
            <span className="text-xs">+13</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-5 gap-2 px-2 flex-wrap">
        <PropertyTag propertyType={propertyType} />
        <div className="flex items-center gap-2 flex-wrap">
          {actions.map((action, i) => (
            <ActionButton
              key={i}
              {...action}
              route={
                typeof action.route === "function"
                  ? action.route(unitId, propertyType)
                  : action.route
              }
              label={
                typeof action.label === "function"
                  ? action.label(propertyType)
                  : action.label
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentalPropertyListCard;
