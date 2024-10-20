import React, { useState } from "react";
import Image from "next/image";
import { ModalTrigger } from "@/components/Modal/modal";
import { ChevronRight, ChevronLeft } from "lucide-react";
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs, { Dayjs } from "dayjs";
import { FilterModalProps, FilterOptionWithDropdown, FilterOptionWithRadio } from "./types";

const FilterModal: React.FC<FilterModalProps> = ({
  filterOptionsWithDropdown,
  filterOptions,
  filterOptionsWithRadio,
  onApply,
  onStateSelect,
  title = "Filters by",
  date,
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
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null);
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


  // Show dropdown options content within the same modal
  const showDropdownOptions = (option: FilterOptionWithDropdown) => {
    setActiveDropdownOption(option);
  };

  const showRadioOptions = (option: FilterOptionWithRadio) => {
    setActiveRadioOption(option);
  };

  const hideDropdownOptions = () => {
    setActiveDropdownOption(null);
    setActiveRadioOption(null);
  };

  // Check if any dropdown option is selected
  const isDropdownOptionSelected = (dropdownLabel: string) => {
    return (dropdownSelections[dropdownLabel] || []).length > 0;
  };

  // Check if a radio option is selected
  const isRadioOptionSelected = (value: string) => {
    return selectedRadioOption === value;
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
          <button className="p-2" onClick={() => setActiveDropdownOption(null)}>
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
              className="flex items-center justify-between py-2 px-5 my-2 bg-[#F5F5F5] dark:bg-darkText-primary"
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
          onClick={() => setActiveDropdownOption(null)}
        >
          OK
        </button>
      </>
    );
  };

  // Content for the radio options
  const renderRadioOptions = () => {
    const filteredRadioOptions = activeRadioOption?.value.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
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
              {activeRadioOption?.label}
            </h2>
          </div>
          <button className="p-2" onClick={() => setActiveRadioOption(null)}>
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
          {filteredRadioOptions?.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-5 my-2 bg-[#F5F5F5]"
            >
              <label className="text-sm capitalize">{option.label}</label>
              <input
                type="radio"
                name={activeRadioOption!.label}
                value={option.value}
                className="cursor-pointer"
                onChange={() => handleRadioChange(option.value)}
                checked={isRadioOptionSelected(option.value)}
              />
            </div>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={() => setActiveRadioOption(null)}
        >
          OK
        </button>
      </>
    );
  };

  // Content for the date options
  const renderDateOptions = () => {
    return (
      <>
        <div className="flex items-center justify-between border-b border-solid border-gray-300">
          <div
            onClick={() => setShowDatePicker(false)}
            className="flex items-center cursor-pointer"
          >
            <span className="text-sm capitalize">
              <ChevronLeft />
            </span>
            <h2 className="text-lg font-bold text-primary-navy">
              Date
            </h2>
          </div>
          <button className="p-2" onClick={() => setShowDatePicker(false)}>
            <Image
              src="/icons/cancel.svg"
              alt="close"
              width={34}
              height={34}
              className="min-w-[34px] min-h-[34px]"
            />
          </button>
        </div>
        <div className="py-2 space-y-3 px-4 my-2 bg-[#F5F5F5]">
          <div>
            <label
              htmlFor="registration_date_from"
              className="text-xs text-black"
            >
              From
            </label>
            <DateInput
              id="registration_date_from"
              value={selectedStartDate ? dayjs(selectedStartDate) : undefined}
              onChange={(date) => handleDateChange("start", date)}
              inputClassName="setup-f"
            />
          </div>
          <div>
            <label
              htmlFor="registration_date_to"
              className="text-xs text-black"
            >
              To
            </label>
            <DateInput
              id="registration_date_to"
              value={selectedEndDate ? dayjs(selectedEndDate) : undefined}
              onChange={(date) => handleDateChange("end", date)}
              inputClassName="setup-f"
            />
          </div>
        </div>
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={() => setShowDatePicker(false)}
        >
          OK
        </button>
      </>
    );
  };

  // Content for the main modal options
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

      {date && (
        <div
          className="flex items-center justify-between py-2 px-4 my-2 bg-[#F5F5F5] cursor-pointer"
          onClick={toggleDatePicker}
        >
          <label className="text-sm capitalize">Date</label>
          {(selectedStartDate || selectedEndDate) ? (
            <Image
              src="/icons/checkbox-checked.svg"
              alt="check"
              width={20}
              height={20}
              className="min-w-[20px] min-h-[20px]"
            />
          ) : (
            <ChevronRight />
          )}
        </div>
      )}

      {/* Dropdown filter options */}
      {filterOptionsWithDropdown?.map((option) => (
        <div key={option.label}>
          <div
            className="flex items-center justify-between py-2 px-4 my-2 bg-[#F5F5F5] cursor-pointer"
            onClick={() => showDropdownOptions(option)}
          >
            <label className="text-sm capitalize">{option.label}</label>
            {isDropdownOptionSelected(option.label) ? (
              <Image
                src="/icons/checkbox-checked.svg"
                alt="check"
                width={20}
                height={20}
                className="min-w-[20px] min-h-[20px]"
              />
            ) : (
              <ChevronRight />
            )}
          </div>
        </div>
      ))}

      {/* Radio filter options */}
      {filterOptionsWithRadio?.map((option) => (
        <div
          key={option.label}
          onClick={() => showRadioOptions(option)}
          className="cursor-pointer"
        >
          <div className="flex items-center justify-between py-2 px-4 my-2 bg-[#F5F5F5]">
            <label className="text-sm capitalize">{option.label}</label>
            {selectedRadioOption ? (
              <Image
                src="/icons/checkbox-checked.svg"
                alt="check"
                width={20}
                height={20}
                className="min-w-[20px] min-h-[20px]"
              />
            ) : (
              <ChevronRight />
            )}
          </div>
        </div>
      ))}

      {/* Regular filter options */}
      {filterOptions && filterOptions.map((option) => (
        <div
          key={option.value}
          className="flex items-center justify-between py-2 px-4 my-2 bg-[#F5F5F5]"
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
        className="w-full bg-blue-600 text-white py-2 rounded-lg mt-4"
        onClick={handleApplyFilter}
      >
        Apply Filters
      </button>
    </>
  );

  // Main return statement in the component
  return (
    <div className="w-[400px] rounded-[20px] bg-white p-[20px] custom-flex-col">
      {activeDropdownOption
        ? renderDropdownOptions()
        : activeRadioOption
          ? renderRadioOptions()
          : showDatePicker && date
            ? renderDateOptions()
            : renderMainOptions()}
    </div>
  );


  return (
    <div className="w-[400px] rounded-[20px] bg-white p-[20px] custom-flex-col">
      {activeDropdownOption
        ? renderDropdownOptions()
        : activeRadioOption
          ? renderRadioOptions()
          : showDatePicker
            ? renderDateOptions()
            : renderMainOptions()}
    </div>
  );
};

export default FilterModal;
