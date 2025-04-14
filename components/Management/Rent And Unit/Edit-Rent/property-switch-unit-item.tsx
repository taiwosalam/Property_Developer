"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CameraIcon } from "lucide-react"; // Use lucide-react for consistency
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Switch from "@/components/Form/Switch/switch";
import { useOccupantStore } from "@/hooks/occupant-store";
import { SectionSeparator } from "@/components/Section/section-components";
import { formatNumber } from "@/utils/number-formatter";

interface PropertySwitchUnitItemProps {
  id: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isRental?: boolean;
  cautionDeposit?: string;
  serviceCharge?: string;
  unitDetails: string;
  unitImages: string[];
  rent: string;
  propertyType: string;
  unitName: string;
}

const PropertySwitchUnitItem: React.FC<PropertySwitchUnitItemProps> = ({
  id,
  isSelected,
  onSelect,
  isRental,
  cautionDeposit,
  serviceCharge,
  unitDetails,
  unitImages,
  rent,
  propertyType,
  unitName,
}) => {
  const { setCalculation, setDeduction, calculation, deduction } =
    useOccupantStore();
  const [screenModal, setScreenModal] = useState(false);
  const [calcChecked, setCalcChecked] = useState(calculation);
  const [deductChecked, setDeductChecked] = useState(deduction);

  // Sync store with local state
  useEffect(() => {
    setCalcChecked(calculation);
  }, [calculation]);

  useEffect(() => {
    setDeductChecked(deduction);
  }, [deduction]);

  // Handle switch toggles
  const handleCalculationToggle = () => {
    const newValue = !calcChecked;
    setCalcChecked(newValue);
    setCalculation(newValue);
  };

  const handleDeductionToggle = () => {
    const newValue = !deductChecked;
    setDeductChecked(newValue);
    setDeduction(newValue);
  };

  return (
    <div
      className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={unitImages.map((image) => ({ src: image, isVideo: false }))}
      />

      {/* Unit ID and Checkbox */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-brand-10 dark:text-darkText-1">
          Unit ID: {id}
        </span>
        <Checkbox onChange={() => onSelect(id)} checked={isSelected} />
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-2 justify-between">
        <div className="flex-grow text-sm md:text-base grid grid-cols-2 gap-x-4 gap-y-4 w-full">
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Unit Details
            </p>
            <p className="text-black dark:text-darkText-2 flex-1 capitalize">
              {unitDetails}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">Rent</p>
            <p className="text-black dark:text-darkText-2 flex-1 capitalize">
              {rent}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Unit No/Name
            </p>
            <p className="text-black dark:text-darkText-2 flex-1 capitalize">{unitName}</p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Caution Deposit
            </p>
            <p className="text-black dark:text-darkText-2 flex-1 capitalize">
              {cautionDeposit}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Unit Description
            </p>
            <p className="text-black dark:text-darkText-2 flex-1 capitalize">
              {unitDetails}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Service Charge
            </p>
            <p className="text-black dark:text-darkText-2 flex-1 capitalize">
              {serviceCharge}
            </p>
          </div>
        </div>

        {/* Image */}
        <div
          role="button"
          className="flex-shrink-0 w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer"
          onClick={() => setScreenModal(true)}
        >
          <div className="absolute z-[1] left-[65%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon width={12} height={12} />
            <p className="text-black font-medium text-[10px]">
              +{unitImages.length}
            </p>
          </div>
          <Image
            src={unitImages[0] || "/empty/SampleProperty.jpeg"}
            alt={unitName || "Unit image"}
            fill
            className="object-cover object-center rounded-2xl"
          />
        </div>
      </div>

      {/* Divider and Switches */}
      <SectionSeparator className="my-4 h-[2px]" />
      {isSelected && isRental && (
        <div className="space-y-6 text-text-secondary dark:text-darkText-1 text-sm font-medium">
          <div className="space-y-[10px]">
            <div className="flex items-center gap-2">
              <Switch checked={calcChecked} onClick={handleCalculationToggle} />
              <p>Calculation</p>
            </div>
            <p>
              {calcChecked
                ? "Calculate the total package of the new rent, including caution deposit, service charge, agency fee, legal fee, and other charges for the tenants transferring to the new unit."
                : "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before."}
            </p>
          </div>
          <div className="space-y-[10px]">
            <div className="flex items-center gap-2">
              <Switch checked={deductChecked} onClick={handleDeductionToggle} />
              <p>Deduction</p>
            </div>
            <p>
              {deductChecked
                ? "Calculate the total package of the new fee, including service charge and other charges for the occupant transferring to the new unit."
                : "Do not deduct the current outstanding rent balance from the cost of the new units that the occupants are moving into."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySwitchUnitItem;
