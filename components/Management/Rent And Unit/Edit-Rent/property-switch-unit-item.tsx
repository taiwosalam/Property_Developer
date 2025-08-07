"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CameraIcon } from "lucide-react";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Switch from "@/components/Form/Switch/switch";
import { useOccupantStore } from "@/hooks/occupant-store";
import { SectionSeparator } from "@/components/Section/section-components";
import { empty } from "@/app/config";
import { cn } from "@/lib/utils";

interface PropertySwitchUnitItemProps {
  id: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isRental?: boolean;
  cautionDeposit?: string;
  serviceCharge?: string;
  unitDetails: string;
  totalPackage?: string;
  unitImages: string[];
  rent: string;
  propertyType: string;
  unitName: string;
  vatAmount?: string;
  otherCharge?: string;
  legalFee?: string;
  inspectionFee?: string;
  agencyFee?: string;
}

// Utility function to check for valid, non-zero values
const isValidValue = (value: string | undefined): boolean => {
  if (value === undefined || value === null || value === "") return false;

  // Remove currency symbols (e.g., ₦) and trim whitespace
  const cleanValue = value.replace(/[^\d.-]/g, "").trim();

  // Check if the cleaned value is a number and not zero
  const numericValue = parseFloat(cleanValue);
  return !isNaN(numericValue) && numericValue !== 0;
};

const PropertySwitchUnitItem: React.FC<PropertySwitchUnitItemProps> = ({
  id,
  isSelected,
  onSelect,
  isRental,
  cautionDeposit,
  serviceCharge,
  unitDetails,
  totalPackage,
  unitImages,
  rent,
  propertyType,
  unitName,
  vatAmount,
  otherCharge,
  legalFee,
  inspectionFee,
  agencyFee,
}) => {
  const { setCalculation, setDeduction, calculation, deduction } =
    useOccupantStore();
  const [screenModal, setScreenModal] = useState(false);
  // const [calcChecked, setCalcChecked] = useState(calculation);
  const [calcChecked, setCalcChecked] = useState(false);
  // const [deductChecked, setDeductChecked] = useState(deduction);
  const [deductChecked, setDeductChecked] = useState(false);

  // Sync local state with store
  useEffect(() => {
    setCalcChecked(calculation);
  }, [calculation]);

  useEffect(() => {
    setDeductChecked(deduction);
  }, [deduction]);

  const fields = [
    { label: "Unit No/Name", value: unitName, required: true },
    { label: "Rent", value: rent, required: true },
    { label: "Unit Details", value: unitDetails, required: true },
    { label: "Caution Deposit", value: cautionDeposit },
    { label: "Service Charge", value: serviceCharge },
    { label: "VAT Amount", value: vatAmount },
    { label: "Other Charge", value: otherCharge },
    { label: "Legal Fee", value: legalFee },
    { label: "Inspection Fee", value: inspectionFee },
    { label: "Agency Fee", value: agencyFee },
    { label: "Total Package", value: totalPackage },
  ];

  // Filter fields to show only those with valid values or required
  const visibleFields = fields.filter(
    (field) => field.required || isValidValue(field.value)
  );

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-darkText-primary shadow-[2px_2px_4px_0px_rgba(0,0,0,0.05)]">
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
        <Checkbox
          onChange={() => onSelect(id)}
          checked={isSelected}
          aria-label={`Select unit ${unitName}`}
        />
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-4 justify-between">
        <div className="flex-grow text-sm md:text-base grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
          {visibleFields.map((field, index) => (
            <div key={index} className="flex items-start gap-4">
              <p className="text-[#747474] dark:text-white min-w-[120px] capitalize">
                {field.label}
              </p>
              <p className="text-black dark:text-darkText-2 flex-1 capitalize truncate">
                {field.value}
              </p>
            </div>
          ))}
        </div>

        {/* Image */}
        <div
          role="button"
          className="flex-shrink-0 w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer"
          onClick={() => setScreenModal(true)}
          aria-label={`View images for unit ${unitName}`}
        >
          <div className="absolute z-[1] left-[65%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon width={12} height={12} />
            <p className="text-black font-medium text-[10px]">
              {unitImages.length > 0 ? `+${unitImages.length}` : "No images"}
            </p>
          </div>
          <Image
            src={unitImages[0] || empty}
            alt={unitName || "Unit image"}
            fill
            className="object-cover object-center rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertySwitchUnitItem;
