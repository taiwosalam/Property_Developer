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
import { RentalPropertyCardProps } from "@/app/(nav)/management/rent-unit/data";

const RentalPropertyListCard: React.FC<RentalPropertyCardProps> = ({
  propertyType,
  images,
  unitId,
  unit_title,
  unit_name,
  unit_type,
  tenant_name,
  expiry_date,
  rent,
  caution_deposit,
  service_charge,
  status,
  property_type,
}) => {
    const [isOpened, setIsOpened] = useState(false);
    return (
      <div className="p-6 bg-white dark:bg-darkText-primary rounded-2xl shadow-md text-[16px]">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-bold text-brand-10 dark:text-darkText-1">
            Unit ID: { unitId } {status}
          </span>
          <div className="flex items-center gap-1 flex-wrap">
              <div
                key={status}
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getBackgroundColor(status) }}
              />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 py-4 border-y border-gray-200 overflow-y-auto">
          <div className="flex-grow-1 flex-shrink-0 grid grid-cols-2 gap-x-2 gap-y-4 w-fit xl:max-w-[calc(100%-200px-16px)]">
            <DetailItem
              label="Unit Details"
              value={ unit_name + " " + unit_type } 
            />
            <DetailItem label="Rent" value={`₦${rent}`} />
            <DetailItem label="Unit No/Name" value="Flat 4" />
            <DetailItem label="Caution Deposit" value={`₦${caution_deposit}`} />
            <DetailItem label="Unit Description" value={ unit_title } />
            <DetailItem label="Service Charge" value={`₦${service_charge}`} />
            <DetailItem
              label="Tenants Name"
              value={
                <span className="flex items-center">
                  <span className="border-black border-b">{tenant_name}</span>{" "}
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
              src={images[0]}
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
              <span className="text-xs"> { images.length } </span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5 gap-2 px-2 flex-wrap">
          <PropertyTag propertyType={propertyType} />
          <div className="flex items-center gap-2 flex-wrap">
            {actions
              .filter((action) => {
                // For rental properties, exclude Relocate
                if (propertyType === "rental" && action.label === "Relocate") {
                  return false;
                }
                // For facilities, exclude Move Out
                if (propertyType === "facility" && action.label === "Move Out") {
                  return false;
                }
                return true;
              })
              .map((action, i) => (
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
