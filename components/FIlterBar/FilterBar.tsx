"use client";
import clsx from "clsx";
import SearchInput from "../SearchInput/search-input";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import FilterButton from "../FilterButton/filter-button";
import FilterModal from "../Management/Landlord/filters-modal";
import PageTitle from "../PageTitle/page-title";
import SortButton from "../FilterButton/sort-button";
import ExportButton from "../reports/export-button";

// Define the types for the props
type FilterOption = {
  label: string;
  value: string;
};

type FilterOptionWithRadio = {
  label: string;
  value: FilterOption[];
};

type FilterOptionWithDropdown = {
  label: string;
  value: FilterOption[];
};

interface FilterBarProps {
  filterWithOptionsWithDropdown?: FilterOptionWithDropdown[];
  filterOptions?: FilterOption[];
  filterOptionsWithRadio?: FilterOptionWithRadio[];
  handleFilterApply: (filters: any) => void;
  onStateSelect?: (state: string) => void;
  isDateTrue?: boolean;
  searchInputPlaceholder?: string;
  pageTitle?: string;
  aboutPageModalData?: {
    title: string;
    description: string;
    video?: string;
    readingLink?: string;
  };
  gridView?: boolean;
  setGridView?: () => void;
  setListView?: () => void;
  azFilter?: boolean;
  exports?: boolean;
  hasGridListToggle?: boolean;
  exportHref?: string;
  hiddenSearchInput?: boolean;
  iconOnly?: boolean;
  article?: boolean;
  propertyRequest?: boolean;
  noExclamationMark?: boolean;
  handleSearch?: (query: string) => void;
  searchQuery?: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
  filterWithOptionsWithDropdown,
  filterOptions,
  filterOptionsWithRadio,
  handleFilterApply,
  onStateSelect,
  isDateTrue,
  searchInputPlaceholder,
  pageTitle,
  aboutPageModalData,
  gridView,
  setGridView,
  setListView,
  azFilter,
  exports,
  hasGridListToggle = true,
  exportHref,
  hiddenSearchInput,
  iconOnly,
  article,
  propertyRequest,
  noExclamationMark,
  handleSearch,
  searchQuery,
}) => {
  return (
    <div className="page-title-container ">
      {pageTitle && (
        <PageTitle
          title={pageTitle}
          aboutPageModalData={aboutPageModalData}
          noExclamationMark={noExclamationMark}
        />
      )}

      <div
        className={clsx(
          "flex items-center gap-4 flex-wrap",
          !pageTitle && "ml-auto"
        )}
      >
        <SearchInput
          placeholder={searchInputPlaceholder}
          className={`max-w-[250px] md:max-w-max ${
            hiddenSearchInput && "hidden"
          }`}
          onEnterPress={handleSearch}
          searchQuery={searchQuery}
        />
        {hasGridListToggle && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="list-view"
              className={clsx(
                "p-1 rounded-md",
                !gridView
                  ? "bg-black text-white dark:bg-[#020617] dark:text-darkText-1"
                  : "bg-transparent text-[unset]"
              )}
              onClick={setListView}
            >
              <ListIcon />
            </button>
            <button
              type="button"
              aria-label="grid-view"
              className={clsx(
                "p-1 rounded-md",
                gridView
                  ? "bg-black text-white dark:bg-[#020617] dark:text-darkText-1"
                  : "bg-transparent text-[unset]"
              )}
              onClick={setGridView}
            >
              <GridIcon />
            </button>
          </div>
        )}
        {azFilter && <SortButton />}
        <Modal>
          <ModalTrigger asChild>
            <FilterButton noTitle={iconOnly} />
          </ModalTrigger>
          <ModalContent>
            <FilterModal
              filterOptionsWithDropdown={filterWithOptionsWithDropdown}
              filterOptions={filterOptions}
              filterOptionsWithRadio={filterOptionsWithRadio}
              onApply={handleFilterApply}
              onStateSelect={onStateSelect}
              date={isDateTrue}
              article={article}
              propertyRequest={propertyRequest}
            />
          </ModalContent>
        </Modal>
        {exports && (
          <div className="flex items-center gap-4">
            <ExportButton type="pdf" href={exportHref} />
            <ExportButton type="csv" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
