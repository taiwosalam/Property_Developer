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
import {
  FilterOptionMenu,
  FilterOption,
  FilterResult,
  // FilterModalProps,
  // FilterOptionObj,
} from "../Management/Landlord/types";
import { ReactNode } from "react";

interface FilterModalProps {
  handleFilterApply: (selectedFilters: FilterResult) => void;
  filterTitle?: string;
  isDateTrue?: boolean;
  dateLabel?: string;
  filterOptions?: FilterOption[] | FilterOptionObj;
  filterOptionsMenu?: FilterOptionMenu[];
  appliedFilters?: FilterResult;
}

export interface FilterOptionObj {
  radio?: boolean;
  value: FilterOption[];
}

interface FilterBarProps extends FilterModalProps {
  filterTitle?: string;
  dateLabel?: string;
  filterOptions?: FilterOption[] | FilterOptionObj;
  filterOptionsMenu?: FilterOptionMenu[];
  appliedFilters?: FilterResult;
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
  noExclamationMark?: boolean;
  handleSearch?: (query: string) => void;
  onSort?: (order: "asc" | "desc") => void;
  noFilterButton?: boolean;
  isDateTrue?: boolean;
  handleFilterApply: (filters: any) => void;
  inputOff?: boolean;
  customLeft?: ReactNode;
  customRight?: ReactNode;
  printRef?: React.RefObject<HTMLDivElement>;
  firstPageRef?: React.RefObject<HTMLDivElement>;
  restOfContentRef?: React.RefObject<HTMLDivElement>;
  xlsxData?: any;
  fileLabel?: string;
  onBack?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
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
  noExclamationMark,
  handleSearch,
  onSort,
  handleFilterApply,
  filterOptions,
  filterOptionsMenu,
  isDateTrue,
  filterTitle,
  appliedFilters,
  dateLabel,
  noFilterButton,
  inputOff,
  customLeft,
  customRight,
  firstPageRef,
  restOfContentRef,
  printRef,
  xlsxData,
  fileLabel,
  onBack

}) => {
  return (
    <div className="page-title-container w-full">
      {customLeft ? (
        <div className="custom-left">{customLeft}</div>
      ) : (
        pageTitle && (
          <PageTitle
            title={pageTitle}
            aboutPageModalData={aboutPageModalData}
            noExclamationMark={noExclamationMark}
            onBack={onBack}
          />
        )
      )}

      <div
        className={clsx(
          "flex items-center gap-4 flex-wrap",
          !pageTitle && "ml-auto"
        )}
      >
        <SearchInput
          placeholder={searchInputPlaceholder}
          className={`search-input max-w-[250px] md:max-w-max ${
            hiddenSearchInput && "hidden"
          }`}
          onSearch={handleSearch}
        />
        {hasGridListToggle && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="list-view"
              className={clsx(
                "p-1 rounded-md list-view-button",
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
                "p-1 rounded-md grid-view-button",
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
        {azFilter && <SortButton onSort={onSort} />}
        <Modal>
          <ModalTrigger asChild>
            {!noFilterButton && <FilterButton noTitle={iconOnly} />}
          </ModalTrigger>
          <ModalContent>
            <FilterModal
              handleFilterApply={handleFilterApply}
              isDateTrue={isDateTrue}
              filterTitle={filterTitle}
              filterOptions={filterOptions}
              filterOptionsMenu={filterOptionsMenu}
              appliedFilters={appliedFilters}
              dateLabel={dateLabel}
              inputOff={inputOff}
            />
          </ModalContent>
        </Modal>
        {exports && (
          <div className="flex items-center gap-4">
            <ExportButton
              type="pdf"
              href={exportHref}
              printRef={printRef}
              firstPageRef={firstPageRef}
              restOfContentRef={restOfContentRef}
            />
            <ExportButton
              data={xlsxData}
              fileLabel={fileLabel}
              type="csv"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
