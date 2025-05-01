import {
  XIcon,
  DownArrow,
  SearchIcon,
  ChevronLeft,
} from "@/public/icons/icons";
import Select from "@/components/Form/Select/select";
import Button from "@/components/Form/Button/button";
import { useEffect, useState, useMemo } from "react";
import useVehicleRecordStore from "@/store/vehicle-record";
import { toast } from "sonner";
import { empty } from "@/app/config";
import Image from "next/image";
import { VehicleData } from "@/app/(nav)/management/vehicles-record/data";

export interface PlateData {
  id: string;
  plate_number: string;
  state: string;
  name: string;
  model: string;
  brand: string;
  user_id: string;
  pictureSrc: string;
}

// SearchBar Component
export const SearchBar: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}> = ({ searchTerm, setSearchTerm }) => (
  <div className="flex items-center gap-2 w-full py-2 px-2 rounded-lg border border-neutral-300 dark:border-neutral-700">
    <SearchIcon size={25} />
    <input
      type="text"
      placeholder="Search"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="h-full w-full outline-none"
    />
  </div>
);


// PlateNumber Component
export const PlateNumber: React.FC<{
  plate: VehicleData;
  onClick: () => void;
  isSelected: boolean;
}> = ({ plate, onClick, isSelected }) => (
  <div
    className={`rounded-lg flex flex-col items-center p-2 cursor-pointer ${
      isSelected ? "bg-brand-9" : "custom-secondary-bg"
    }`}
    onClick={onClick}
  >
    <p className="text-base text-white font-bold">{plate.plate_number}</p>
    <p className="text-xs text-white font-medium">
      {plate.state} &bull; {plate.name}
    </p>
  </div>
);

// VehicleDetails Component
export const VehicleDetails: React.FC<{ plate: VehicleData }> = ({ plate }) => {
  const details = [
    { label: "Brand Name", value: plate.vehicle_brand },
    { label: "Model", value: plate.model },
    { label: "Plate Number", value: plate.plate_number },
    { label: "State", value: plate.state },
  ];

  return (
    <div className="custom-flex-col gap-4 w-1/2">
      {details.map((detail, index) => (
        <div className="flex items-center justify-between" key={index}>
          <h4 className="text-text-label dark:text-darkText-2 font-normal min-w-[90px] md:min-w-[unset]">
            {detail.label}
          </h4>
          <span className="text-text-primary dark:text-white font-medium">
            {detail.value}
          </span>
        </div>
      ))}
    </div>
  );
};
