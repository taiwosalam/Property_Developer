import { useState, useRef, useEffect } from "react";
import { ModalTrigger } from "@/components/Modal/modal";
import { ChevronRight, ChevronLeft } from "lucide-react";
import DateInput from "@/components/Form/DateInput/date-input";
import dayjs, { Dayjs } from "dayjs";
import Button from "@/components/Form/Button/button";
import { CancelIcon, CheckboxCheckedIcon } from "@/public/icons/icons";
import { useModal } from "@/components/Modal/modal";
import Checkbox from "@/components/Form/Checkbox/checkbox";
import {
  FilterOptionObj,
  FilterResult,
  FilterOption,
  FilterOptionMenu,
} from "./types";

interface FilterModalProps {
  handleFilterApply: (selectedFilters: FilterResult) => void;
  filterTitle?: string;
  isDateTrue?: boolean;
  dateLabel?: string;
  filterOptions?: FilterOption[] | FilterOptionObj;
  filterOptionsMenu?: FilterOptionMenu[];
  appliedFilters?: FilterResult;
  inputOff?: boolean;
}

const FilterModal: React.FC<FilterModalProps> = ({
  filterOptions,
  filterOptionsMenu,
  handleFilterApply,
  filterTitle = "Filters by",
  isDateTrue,
  dateLabel = "Date",
  appliedFilters,
  inputOff = true,
}) => {
  const { setIsOpen } = useModal();
  const isRadio =
    typeof filterOptions === "object" &&
    !Array.isArray(filterOptions) &&
    filterOptions.radio;

  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(
    appliedFilters?.startDate || null
  );
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(
    appliedFilters?.endDate || null
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>(() => {
    if (appliedFilters?.options) return appliedFilters.options;
    const defaultRadioValue = filterOptionsMenu
      ?.find((menu) => menu.radio)
      ?.value.find((option) => option.isChecked)?.value;
    return defaultRadioValue ? [String(defaultRadioValue)] : [];
  });
  const [selectedFilterMenus, setSelectedFilterMenus] = useState<
    Record<string, string[]>
  >(() => {
    if (appliedFilters?.menuOptions) return appliedFilters.menuOptions;
    const initialMenus: Record<string, string[]> = {};
    filterOptionsMenu?.forEach((menu) => {
      if (menu.radio) {
        const defaultValue = menu.value.find(
          (option) => option.isChecked
        )?.value;
        if (defaultValue) {
          initialMenus[menu.label] = [String(defaultValue)];
        }
      }
    });
    return initialMenus;
  });
  const [view, setView] = useState<"default" | "date" | "menu">("default");
  const [activeOptionMenu, setActiveOptionMenu] =
    useState<FilterOptionMenu | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<FilterOption[]>([]);
  const [visibleOptions, setVisibleOptions] = useState<FilterOption[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Virtualization constants
  const ITEMS_PER_PAGE = 20;
  const SCROLL_THRESHOLD = 100;
  const DEBOUNCE_DELAY = 300;

  // Debounce function
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

  // Filter options based on search query
  const filterMenuOptions = (options: FilterOption[], query: string) => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(query.toLowerCase())
    );
  };

  // Load more options for virtualization
  const loadMoreOptions = debounce(() => {
    setVisibleOptions((prev) => {
      if (prev.length >= filteredOptions.length) {
        return prev;
      }
      const nextBatch = filteredOptions.slice(
        prev.length,
        prev.length + ITEMS_PER_PAGE
      );
      return [...prev, ...nextBatch];
    });
  }, DEBOUNCE_DELAY);

  // Handle scroll to load more options
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollPosition = container.scrollTop + container.clientHeight;
    const scrollHeight = container.scrollHeight;
    if (scrollPosition >= scrollHeight - SCROLL_THRESHOLD) {
      loadMoreOptions();
    }
  };

  // Update filtered and visible options when searchQuery or activeOptionMenu changes
  useEffect(() => {
    if (activeOptionMenu) {
      const newFilteredOptions = filterMenuOptions(
        activeOptionMenu.value,
        searchQuery
      );
      setFilteredOptions(newFilteredOptions);
      setVisibleOptions(newFilteredOptions.slice(0, ITEMS_PER_PAGE));
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }
  }, [searchQuery, activeOptionMenu]);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || view !== "menu") return;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [view]);

  const handleDateChange = (type: "start" | "end", date?: Dayjs | null) => {
    if (type === "start") {
      setSelectedStartDate(date && date.isValid() ? date.toISOString() : null);
    } else if (type === "end") {
      setSelectedEndDate(date && date.isValid() ? date.toISOString() : null);
    }
  };

  const handleApplyFilter = () => {
    const filtersToApply = {
      options: [...selectedFilters],
      menuOptions: { ...selectedFilterMenus },
      startDate: selectedStartDate,
      endDate: selectedEndDate,
    };
    handleFilterApply(filtersToApply);
    setIsOpen(false);
  };

  const handleOptionMenuClick = (option: FilterOptionMenu) => {
    setSearchQuery("");
    setActiveOptionMenu(option);
    setView("menu");
  };

  const handleOptionClick = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );
  };

  const handleOptionMenuItemClick = (
    menuLabel: string,
    value: string,
    isRadio?: boolean
  ) => {
    setSelectedFilterMenus((prev) => {
      const currentSelections = prev[menuLabel] || [];
      if (isRadio) {
        return {
          ...prev,
          [menuLabel]: currentSelections.includes(value) ? [] : [value],
        };
      } else {
        const newSelections = currentSelections.includes(value)
          ? currentSelections.filter((v) => v !== value)
          : [...currentSelections, value];
        return { ...prev, [menuLabel]: newSelections };
      }
    });
  };

  const commonCheckboxClasses =
    "flex-row-reverse w-full justify-between bg-[#F5F5F5] dark:bg-[#3C3D37] py-2 px-4 capitalize";
  const commonLabelClasses =
    "text-text-secondary dark:text-darkText-1 font-medium flex items-center justify-between py-2 px-4 bg-[#F5F5F5] dark:bg-[#3C3D37] capitalize cursor-pointer";

  return (
    <div className="w-full sm:w-[400px] max-h-[90vh] overflow-y-auto rounded-[20px] bg-white dark:bg-darkText-primary p-[20px] mx-[20px] custom-flex-col">
      <div className="flex items-center justify-between border-b border-solid border-gray-300">
        <div className="flex items-center gap-1">
          {view !== "default" && (
            <button
              onClick={() => {
                setView("default");
                setActiveOptionMenu(null);
              }}
            >
              <ChevronLeft />
            </button>
          )}
          <h2 className="text-lg font-bold text-primary-navy dark:text-white">
            {view === "default"
              ? filterTitle
              : view === "date"
              ? dateLabel
              : activeOptionMenu?.label}
          </h2>
        </div>
        {view === "default" && (
          <ModalTrigger close className="p-2">
            <CancelIcon />
          </ModalTrigger>
        )}
      </div>
      <div className="space-y-2 my-4">
        {view === "default" ? (
          <>
            {isDateTrue && (
              <div
                role="button"
                className={commonLabelClasses}
                onClick={() => setView("date")}
              >
                <span>{dateLabel}</span>
                {selectedStartDate || selectedEndDate ? (
                  <CheckboxCheckedIcon />
                ) : (
                  <ChevronRight className="text-[#344054]" />
                )}
              </div>
            )}
            {filterOptionsMenu?.map((option, i) => (
              <div
                key={i}
                role="button"
                className={commonLabelClasses}
                onClick={() => handleOptionMenuClick(option)}
              >
                <span>{option.label}</span>
                {selectedFilterMenus[option.label] &&
                selectedFilterMenus[option.label].length > 0 ? (
                  <CheckboxCheckedIcon />
                ) : (
                  <ChevronRight className="text-[#344054]" />
                )}
              </div>
            ))}
            {!isRadio &&
              Array.isArray(filterOptions) &&
              filterOptions.map((option, i) => (
                <Checkbox
                  key={i}
                  className={commonCheckboxClasses}
                  checked={selectedFilters.includes(option.value)}
                  onChange={() => handleOptionClick(option.value)}
                >
                  {option.label}
                </Checkbox>
              ))}
            {isRadio &&
              Array.isArray(filterOptions?.value) &&
              filterOptions.value.map((option, i) => (
                <Checkbox
                  key={i}
                  radio={true}
                  className={commonCheckboxClasses}
                  checked={selectedFilters.includes(option.value)}
                  onChange={() => {
                    setSelectedFilters([option.value]);
                  }}
                >
                  {option.label}
                </Checkbox>
              ))}
          </>
        ) : view === "date" ? (
          <>
            <DateInput
              label="From"
              id="date_from"
              value={selectedStartDate ? dayjs(selectedStartDate) : undefined}
              onChange={(date) => handleDateChange("start", date)}
              disableFuture
            />
            <DateInput
              label="To"
              id="date_to"
              value={selectedEndDate ? dayjs(selectedEndDate) : undefined}
              onChange={(date) => handleDateChange("end", date)}
              disableFuture
            />
          </>
        ) : (
          <>
            {inputOff && !activeOptionMenu?.radio && (
              <input
                type="text"
                className="w-full border p-2"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            )}
            <div
              className="max-h-[200px] overflow-y-auto pr-1 custom-round-scrollbar space-y-2 my-2"
              ref={scrollContainerRef}
            >
              {visibleOptions.length > 0 ? (
                visibleOptions.map((option, i) => (
                  <Checkbox
                    key={i}
                    radio={activeOptionMenu?.radio}
                    className={commonCheckboxClasses}
                    checked={selectedFilterMenus[
                      activeOptionMenu!.label
                    ]?.includes(option.value)}
                    onChange={() =>
                      handleOptionMenuItemClick(
                        activeOptionMenu!.label,
                        option.value,
                        activeOptionMenu!.radio
                      )
                    }
                  >
                    {option.label}
                  </Checkbox>
                ))
              ) : (
                <div className="p-2 text-gray-500">No match</div>
              )}
            </div>
          </>
        )}
      </div>
      <Button
        className="w-full py-2 rounded-lg mt-4"
        size="base_medium"
        onClick={() => {
          if (view === "default") {
            handleApplyFilter();
          } else {
            setView("default");
          }
        }}
      >
        {view === "default" ? "Apply Filters" : "OK"}
      </Button>
    </div>
  );
};

export default FilterModal;
