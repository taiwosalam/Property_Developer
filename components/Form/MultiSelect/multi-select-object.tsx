import { useState, useRef, useEffect } from "react";
import Label from "../Label/label";
import clsx from "clsx";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { ArrowDownIcon } from "@/public/icons/icons";

interface Option {
  label: string;
  value: string | number;
}

interface MultiSelectProps {
  id: string;
  required?: boolean;
  disabled?: boolean;
  options: Option[];
  maxSelections?: number;
  label?: string;
  inputTextClassName?: string;
  className?: string;
  resetKey?: number;
  defaultSelections?: (string | number)[];
  placeholder?: string;
  /** Callback triggered when selected values change */
  onValueChange?: (selected: (string | number)[]) => void;
}

const MultiSelectObj: React.FC<MultiSelectProps> = ({
  id,
  className,
  required,
  options,
  maxSelections = Infinity,
  label,
  inputTextClassName,
  resetKey,
  defaultSelections = [],
  placeholder,
  onValueChange,
  disabled,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] =
    useState<(string | number)[]>(defaultSelections);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleToggleDropdown = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: Option) => {
    if (disabled) return;

    let newSelectedItems: (string | number)[];
    if (selectedItems.includes(option.value)) {
      newSelectedItems = selectedItems.filter((item) => item !== option.value);
    } else if (selectedItems.length < maxSelections) {
      newSelectedItems = [...selectedItems, option.value];
    } else {
      newSelectedItems = selectedItems;
    }

    setSelectedItems(newSelectedItems);
    if (onValueChange) onValueChange(newSelectedItems);
  };

  const isSelected = (option: Option) => selectedItems.includes(option.value);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    setSelectedItems(defaultSelections);
    if (onValueChange) {
      onValueChange(defaultSelections);
    }
  }, [resetKey]);

  return (
    <div className={clsx("flex  flex-col gap-2", className)}>
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
        {/* <div
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
              ? placeholder ?? "Select options"
              : selectedItems
                  .map((item) => {
                    const found = options.find((option) => option.value === item);
                    return found ? found.label : item;
                  })
                  .join(", ")}
          </span>
        </div> */}

        <div
          className="flex !h-[45px] items-center justify-between border border-solid border-[#C1C2C366] p-2 bg-white dark:bg-darkText-primary cursor-pointer rounded-lg max-h-[70px] overflow-auto"
          onClick={handleToggleDropdown}
        >
          <span
            className={clsx(
              "flex-1 capitalize text-xs md:text-sm font-normal",
              inputTextClassName
            )}
          >
            {selectedItems.length === 0
              ? placeholder ?? "Select options"
              : selectedItems
                  .map((item) => {
                    const found = options.find(
                      (option) => option.value === item
                    );
                    return found ? found.label : item;
                  })
                  .join(", ")}
          </span>

          <div
            className={clsx(
              "ml-2 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          >
            <ArrowDownIcon />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full border bg-white dark:bg-darkText-primary mt-2 max-h-60 overflow-y-auto rounded-lg">
            {options.map((option, index) => (
              <div
                key={index}
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
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectObj;
