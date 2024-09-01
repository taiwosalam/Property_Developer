import clsx from "clsx";
import Image from "next/image";
import Label from "../Label/label";
import { useEffect, useRef, useState } from "react";
import type { SelectProps } from "./types";
import SearchIcon from "@/public/icons/search-icon.svg";
import ArrowDownIcon from "@/public/icons/arrow-down.svg";
import ArrowUpIcon from "@/public/icons/arrow-up.svg";
import deleteIcon from "@/public/icons/delete-icon.svg";

const Select: React.FC<SelectProps> = ({
  id,
  label,
  value: propValue,
  required,
  className,
  options,
  onChange,
  inputTextStyles,
  placeholder = "Select",
  allowCustom = false,
  hiddenInputClassName,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedValue, setSelectedValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelection = (option: string) => {
    setSelectedValue(option); // Update selected value
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on the search term
  useEffect(() => {
    setFilteredOptions(
      options.filter((o) => o.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, options]);
  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(""); // Clear search term
    setIsOpen(false); // Close dropdown
    onChange && onChange(selectedValue); // Call the onChange prop if provided
  }, [onChange, selectedValue]);

  // Sync internal state with propValue when propValue changes
  // useEffect(() => {
  //   if (!propValue) {
  //     setSelectedValue("");
  //   } else {
  //     setSelectedValue(propValue);
  //   }
  // }, [propValue]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      <input
        type="hidden"
        className={hiddenInputClassName}
        value={propValue || selectedValue}
      />
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative" ref={dropdownRef}>
        <input type="hidden" name={id} value={selectedValue} />
        {/* Trigger for the custom dropdown with embedded search field */}
        <div
          className={clsx(
            "flex items-center border border-solid py-3 pl-10 pr-3 rounded-[4px]",
            { "bg-neutral-2": selectedValue },
            { "cursor-pointer": !selectedValue }
          )}
          onClick={() => {
            if (!selectedValue) setIsOpen(true);
          }}
        >
          {/* Search icon positioned absolutely */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Image
              src={SearchIcon}
              alt="Search Icon"
              height={18}
              width={18}
              className="w-[18px] h-[18px]"
            />
          </div>
          {/* Conditionally render input or selected value */}
          {(propValue || selectedValue) && !isOpen ? (
            <span
              className={clsx(
                "flex-1 capitalize text-text-disabled",
                inputTextStyles
              )}
            >
              {propValue || selectedValue}
            </span>
          ) : (
            <input
              ref={inputRef}
              type="text"
              className={clsx(
                "flex-1 bg-transparent outline-none text-sm",
                inputTextStyles
              )}
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true); // Open dropdown when typing
              }}
              onClick={(e) => {
                setIsOpen(true); // Open dropdown when clicking input
                e.stopPropagation(); // Prevent dropdown from toggling
              }}
              autoFocus={isOpen} // Autofocus when opened
            />
          )}
          <div className="ml-2 flex items-center justify-center">
            {!selectedValue ? (
              <Image
                src={isOpen ? ArrowUpIcon : ArrowDownIcon}
                alt="Toggle Arrow"
              />
            ) : (
              <button
                type="button"
                aria-label="Clear"
                onClick={(e) => {
                  handleSelection("");
                  e.stopPropagation();
                }}
              >
                <Image
                  src={deleteIcon}
                  alt="Clear"
                  width={18}
                  height={18}
                  className="w-[18px] h-[18px]"
                />
              </button>
            )}
          </div>
        </div>

        {/* Options dropdown */}
        {isOpen && (
          <div
            className={clsx(
              "absolute z-10 mt-2 w-full bg-white border border-solid rounded-[4px] shadow-lg",
              {
                "border-[0] mt-0 shadow-[none]":
                  !searchTerm && filteredOptions.length === 0,
              }
            )}
          >
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <div
                    key={option}
                    className="p-2 cursor-pointer hover:bg-gray-100 capitalize"
                    onClick={() => handleSelection(option)}
                  >
                    {option}
                  </div>
                ))
              ) : searchTerm ? ( // Show "No match" only if there's a search term
                <div className="p-2 text-gray-500">
                  <p>No match</p>
                  {allowCustom && (
                    <>
                      <hr className="mb-[1px]" /> <hr />
                      <button
                        type="button"
                        onClick={() => handleSelection(searchTerm)}
                        className="w-full hover:bg-gray-100 text-left"
                      >
                        Add {searchTerm}
                      </button>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
