import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs, { Dayjs } from "dayjs";
import { CancelIcon, CheckboxCheckedIcon } from "@/public/icons/icons";
import {
  articleOptions,
  propertyRequestOptions,
  teamChatOptions,
} from "@/app/(nav)/tasks/inspections/data";
import {
  FilterModalProps,
  FilterOptionWithDropdown,
  FilterOptionWithRadio,
} from "@/components/Management/Landlord/types";

const FilterModal: React.FC<FilterModalProps> = ({
  closeModal,
  onApply,
  onStateSelect,
  title = "Filters by",
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [activeDropdownOption, setActiveDropdownOption] =
    useState<FilterOptionWithDropdown | null>(null);
  const [activeRadioOption, setActiveRadioOption] =
    useState<FilterOptionWithRadio | null>(null);
  const [dropdownSelections, setDropdownSelections] = useState<
    Record<string, string[]>
  >({});
  const [selectedRadioOption, setSelectedRadioOption] = useState<string | null>(
    null
  );
  const [selectedDateOption, setSelectedDateOption] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleDateChange = (type: "start" | "end", date?: Dayjs | null) => {
    if (type === "start") {
      setSelectedStartDate(date ? date.toISOString() : null);
    } else if (type === "end") {
      setSelectedEndDate(date ? date.toISOString() : null);
    }
  };

  const toggleDatePicker = () => {
    setShowDatePicker((prev) => !prev);
  };

  // Handle changes to the main filter options (regular options)
  const handleCheckboxChange = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((filter) => filter !== value)
        : [...prev, value]
    );
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadioOption(value);
    setSearchQuery(""); // Reset search query
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

      if (dropdownLabel === "State" && onStateSelect) {
        onStateSelect(value); // Call the state select handler
      }

      return {
        ...prev,
        [dropdownLabel]: updatedSelections,
      };
    });
    setSearchQuery(""); // Reset search query
  };

  // Apply filters and close modal
  const handleApplyFilter = () => {
    const selectedDropdownValues = Object.values(dropdownSelections).flat();
    const filtersToApply = [
      ...selectedFilters,
      ...selectedDropdownValues,
      ...(selectedRadioOption ? [selectedRadioOption] : []),
      ...(selectedStartDate ? [`startDate:${selectedStartDate}`] : []),
      ...(selectedEndDate ? [`endDate:${selectedEndDate}`] : []),
    ];
    onApply(filtersToApply);
  };

  const renderFilters = () => {
    return teamChatOptions.map((option) => (
      <div
        key={option.value}
        className="flex items-center justify-between py-2 px-4 my-2 bg-[#F5F5F5] dark:bg-darkText-primary"
      >
        <label className="text-sm capitalize dark:text-white">
          {option.label}
        </label>
        <input
          type="checkbox"
          value={option.value}
          className="cursor-pointer"
          onChange={() => handleCheckboxChange(option.value)}
          checked={selectedFilters.includes(option.value)}
        />
      </div>
    ));
  };

  // Content for the main modal options
  const renderMainOptions = () => (
    <>
      <div className="flex items-center justify-between border-b border-solid border-gray-300 ">
        <h2 className="text-lg font-bold text-primary-navy dark:text-white">
          {title}
        </h2>
        <button className="p-2" onClick={() => closeModal && closeModal()}>
          <CancelIcon />
        </button>
      </div>
      {renderFilters()}

      <button
        className="w-full bg-brand-9 text-white py-2 rounded-lg mt-4"
        onClick={handleApplyFilter}
      >
        Apply Filters
      </button>
    </>
  );

  // Main return statement in the component
  return (
    <div className="w-[400px] rounded-[20px] bg-white dark:bg-darkText-primary p-[20px] custom-flex-col">
      {renderMainOptions()}
    </div>
  );
};

export default FilterModal;
