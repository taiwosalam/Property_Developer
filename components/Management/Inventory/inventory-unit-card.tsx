import { useState } from "react";
import Image from "next/image";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useRouter } from "next/navigation";
import ImageSlider from "@/components/ImageSlider/image-slider";
import Button from "@/components/Form/Button/button";

const getBackgroundColor = (status: string) => {
  switch (status) {
    case "vacant":
      return "#FFBB53";
    case "occupied":
      return "#01BA4C";
    case "expired":
      return "#E9212E";
    case "relocate":
      return "#620E13";
    default:
      return "#EBEFF0";
  }
};

const InventoryUnitCard: React.FC<{
  images: string[];
  unitId: string;
  unitDetails: string;
  unitName: string;
  status: "vacant" | "occupied" | "relocate";
  total_inventory: number;
  propertyId: number;
  inventoryId: number;
  isOccupied?: boolean;
  page?: "manager" | "account";
}> = ({
  images,
  unitId,
  status,
  unitDetails,
  unitName,
  total_inventory,
  propertyId,
  inventoryId,
  isOccupied,
  page,
}) => {
  // /management/inventory/${unitId}/manage?inventoryId=${inventoryId}&propertyId=${propertyId}
  const getManageLink = () => {
    switch (page) {
      case "manager":
        return `/manager/management/inventory/${propertyId}/manage?inventoryId=${inventoryId}&propertyId=${propertyId}`;
      case "account":
        return `/accountant/management/inventory/${propertyId}/manage?inventoryId=${inventoryId}&propertyId=${propertyId}`;
      default:
        return `/management/inventory/${propertyId}/manage?inventoryId=${inventoryId}&propertyId=${propertyId}`;
    }
  };

  // /management/inventory/${unitId}/preview?inventoryId=${inventoryId}&propertyId=${propertyId}
  const getPreviewLink = () => {
    switch (page) {
      case "manager":
        return `/manager/management/inventory/${unitId}/preview?inventoryId=${inventoryId}&propertyId=${propertyId}`;
      case "account":
        return `/accountant/management/inventory/${unitId}/preview?inventoryId=${inventoryId}&propertyId=${propertyId}`;
      default:
        return `/management/inventory/${unitId}/preview?inventoryId=${inventoryId}&propertyId=${propertyId}`;
    }
  };

  const getCreateLink = () => {
    switch (page) {
      case "manager":
        return `/manager/management/inventory/${propertyId}/create-inventory?unitId=${unitId}`;
      case "account":
        return `/accountant/management/inventory/${propertyId}/create-inventory?unitId=${unitId}`;
      default:
        return `/management/inventory/${propertyId}/create-inventory?unitId=${unitId}`;
    }
  };

  const getRentUnitLink = () => {
    switch (page) {
      case "manager":
        return `/manager/management/rent-unit/${unitId}`;
      case "account":
        return `/accountant/management/rent-unit/${unitId}`;
      default:
        return `/management/rent-unit/${unitId}`;
    }
  };

  const router = useRouter();
  const activeStatuses = [status]; //if multiple statuses, add them here to show multiple status color
  return (
    <div className="bg-white dark:bg-darkText-primary rounded-2xl overflow-hidden shadow-lg">
      <div className="h-[200px] relative">
        <ImageSlider images={images} className="h-full" />
      </div>
      <div
        role="button"
        className="p-2 pb-4 border-b border-[#C0C2C8] dark:border-gray-800 space-y-3 cursor-pointer transition-all duration-500"
        onClick={() => router.push(getRentUnitLink())}
      >
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#374151] dark:text-white line-clamp-1 truncate">
              {unitName}
            </h3>
            <div className="flex items-center space-x-1">
              {activeStatuses.map((status) => (
                <div
                  key={status}
                  className="w-[15px] h-[15px] rounded-full"
                  style={{ backgroundColor: getBackgroundColor(status) }}
                />
              ))}
            </div>
          </div>
          <p className="text-sm font-normal">{unitDetails}</p>
        </div>
      </div>
      {/* manage and preview buttons */}
      <div className="flex items-center justify-end my-5 gap-2 px-2 flex-wrap">
        {isOccupied ? (
          <Button
            href={getPreviewLink()}
            size="xs_medium"
            className="py-2 px-7"
          >
            preview
          </Button>
        ) : total_inventory > 0 ? (
          <>
            <Button
              href={getManageLink()}
              variant="border"
              size="xs_medium"
              className="py-2 px-7"
            >
              manage
            </Button>
            <Button
              href={getPreviewLink()}
              size="xs_medium"
              className="py-2 px-7"
            >
              preview
            </Button>
          </>
        ) : (
          <Button
            href={getCreateLink()}
            variant="border"
            size="xs_medium"
            className="py-2 px-7"
          >
            create
          </Button>
        )}
      </div>
    </div>
  );
};

export default InventoryUnitCard;
