"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ModalTrigger } from "@/components/Modal/modal";

// Types
type FilterOption = {
  label: string;
  value: string;
};

type FilterModalProps = {
  filterOptions: FilterOption[];
  onApply: (selectedFilters: string[]) => void;
  title?: string;
};

const FilterModal: React.FC<FilterModalProps> = ({
  filterOptions,
  onApply,
  title = "Filters by",
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((filter) => filter !== value)
        : [...prev, value]
    );
  };

  const handleApplyFilter = () => {
    onApply(selectedFilters);
  };

  return (
    <div className="w-[400px] rounded-[20px] bg-white p-[20px] custom-flex-col">
      <div className="flex items-center justify-between border-b border-solid border-gray-300">
        <h2 className="text-xl font-bold text-primary-navy">{title}</h2>
        <ModalTrigger close className="p-2">
          <Image
            src="/icons/cancel.svg"
            alt="close"
            width={34}
            height={34}
            className="min-w-[34px] min-h-[34px]"
          />
        </ModalTrigger>
      </div>
      <div className="">
        {filterOptions.map((option) => (
          <div
            key={option.value}
            className="flex items-center justify-between py-2 px-5 my-2 bg-[#F5F5F5]"
          >
            <label className="text-sm capitalize">{option.label}</label>
            <input
              type="checkbox"
              value={option.value}
              className="cursor-pointer"
              onChange={() => handleCheckboxChange(option.value)}
              checked={selectedFilters.includes(option.value)}
            />
          </div>
        ))}
      </div>
      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
        onClick={handleApplyFilter}
      >
        Apply Filter
      </button>
    </div>
  );
};

export default FilterModal;
