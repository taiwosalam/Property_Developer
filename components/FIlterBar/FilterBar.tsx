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
import { FilterModalProps } from "../Management/Landlord/types";

interface FilterBarProps extends FilterModalProps {
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
}) => {
  return (
    <div className="page-title-container w-full">
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
          onSearch={handleSearch}
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
