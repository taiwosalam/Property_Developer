"use client";

import { useState } from "react";
import Image from "next/image";
import { ModalTrigger } from "@/components/Modal/modal";
import { ChevronRight, Check, ChevronLeft } from "lucide-react";

// Types
type FilterOption = {
  label: string;
  value: string;
};

type FilterOptionWithDropdown = {
  label: string;
  value: FilterOption[];
};

type FilterModalProps = {
  filterOptionsWithDropdown?: FilterOptionWithDropdown[];
  filterOptions: FilterOption[];
  onApply: (selectedFilters: string[]) => void;
  title?: string;
  onStateSelect?: (state: string) => void;
};

const FilterModal: React.FC<FilterModalProps> = ({
  filterOptionsWithDropdown,
  filterOptions,
  onApply,
  onStateSelect,
  title = "Filters by",
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeDropdownOption, setActiveDropdownOption] =
    useState<FilterOptionWithDropdown | null>(null);
  const [dropdownSelections, setDropdownSelections] = useState<
    Record<string, string[]>
  >({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Handle changes to the main filter options (regular options)
  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((filter) => filter !== value)
        : [...prev, value]
    );
  };

  // Handle changes to dropdown sub-options
  const handleDropdownCheckboxChange = (
    dropdownLabel: string,
    value: string
  ) => {
    setDropdownSelections((prev) => {
      const currentSelections = prev[dropdownLabel] || [];
      const updatedSelections = currentSelections.includes(value)
        ? currentSelections.filter((v) => v !== value)
        : [...currentSelections, value];

      return {
        ...prev,
        [dropdownLabel]: updatedSelections,
      };
    });
  };

  // Apply filters and close modal
  const handleApplyFilter = () => {
    const selectedDropdownValues = Object.values(dropdownSelections).flat();
    onApply([...selectedFilters, ...selectedDropdownValues]);
  };

  // Show dropdown options content within the same modal
  const showDropdownOptions = (option: FilterOptionWithDropdown) => {
    setActiveDropdownOption(option);
  };

  const hideDropdownOptions = () => {
    setActiveDropdownOption(null);
  };

  // Check if any dropdown option is selected
  const isDropdownOptionSelected = (dropdownLabel: string) => {
    return (dropdownSelections[dropdownLabel] || []).length > 0;
  };

  // Content for the dropdown options
  const renderDropdownOptions = () => {
    const filteredDropdownOptions = activeDropdownOption?.value.filter(
      (option) => option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <>
        <div className="flex items-center justify-between border-b border-solid border-gray-300">
          <div
            onClick={hideDropdownOptions}
            className="flex items-center cursor-pointer"
          >
            <span className="text-sm capitalize">
              <ChevronLeft />
            </span>
            <h2 className="text-lg font-bold text-primary-navy">
              {activeDropdownOption?.label}
            </h2>
          </div>
          <button
            className="p-2"
            onClick={() => setActiveDropdownOption(null)} // Go back to main options
          >
            <Image
              src="/icons/cancel.svg"
              alt="close"
              width={34}
              height={34}
              className="min-w-[34px] min-h-[34px]"
            />
          </button>
        </div>
        {/* Search bar */}
        <input
          type="text"
          className="w-full border p-2 mt-4"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="max-h-[150px] overflow-y-auto pr-2 custom-round-scrollbar">
          {filteredDropdownOptions?.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-5 my-2 bg-[#F5F5F5]"
            >
              <label className="text-sm capitalize">{option.label}</label>
              <input
                type="checkbox"
                value={option.value}
                className="cursor-pointer"
                onChange={() =>
                  handleDropdownCheckboxChange(
                    activeDropdownOption!.label,
                    option.value
                  )
                }
                checked={(
                  dropdownSelections[activeDropdownOption!.label] || []
                ).includes(option.value)}
              />
            </div>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={() => setActiveDropdownOption(null)} // Return to the main options
        >
          OK
        </button>
      </>
    );
  };

  // Content for the main modal options
  const renderMainOptions = () => (
    <>
      <div className="flex items-center justify-between border-b border-solid border-gray-300">
        <h2 className="text-lg font-bold text-primary-navy">{title}</h2>
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

      {/* Dropdown filter options */}
      {filterOptionsWithDropdown?.map((option) => (
        <div key={option.label}>
          <div
            className="flex items-center justify-between py-2 px-4 my-2 bg-[#F5F5F5] cursor-pointer"
            onClick={() => showDropdownOptions(option)}
          >
            <label className="text-sm capitalize">{option.label}</label>
            <span className="text-sm capitalize">
              {isDropdownOptionSelected(option.label) ? (
                <input type="checkbox" checked />
              ) : (
                <ChevronRight />
              )}
            </span>
          </div>
        </div>
      ))}

      {/* Regular filter options */}
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

      <button
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
        onClick={handleApplyFilter}
      >
        Apply Filter
      </button>
    </>
  );

  return (
    <>
      <div className="w-[400px] rounded-[20px] bg-white p-[20px] custom-flex-col">
        {/* Conditionally render content based on whether dropdown is active */}
        {activeDropdownOption ? renderDropdownOptions() : renderMainOptions()}
      </div>
    </>
  );
};

export default FilterModal;
