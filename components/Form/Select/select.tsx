"use client";
import clsx from "clsx";
import Label from "../Label/label";
import { useEffect, useRef, useState, useContext } from "react";
import type { SelectOptionObject, SelectProps } from "./types";
import { DeleteIconX, ArrowDownIcon, SearchIcon } from "@/public/icons/icons";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { checkValidatonError } from "@/utils/validation";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const Select: React.FC<SelectProps> = ({
  id,
  label,
  defaultValue,
  value: propValue,
  required,
  className,
  options,
  onChange,
  inputTextClassName,
  validationErrors = {},
  placeholder = "Select options",
  allowCustom = false,
  isSearchable = true,
  hiddenInputClassName,
  inputContainerClassName,
  dropdownRefClassName,
  resetKey,
  requiredNoStar,
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialState: {
    isOpen: boolean;
    searchTerm: string;
    filteredOptions: string[] | SelectOptionObject[];
    selectedValue?: string | number;
  } = {
    isOpen: false,
    searchTerm: "",
    filteredOptions: options,
    selectedValue: defaultValue,
  };
  const [state, setState] = useState(initialState);
  const { isOpen, searchTerm, filteredOptions, selectedValue } = state;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showAbove, setShowAbove] = useState(false);

  // State to store validation error message
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const bottomSpace = windowHeight - dropdownRect.bottom;
      const dropdownHeight = 240; // max-h-60 = 15rem = 240px
      setShowAbove(bottomSpace < dropdownHeight);
      console.log({
        bottomSpace,
        diff: dropdownHeight - bottomSpace,
        value: bottomSpace < dropdownHeight,
      });
    }
  };

  const handleSelection = (option: string | number) => {
    setState((x) => ({
      ...x,
      selectedValue: option,
      searchTerm: "",
      isOpen: false,
    }));
    onChange && onChange(`${option}`); // Call the onChange prop if provided
  };

  // Type guard to check if the options array is an array of objects
  const isOptionObjectArray = (
    options: string[] | SelectOptionObject[]
  ): options is SelectOptionObject[] => {
    return typeof options[0] === "object";
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      updateDropdownPosition();
    }
  }, [isOpen]);

  // Filter options based on the search term
  useEffect(() => {
    setState((x) => {
      const filteredOptions =
        typeof options[0] === "string"
          ? (options as string[]).filter((o) =>
              o.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : (options as SelectOptionObject[]).filter((o) =>
              o.label.toLowerCase().includes(searchTerm.toLowerCase())
            );

      return { ...x, filteredOptions };
    });
  }, [searchTerm, options]);

  useOutsideClick(dropdownRef, () => {
    setState((x) => ({ ...x, isOpen: false, searchTerm: "" }));
  });

  // Initialize
  useEffect(() => {
    setState((x) => ({ ...x, selectedValue: propValue || defaultValue }));
  }, [propValue, resetKey, defaultValue]);

  useEffect(() => {
    setValidationError(null);
    handleInputChange && handleInputChange();
  }, [selectedValue, handleInputChange]);

  // Check and set validation error for this input when validationErrors or id changes
  useEffect(() => {
    setValidationError(
      checkValidatonError({ errors: validationErrors, key: id })
    );
  }, [validationErrors, id]);

  return (
    <div className={clsx("custom-flex-col gap-2", className)}>
      {/* input for flow progress and holding the selected value for form submission */}
      <input
        name={id}
        id={id}
        type="hidden"
        className={hiddenInputClassName}
        value={selectedValue || ""}
        required={required || requiredNoStar}
      />
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className={clsx("relative", dropdownRefClassName)} ref={dropdownRef}>
        {/* Trigger for the custom dropdown with embedded search field */}
        <div
          className={clsx(
            "flex items-center dark:bg-darkText-primary border border-solid border-[#C1C2C366] hover:border-[#00000099] dark:hover:border-darkText-2 py-[11px] pr-3 rounded-lg custom-primary-outline transition-colors duration-300 ease-in-out",
            selectedValue
              ? "bg-neutral-2 dark:bg-darkText-primary"
              : "cursor-pointer",
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
              <span className="dark:text-white">
                <SearchIcon />
              </span>
            </div>
          )}
          {/* Conditionally render input or selected value based on `isSearchable` */}
          {selectedValue && !isOpen ? (
            <span
              className={clsx(
                "flex-1 capitalize text-text-disabled dark:bg-transparent text-xs md:text-sm font-normal",
                inputTextClassName
              )}
            >
              {isOptionObjectArray(options)
                ? options.find((o) => o.value === selectedValue)?.label
                : selectedValue}
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
              onInput={() => setValidationError(null)}
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
              "absolute z-10 w-full bg-white dark:bg-darkText-primary dark:border-darkText-1 border border-solid rounded-[8px] shadow-lg",
              {
                "border-[0] my-0 shadow-[none]":
                  !searchTerm && filteredOptions.length === 0,
              },
              showAbove ? "bottom-full mb-2" : "top-full mt-2"
            )}
          >
            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => {
                  const optionLabel =
                    typeof option === "string" ? option : option.label;
                  const optionValue =
                    typeof option === "string" ? option : option.value;

                  return (
                    <div
                      key={optionValue}
                      className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-darkText-2 capitalize"
                      onClick={() => handleSelection(optionValue)}
                    >
                      {optionLabel}
                    </div>
                  );
                })
              ) : searchTerm ? ( // Show "No match" only if there's a search term
                <div className="p-2 text-gray-500">
                  <p>No match</p>
                  {allowCustom && (
                    <>
                      <hr className="mb-[1px]" />
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
      {/* Render validation error message if present */}
      {validationError && (
        <p className="text-sm text-red-500 font-medium">{validationError}</p>
      )}
    </div>
  );
};

export default Select;
