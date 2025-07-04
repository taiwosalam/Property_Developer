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
  status: "vacant" | "occupied";
  total_inventory: number;
  propertyId: number;
  inventoryId: number;
}> = ({
  images,
  unitId,
  status,
  unitDetails,
  unitName,
  total_inventory,
  propertyId,
  inventoryId,
}) => {
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
        onClick={() => router.push(`/management/rent-unit/${unitId}`)}
      >
        <div className="relative">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-[#374151] dark:text-white">
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
      <div className="flex items-center justify-end my-5 gap-2 px-2 flex-wrap">
        {total_inventory > 0 ? (
          <>
            <Button
              href={`/management/inventory/${unitId}/manage?inventoryId=${inventoryId}&propertyId=${propertyId}`}
              variant="border"
              size="xs_medium"
              className="py-2 px-7"
            >
              manage
            </Button>
            <Button
              href={`/management/inventory/${unitId}/preview?inventoryId=${inventoryId}&propertyId=${propertyId}`}
              size="xs_medium"
              className="py-2 px-7"
            >
              preview
            </Button>
          </>
        ) : (
          <>
            <Button
              href={`/management/inventory/${propertyId}/create-inventory?unitId=${unitId}`}
              variant="border"
              size="xs_medium"
              className="py-2 px-7"
            >
              Create
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default InventoryUnitCard;
