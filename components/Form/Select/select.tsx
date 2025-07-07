// "use client";
// import clsx from "clsx";
// import { v4 as uuidv4 } from "uuid";
// import Label from "../Label/label";
// import { useEffect, useRef, useState, useContext } from "react";
// import type { SelectOptionObject, SelectProps } from "./types";
// import { ArrowDownIcon, SearchIcon } from "@/public/icons/icons";
// import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
// import { checkValidatonError } from "@/utils/validation";
// import { useOutsideClick } from "@/hooks/useOutsideClick";

// const Select: React.FC<SelectProps> = ({
//   id,
//   name,
//   label,
//   defaultValue,
//   value: propValue,
//   required,
//   className,
//   options,
//   onChange,
//   inputTextClassName,
//   validationErrors = {},
//   placeholder = "Select options",
//   allowCustom = false,
//   isSearchable = true,
//   hiddenInputClassName,
//   inputContainerClassName,
//   dropdownRefClassName,
//   resetKey,
//   requiredNoStar,
//   disabled,
//   error,
//   desc,
//   renderValue,
// }) => {
//   const { handleInputChange } = useContext(FlowProgressContext);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const initialState = {
//     showAbove: false,
//     isOpen: false,
//     searchTerm: "",
//     filteredOptions: [] as (string | SelectOptionObject)[],
//     selectedValue: "",
//     selectedLabel: "",
//   };
//   const [state, setState] = useState(initialState);
//   const {
//     isOpen,
//     searchTerm,
//     filteredOptions,
//     selectedValue,
//     selectedLabel,
//     showAbove,
//   } = state;
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const [validationError, setValidationError] = useState<string | null>(null);

//   const updateDropdownPosition = () => {
//     if (dropdownRef.current) {
//       const dropdownRect = dropdownRef.current.getBoundingClientRect();
//       const dropdownHeight = 240; // max-h-60 = 15rem = 240px
//       const windowHeight = window.innerHeight;
//       const bottomSpace = windowHeight - dropdownRect.bottom;
//       setState((x) => ({ ...x, showAbove: bottomSpace < dropdownHeight }));
//     }
//   };

//   const handleSelection = (option: string | SelectOptionObject) => {
//     const value = typeof option === "string" ? option : option.value;
//     const label = typeof option === "string" ? option : option.label;
//     setState((x) => ({
//       ...x,
//       selectedValue: `${value}`,
//       selectedLabel: label,
//       searchTerm: "",
//       isOpen: false,
//     }));
//     onChange && onChange(`${value}`);
//   };

//   const handleClearOrToggle = () => {
//     if (disabled) return;
//     if (selectedValue) {
//       // Clear selection if there's a selected value
//       setState((x) => ({
//         ...x,
//         selectedValue: "",
//         selectedLabel: "",
//         searchTerm: "",
//         isOpen: true,
//       }));
//       onChange && onChange("");
//     } else {
//       // Toggle dropdown if no value is selected
//       setState((x) => ({ ...x, isOpen: !x.isOpen }));
//     }
//   };

//   const filterOptions = (
//     options: (string | SelectOptionObject)[],
//     searchTerm: string
//   ) => {
//     return options.filter((option) => {
//       if (typeof option === "string") {
//         return option.toLowerCase().includes(searchTerm.toLowerCase());
//       } else {
//         return option?.label
//           ?.toLowerCase()
//           ?.includes(searchTerm?.toLowerCase());
//       }
//     });
//   };

//   useOutsideClick(dropdownRef, () => {
//     setState((x) => ({ ...x, isOpen: false, searchTerm: "" }));
//   });

//   useEffect(() => {
//     updateDropdownPosition();
//     if (isOpen) {
//       inputRef.current?.focus();
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     setState((x) => ({
//       ...x,
//       filteredOptions: filterOptions(options, searchTerm),
//     }));
//   }, [options, searchTerm]);

//   useEffect(() => {
//     const updateSelection = (value: string, label: string) => {
//       setState((prevState) => ({
//         ...prevState,
//         selectedValue: value,
//         selectedLabel: label,
//       }));
//     };

//     if (propValue) {
//       const value = typeof propValue === "string" ? propValue : propValue.value;
//       const label = typeof propValue === "string" ? propValue : propValue.label;
//       updateSelection(`${value}`, label);
//     } else if (defaultValue) {
//       const value =
//         typeof defaultValue === "string" ? defaultValue : defaultValue.value;
//       const label =
//         typeof defaultValue === "string" ? defaultValue : defaultValue.label;
//       updateSelection(`${value}`, label);
//     } else {
//       updateSelection("", "");
//     }
//   }, [propValue, resetKey, defaultValue]);

//   useEffect(() => {
//     setValidationError(null);
//     handleInputChange && handleInputChange();
//   }, [selectedValue, handleInputChange]);

//   useEffect(() => {
//     setValidationError(
//       checkValidatonError({ errors: validationErrors, key: id })
//     );
//   }, [validationErrors, id]);

//   return (
//     <div
//       className={clsx(
//         "custom-flex-col gap-2",
//         {
//           "pointer-events-none opacity-50": disabled,
//         },
//         className
//       )}
//     >
//       <input
//         name={name ? name : id}
//         id={id}
//         type="hidden"
//         className={hiddenInputClassName}
//         value={selectedValue || ""}
//         required={required || requiredNoStar}
//         disabled={disabled}
//       />
//       {label && (
//         <Label id={id} required={required}>
//           {label}
//         </Label>
//       )}
//       {desc && (
//         <p className="text-text-disabled text-xs md:text-sm font-normal">
//           {desc}
//         </p>
//       )}
//       <div className={clsx("relative", dropdownRefClassName)} ref={dropdownRef}>
//         <div
//           className={clsx(
//             "flex items-center dark:bg-darkText-primary border border-solid border-[#C1C2C366] hover:border-[#00000099] dark:hover:border-darkText-2 py-[11px] pr-3 rounded-lg custom-primary-outline transition-colors duration-300 ease-in-out",
//             selectedValue
//               ? "bg-neutral-2 dark:bg-darkText-primary"
//               : "cursor-pointer",
//             isSearchable ? "pl-10" : "pl-4",
//             inputContainerClassName
//           )}
//           onClick={handleClearOrToggle}
//         >
//           {isSearchable && (
//             <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
//               <span className="dark:text-white">
//                 <SearchIcon />
//               </span>
//             </div>
//           )}
//           {selectedValue && !isOpen ? (
//             <span
//               className={clsx(
//                 "flex-1 capitalize text-text-disabled dark:bg-transparent text-xs md:text-sm font-normal",
//                 inputTextClassName
//               )}
//             >
//               {selectedLabel}
//             </span>
//           ) : isSearchable ? (
//             <input
//               ref={inputRef}
//               type="text"
//               className={clsx(
//                 "w-full flex-1 bg-transparent outline-none text-xs md:text-sm font-normal",
//                 inputTextClassName
//               )}
//               placeholder={placeholder}
//               value={searchTerm}
//               onInput={() => setValidationError(null)}
//               onChange={(e) => {
//                 setState((x) => ({
//                   ...x,
//                   searchTerm: e.target.value,
//                   isOpen: true,
//                 }));
//               }}
//               onClick={(e) => {
//                 setState((x) => ({ ...x, isOpen: true }));
//                 e.stopPropagation();
//               }}
//               autoFocus={isOpen}
//             />
//           ) : (
//             <span
//               className={clsx(
//                 "flex-1 text-text-disabled text-xs md:text-sm font-normal",
//                 inputTextClassName
//               )}
//             >
//               {placeholder}
//             </span>
//           )}
//           <div className="ml-auto flex items-center justify-center">
//             <div
//               className={clsx(
//                 "transition-transform duration-300",
//                 isOpen && "rotate-180"
//               )}
//             >
//               <ArrowDownIcon />
//             </div>
//           </div>
//         </div>
//         {isOpen && (
//           <div
//             className={clsx(
//               "absolute z-10 w-full bg-white dark:bg-darkText-primary dark:border-darkText-1 border border-solid rounded-[8px] shadow-lg",
//               {
//                 "border-[0] my-0 shadow-[none]":
//                   !searchTerm && filteredOptions.length === 0,
//               },
//               showAbove ? "bottom-full mb-2" : "top-full mt-2"
//             )}
//           >
//             <div className="max-h-60 overflow-y-auto">
//               {filteredOptions.length > 0 ? (
//                 filteredOptions.map((option) => {
//                   const label =
//                     typeof option === "string" ? option : option.label;
//                   return (
//                     <div
//                       role="button"
//                       key={uuidv4()}
//                       className="p-2 hover:bg-gray-100 dark:hover:bg-darkText-2 capitalize"
//                       onClick={() => handleSelection(option)}
//                     >
//                       {label}
//                     </div>
//                   );
//                 })
//               ) : searchTerm ? (
//                 <div className="p-2 text-gray-500">
//                   <p>No match</p>
//                   {allowCustom && (
//                     <>
//                       <hr className="mb-[1px]" />
//                       <button
//                         type="button"
//                         onClick={() => handleSelection(searchTerm)}
//                         className="w-full hover:bg-gray-100 text-left"
//                       >
//                         Add {searchTerm}
//                       </button>
//                     </>
//                   )}
//                 </div>
//               ) : null}
//             </div>
//           </div>
//         )}
//       </div>
//       {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
//       {validationError && (
//         <p className="text-sm text-red-500 font-medium">{validationError}</p>
//       )}
//     </div>
//   );
// };

// export default Select;






















"use client";
import clsx from "clsx";
import { v4 as uuidv4 } from "uuid";
import Label from "../Label/label";
import { useEffect, useRef, useState, useContext, useCallback } from "react";
import type { SelectOptionObject, SelectProps } from "./types";
import { DeleteIconX, ArrowDownIcon, SearchIcon } from "@/public/icons/icons";
import { FlowProgressContext } from "@/components/FlowProgress/flow-progress";
import { checkValidatonError } from "@/utils/validation";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const Select: React.FC<SelectProps> = ({
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
  desc,
  renderValue,
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
  };
  const [state, setState] = useState(initialState);
  const {
    isOpen,
    searchTerm,
    filteredOptions,
    visibleOptions,
    selectedValue,
    selectedLabel,
    showAbove,
  } = state;
  const [validationError, setValidationError] = useState<string | null>(null);

  // Constants for virtualization
  const ITEMS_PER_PAGE = 20; // Number of items to load per batch
  const DEBOUNCE_DELAY = 300; // Debounce delay for search and scroll in ms
  const SCROLL_THRESHOLD = 100; // Pixels from bottom to trigger loading

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
        return option?.label
          ?.toLowerCase()
          ?.includes(searchTerm?.toLowerCase());
      }
    });
    console.log(`Filtered options: ${filtered.length} items`);
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
      // Reset scroll position to top when filtering
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
          console.log("No more options to load");
          return prev; // No more options to load
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
      const dropdownHeight = 240; // max-h-60 = 15rem = 240px
      const windowHeight = window.innerHeight;
      const bottomSpace = windowHeight - dropdownRect.bottom;
      setState((x) => ({ ...x, showAbove: bottomSpace < dropdownHeight }));
    }
  };

  const handleSelection = (option: string | SelectOptionObject) => {
    const value = typeof option === "string" ? option : option.value;
    const label = typeof option === "string" ? option : option.label;
    setState((x) => ({
      ...x,
      selectedValue: `${value}`,
      selectedLabel: label,
      searchTerm: "",
      isOpen: false,
    }));
    onChange && onChange(`${value}`);
  };

  useOutsideClick(dropdownRef, () => {
    setState((x) => ({ ...x, isOpen: false, searchTerm: "" }));
  });

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!isOpen || !container) return;

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [isOpen, handleScroll]);

  // Update dropdown position and focus input
  useEffect(() => {
    updateDropdownPosition();
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Filter options based on search term
  useEffect(() => {
    debouncedFilterOptions(searchTerm);
  }, [searchTerm, debouncedFilterOptions]);

  // Initialize selection
  useEffect(() => {
    const updateSelection = (value: string, label: string) => {
      setState((prevState) => ({
        ...prevState,
        selectedValue: value,
        selectedLabel: label,
      }));
    };

    if (propValue) {
      const value = typeof propValue === "string" ? propValue : propValue.value;
      const label = typeof propValue === "string" ? propValue : propValue.label;
      updateSelection(`${value}`, label);
    } else if (defaultValue) {
      const value =
        typeof defaultValue === "string" ? defaultValue : defaultValue.value;
      const label =
        typeof defaultValue === "string" ? defaultValue : defaultValue.label;
      updateSelection(`${value}`, label);
    } else {
      updateSelection("", "");
    }
  }, [propValue, resetKey, defaultValue]);

  // Handle validation and input change
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
      {desc && (
        <p className="text-text-disabled text-xs md:text-sm font-normal">
          {desc}
        </p>
      )}
      <div className={clsx("relative", dropdownRefClassName)} ref={dropdownRef}>
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
            if (!selectedValue && !disabled)
              setState((x) => ({ ...x, isOpen: !x.isOpen }));
            console.log(
              `Dropdown toggled, isOpen: ${
                !selectedValue && !disabled ? !isOpen : isOpen
              }`
            );
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
            <span
              className={clsx(
                "flex-1 capitalize text-text-disabled dark:bg-transparent text-xs md:text-sm font-normal",
                inputTextClassName
              )}
            >
              {renderValue ? renderValue(selectedValue) : selectedLabel}
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
                console.log(`Search term changed: ${e.target.value}`);
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
                className="ml-2"
                onClick={(e) => {
                  handleSelection("");
                  e.stopPropagation();
                  console.log("Selection cleared");
                }}
              >
                <DeleteIconX />
              </button>
            )}
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
                visibleOptions.map((option) => {
                  const label =
                    typeof option === "string" ? option : option.label;
                  return (
                    <div
                      role="button"
                      key={uuidv4()}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-darkText-2 capitalize"
                      onClick={() => handleSelection(option)}
                    >
                      {label}
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

export default Select;