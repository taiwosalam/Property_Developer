import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import Label from "../Form/Label/label";

interface MultiSelectProps {
  id: string;
  name: string;
  required?: boolean;
  options: string[];
  maxSelections?: number;
  label?: string;
  inputTextClassName?: string;
  className?: string;
  resetKey?: number;
  onSelectionChange?: (selectedItems: string[]) => void; // Callback to send selected items to parent
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  className,
  required,
  options,
  maxSelections = Infinity,
  label,
  inputTextClassName,
  resetKey,
  onSelectionChange, // Receive callback from parent
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: string) => {
    let newSelection: string[];

    // Calculate new selection outside of setState
    if (option === "All States") {
      newSelection = selectedItems.includes("All States") ? [] : ["All States"];
    } else {
      if (selectedItems.includes(option)) {
        newSelection = selectedItems.filter((item) => item !== option);
      } else if (selectedItems.length < maxSelections) {
        newSelection = [...selectedItems.filter((item) => item !== "All States"), option];
      } else {
        newSelection = selectedItems;
      }
    }

    // Update local state
    setSelectedItems(newSelection);
    
    // Notify parent component
    onSelectionChange?.(newSelection);
  };

  const isSelected = (option: string) => selectedItems.includes(option);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false); // Close dropdown if clicking outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedItems([]);
  }, [resetKey]);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      {/* Hidden input to hold the selected values */}
      <input type="hidden" name={id} value={selectedItems.join(",") || ""} />

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
            {selectedItems.length === 0
              ? "Select options"
              : selectedItems.join(", ")}
          </span>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full border bg-white dark:bg-darkText-primary mt-2 max-h-60 overflow-y-auto rounded-lg">
            {options.map((option) => (
              <div
                key={option}
                className={clsx(
                  "p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-darkText-2 capitalize",
                  isSelected(option) && "bg-blue-100 dark:bg-darkText-primary",
                  selectedItems.includes("All States") &&
                    option !== "All States" &&
                    "opacity-50 cursor-not-allowed"
                )}
                onClick={() => handleSelect(option)}
              >
                <input
                  type="checkbox"
                  checked={isSelected(option)}
                  readOnly
                  className="mr-2"
                  disabled={
                    selectedItems.includes("All States") &&
                    option !== "All States"
                  } // Disable other options if "All States" is selected
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
