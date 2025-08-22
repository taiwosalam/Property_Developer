import { useState, useRef, useEffect } from "react";
import Label from "../Label/label";
import clsx from "clsx";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface MultiSelectProps {
  id: string;
  required?: boolean;
  options: string[];
  maxSelections?: number;
  label?: string;
  inputTextClassName?: string;
  className?: string;
  resetKey?: number;
  defaultSelections?: string[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  className,
  required,
  options,
  maxSelections = Infinity, // Default to no limit if not provided
  label,
  inputTextClassName,
  resetKey,
  defaultSelections = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] =
    useState<string[]>(defaultSelections);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: string) => {
    if (selectedItems.includes(option)) {
      // Unselect the item
      setSelectedItems((prev) => prev.filter((item) => item !== option));
    } else if (selectedItems.length < maxSelections) {
      // Add the item if not selected yet and within limit
      setSelectedItems((prev) => [...prev, option]);
    }
  };

  const isSelected = (option: string) => selectedItems.includes(option);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (resetKey !== 0) {
      setSelectedItems(defaultSelections);
    }
  }, [resetKey, defaultSelections]);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      {/* Hidden input to hold the selected values */}
      <input
        type="hidden"
        name={id}
        value={selectedItems.map(encodeURIComponent).join(",") || ""}
      />

      <div className="relative" ref={dropdownRef}>
        <div
          className="border border-solid border-[#C1C2C366] p-2 bg-white dark:bg-darkText-primary cursor-pointer rounded-lg max-h-[70px] overflow-auto line-clamp-2"
          onClick={handleToggleDropdown}
        >
          <span
            className={clsx(
              "flex-1 capitalize text-xs md:text-sm font-normal",
              inputTextClassName
            )}
          >
            {/* Display selected items or a placeholder */}
            {selectedItems.length === 0
              ? "Select options"
              : selectedItems.join(", ")}
          </span>
        </div>
        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-10 w-full border bg-white dark:bg-darkText-primary mt-2 max-h-60 overflow-y-auto rounded-lg">
            {options.map((option) => (
              <div
                key={option}
                className={clsx(
                  "p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-darkText-2 capitalize",
                  isSelected(option) && "bg-blue-100 dark:bg-darkText-primary"
                )}
                onClick={() => handleSelect(option)}
              >
                <input
                  type="checkbox"
                  checked={isSelected(option)}
                  readOnly
                  className="mr-2"
                />
                {option}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelect;
