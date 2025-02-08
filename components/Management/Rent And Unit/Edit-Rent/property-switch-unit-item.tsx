"use client";
import { useState } from "react";
import { CameraIcon } from "@/public/icons/icons";
import Image from "next/image";
import Sample from "@/public/empty/SampleProperty.jpeg";
import { SectionSeparator } from "@/components/Section/section-components";
import Sample2 from "@/public/empty/SampleProperty2.jpeg";
import Sample3 from "@/public/empty/SampleProperty3.jpeg";
import Sample4 from "@/public/empty/SampleProperty4.png";
import Sample5 from "@/public/empty/SampleProperty5.jpg";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import Switch from "@/components/Form/Switch/switch";

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
  const [screenModal, setScreenModal] = useState(false);
  const sampleImages = [Sample, Sample2, Sample3, Sample4, Sample5];
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  return (
    <div
      className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={unitImages.map((image) => ({
          src: image,
        }))}
      />
      <div className="flex items-center justify-between">
        <h4 className="text-brand-10 text-base font-bold">
          Unit ID: {id}
        </h4>
        <Checkbox onChange={() => onSelect(id)} checked={isSelected} />
      </div>
      <SectionSeparator className="my-4 h-[2px]" />
      <div className="flex items-center gap-2 justify-between overflow-y-auto custom-round-scrollbar pb-2">
        <div className="min-w-[400px] text-sm md:text-base grid grid-cols-2 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[35%,1fr]">
          <div>
            <p className="text-[#747474] dark:text-white">Unit Details</p>
            <p className="text-black dark:text-darkText-1">{unitDetails}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Rent</p>
            <p className="text-black dark:text-darkText-1">{rent}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Unit No/Name</p>
            <p className="text-black dark:text-darkText-1">{unitName}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Caution Deposit</p>
            <p className="text-black dark:text-darkText-1">{cautionDeposit}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Unit Description</p>
            <p className="text-black dark:text-darkText-1">{unitDetails}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Service Charge</p>
            <p className="text-black dark:text-darkText-1">{serviceCharge}</p>
          </div>
        </div>

        {/* Image */}
        <div
          role="button"
          className="flex-shrink-0 w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer"
          onClick={() => setScreenModal(true)}
        >
          <div className="absolute z-[1] left-[65%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
            <CameraIcon />
            <p className="text-black font-medium text-[10px]">+{unitImages.length}</p>
          </div>
          <Image
            src={unitImages[0]}
            alt={""}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>
      <SectionSeparator className="my-4 h-[2px]" />
      {isSelected && isRental && (
        <div className="space-y-6 text-text-secondary dark:text-darkText-1 text-sm font-medium">
          <div className="space-y-[10px]">
            <div className="flex items-center gap-2">
              <Switch
                checked={checked1}
                onClick={() => setChecked1((x) => !x)}
              />
              <p>Calclation</p>
            </div>
            <p>
              {!checked1
                ? "Charge the tenants the same total package as renewal tenants since they were tenants in one of the units of the property before"
                : "Calculate the total package of the new rent, including caution deposit, Service Charge, agency fee, legal fee and other Charges) for the tenants that you are transferring to the new unit."}
            </p>
          </div>
          <div className="space-y-[10px]">
            <div className="flex items-center gap-2">
              <Switch
                checked={checked2}
                onClick={() => setChecked2((x) => !x)}
              />
              <p>Deduction</p>
            </div>
            <p>
              {!checked2
                ? "Do not deduct the current outstanding rent balance from the cost of the new units that the occupants are moving into"
                : "Calculate the total package of the new fee, including service charge and other Charges for the occupant that you are transferring to the new unit."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertySwitchUnitItem;
