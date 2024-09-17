import clsx from "clsx";
import Label from "../Label/label";
import { useEffect, useRef, useState, useContext } from "react";
import type { SelectProps } from "./types";
import { DeleteIconX, ArrowDownIcon, SearchIcon } from "@/public/icons/icons";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";

const Select: React.FC<SelectProps> = ({
  id,
  label,
  value: propValue = "",
  required,
  className,
  options,
  onChange,
  inputTextClassName,
  placeholder = "Select options",
  allowCustom = false,
  isSearchable = true,
  hiddenInputClassName,
  inputContainerClassName,
  resetKey, // <-- New prop for external reset control
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialState = {
    isOpen: false,
    searchTerm: "",
    filteredOptions: options,
    selectedValue: "",
  };
  const [state, setState] = useState(initialState);
  const { isOpen, searchTerm, filteredOptions, selectedValue } = state;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelection = (option: string) => {
    setState((x) => ({
      ...x,
      selectedValue: option,
      searchTerm: "",
      isOpen: false,
    }));
    onChange && onChange(option); // Call the onChange prop if provided
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on the search term
  useEffect(() => {
    setState((x) => ({
      ...x,
      filteredOptions: options.filter((o) =>
        o.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }));
  }, [searchTerm, options]);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setState((x) => ({ ...x, isOpen: false, searchTerm: "" }));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize
  useEffect(() => {
    setState((x) => ({ ...x, selectedValue: propValue }));
  }, [propValue, resetKey]);

  useEffect(() => {
    handleInputChange && handleInputChange();
  }, [selectedValue, handleInputChange]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* input for flow progress */}
      <input
        name={id}
        id={id}
        type="hidden"
        className={hiddenInputClassName}
        value={selectedValue || ""}
      />
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className="relative" ref={dropdownRef}>
        {/* Trigger for the custom dropdown with embedded search field */}
        <div
          className={clsx(
            "flex items-center border border-solid border-[#C1C2C366] hover:border-[#00000099] py-[11px] pr-3 rounded-lg custom-primary-outline transition-colors duration-300 ease-in-out",
            selectedValue ? "bg-neutral-2" : "cursor-pointer",
            isSearchable ? "pl-10" : "pl-4",
            inputContainerClassName
          )}
          onClick={() => {
            if (!selectedValue) setState((x) => ({ ...x, isOpen: !x.isOpen }));
          }}
        >
          {/* Conditionally render the search icon */}
          {isSearchable && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <SearchIcon />
            </div>
          )}
          {/* Conditionally render input or selected value based on `isSearchable` */}
          {selectedValue && !isOpen ? (
            <span
              className={clsx(
                "flex-1 capitalize text-text-disabled text-xs md:text-sm font-normal",
                inputTextClassName
              )}
            >
              {selectedValue}
            </span>
          ) : isSearchable ? (
            <input
              ref={inputRef}
              type="text"
              className={clsx(
                "w-full flex-1 bg-transparent outline-none text-xs md:text-sm font-normal",
                inputTextClassName
              )}
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => {
                setState((x) => ({
                  ...x,
                  searchTerm: e.target.value,
                  isOpen: true,
                }));
              }}
              onClick={(e) => {
                setState((x) => ({ ...x, isOpen: true }));

                e.stopPropagation(); // Prevent dropdown from toggling
              }}
              autoFocus={isOpen} // Autofocus when opened
            />
          ) : (
            <span
              className={clsx(
                "flex-1 text-text-disabled text-xs md:text-sm font-normal",
                inputTextClassName
              )}
            >
              {placeholder}
            </span>
          )}
          <div className="ml-auto flex items-center justify-center">
            {!selectedValue ? (
              <div
                className={clsx(
                  "transition-transform duration-300",
                  isOpen && "rotate-180"
                )}
              >
                <ArrowDownIcon />
              </div>
            ) : (
              <button
                type="button"
                aria-label="Clear"
                onClick={(e) => {
                  handleSelection("");
                  e.stopPropagation();
                }}
              >
                <DeleteIconX />
              </button>
            )}
          </div>
        </div>

        {/* Options dropdown */}
        {isOpen && (
          <div
            className={clsx(
              "absolute z-10 mt-2 w-full bg-white border border-solid rounded-[8px] shadow-lg",
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
