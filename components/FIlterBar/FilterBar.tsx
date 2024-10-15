import clsx from "clsx";
import SearchInput from "../SearchInput/search-input";
import { GridIcon, ListIcon } from "@/public/icons/icons";
import { Modal, ModalContent, ModalTrigger } from "../Modal/modal";
import FilterButton from "../FilterButton/filter-button";
import FilterModal from "../Management/Landlord/filters-modal";
import PageTitle from "../PageTitle/page-title";
import AboutPage from "../AboutPage/about-page";
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
  filterWithOptionsWithDropdown: FilterOptionWithDropdown[];
  filterOptions?: FilterOption[];
  filterOptionsWithRadio?: FilterOptionWithRadio[];
  handleFilterApply: (filters: any) => void;
  onStateSelect: (state: string) => void;
  isDateTrue: boolean;
  searchInputPlaceholder: string;
  pageTitle: string;
  aboutPageModalData?: {
    title: string;
    description: string;
    video?: string;
  };
  gridView?: boolean;
  setGridView?: () => void;
  setListView?: () => void;
  azFilter?: boolean;
  exports?: boolean;
  hasGridListToggle?: boolean;
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
}) => {
  return (
    <div className="page-title-container">
      <PageTitle title={pageTitle} aboutPageModalData={aboutPageModalData} />
      <div className="flex items-center gap-4 flex-wrap">
        <SearchInput
          placeholder={searchInputPlaceholder}
          className="max-w-[250px] md:max-w-max"
        />
        {hasGridListToggle && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="list-view"
              className={clsx(
                "p-1 rounded-md",
                !gridView
                  ? "bg-black text-white"
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
                gridView ? "bg-black text-white" : "bg-transparent text-[unset]"
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
            <FilterButton />
          </ModalTrigger>
          <ModalContent>
            <FilterModal
              filterOptionsWithDropdown={filterWithOptionsWithDropdown}
              filterOptions={filterOptions}
              filterOptionsWithRadio={filterOptionsWithRadio}
              onApply={handleFilterApply}
              onStateSelect={onStateSelect}
              date={isDateTrue}
            />
          </ModalContent>
        </Modal>
        {exports && (
          <div className="flex items-center gap-4">
            <ExportButton type="pdf" href="/reports/tenants/export" />
            <ExportButton type="csv" />
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterBar;
