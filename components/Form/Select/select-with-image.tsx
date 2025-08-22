"use client";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import Label from "../Label/label";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import type { SelectOptionObject, SelectProps } from "./types";
import { ArrowDownIcon, SearchIcon } from "@/public/icons/icons";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { checkValidatonError } from "@/utils/validation";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import Picture from "@/components/Picture/picture";
import { empty } from "@/app/config";

const SelectWithImage: React.FC<SelectProps> = ({
  id,
  name,
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
  disabled,
  error,
}) => {
  const { handleInputChange } = useContext(FlowProgressContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const initialState = {
    showAbove: false,
    isOpen: false,
    searchTerm: "",
    filteredOptions: [] as (string | SelectOptionObject)[],
    visibleOptions: [] as (string | SelectOptionObject)[],
    selectedValue: "",
    selectedLabel: "",
    selectedIcon: "",
  };
  const [state, setState] = useState(initialState);
  const {
    isOpen,
    searchTerm,
    filteredOptions,
    visibleOptions,
    selectedValue,
    selectedLabel,
    selectedIcon,
    showAbove,
  } = state;
  const [validationError, setValidationError] = useState<string | null>(null);

  // Constants for virtualization
  const ITEMS_PER_PAGE = 20;
  const DEBOUNCE_DELAY = 300;
  const SCROLL_THRESHOLD = 100;

  // Determine effective placeholder
  const effectivePlaceholder =
    options.length === 0 ? "No Option Available" : placeholder;

  // Custom debounce function
  const debounce = <T extends (...args: any[]) => void>(
    func: T,
    delay: number
  ) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const filterOptions = (
    options: (string | SelectOptionObject)[],
    searchTerm: string
  ) => {
    const filtered = options.filter((option) => {
      if (typeof option === "string") {
        return option.toLowerCase().includes(searchTerm.toLowerCase());
      } else {
        return option.label?.toLowerCase()?.includes(searchTerm.toLowerCase());
      }
    });
    return filtered;
  };

  const debouncedFilterOptions = useCallback(
    debounce((term: string) => {
      const newFilteredOptions = filterOptions(options, term);
      setState((prev) => ({
        ...prev,
        filteredOptions: newFilteredOptions,
        visibleOptions: newFilteredOptions.slice(0, ITEMS_PER_PAGE),
      }));
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }, DEBOUNCE_DELAY),
    [options]
  );

  const loadMoreOptions = useCallback(
    debounce(() => {
      setState((prev) => {
        if (prev.visibleOptions.length >= prev.filteredOptions.length) {
          return prev;
        }
        const nextBatch = prev.filteredOptions.slice(
          prev.visibleOptions.length,
          prev.visibleOptions.length + ITEMS_PER_PAGE
        );
        return {
          ...prev,
          visibleOptions: [...prev.visibleOptions, ...nextBatch],
        };
      });
    }, DEBOUNCE_DELAY),
    []
  );

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;

    if (scrollPosition >= scrollHeight - SCROLL_THRESHOLD) {
      loadMoreOptions();
    }
  }, [loadMoreOptions]);

  const updateDropdownPosition = () => {
    if (dropdownRef.current) {
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const dropdownHeight = 240;
      const windowHeight = window.innerHeight;
      const bottomSpace = windowHeight - dropdownRect.bottom;
      setState((x) => ({ ...x, showAbove: bottomSpace < dropdownHeight }));
    }
  };

  const handleSelection = (option: string | SelectOptionObject) => {
    const value = typeof option === "string" ? option : option.value;
    const label = typeof option === "string" ? option : option.label;
    const icon = typeof option === "string" ? option : option.icon;
    setState((x) => ({
      ...x,
      selectedValue: `${value}`,
      selectedLabel: label,
      selectedIcon: `${icon}`,
      searchTerm: "",
      isOpen: false,
    }));
    onChange && onChange(`${value}`);
  };

  useOutsideClick(dropdownRef, () => {
    setState((x) => ({ ...x, isOpen: false, searchTerm: "" }));
  });

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!isOpen || !container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, handleScroll]);

  useEffect(() => {
    updateDropdownPosition();
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    debouncedFilterOptions(searchTerm);
  }, [searchTerm, debouncedFilterOptions]);

  // FIXED: Better synchronization with prop values
  useEffect(() => {
    const updateSelection = (value: string, label: string, icon: string) => {
      setState((prevState) => ({
        ...prevState,
        selectedValue: value,
        selectedLabel: label,
        selectedIcon: icon,
      }));
    };

    if (propValue) {
      const value = typeof propValue === "string" ? propValue : propValue.value;
      const label = typeof propValue === "string" ? propValue : propValue.label;
      const icon = typeof propValue === "string" ? propValue : propValue.icon;
      updateSelection(`${value}`, label, `${icon}`);
    } else if (defaultValue && !propValue) {
      const value = typeof defaultValue === "string" ? defaultValue : defaultValue.value;
      const label = typeof defaultValue === "string" ? defaultValue : defaultValue.label;
      const icon = typeof defaultValue === "string" ? defaultValue : defaultValue.icon;
      updateSelection(`${value}`, label, `${icon}`);
    } else if (!propValue) {
      // Clear selection when propValue becomes undefined/null
      updateSelection("", "", "");
    }
  }, [propValue, resetKey, defaultValue]);

  useEffect(() => {
    setValidationError(null);
    handleInputChange && handleInputChange();
  }, [selectedValue, handleInputChange]);

  useEffect(() => {
    setValidationError(
      checkValidatonError({ errors: validationErrors, key: id })
    );
  }, [validationErrors, id]);

  return (
    <div
      className={clsx(
        "custom-flex-col gap-2",
        { "pointer-events-none opacity-50": disabled },
        className
      )}
    >
      <input
        name={name ? name : id}
        id={id}
        type="hidden"
        className={hiddenInputClassName}
        value={selectedValue || ""}
        required={required || requiredNoStar}
        disabled={disabled}
      />
      {label && (
        <Label id={id} required={required}>
          {label}
        </Label>
      )}
      <div className={clsx("relative", dropdownRefClassName)} ref={dropdownRef}>
        <div
          className={clsx(
            "flex items-center h-[44px] dark:bg-darkText-primary border border-solid border-[#C1C2C366] hover:border-[#00000099] dark:hover:border-darkText-2 py-[11px] pr-3 rounded-lg custom-primary-outline transition-colors duration-300 ease-in-out cursor-pointer",
            selectedValue
              ? "bg-neutral-2 dark:bg-darkText-primary"
              : "",
            isSearchable ? "pl-10" : "pl-4",
            inputContainerClassName
          )}
          onClick={() => {
            if (!disabled) setState((x) => ({ ...x, isOpen: !x.isOpen }));
          }}
        >
          {isSearchable && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <span className="dark:text-white">
                <SearchIcon />
              </span>
            </div>
          )}
          {selectedValue && !isOpen ? (
            <div className="flex items-center gap-1 w-full overflow-hidden">
              {selectedIcon && selectedIcon !== "null" && (
                <Picture
                  src={selectedIcon || empty}
                  alt={`${selectedLabel} icon`}
                  size={25}
                  rounded
                  containerClassName="flex-shrink-0 bg-[var(--secondary-color)] rounded-full"
                />
              )}
              <span
                className={clsx(
                  "truncate text-text-disabled dark:bg-transparent text-xs md:text-sm font-normal",
                  inputTextClassName
                )}
              >
                {selectedLabel}
              </span>
            </div>
          ) : isSearchable ? (
            <input
              ref={inputRef}
              type="text"
              className={clsx(
                "w-full flex-1 bg-transparent outline-none text-xs md:text-sm font-normal",
                inputTextClassName
              )}
              placeholder={effectivePlaceholder} 
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
                e.stopPropagation();
              }}
              autoFocus={isOpen}
            />
          ) : (
            <span
              className={clsx(
                "flex-1 text-text-disabled text-xs md:text-sm font-normal",
                inputTextClassName
              )}
            >
              {effectivePlaceholder} 
            </span>
          )}
          {/* REMOVED: X icon for clearing selection */}
          <div className="ml-auto flex items-center justify-center">
            <div
              className={clsx(
                "transition-transform duration-300",
                isOpen && "rotate-180"
              )}
            >
              <ArrowDownIcon />
            </div>
          </div>
        </div>
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
            <div className="max-h-60 overflow-y-auto" ref={scrollContainerRef}>
              {visibleOptions.length > 0 ? (
                visibleOptions.map((option, index) => {
                  const label = typeof option === "string" ? option : option.label;
                  const value = typeof option === "string" ? option : option.value;
                  const icon = typeof option === "string" ? option : option.icon;
                  return (
                    <div
                      role="button"
                      key={uuidv4()}
                      className="flex items-center gap-1 p-2 hover:bg-gray-100 dark:hover:bg-darkText-2 capitalize"
                      onClick={() => handleSelection(option)}
                    >
                      {icon && (
                        <Picture
                          src={icon || empty}
                          alt="User picture"
                          size={25}
                          rounded
                          containerClassName="flex-shrink-0 bg-[var(--secondary-color)] rounded-full"
                        />
                      )}
                      <span className="truncate">{label}</span>
                    </div>
                  );
                })
              ) : searchTerm ? (
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
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      {validationError && (
        <p className="text-sm text-red-500 font-medium">{validationError}</p>
      )}
    </div>
  );
};

export default SelectWithImage;
